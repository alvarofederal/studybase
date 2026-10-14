import { describe, expect, it } from "vitest";
import { ehCertoErrado, montarOpcoes } from "./montar-quiz";

describe("montarOpcoes", () => {
  it("múltipla escolha tradicional", () => {
    const r = montarOpcoes({ opcaoA: "a", opcaoB: "b", opcaoC: "c", opcaoD: "d", correta: "C" });
    expect(r).toMatchObject({ tipo: "MULTIPLA" });
    expect("opcoes" in r && r.opcoes.map((o) => o.correta)).toEqual([false, false, true, false]);
  });
  it("sem alternativas vira Certo/Errado — 'C' é Certo, não a letra C", () => {
    const r = montarOpcoes({ correta: "C" });
    expect(r).toMatchObject({ tipo: "CERTO_ERRADO" });
    expect("opcoes" in r && r.opcoes[0]).toEqual({ texto: "Certo", correta: true, ordem: 0 });
  });
  it("coluna tipo manda mesmo com alternativas", () => {
    expect(ehCertoErrado({ tipo: "CE", opcaoA: "x", correta: "E" })).toBe(true);
    expect(ehCertoErrado({ tipo: "MULTIPLA", correta: "A" })).toBe(false);
  });
  it("rejeita gabarito inválido", () => {
    expect(montarOpcoes({ tipo: "CE", correta: "B" })).toHaveProperty("erro");
    expect(montarOpcoes({ opcaoA: "a", opcaoB: "b", opcaoC: "c", opcaoD: "d", correta: "E" })).toHaveProperty("erro");
  });
});
