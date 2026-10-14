/**
 * Seed — Língua Portuguesa (baseada na gramática de concursos de Fernando Pestana, Elsevier, 2013,
 * com texto próprio; ver prisma/data/lingua-portuguesa/).
 *
 * Idempotente: blocos e tópicos são criados/atualizados por slug; as questões e flashcards
 * DOS TÓPICOS DESTE SEED são recriados a cada execução (nada de outras matérias é tocado).
 *
 * Uso:
 *   node prisma/seed-lingua-portuguesa.mjs --dry     → só valida e mostra contagens
 *   node prisma/seed-lingua-portuguesa.mjs           → grava no banco
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import b1 from "./data/lingua-portuguesa/01-interpretacao.mjs";
import b2 from "./data/lingua-portuguesa/02-fonologia-ortografia.mjs";
import b3 from "./data/lingua-portuguesa/03-semantica-formacao.mjs";
import b4 from "./data/lingua-portuguesa/04-classes-de-palavras.mjs";
import b5 from "./data/lingua-portuguesa/05-sintaxe.mjs";
import b6 from "./data/lingua-portuguesa/06-pontuacao-concordancia-regencia-crase.mjs";
import b7 from "./data/lingua-portuguesa/07-reescrita-registro-culto.mjs";
import b8 from "./data/lingua-portuguesa/08-redacao-oficial.mjs";

const MATERIA_SLUG = "lingua-portuguesa";
const blocos = [b1, b2, b3, b4, b5, b6, b7, b8];
const dry = process.argv.includes("--dry");

const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"];

const totais = blocos.reduce(
  (t, b) => {
    for (const tp of b.topicos) {
      t.topicos++;
      t.mc += tp.mc.length;
      t.ce += tp.ce.length;
      t.fc += tp.fc.length;
    }
    return t;
  },
  { topicos: 0, mc: 0, ce: 0, fc: 0 },
);

console.log(
  `📚 ${blocos.length} blocos · ${totais.topicos} tópicos · ${totais.mc} questões de múltipla escolha · ${totais.ce} itens Certo/Errado · ${totais.fc} flashcards`,
);
if (dry) {
  console.log("Simulação (--dry): nada foi gravado.");
  process.exit(0);
}

const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
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

async function main() {
  const materia = await prisma.materia.findUnique({ where: { slug: MATERIA_SLUG } });
  if (!materia) throw new Error(`Matéria "${MATERIA_SLUG}" não existe. Crie-a no admin antes de rodar o seed.`);

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
    for (const t of b.topicos) {
      ordemTopico++;
      const topico = await prisma.topico.upsert({
        where: { blocoId_slug: { blocoId: bloco.id, slug: t.slug } },
        update: { titulo: t.titulo, resumo: t.resumo, conteudo: t.conteudo, ordem: ordemTopico, publicado: true },
        create: {
          blocoId: bloco.id,
          titulo: t.titulo,
          slug: t.slug,
          resumo: t.resumo,
          conteudo: t.conteudo,
          ordem: ordemTopico,
          publicado: true,
        },
      });

      // Recria questões e flashcards deste tópico
      await prisma.quiz.deleteMany({ where: { topicoId: topico.id } });
      await prisma.flashcard.deleteMany({ where: { topicoId: topico.id } });

      let ordem = 0;
      for (const [pergunta, opcoes, correta, explicacao, dificuldade] of t.mc) {
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
      for (const [assertiva, gabarito, explicacao] of t.ce) {
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
      for (const [frente, verso] of t.fc) {
        await prisma.flashcard.create({ data: { frente, verso, ordem: ordemFc++, topicoId: topico.id } });
        nFc++;
      }
      console.log(`  ✓ ${b.nome} › ${t.titulo}`);
    }
  }

  console.log(`\n🎉 Língua Portuguesa: ${nMc} questões · ${nCe} itens C/E · ${nFc} flashcards gravados.`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
