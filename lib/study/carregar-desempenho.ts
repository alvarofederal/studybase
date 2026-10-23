import prisma from "@/lib/prisma";
import { materiasAtivasIds } from "./painel";
import {
  evolucaoSemanal,
  inicioJanelaSemanas,
  montarDesempenho,
  type ContagemTopico,
  type TopicoMeta,
} from "./desempenho";

/**
 * Carrega o desempenho do aluno nas matérias com acesso ativo.
 * Agrega no banco (groupBy por tópico); só as tentativas das últimas 8 semanas vêm linha a linha.
 */
export async function carregarDesempenho(userId: string, agora = new Date()) {
  const materiaIds = await materiasAtivasIds(userId);

  const topicosDb = materiaIds.length
    ? await prisma.topico.findMany({
        where: { bloco: { materiaId: { in: materiaIds } } },
        select: {
          id: true,
          titulo: true,
          ordem: true,
          bloco: {
            select: {
              id: true,
              nome: true,
              ordem: true,
              materia: { select: { id: true, nome: true, slug: true, icone: true, ordem: true } },
            },
          },
          _count: { select: { quizzes: { where: { origemId: null } }, flashcards: true } },
        },
      })
    : [];

  const topicos: TopicoMeta[] = topicosDb.map((t) => ({
    topicoId: t.id,
    titulo: t.titulo,
    ordem: t.ordem,
    blocoId: t.bloco.id,
    blocoNome: t.bloco.nome,
    blocoOrdem: t.bloco.ordem,
    materiaId: t.bloco.materia.id,
    materiaNome: t.bloco.materia.nome,
    materiaSlug: t.bloco.materia.slug,
    materiaIcone: t.bloco.materia.icone,
    materiaOrdem: t.bloco.materia.ordem,
    questoesTrilha: t._count.quizzes,
    flashcards: t._count.flashcards,
  }));

  const topicoIds = topicos.map((t) => t.topicoId);
  const noEscopo = { userId, topicoId: { in: topicoIds } };

  const [respostas, respostasTrilha, revisoes, tentativas] = topicoIds.length
    ? await Promise.all([
        prisma.respostaQuiz.groupBy({ by: ["topicoId", "correta"], where: noEscopo, _count: { _all: true } }),
        prisma.respostaQuiz.groupBy({
          by: ["topicoId"],
          where: { ...noEscopo, quiz: { origemId: null } },
          _count: { _all: true },
        }),
        prisma.revisaoFlashcard.groupBy({ by: ["topicoId", "acertou"], where: noEscopo, _count: { _all: true } }),
        prisma.historicoRespostaQuiz.findMany({
          where: { ...noEscopo, createdAt: { gte: inicioJanelaSemanas(agora) } },
          select: { createdAt: true, correta: true },
        }),
      ])
    : [[], [], [], []];

  const contagens = new Map<string, ContagemTopico>();
  const de = (topicoId: string) => {
    let c = contagens.get(topicoId);
    if (!c) {
      c = { topicoId, respondidos: 0, acertos: 0, respondidosTrilha: 0, fcRevisados: 0, fcAcertos: 0 };
      contagens.set(topicoId, c);
    }
    return c;
  };
  for (const r of respostas) {
    const c = de(r.topicoId);
    c.respondidos += r._count._all;
    if (r.correta) c.acertos += r._count._all;
  }
  for (const r of respostasTrilha) de(r.topicoId).respondidosTrilha += r._count._all;
  for (const r of revisoes) {
    const c = de(r.topicoId);
    c.fcRevisados += r._count._all;
    if (r.acertou) c.fcAcertos += r._count._all;
  }

  return {
    ...montarDesempenho(topicos, [...contagens.values()]),
    semanas: evolucaoSemanal(tentativas, agora),
    temAcesso: materiaIds.length > 0,
  };
}

export type DesempenhoCompleto = Awaited<ReturnType<typeof carregarDesempenho>>;
