/**
 * Deriva itens CEBRASPE (Certo/Errado) a partir das questões de múltipla escolha.
 *
 * Para cada questão MULTIPLA gera 2 assertivas no mesmo tópico:
 *   • uma CERTA   → enunciado + alternativa correta
 *   • uma ERRADA  → enunciado + uma alternativa incorreta (sorteada)
 *
 * É um quebra-galho para ter volume de treino em Certo/Errado; a redação sai mais
 * "mecânica" que a da banca. Os itens ficam marcados com a tag `CE-derivada` e podem ser
 * apagados/substituídos por itens autorais depois. Idempotente: não duplica (coluna `origemId`).
 *
 * Uso:
 *   node prisma/derivar-ce.mjs                      → simulação (não grava)
 *   node prisma/derivar-ce.mjs --apply              → grava
 *   node prisma/derivar-ce.mjs --apply --materia=conhecimentos-bancarios
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
const dbUrl = new URL(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    connectionLimit: 2,
  }),
});

const apply = process.argv.includes("--apply");
const slug = process.argv.find((a) => a.startsWith("--materia="))?.split("=")[1];

const sortear = (arr) => arr[Math.floor(Math.random() * arr.length)];
const base = (p) => p.trim().replace(/[?:]\s*$/, "");
const opcoesCE = (certo) => [
  { texto: "Certo", correta: certo, ordem: 0 },
  { texto: "Errado", correta: !certo, ordem: 1 },
];

const quizzes = await prisma.quiz.findMany({
  where: {
    tipo: "MULTIPLA",
    ...(slug ? { topico: { bloco: { materia: { slug } } } } : {}),
  },
  select: {
    id: true,
    pergunta: true,
    explicacao: true,
    dificuldade: true,
    topicoId: true,
    opcoes: { select: { texto: true, correta: true } },
  },
});

const jaDerivados = new Set(
  (await prisma.quiz.findMany({ where: { origemId: { not: null } }, select: { origemId: true } })).map((q) => q.origemId),
);

let criados = 0;
let ignorados = 0;
const proxOrdem = new Map();

for (const q of quizzes) {
  const certa = q.opcoes.find((o) => o.correta);
  const erradas = q.opcoes.filter((o) => !o.correta);
  if (jaDerivados.has(q.id) || !certa || erradas.length === 0) {
    ignorados++;
    continue;
  }
  if (!proxOrdem.has(q.topicoId)) proxOrdem.set(q.topicoId, await prisma.quiz.count({ where: { topicoId: q.topicoId } }));

  const errada = sortear(erradas);
  const itens = [
    {
      pergunta: `${base(q.pergunta)}: ${certa.texto.trim()}`,
      gabarito: true,
      explicacao: `Item CERTO. A alternativa correta da questão original era: "${certa.texto.trim()}".${q.explicacao ? " " + q.explicacao : ""}`,
    },
    {
      pergunta: `${base(q.pergunta)}: ${errada.texto.trim()}`,
      gabarito: false,
      explicacao: `Item ERRADO. O correto seria: "${certa.texto.trim()}".${q.explicacao ? " " + q.explicacao : ""}`,
    },
  ];

  for (const it of itens) {
    if (apply) {
      const ordem = proxOrdem.get(q.topicoId);
      proxOrdem.set(q.topicoId, ordem + 1);
      await prisma.quiz.create({
        data: {
          tipo: "CERTO_ERRADO",
          pergunta: it.pergunta,
          explicacao: it.explicacao,
          dificuldade: q.dificuldade,
          tags: "CE-derivada",
          origemId: q.id,
          ordem,
          topicoId: q.topicoId,
          opcoes: { create: opcoesCE(it.gabarito) },
        },
      });
    }
    criados++;
  }
}

console.log(
  `${apply ? "Criados" : "Seriam criados"}: ${criados} itens Certo/Errado a partir de ${quizzes.length - ignorados} questões (${ignorados} ignoradas).`,
);
if (!apply) console.log("Simulação — rode com --apply para gravar.");
await prisma.$disconnect();
