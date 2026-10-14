/**
 * Define o ícone (emoji) das matérias que ainda não têm um. Idempotente.
 *
 *   node prisma/set-icones.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const ICONES = {
  "conhecimentos-bancarios": "🏦",
  "lingua-portuguesa": "✍️",
  "probabilidade-e-estatistica": "🎲",
  "comportamentos-eticos-e-compliance": "🤝",
};

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

try {
  const materias = await prisma.materia.findMany({ select: { id: true, slug: true, nome: true, icone: true } });
  for (const m of materias) {
    const icone = ICONES[m.slug];
    if (!icone) continue;
    await prisma.materia.update({ where: { id: m.id }, data: { icone } });
    console.log(`${icone}  ${m.nome} (antes: ${m.icone ?? "—"})`);
  }
} finally {
  await prisma.$disconnect();
}
