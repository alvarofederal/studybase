/**
 * Regra única de "matéria com conteúdo": só aparece para o público (landing) e só pode ser
 * solicitada pelo aluno quando já tem tópicos, questões e flashcards.
 * Usada pela landing, pela lista "Solicitar acesso" do aluno e pela API de solicitação.
 */
export interface ContagemConteudo {
  topicos: number;
  quizzes: number;
  flashcards: number;
}

export function materiaTemConteudo(c: ContagemConteudo): boolean {
  return c.topicos > 0 && c.quizzes > 0 && c.flashcards > 0;
}

/** Soma as contagens de uma matéria carregada com `blocos → topicos → _count`. */
export function contarConteudo(
  blocos: { topicos: { _count: { quizzes: number; flashcards: number } }[] }[],
): ContagemConteudo {
  let topicos = 0;
  let quizzes = 0;
  let flashcards = 0;
  for (const b of blocos) {
    for (const t of b.topicos) {
      topicos += 1;
      quizzes += t._count.quizzes;
      flashcards += t._count.flashcards;
    }
  }
  return { topicos, quizzes, flashcards };
}
