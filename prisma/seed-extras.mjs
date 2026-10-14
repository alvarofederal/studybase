/**
 * Aplica os extras (prisma/extras/<slug-da-matéria>/*.mjs) — mais questões e flashcards para tópicos existentes.
 * Não apaga nada; pula o que já existe. Ver prisma/lib/seed-extras.mjs.
 *
 *   node prisma/seed-extras.mjs --dry                       → valida e conta
 *   node prisma/seed-extras.mjs                             → aplica todas as matérias
 *   node prisma/seed-extras.mjs --materia=lingua-portuguesa → só uma matéria
 */
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { adicionarExtras } from "./lib/seed-extras.mjs";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "extras");
const dry = process.argv.includes("--dry");
const so = process.argv.find((a) => a.startsWith("--materia="))?.split("=")[1];

const materias = readdirSync(raiz).filter((d) => statSync(path.join(raiz, d)).isDirectory() && (!so || d === so));
for (const slug of materias) {
  const extras = {};
  for (const arq of readdirSync(path.join(raiz, slug)).filter((f) => f.endsWith(".mjs")).sort()) {
    const mod = await import(pathToFileURL(path.join(raiz, slug, arq)).href);
    for (const [topico, e] of Object.entries(mod.default)) {
      if (extras[topico]) throw new Error(`Tópico repetido entre arquivos de extras: ${slug}/${topico}`);
      extras[topico] = e;
    }
  }
  await adicionarExtras({ slug, extras, dry, rotulo: slug });
  console.log("");
}
