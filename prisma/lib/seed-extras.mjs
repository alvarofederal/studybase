/**
 * Acrescenta questões (múltipla escolha e Certo/Errado) e flashcards a tópicos JÁ existentes,
 * sem apagar nada do que está no banco. Idempotente: pula o que já existe no tópico
 * (mesma pergunta/assertiva ou mesma frente de flashcard).
 *
 * Formato dos extras (prisma/extras/<matéria>/*.mjs):
 *   export default {
 *     "slug-do-topico": {
 *       mc: [[pergunta, [4 opções], índiceCorreto, explicação, dificuldade?]],
 *       ce: [[assertiva, "C"|"E", explicação]],
 *       fc: [[frente, verso]],
 *     },
 *   };
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { balancearMc } from "./balancear.mjs";

const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"];

/** Chave de duplicidade: enunciado; para múltipla escolha, enunciado + alternativas (enunciados genéricos se repetem). */
const chaveMc = (pergunta, opcoes) => `${pergunta.trim()}||${[...opcoes].map((o) => o.trim()).sort().join("|")}`;
const chaveCe = (assertiva) => assertiva.trim();

export function contarExtras(extras) {
  const t = { topicos: 0, mc: 0, ce: 0, fc: 0 };
  for (const e of Object.values(extras)) {
    t.topicos++;
    t.mc += (e.mc ?? []).length;
    t.ce += (e.ce ?? []).length;
    t.fc += (e.fc ?? []).length;
  }
  return t;
}

/** @param {{ slug: string, extras: Record<string, {mc?: any[], ce?: any[], fc?: any[]}>, dry?: boolean, rotulo?: string }} opts */
export async function adicionarExtras({ slug, extras, dry = false, rotulo = slug }) {
  const t = contarExtras(extras);
  console.log(`➕ ${rotulo}: ${t.topicos} tópicos · +${t.mc} múltipla escolha · +${t.ce} Certo/Errado · +${t.fc} flashcards`);
  if (dry) {
    console.log("Simulação (--dry): nada foi gravado.");
    return;
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
  const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
  const dbUrl = new URL(process.env.DATABASE_URL);
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: decodeURIComponent(dbUrl.username),
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      connectionLimit: 3,
    }),
  });

  try {
    const materia = await prisma.materia.findUnique({ where: { slug } });
    if (!materia) throw new Error(`Matéria "${slug}" não existe.`);

    const topicos = await prisma.topico.findMany({
      where: { bloco: { materiaId: materia.id } },
      select: { id: true, slug: true, titulo: true },
    });
    const porSlug = new Map();
    for (const tp of topicos) porSlug.set(tp.slug, [...(porSlug.get(tp.slug) ?? []), tp]);

    let addMc = 0;
    let addCe = 0;
    let addFc = 0;
    let puladas = 0;
    let seq = 0;
    const faltando = [];

    for (const [topicoSlug, e] of Object.entries(extras)) {
      const achados = porSlug.get(topicoSlug) ?? [];
      if (achados.length !== 1) {
        faltando.push(`${topicoSlug} (${achados.length === 0 ? "não encontrado" : "ambíguo"})`);
        continue;
      }
      const topico = achados[0];

      const quizzes = await prisma.quiz.findMany({
        where: { topicoId: topico.id },
        select: { pergunta: true, ordem: true, tipo: true, opcoes: { select: { texto: true } } },
      });
      const flashcards = await prisma.flashcard.findMany({ where: { topicoId: topico.id }, select: { frente: true, ordem: true } });
      const chaves = new Set(quizzes.map((q) => (q.tipo === "CERTO_ERRADO" ? chaveCe(q.pergunta) : chaveMc(q.pergunta, q.opcoes.map((o) => o.texto)))));
      const frentes = new Set(flashcards.map((f) => f.frente.trim()));
      let ordemQ = quizzes.reduce((m, q) => Math.max(m, q.ordem), -1) + 1;
      let ordemF = flashcards.reduce((m, f) => Math.max(m, f.ordem), -1) + 1;

      const mcNovas = [];
      for (const q of e.mc ?? []) {
        const k = chaveMc(q[0], q[1]);
        if (chaves.has(k)) continue;
        chaves.add(k);
        mcNovas.push(q);
      }
      puladas += (e.mc ?? []).length - mcNovas.length;
      for (const [pergunta, opcoes, correta, explicacao, dificuldade] of balancearMc(mcNovas, seq)) {
        await prisma.quiz.create({
          data: {
            tipo: "MULTIPLA",
            pergunta,
            explicacao,
            dificuldade: DIFICULDADES.includes(dificuldade) ? dificuldade : "MEDIO",
            ordem: ordemQ++,
            topicoId: topico.id,
            opcoes: { create: opcoes.map((texto, i) => ({ texto, correta: i === correta, ordem: i })) },
          },
        });
        addMc++;
      }
      seq += mcNovas.length;

      for (const [assertiva, gabarito, explicacao] of e.ce ?? []) {
        if (chaves.has(chaveCe(assertiva))) {
          puladas++;
          continue;
        }
        chaves.add(chaveCe(assertiva));
        await prisma.quiz.create({
          data: {
            tipo: "CERTO_ERRADO",
            pergunta: assertiva,
            explicacao,
            dificuldade: "MEDIO",
            ordem: ordemQ++,
            topicoId: topico.id,
            opcoes: {
              create: [
                { texto: "Certo", correta: gabarito === "C", ordem: 0 },
                { texto: "Errado", correta: gabarito === "E", ordem: 1 },
              ],
            },
          },
        });
        addCe++;
      }

      for (const [frente, verso] of e.fc ?? []) {
        if (frentes.has(frente.trim())) {
          puladas++;
          continue;
        }
        frentes.add(frente.trim());
        await prisma.flashcard.create({ data: { frente, verso, ordem: ordemF++, topicoId: topico.id } });
        addFc++;
      }
      console.log(`  ✓ ${topico.titulo}`);
    }

    console.log(`\n🎉 ${rotulo}: +${addMc} múltipla escolha · +${addCe} Certo/Errado · +${addFc} flashcards (${puladas} já existiam).`);
    if (faltando.length) console.warn(`⚠️  Tópicos não aplicados: ${faltando.join(", ")}`);
  } finally {
    await prisma.$disconnect();
  }
}
