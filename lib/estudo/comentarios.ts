import prisma from "@/lib/prisma";

export const MAX_TEXTO = 2000;
/** Denúncias distintas que ocultam o comentário automaticamente (o admin revisa e decide). */
export const DENUNCIAS_PARA_OCULTAR = 3;

/** "Maria da Silva" → "Maria S." — não expõe o nome completo dos alunos. */
export function nomePublico(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0];
  const ultimo = partes[partes.length - 1];
  return `${partes[0]} ${ultimo.charAt(0).toUpperCase()}.`;
}

/**
 * Resolve a questão "raiz" (itens CE derivados comentam na questão de origem) e a matéria dela.
 * Retorna null se a questão não existir.
 */
export async function resolverQuestao(quizId: string) {
  const q = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, origemId: true, topico: { select: { bloco: { select: { materiaId: true } } } } },
  });
  if (!q) return null;
  return {
    raizId: q.origemId ?? q.id,
    idsRelacionados: [q.id, ...(q.origemId ? [q.origemId] : [])],
    materiaId: q.topico.bloco.materiaId,
  };
}

export async function temAcessoMateria(userId: string, role: string, materiaId: string): Promise<boolean> {
  if (role === "ADMIN") return true;
  const acesso = await prisma.userMateria.findFirst({
    where: { userId, materiaId, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { id: true },
  });
  return !!acesso;
}

/** O aluno só participa da discussão depois de ter respondido a questão (sem spoiler do gabarito). */
export async function jaRespondeu(userId: string, quizIds: string[]): Promise<boolean> {
  const [r, h] = await Promise.all([
    prisma.respostaQuiz.findFirst({ where: { userId, quizId: { in: quizIds } }, select: { id: true } }),
    prisma.historicoRespostaQuiz.findFirst({ where: { userId, quizId: { in: quizIds } }, select: { id: true } }),
  ]);
  return !!(r || h);
}
