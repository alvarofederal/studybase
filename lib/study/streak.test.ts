import { describe, expect, it } from "vitest";
import { calcularStreak } from "./streak";

const agora = new Date("2026-03-10T15:00:00Z");
const dia = (n: number) => new Date(agora.getTime() - n * 86400000);

describe("calcularStreak", () => {
  it("zero sem atividade", () => expect(calcularStreak([], agora)).toBe(0));
  it("conta dias consecutivos incluindo hoje", () =>
    expect(calcularStreak([dia(0), dia(1), dia(2), dia(4)], agora)).toBe(3));
  it("não perde a sequência se só falta estudar hoje", () =>
    expect(calcularStreak([dia(1), dia(2)], agora)).toBe(2));
  it("quebra se passou mais de um dia", () => expect(calcularStreak([dia(2), dia(3)], agora)).toBe(0));
});
