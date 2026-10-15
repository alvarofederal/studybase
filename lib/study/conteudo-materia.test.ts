import { describe, expect, it } from "vitest";
import { contarConteudo, materiaTemConteudo } from "./conteudo-materia";

describe("materiaTemConteudo", () => {
  it("exige tópicos, questões e flashcards ao mesmo tempo", () => {
    expect(materiaTemConteudo({ topicos: 3, quizzes: 10, flashcards: 5 })).toBe(true);
    expect(materiaTemConteudo({ topicos: 0, quizzes: 0, flashcards: 0 })).toBe(false);
    expect(materiaTemConteudo({ topicos: 3, quizzes: 0, flashcards: 5 })).toBe(false);
    expect(materiaTemConteudo({ topicos: 3, quizzes: 10, flashcards: 0 })).toBe(false);
    expect(materiaTemConteudo({ topicos: 0, quizzes: 10, flashcards: 5 })).toBe(false);
  });
});

describe("contarConteudo", () => {
  it("soma tópicos, questões e flashcards de todos os blocos", () => {
    const blocos = [
      { topicos: [{ _count: { quizzes: 4, flashcards: 2 } }, { _count: { quizzes: 1, flashcards: 0 } }] },
      { topicos: [{ _count: { quizzes: 5, flashcards: 3 } }] },
    ];
    expect(contarConteudo(blocos)).toEqual({ topicos: 3, quizzes: 10, flashcards: 5 });
  });

  it("matéria sem blocos ou com blocos vazios conta zero (e não tem conteúdo)", () => {
    expect(contarConteudo([])).toEqual({ topicos: 0, quizzes: 0, flashcards: 0 });
    expect(materiaTemConteudo(contarConteudo([{ topicos: [] }]))).toBe(false);
  });

  it("tópicos sem questões nem cards não tornam a matéria elegível", () => {
    const c = contarConteudo([{ topicos: [{ _count: { quizzes: 0, flashcards: 0 } }] }]);
    expect(c.topicos).toBe(1);
    expect(materiaTemConteudo(c)).toBe(false);
  });
});
