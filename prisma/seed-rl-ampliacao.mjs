/**
 * Seed — Raciocínio Lógico (ampliação): negações/equivalências, conjuntos, análise combinatória,
 * probabilidade, raciocínio matemático e geometria. Base: "Raciocínio Lógico Facilitado" (Bruno Villa),
 * com redação própria (prisma/data/raciocinio-logico/).
 *
 * Só toca nos blocos NOVOS (slugs próprios); os blocos 1–5 já existentes da matéria não são alterados.
 *
 *   node prisma/seed-rl-ampliacao.mjs --dry
 *   node prisma/seed-rl-ampliacao.mjs
 */
import { semearMateria } from "./lib/seed-materia.mjs";
import a from "./data/raciocinio-logico/06-negacao-conjuntos-contagem.mjs";
import b from "./data/raciocinio-logico/07-matematico-geometria.mjs";

await semearMateria({
  slug: "raciocinio-logico",
  rotulo: "Raciocínio Lógico (ampliação)",
  blocos: [...a, ...b],
  dry: process.argv.includes("--dry"),
});
