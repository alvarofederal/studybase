/**
 * Seed — LGPD (Lei nº 13.709/2018). Base: "Resumo Esquematizado da LGPD" (LIVROS/LGPD) + texto da lei,
 * com redação própria (prisma/data/lgpd/). Cria a matéria "lgpd" se ainda não existir.
 *
 *   node prisma/seed-lgpd.mjs --dry   → só valida
 *   node prisma/seed-lgpd.mjs         → grava
 */
import { semearMateria } from "./lib/seed-materia.mjs";
import a from "./data/lgpd/01-fundamentos-tratamento.mjs";
import b from "./data/lgpd/02-direitos-publico-governanca.mjs";

await semearMateria({
  slug: "lgpd",
  rotulo: "LGPD",
  criar: {
    nome: "LGPD — Lei Geral de Proteção de Dados",
    descricao: "Lei nº 13.709/2018: fundamentos, princípios, bases legais, direitos do titular, Poder Público, governança, sanções e ANPD.",
    icone: "🔒",
    cor: "rose",
    ordem: 6,
  },
  blocos: [...a, ...b],
  dry: process.argv.includes("--dry"),
});
