import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, proximaRevisao } from "./sm2";

const agora = new Date("2026-01-10T12:00:00Z");

describe("proximaRevisao", () => {
  it("primeiro acerto agenda para 1 dia", () => {
    const r = proximaRevisao(ESTADO_INICIAL, true, agora);
    expect(r.intervaloDias).toBe(1);
    expect(r.proximaRevisao.toISOString()).toBe("2026-01-11T12:00:00.000Z");
  });
  it("acertos seguidos espaçam 1 → 3 → crescente", () => {
    let e = ESTADO_INICIAL;
    const intervalos: number[] = [];
    for (let i = 0; i < 4; i++) {
      const r = proximaRevisao(e, true, agora);
      intervalos.push(r.intervaloDias);
      e = r;
    }
    expect(intervalos.slice(0, 2)).toEqual([1, 3]);
    expect(intervalos[3]).toBeGreaterThan(intervalos[2]);
  });
  it("erro zera a sequência e reduz a facilidade, sem passar do mínimo", () => {
    let e = { facilidade: 1.4, intervaloDias: 20, repeticoes: 5 };
    e = proximaRevisao(e, false, agora);
    expect(e.repeticoes).toBe(0);
    expect(e.intervaloDias).toBe(1);
    expect(e.facilidade).toBe(1.3);
    expect(proximaRevisao(e, false, agora).facilidade).toBe(1.3);
  });
});
