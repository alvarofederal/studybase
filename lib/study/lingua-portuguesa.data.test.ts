import { describe, expect, it } from "vitest";
import b1 from "../../prisma/data/lingua-portuguesa/01-interpretacao.mjs";
import b2 from "../../prisma/data/lingua-portuguesa/02-fonologia-ortografia.mjs";
import b3 from "../../prisma/data/lingua-portuguesa/03-semantica-formacao.mjs";
import b4 from "../../prisma/data/lingua-portuguesa/04-classes-de-palavras.mjs";
import b5 from "../../prisma/data/lingua-portuguesa/05-sintaxe.mjs";
import b6 from "../../prisma/data/lingua-portuguesa/06-pontuacao-concordancia-regencia-crase.mjs";
import b7 from "../../prisma/data/lingua-portuguesa/07-reescrita-registro-culto.mjs";
import b8 from "../../prisma/data/lingua-portuguesa/08-redacao-oficial.mjs";

type Topico = {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  fc: [string, string][];
  mc: [string, string[], number, string, string?][];
  ce: [string, string, string][];
};
type Bloco = { nome: string; slug: string; ordem: number; topicos: Topico[] };

const blocos = [b1, b2, b3, b4, b5, b6, b7, b8] as unknown as Bloco[];
const topicos = blocos.flatMap((b) => b.topicos.map((t) => ({ bloco: b.slug, ...t })));

describe("conteúdo de Língua Portuguesa", () => {
  it("tem blocos e tópicos com slugs únicos", () => {
    expect(new Set(blocos.map((b) => b.slug)).size).toBe(blocos.length);
    for (const b of blocos) expect(new Set(b.topicos.map((t) => t.slug)).size).toBe(b.topicos.length);
    expect(blocos.map((b) => b.ordem)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it.each(topicos.map((t) => [t.titulo, t] as const))("%s: conteúdo, flashcards, questões e itens C/E válidos", (_, t) => {
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
      expect(new Set(opcoes).size).toBe(4); // sem alternativas repetidas
      expect(Number.isInteger(correta) && correta >= 0 && correta <= 3).toBe(true);
      expect(explicacao.trim()).not.toBe("");
      if (dif) expect(["FACIL", "MEDIO", "DIFICIL"]).toContain(dif);
    }
    for (const [assertiva, gabarito, explicacao] of t.ce) {
      expect(assertiva.trim()).not.toBe("");
      expect(["C", "E"]).toContain(gabarito);
      expect(explicacao.trim()).not.toBe("");
    }
  });

  it("mistura gabaritos C e E (não enviesa a prova)", () => {
    const todos = topicos.flatMap((t) => t.ce.map((c) => c[1]));
    const certos = todos.filter((g) => g === "C").length;
    const pctCertos = certos / todos.length;
    expect(pctCertos).toBeGreaterThan(0.3);
    expect(pctCertos).toBeLessThan(0.8);
  });

  it("distribui o gabarito da múltipla escolha entre as quatro letras", () => {
    const contagem = [0, 0, 0, 0];
    for (const t of topicos) for (const q of t.mc) contagem[q[2]]++;
    for (const n of contagem) expect(n).toBeGreaterThan(5);
  });

  it("não deixa marcadores de rascunho no texto", () => {
    for (const t of topicos) {
      const texto = JSON.stringify(t);
      expect(texto).not.toMatch(/\bTODO\b|undefined|\[object/);
    }
  });
});
