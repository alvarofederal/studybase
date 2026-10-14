import { normalizarGabaritoCE, opcoesCertoErrado } from "./cebraspe";

export interface LinhaQuiz {
  tipo?: string | null;
  correta?: string | null;
  opcaoA?: string | null;
  opcaoB?: string | null;
  opcaoC?: string | null;
  opcaoD?: string | null;
}

type Montado =
  | { tipo: "MULTIPLA" | "CERTO_ERRADO"; opcoes: { texto: string; correta: boolean; ordem: number }[] }
  | { erro: string };

const LETRAS = ["A", "B", "C", "D"];

/** É um item Certo/Errado? `tipo` = CE/CERTO_ERRADO, ou nenhuma alternativa preenchida. */
export function ehCertoErrado(l: LinhaQuiz): boolean {
  const t = String(l.tipo ?? "").trim().toUpperCase();
  if (t === "CE" || t === "CERTO_ERRADO" || t === "CERTO/ERRADO" || t === "CEBRASPE") return true;
  if (t === "MULTIPLA" || t === "ME") return false;
  return [l.opcaoA, l.opcaoB, l.opcaoC, l.opcaoD].every((o) => !String(o ?? "").trim());
}

/** Monta as opções de uma linha de importação (múltipla escolha ou Certo/Errado). */
export function montarOpcoes(l: LinhaQuiz): Montado {
  if (ehCertoErrado(l)) {
    const g = normalizarGabaritoCE(l.correta);
    if (!g) return { erro: 'item Certo/Errado: "correta" deve ser C ou E' };
    return { tipo: "CERTO_ERRADO", opcoes: opcoesCertoErrado(g) };
  }

  const idx = LETRAS.indexOf(String(l.correta ?? "").trim().toUpperCase());
  if (idx === -1) return { erro: '"correta" deve ser A, B, C ou D' };
  const textos = [l.opcaoA, l.opcaoB, l.opcaoC, l.opcaoD].map((o) => String(o ?? "").trim());
  return {
    tipo: "MULTIPLA",
    opcoes: textos.map((texto, i) => ({ texto, correta: i === idx, ordem: i })),
  };
}
