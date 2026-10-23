import prisma from "@/lib/prisma";
import type { ContextoQuestao } from "./comentario-quiz";

/** Campos necessários para montar o prompt de uma questão. */
const selecao = {
  id: true,
  pergunta: true,
  tipo: true,
  explicacao: true,
  opcoes: { orderBy: { ordem: "asc" as const }, select: { texto: true, correta: true } },
  topico: {
    select: {
      titulo: true,
      conteudo: true,
      bloco: { select: { nome: true, materia: { select: { nome: true } } } },
    },
  },
};

type Linha = {
  id: string;
  pergunta: string;
  tipo: "MULTIPLA" | "CERTO_ERRADO";
  explicacao: string | null;
  opcoes: { texto: string; correta: boolean }[];
  topico: { titulo: string; conteudo: string; bloco: { nome: string; materia: { nome: string } } };
};

function paraContexto(q: Linha): ContextoQuestao {
  return {
    materia: q.topico.bloco.materia.nome,
    bloco: q.topico.bloco.nome,
    topico: q.topico.titulo,
    conteudoTopico: q.topico.conteudo ?? "",
    tipo: q.tipo,
    pergunta: q.pergunta,
    explicacao: q.explicacao,
    opcoes: q.opcoes,
  };
}

/** Contexto de uma questão da trilha (itens CE derivados não recebem comentário próprio). */
export async function contextoDaQuestao(quizId: string): Promise<ContextoQuestao | null> {
  const q = await prisma.quiz.findFirst({ where: { id: quizId, origemId: null }, select: selecao });
  return q ? paraContexto(q) : null;
}

/**
 * Questões da trilha de uma matéria ainda sem comentário, na ordem bloco → tópico → questão
 * (questões do mesmo tópico ficam juntas e reaproveitam o cache do bloco do tópico).
 */
export async function contextosSemComentario(materiaId: string, limite = 5000) {
  const linhas = await prisma.quiz.findMany({
    where: { origemId: null, comentarioIa: null, topico: { bloco: { materiaId } } },
    orderBy: [{ topico: { bloco: { ordem: "asc" } } }, { topico: { ordem: "asc" } }, { ordem: "asc" }],
    take: limite,
    select: selecao,
  });
  return linhas.map((q) => ({ quizId: q.id, contexto: paraContexto(q) }));
}
