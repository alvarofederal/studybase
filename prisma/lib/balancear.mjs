/**
 * Distribui a posição da alternativa correta de forma uniforme (A, B, C, D) entre as questões,
 * trocando de lugar a correta com a alternativa que está na posição-alvo. Determinístico:
 * a questão de número i (contagem corrida) recebe a correta na posição i % 4.
 *
 * As explicações dos dados não citam letras, então o reposicionamento é seguro.
 *
 * @param {[string, string[], number, string, string?][]} mc
 * @param {number} inicio contagem corrida global (para o balanceamento valer entre tópicos)
 */
export function balancearMc(mc, inicio = 0) {
  return mc.map(([pergunta, opcoes, correta, explicacao, dificuldade], i) => {
    const alvo = (inicio + i) % 4;
    const novas = [...opcoes];
    [novas[correta], novas[alvo]] = [novas[alvo], novas[correta]];
    return [pergunta, novas, alvo, explicacao, dificuldade];
  });
}
