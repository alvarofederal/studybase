/**
 * Regras do estilo CEBRASPE (itens Certo/Errado). Funções puras e testadas.
 *
 * Um item CERTO_ERRADO é um Quiz cuja `pergunta` é a assertiva e cujas opções são
 * exatamente "Certo" (ordem 0) e "Errado" (ordem 1); uma delas é a `correta`.
 */
export const OPCOES_CE = ["Certo", "Errado"] as const;

export type GabaritoCE = "C" | "E";

/** Aceita C/E/Certo/Errado/V/F em qualquer caixa. */
export function normalizarGabaritoCE(raw: unknown): GabaritoCE | null {
  const s = String(raw ?? "").trim().toUpperCase();
  if (s === "C" || s === "CERTO" || s === "V" || s === "VERDADEIRO") return "C";
  if (s === "E" || s === "ERRADO" || s === "F" || s === "FALSO") return "E";
  return null;
}

/** Opções (texto/correta/ordem) de um item Certo/Errado, prontas para o Prisma. */
export function opcoesCertoErrado(gabarito: GabaritoCE) {
  return OPCOES_CE.map((texto, ordem) => ({
    texto,
    correta: (ordem === 0) === (gabarito === "C"),
    ordem,
  }));
}

export interface ItemParaPontuar {
  correta: boolean;
  emBranco: boolean;
  /** Marcou "Errado" (isto é, "caçou" o item). */
  marcouErrado: boolean;
}

/**
 * Pontuação CEBRASPE: cada erro anula um acerto e o branco vale zero.
 * Saldo = acertos − erros (pode ser negativo). Também mede a "caça às erradas":
 *  - pureza: das que marcou Errado, quantas realmente eram erradas
 *  - taxaCaca: % do total marcado como Errado (alvo ~25–35% por bloco)
 */
export function pontuarCebraspe(itens: ItemParaPontuar[], valorItem = 1) {
  const total = itens.length;
  const acertos = itens.filter((i) => i.correta).length;
  const emBranco = itens.filter((i) => i.emBranco).length;
  const erros = total - acertos - emBranco;
  const caçadas = itens.filter((i) => i.marcouErrado);
  const caçadasCorretas = caçadas.filter((i) => i.correta).length;
  const pureza = caçadas.length ? Math.round((caçadasCorretas / caçadas.length) * 100) : null;
  const taxaCaca = total ? Math.round((caçadas.length / total) * 100) : 0;

  return {
    total,
    acertos,
    erros,
    emBranco,
    saldo: (acertos - erros) * valorItem,
    maximo: total * valorItem,
    caçadas: caçadas.length,
    caçadasCorretas,
    pureza,
    taxaCaca,
    /** Leitura do termômetro da técnica: <20% superficial, >40% severo demais. */
    termometro: (taxaCaca > 40 ? "severo" : taxaCaca < 20 ? "superficial" : "ok") as "severo" | "superficial" | "ok",
    /** Pureza ≥95 confiável · 85–94 apertar o critério · <85 a técnica está prejudicando. */
    veredito:
      pureza === null ? null : pureza >= 95 ? "confiavel" : pureza >= 85 ? "apertar" : ("prejudicando" as const),
  };
}

/**
 * Deriva uma assertiva Certo/Errado a partir de uma questão de múltipla escolha:
 * a versão CERTA usa a alternativa correta; a ERRADA, uma alternativa incorreta.
 */
export function derivarAssertivas(pergunta: string, correta: string, incorreta: string) {
  const base = pergunta.trim().replace(/[?:]\s*$/, "");
  return {
    certa: `${base}: ${correta.trim()}`,
    errada: `${base}: ${incorreta.trim()}`,
  };
}
