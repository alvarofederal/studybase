/** Correção de simulado — função pura, o gabarito vem sempre do banco. */
export interface QuestaoGabarito {
  id: string;
  opcoes: { id: string; correta: boolean }[];
}
export interface RespostaSimulado {
  quizId: string;
  opcaoId: string | null;
}
export interface ResultadoItem {
  quizId: string;
  opcaoEscolhida: string | null;
  opcaoCorreta: string | null;
  correta: boolean;
  emBranco: boolean;
}

export function corrigir(questoes: QuestaoGabarito[], respostas: RespostaSimulado[]) {
  const porQuiz = new Map(respostas.map((r) => [r.quizId, r.opcaoId]));
  const itens: ResultadoItem[] = questoes.map((q) => {
    const escolhida = porQuiz.get(q.id) ?? null;
    const valida = escolhida !== null && q.opcoes.some((o) => o.id === escolhida);
    const certa = q.opcoes.find((o) => o.correta)?.id ?? null;
    return {
      quizId: q.id,
      opcaoEscolhida: valida ? escolhida : null,
      opcaoCorreta: certa,
      correta: valida && escolhida === certa,
      emBranco: !valida,
    };
  });
  const acertos = itens.filter((i) => i.correta).length;
  const emBranco = itens.filter((i) => i.emBranco).length;
  return {
    itens,
    total: itens.length,
    acertos,
    emBranco,
    erros: itens.length - acertos - emBranco,
    percentual: itens.length ? Math.round((acertos / itens.length) * 100) : 0,
  };
}

export function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
