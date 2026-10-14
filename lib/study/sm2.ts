/**
 * Repetição espaçada (SM-2 simplificado) para flashcards.
 * Funções puras — sem acesso a banco — para serem testáveis.
 */
export interface EstadoRevisao {
  facilidade: number;
  intervaloDias: number;
  repeticoes: number;
}

export const ESTADO_INICIAL: EstadoRevisao = { facilidade: 2.5, intervaloDias: 0, repeticoes: 0 };

const FACILIDADE_MIN = 1.3;
const DIA_MS = 24 * 60 * 60 * 1000;

/** Aplica uma revisão ("sabia" ou "não sabia") e devolve o novo estado e a próxima data. */
export function proximaRevisao(estado: EstadoRevisao, acertou: boolean, agora = new Date()) {
  let { facilidade, intervaloDias, repeticoes } = estado;

  if (!acertou) {
    repeticoes = 0;
    intervaloDias = 1;
    facilidade = Math.max(FACILIDADE_MIN, facilidade - 0.2);
  } else {
    repeticoes += 1;
    if (repeticoes === 1) intervaloDias = 1;
    else if (repeticoes === 2) intervaloDias = 3;
    else intervaloDias = Math.max(1, Math.round(intervaloDias * facilidade));
    facilidade = Math.min(3.0, facilidade + 0.05);
  }

  return {
    facilidade: Math.round(facilidade * 100) / 100,
    intervaloDias,
    repeticoes,
    proximaRevisao: new Date(agora.getTime() + intervaloDias * DIA_MS),
  };
}
