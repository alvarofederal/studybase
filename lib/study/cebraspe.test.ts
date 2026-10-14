import { describe, expect, it } from "vitest";
import { normalizarGabaritoCE, opcoesCertoErrado, pontuarCebraspe } from "./cebraspe";

const item = (correta: boolean, emBranco = false, marcouErrado = false) => ({ correta, emBranco, marcouErrado });

describe("normalizarGabaritoCE", () => {
  it("aceita variações", () => {
    expect(normalizarGabaritoCE("c")).toBe("C");
    expect(normalizarGabaritoCE(" Errado ")).toBe("E");
    expect(normalizarGabaritoCE("F")).toBe("E");
    expect(normalizarGabaritoCE("A")).toBeNull();
    expect(normalizarGabaritoCE(undefined)).toBeNull();
  });
});

describe("opcoesCertoErrado", () => {
  it("marca exatamente uma como correta", () => {
    expect(opcoesCertoErrado("C")).toEqual([
      { texto: "Certo", correta: true, ordem: 0 },
      { texto: "Errado", correta: false, ordem: 1 },
    ]);
    expect(opcoesCertoErrado("E").map((o) => o.correta)).toEqual([false, true]);
  });
});

describe("pontuarCebraspe", () => {
  it("cada erro anula um acerto e o branco vale zero", () => {
    const r = pontuarCebraspe([item(true), item(true), item(true), item(false), item(false, true)]);
    expect(r).toMatchObject({ acertos: 3, erros: 1, emBranco: 1, saldo: 2, maximo: 5 });
  });
  it("saldo pode ser negativo", () => {
    expect(pontuarCebraspe([item(false), item(false), item(true)]).saldo).toBe(-1);
  });
  it("valor do item multiplica (ex.: 2 pontos na P3 da CGU)", () => {
    expect(pontuarCebraspe([item(true), item(false)], 2).saldo).toBe(0);
    expect(pontuarCebraspe([item(true), item(true)], 2).saldo).toBe(4);
  });
  it("mede pureza e taxa da caça", () => {
    // 10 itens: marcou E em 3 (2 acertos, 1 furo), 7 como C (todos certos)
    const itens = [
      item(true, false, true),
      item(true, false, true),
      item(false, false, true),
      ...Array.from({ length: 7 }, () => item(true)),
    ];
    const r = pontuarCebraspe(itens);
    expect(r).toMatchObject({ caçadas: 3, caçadasCorretas: 2, pureza: 67, taxaCaca: 30, termometro: "ok", veredito: "prejudicando" });
  });
  it("sem caça, pureza é null", () => {
    const r = pontuarCebraspe([item(true)]);
    expect(r.pureza).toBeNull();
    expect(r.termometro).toBe("superficial");
  });
});
