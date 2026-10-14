/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

const chaveMc = (p: string, o: string[]) => `${p.trim()}||${[...o].map((x) => x.trim()).sort().join("|")}`;

type Extra = {
  mc?: [string, string[], number, string, string?][];
  ce?: [string, string, string][];
  fc?: [string, string][];
};

const modulos = import.meta.glob("../../prisma/extras/**/*.mjs", { eager: true }) as Record<string, { default: Record<string, Extra> }>;
const bases = import.meta.glob("../../prisma/data/**/*.mjs", { eager: true }) as Record<string, { default: unknown }>;

type BlocoBase = { topicos: { slug: string; mc: [string, string[]][]; ce: [string][]; fc: [string][] }[] };
const baseDeTopico = new Map<string, { perguntas: Set<string>; frentes: Set<string> }>();
for (const mod of Object.values(bases)) {
  const lista = (Array.isArray(mod.default) ? mod.default : [mod.default]) as BlocoBase[];
  for (const b of lista) {
    for (const t of b.topicos) {
      baseDeTopico.set(t.slug, {
        perguntas: new Set([...t.mc.map((q) => chaveMc(q[0], q[1])), ...t.ce.map((q) => q[0].trim())]),
        frentes: new Set(t.fc.map((f) => f[0].trim())),
      });
    }
  }
}

const itens = Object.entries(modulos).flatMap(([caminho, mod]) => {
  const materia = caminho.split("/extras/")[1].split("/")[0];
  return Object.entries(mod.default).map(([slug, e]) => ({ materia, slug, e }));
});

describe("extras (prisma/extras)", () => {
  it("não repete tópicos dentro de uma mesma matéria", () => {
    const vistos = new Set<string>();
    for (const { materia, slug } of itens) {
      const k = `${materia}/${slug}`;
      expect(vistos.has(k), `repetido: ${k}`).toBe(false);
      vistos.add(k);
    }
  });

  it.each(itens.map((i) => [`${i.materia} › ${i.slug}`, i] as const))("%s: estrutura válida e sem duplicatas", (_, { slug, e }) => {
    const mc = e.mc ?? [];
    const ce = e.ce ?? [];
    const fc = e.fc ?? [];

    for (const [pergunta, opcoes, correta, explicacao, dif] of mc) {
      expect(pergunta.trim()).not.toBe("");
      expect(opcoes, pergunta).toHaveLength(4);
      expect(new Set(opcoes).size, pergunta).toBe(4);
      for (const o of opcoes) {
        expect(o.trim(), pergunta).not.toBe("");
        expect(o, pergunta).not.toMatch(/\.\.\.|\?\)|\(incorreta|sem ‘s’… forma/); // restos de rascunho
      }
      expect(Number.isInteger(correta) && correta >= 0 && correta <= 3, pergunta).toBe(true);
      expect(explicacao.trim(), pergunta).not.toBe("");
      if (dif) expect(["FACIL", "MEDIO", "DIFICIL"]).toContain(dif);
    }
    for (const [assertiva, gabarito, explicacao] of ce) {
      expect(assertiva.trim()).not.toBe("");
      expect(["C", "E"], assertiva).toContain(gabarito);
      expect(explicacao.trim(), assertiva).not.toBe("");
    }
    for (const [frente, verso] of fc) {
      expect(frente.trim()).not.toBe("");
      expect(verso.trim()).not.toBe("");
    }

    // sem duplicatas internas
    const textos = [...mc.map((q) => chaveMc(q[0], q[1])), ...ce.map((q) => q[0].trim())];
    expect(new Set(textos).size, "duplicatas internas de perguntas").toBe(textos.length);
    expect(new Set(fc.map((f) => f[0].trim())).size, "duplicatas internas de flashcards").toBe(fc.length);

    // sem duplicar o conteúdo-base (quando o tópico é de uma matéria com dados em prisma/data)
    const base = baseDeTopico.get(slug);
    if (base) {
      for (const t of textos) expect(base.perguntas.has(t), `repete questão-base: ${t.slice(0, 60)}`).toBe(false);
      for (const f of fc) expect(base.frentes.has(f[0].trim()), `repete flashcard-base: ${f[0].slice(0, 60)}`).toBe(false);
    }
    expect(JSON.stringify(e)).not.toMatch(/\bTODO\b|undefined|\[object/);
  });
});
