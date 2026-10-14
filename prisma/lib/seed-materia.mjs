/**
 * Núcleo reutilizável de seed de conteúdo (blocos → tópicos → questões, itens C/E e flashcards).
 *
 * Formato dos dados (ver prisma/data/*):
 *   bloco  = { nome, slug, descricao, ordem, topicos: [...] }
 *   tópico = { titulo, slug, resumo, conteudo, fc: [[frente, verso]], mc: [[pergunta, [4 opções], índice, explicação, dificuldade?]], ce: [[assertiva, "C"|"E", explicação]] }
 *
 * Idempotente: blocos/tópicos por slug (upsert); questões e flashcards DOS TÓPICOS INFORMADOS são recriados.
 * Nada fora dos slugs informados é alterado.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { balancearMc } from "./balancear.mjs";

const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"];

export function contar(blocos) {
  return blocos.reduce(
    (t, b) => {
      for (const tp of b.topicos) {
        t.topicos++;
        t.mc += tp.mc.length;
        t.ce += tp.ce.length;
        t.fc += tp.fc.length;
      }
      return t;
    },
    { blocos: blocos.length, topicos: 0, mc: 0, ce: 0, fc: 0 },
  );
}

/**
 * @param {{ slug: string, criar?: { nome: string, descricao?: string, icone?: string, cor?: string, ordem?: number }, blocos: any[], dry?: boolean, rotulo?: string }} opts
 */
export async function semearMateria({ slug, criar, blocos, dry = false, rotulo = slug }) {
  const t = contar(blocos);
  console.log(
    `📚 ${rotulo}: ${t.blocos} blocos · ${t.topicos} tópicos · ${t.mc} questões de múltipla escolha · ${t.ce} itens Certo/Errado · ${t.fc} flashcards`,
  );
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
    let materia = await prisma.materia.findUnique({ where: { slug } });
    if (!materia) {
      if (!criar) throw new Error(`Matéria "${slug}" não existe e não há dados para criá-la.`);
      materia = await prisma.materia.create({
        data: {
          nome: criar.nome,
          slug,
          descricao: criar.descricao ?? null,
          icone: criar.icone ?? null,
          cor: criar.cor ?? "emerald",
          ordem: criar.ordem ?? 0,
          ativa: true,
        },
      });
      console.log(`  + matéria criada: ${materia.nome}`);
    }

    let seqMc = 0; // contagem corrida para balancear a posição da alternativa correta
    let nMc = 0;
    let nCe = 0;
    let nFc = 0;

    for (const b of blocos) {
      const bloco = await prisma.bloco.upsert({
        where: { materiaId_slug: { materiaId: materia.id, slug: b.slug } },
        update: { nome: b.nome, descricao: b.descricao, ordem: b.ordem },
        create: { materiaId: materia.id, nome: b.nome, slug: b.slug, descricao: b.descricao, ordem: b.ordem },
      });

      let ordemTopico = 0;
      for (const tp of b.topicos) {
        ordemTopico++;
        const topico = await prisma.topico.upsert({
          where: { blocoId_slug: { blocoId: bloco.id, slug: tp.slug } },
          update: { titulo: tp.titulo, resumo: tp.resumo, conteudo: tp.conteudo, ordem: ordemTopico, publicado: true },
          create: {
            blocoId: bloco.id,
            titulo: tp.titulo,
            slug: tp.slug,
            resumo: tp.resumo,
            conteudo: tp.conteudo,
            ordem: ordemTopico,
            publicado: true,
          },
        });

        await prisma.quiz.deleteMany({ where: { topicoId: topico.id } });
        await prisma.flashcard.deleteMany({ where: { topicoId: topico.id } });

        let ordem = 0;
        const mcBalanceadas = balancearMc(tp.mc, seqMc);
        seqMc += tp.mc.length;
        for (const [pergunta, opcoes, correta, explicacao, dificuldade] of mcBalanceadas) {
          await prisma.quiz.create({
            data: {
              tipo: "MULTIPLA",
              pergunta,
              explicacao,
              dificuldade: DIFICULDADES.includes(dificuldade) ? dificuldade : "MEDIO",
              ordem: ordem++,
              topicoId: topico.id,
              opcoes: { create: opcoes.map((texto, i) => ({ texto, correta: i === correta, ordem: i })) },
            },
          });
          nMc++;
        }
        for (const [assertiva, gabarito, explicacao] of tp.ce) {
          await prisma.quiz.create({
            data: {
              tipo: "CERTO_ERRADO",
              pergunta: assertiva,
              explicacao,
              dificuldade: "MEDIO",
              ordem: ordem++,
              topicoId: topico.id,
              opcoes: {
                create: [
                  { texto: "Certo", correta: gabarito === "C", ordem: 0 },
                  { texto: "Errado", correta: gabarito === "E", ordem: 1 },
                ],
              },
            },
          });
          nCe++;
        }
        let ordemFc = 0;
        for (const [frente, verso] of tp.fc) {
          await prisma.flashcard.create({ data: { frente, verso, ordem: ordemFc++, topicoId: topico.id } });
          nFc++;
        }
        console.log(`  ✓ ${b.nome} › ${tp.titulo}`);
      }
    }

    console.log(`\n🎉 ${rotulo}: ${nMc} questões · ${nCe} itens C/E · ${nFc} flashcards gravados.`);
  } finally {
    await prisma.$disconnect();
  }
}
