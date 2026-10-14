/**
 * Script de importação — Bloco 5: Regulação, Ética e Temas Transversais
 * Lê o CSV e insere as questões no banco via Prisma + adapter-mariadb
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host:            dbUrl.hostname,
  port:            parseInt(dbUrl.port) || 3306,
  user:            decodeURIComponent(dbUrl.username),
  password:        decodeURIComponent(dbUrl.password),
  database:        dbUrl.pathname.slice(1),
  connectionLimit: 3,
});
const prisma = new PrismaClient({ adapter });

// ── Parser CSV ───────────────────────────────────────────────────────────────
function parseCSVLine(line) {
  const cols = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) { cols.push(cur); cur = ""; }
    else cur += c;
  }
  cols.push(cur);
  return cols.map(s => s.trim());
}

// ── Ler CSV ──────────────────────────────────────────────────────────────────
const csvPath = path.resolve(
  __dirname,
  "../dados/Conhecimentos Bancarios - Perplexity/Conhecimentos Bancários - Regulação, Ética e Temas Transversais.csv"
);

const text  = fs.readFileSync(csvPath, "utf-8");
const lines = text.trim().split(/\r?\n/).filter(Boolean);
const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
const col = name => headers.indexOf(name);

const rows = lines.slice(1).map((line, idx) => {
  const f = parseCSVLine(line);
  const g = name => (col(name) >= 0 ? f[col(name)] ?? "" : "");
  return {
    bloco:       g("bloco"),
    topico:      g("topico"),
    pergunta:    g("pergunta"),
    opcaoA:      g("opcaoa") || g("opcao_a"),
    opcaoB:      g("opcaob") || g("opcao_b"),
    opcaoC:      g("opcaoc") || g("opcao_c"),
    opcaoD:      g("opcaod") || g("opcao_d"),
    correta:     g("correta").toUpperCase(),
    explicacao:  g("explicacao"),
    dificuldade: g("dificuldade"),
    tags:        g("tags"),
    _linha:      idx + 2,
  };
});

console.log(`📄 CSV lido: ${rows.length} questões encontradas\n`);

// ── Buscar matéria (filtro em JS para evitar erro de collation) ───────────────
const todas = await prisma.materia.findMany({
  include: {
    blocos: {
      orderBy: { ordem: "asc" },
      include: { topicos: { orderBy: { ordem: "asc" } } },
    },
  },
});
const materia = todas.find(m => m.nome.toLowerCase().includes("conhecimentos banc"));

if (!materia) {
  console.error("❌ Matéria 'Conhecimentos Bancários' não encontrada. Rode o seed primeiro.");
  await prisma.$disconnect();
  process.exit(1);
}

console.log(`✅ Matéria: ${materia.nome}`);
const bloco5 = materia.blocos.find(b => b.nome.toLowerCase().includes("regulação") || b.nome.toLowerCase().includes("regulacao") || b.nome.toLowerCase().includes("ética") || b.nome.toLowerCase().includes("etica") || b.nome.toLowerCase().includes("transversal"));
if (bloco5) {
  console.log(`   Bloco encontrado: ${bloco5.nome}`);
  console.log(`   Tópicos: ${bloco5.topicos.map(t => t.titulo).join(" | ")}\n`);
}

// ── Resolver bloco e tópico por nome ─────────────────────────────────────────
function resolveTopico(blocoNome, topicoNome) {
  const bloco = materia.blocos.find(b => b.nome.toLowerCase() === blocoNome.trim().toLowerCase());
  if (!bloco) return { erro: `Bloco não encontrado: "${blocoNome}"` };
  const topico = bloco.topicos.find(t => t.titulo.toLowerCase() === topicoNome.trim().toLowerCase());
  if (!topico) return { erro: `Tópico não encontrado: "${topicoNome}" em "${blocoNome}"` };
  return { topicoId: topico.id };
}

const LETRAS       = ["A", "B", "C", "D"];
const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"];

// ── Importar ──────────────────────────────────────────────────────────────────
let criadas = 0;
let erros   = 0;

for (const row of rows) {
  const { topicoId, erro } = resolveTopico(row.bloco, row.topico);
  if (erro) {
    console.error(`  ⚠️  Linha ${row._linha}: ${erro}`);
    erros++;
    continue;
  }

  const idxCorreta = LETRAS.indexOf(row.correta);
  if (idxCorreta === -1) {
    console.error(`  ⚠️  Linha ${row._linha}: correta inválida "${row.correta}"`);
    erros++;
    continue;
  }

  const dificuldade = DIFICULDADES.includes(row.dificuldade?.trim().toUpperCase())
    ? row.dificuldade.trim().toUpperCase()
    : "MEDIO";

  try {
    const ordem = await prisma.quiz.count({ where: { topicoId } });
    await prisma.quiz.create({
      data: {
        pergunta:   row.pergunta.trim(),
        explicacao: row.explicacao?.trim() || null,
        dificuldade,
        tags:       row.tags?.trim() || null,
        ordem,
        topicoId,
        opcoes: {
          create: [row.opcaoA, row.opcaoB, row.opcaoC, row.opcaoD].map((texto, oi) => ({
            texto:   texto.trim(),
            correta: oi === idxCorreta,
            ordem:   oi,
          })),
        },
      },
    });
    criadas++;
    process.stdout.write(`  ✅ [${criadas}] ${row.pergunta.slice(0, 65)}…\n`);
  } catch (e) {
    console.error(`  ❌ Linha ${row._linha}: ${e.message.slice(0, 120)}`);
    erros++;
  }
}

console.log(`\n${"─".repeat(60)}`);
console.log(`✅ Questões criadas : ${criadas}`);
console.log(`❌ Erros            : ${erros}`);
console.log(`${"─".repeat(60)}\n`);

await prisma.$disconnect();
