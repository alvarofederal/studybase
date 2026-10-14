/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { balancearMc } from "../../prisma/lib/balancear.mjs";

type Topico = {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  fc: [string, string][];
  mc: [string, string[], number, string, string?][];
  ce: [string, string, string][];
};
type Bloco = { nome: string; slug: string; descricao: string; ordem: number; topicos: Topico[] };

// Cada arquivo exporta um bloco ou uma lista de blocos. Agrupados por pasta (= matéria).
const modulos = import.meta.glob("../../prisma/data/**/*.mjs", { eager: true }) as Record<string, { default: Bloco | Bloco[] }>;

const porMateria = new Map<string, Bloco[]>();
for (const [caminho, mod] of Object.entries(modulos)) {
  const materia = caminho.split("/data/")[1].split("/")[0];
  const lista = Array.isArray(mod.default) ? mod.default : [mod.default];
  porMateria.set(materia, [...(porMateria.get(materia) ?? []), ...lista]);
}
const todos = [...porMateria.entries()].flatMap(([materia, blocos]) =>
  blocos.flatMap((b) => b.topicos.map((t) => ({ materia, bloco: b.slug, ...t }))),
);

describe("conteúdo das matérias (prisma/data)", () => {
  it("encontra as matérias esperadas", () => {
    expect([...porMateria.keys()].sort()).toEqual(["lgpd", "lingua-portuguesa", "raciocinio-logico"]);
  });

  it.each([...porMateria.entries()])("%s: blocos e tópicos com slugs e ordens únicos", (_, blocos) => {
    expect(new Set(blocos.map((b) => b.slug)).size).toBe(blocos.length);
    expect(new Set(blocos.map((b) => b.ordem)).size).toBe(blocos.length);
    for (const b of blocos) {
      expect(b.nome.trim()).not.toBe("");
      expect(b.descricao.trim()).not.toBe("");
      expect(new Set(b.topicos.map((t) => t.slug)).size).toBe(b.topicos.length);
    }
  });

  it("os blocos novos de Raciocínio Lógico não colidem com os blocos já existentes (1 a 5)", () => {
    const slugsExistentes = [
      "logica-proposicional",
      "equivalencias-e-inferencias",
      "quantificadores-e-logica-de-predicados",
      "logica-situacional-e-arranjos",
      "argumentacao-falacias-e-sequencias",
    ];
    for (const b of porMateria.get("raciocinio-logico") ?? []) {
      expect(slugsExistentes).not.toContain(b.slug);
      expect(b.ordem).toBeGreaterThanOrEqual(6);
    }
  });

  it.each(todos.map((t) => [`${t.materia} › ${t.titulo}`, t] as const))("%s: estrutura válida", (_, t) => {
    expect(t.conteudo.length).toBeGreaterThan(500);
    expect(t.resumo.length).toBeGreaterThan(40);
    expect(t.fc.length).toBeGreaterThanOrEqual(3);
    expect(t.mc.length).toBeGreaterThanOrEqual(3);
    expect(t.ce.length).toBeGreaterThanOrEqual(4);

    for (const [frente, verso] of t.fc) {
      expect(frente.trim()).not.toBe("");
      expect(verso.trim()).not.toBe("");
    }
    for (const [pergunta, opcoes, correta, explicacao, dif] of t.mc) {
      expect(pergunta.trim()).not.toBe("");
      expect(opcoes).toHaveLength(4);
      expect(new Set(opcoes).size).toBe(4);
      expect(Number.isInteger(correta) && correta >= 0 && correta <= 3).toBe(true);
      expect(explicacao.trim()).not.toBe("");
      if (dif) expect(["FACIL", "MEDIO", "DIFICIL"]).toContain(dif);
    }
    for (const [assertiva, gabarito, explicacao] of t.ce) {
      expect(assertiva.trim()).not.toBe("");
      expect(["C", "E"]).toContain(gabarito);
      expect(explicacao.trim()).not.toBe("");
    }
    expect(JSON.stringify(t)).not.toMatch(/\bTODO\b|undefined|\[object/);
  });

  it.each([...porMateria.keys()])("%s: gabaritos C/E não são enviesados", (materia) => {
    const ce = todos.filter((t) => t.materia === materia).flatMap((t) => t.ce.map((c) => c[1]));
    const pctC = ce.filter((g) => g === "C").length / ce.length;
    expect(pctC).toBeGreaterThan(0.3);
    expect(pctC).toBeLessThan(0.8);
  });

  it.each([...porMateria.keys()])("%s: o balanceamento distribui a alternativa correta entre A–D sem trocar o conteúdo", (materia) => {
    const letras = [0, 0, 0, 0];
    let seq = 0;
    for (const t of todos.filter((x) => x.materia === materia)) {
      const bal = balancearMc(t.mc, seq) as [string, string[], number, string, string?][];
      seq += t.mc.length;
      bal.forEach(([pergunta, opcoes, correta], i) => {
        const [pOrig, oOrig, cOrig] = t.mc[i];
        expect(pergunta).toBe(pOrig);
        expect([...opcoes].sort()).toEqual([...oOrig].sort()); // mesmas alternativas
        expect(opcoes[correta]).toBe(oOrig[cOrig]); // a correta continua sendo a mesma
        letras[correta]++;
      });
    }
    const total = letras.reduce((a, b) => a + b, 0);
    for (const n of letras) expect(Math.abs(n - total / 4)).toBeLessThanOrEqual(1);
  });
});
