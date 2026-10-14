import { describe, expect, it } from "vitest";
import { corrigir } from "./simulado";

const q = (id: string, certa: string) => ({
  id,
  opcoes: ["a", "b", "c"].map((o) => ({ id: `${id}-${o}`, correta: o === certa })),
});

describe("corrigir", () => {
  const questoes = [q("1", "a"), q("2", "b"), q("3", "c"), q("4", "a")];

  it("conta acertos, erros e brancos", () => {
    const r = corrigir(questoes, [
      { quizId: "1", opcaoId: "1-a" },
      { quizId: "2", opcaoId: "2-a" },
      { quizId: "3", opcaoId: null },
    ]);
    expect(r).toMatchObject({ total: 4, acertos: 1, erros: 1, emBranco: 2, percentual: 25 });
  });
  it("ignora alternativa de outra questão (fraude)", () => {
    const r = corrigir(questoes, [{ quizId: "1", opcaoId: "2-b" }]);
    expect(r.itens[0].correta).toBe(false);
    expect(r.itens[0].emBranco).toBe(true);
  });
  it("lista vazia não divide por zero", () => expect(corrigir([], []).percentual).toBe(0));
});
