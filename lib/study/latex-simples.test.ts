import { describe, expect, it } from "vitest";
import { converterFormulas, formulaParaTexto, restaurarEscapes } from "../../prisma/lib/latex-simples.mjs";

describe("latex-simples", () => {
  it("converte operadores, frações, potências e letras gregas", () => {
    expect(formulaParaTexto("M = C \\times (1 + i)^{n}")).toBe("M = C × (1 + i)^(n)");
    expect(formulaParaTexto("PV = \\frac{N}{1 + i \\times n}")).toBe("PV = N ÷ (1 + i × n)");
    expect(formulaParaTexto("r = \\frac{(1 + i)}{(1 + \\pi)} - 1")).toBe("r = (1 + i) ÷ (1 + π) - 1");
    expect(formulaParaTexto("\\frac{1 - (1 + i)^{-n}}{i}")).toBe("(1 - (1 + i)^(-n)) ÷ i");
  });

  it("restaura escapes consumidos por template strings (tab e form feed) e converte o bloco inteiro", () => {
    // o que o banco guardava: "\times" → TAB + "imes"; "\frac" → FF + "rac"
    const quebrado = "$$J = C \times i \times n$$ e $$PV = \frac{N}{1 + i \times n}$$";
    const texto = converterFormulas(restaurarEscapes(quebrado));
    expect(texto).toContain("> `J = C × i × n`");
    expect(texto).toContain("> `PV = N ÷ (1 + i × n)`");
    expect(texto).not.toMatch(/\$\$|\t|\f/);
  });
});
