/**
 * Converte as fórmulas em LaTeX simples ($$ ... $$) usadas nos seeds antigos em texto legível,
 * já que o MarkdownRenderer do app não renderiza LaTeX.
 *   \times → ×   \frac{A}{B} → (A) ÷ (B)   x^{n} → x^(n)   \sum → Σ   \pi → π   \textbf{X} → X
 * Cada fórmula em bloco vira uma citação com código: > `M = C × (1 + i)^(n)`
 */

const BARRA = "\\";

/**
 * Restaura sequências de escape que o JavaScript consumiu (\t, \f) quando o LaTeX foi parar
 * numa template string: "\times" virou TAB + "imes"; "\frac" virou FF + "rac"; "\textbf" virou TAB + "extbf".
 * Também trata os casos em que o caractere de controle se perdeu e sobrou só "imes", "rac{", "extbf{".
 */
export function restaurarEscapes(s) {
  return s
    .replace(/\t(imes|extbf)/g, BARRA + "t$1")
    .replace(/\f(rac)/g, BARRA + "f$1")
    .replace(/(?<![\\\w])rac\{/g, BARRA + "frac{")
    .replace(/(?<![\\\w])imes(?![a-z])/g, BARRA + "times")
    .replace(/(?<![\\\w])extbf\{/g, BARRA + "textbf{")
    .replace(/(?<![\\\w])sum_\{/g, BARRA + "sum_{");
}

function chave(s, i) {
  // s[i] === "{"; devolve [conteúdo, índice após a chave de fechamento]
  let prof = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") prof++;
    else if (s[j] === "}" && --prof === 0) return [s.slice(i + 1, j), j + 1];
  }
  throw new Error("chave não fechada em: " + s);
}

/** Coloca entre parênteses só quando necessário (token simples ou já agrupado dispensam). */
function par(x) {
  x = x.trim();
  if (/^[\w.,]+$/.test(x)) return x;
  if (x.startsWith("(") && x.endsWith(")")) {
    let prof = 0;
    for (let k = 0; k < x.length; k++) {
      if (x[k] === "(") prof++;
      else if (x[k] === ")" && --prof === 0 && k < x.length - 1) return `(${x})`;
    }
    return x;
  }
  return `(${x})`;
}

function frac(s) {
  const marca = BARRA + "frac{";
  for (;;) {
    const i = s.indexOf(marca);
    if (i < 0) return s;
    const [num, fimNum] = chave(s, i + marca.length - 1);
    const [den, fimDen] = chave(s, fimNum);
    s = s.slice(0, i) + `${par(frac(num))} ÷ ${par(frac(den))}` + s.slice(fimDen);
  }
}

export function formulaParaTexto(f) {
  let s = f.trim();
  s = s.replace(/\\textbf\{([^{}]*)\}/g, "$1");
  s = s.replace(/\\times/g, "×").replace(/\\cdot/g, "·");
  s = frac(s);
  s = s.replace(/\\sum_\{([^}]*)\}\^\{([^}]*)\}/g, "Σ[$1 até $2]");
  s = s.replace(/\^\{([^{}]*)\}/g, "^($1)").replace(/_\{([^{}]*)\}/g, "_($1)");
  s = s.replace(/\\pi\b/g, "π").replace(/\bpi\b/g, "π");
  s = s.replace(/\\text\{([^{}]*)\}/g, "$1").replace(/\\left|\\right/g, "");
  return s.replace(/\s+/g, " ").trim();
}

/** Converte todos os blocos $$...$$ de um texto (já com escapes restaurados). */
export function converterFormulas(texto) {
  return texto.replace(/\$\$([\s\S]*?)\$\$/g, (_, f) => "> `" + formulaParaTexto(f) + "`");
}
