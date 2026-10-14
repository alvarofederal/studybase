/**
 * Utilitário de manutenção (uso único): converte os blocos $$...$$ (LaTeX) dentro de um seed .mjs
 * em texto legível, escapando os acentos graves para continuarem válidos dentro de template strings.
 *
 *   node prisma/fix-seed-latex.mjs prisma/seed-matematica-financeira.mjs
 */
import fs from "node:fs";
import { formulaParaTexto } from "./lib/latex-simples.mjs";

const arquivo = process.argv[2];
if (!arquivo) throw new Error("Informe o arquivo do seed.");

let n = 0;
const original = fs.readFileSync(arquivo, "utf8");
const novo = original.replace(/\$\$([\s\S]*?)\$\$/g, (_, f) => {
  n++;
  return "> \\`" + formulaParaTexto(f) + "\\`";
});
fs.writeFileSync(arquivo, novo);
console.log(`${n} fórmulas convertidas em ${arquivo}`);
