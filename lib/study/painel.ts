import prisma from "@/lib/prisma";
import { calcularStreak, diaBR } from "./streak";

const DIA = 24 * 60 * 60 * 1000;

/** Início do dia atual em Brasília (UTC-3, sem horário de verão desde 2019). */
export function inicioDoDiaBR(d = new Date()): Date {
  return new Date(`${diaBR(d)}T00:00:00-03:00`);
}

/** IDs das matérias ativas às quais o usuário tem acesso vigente. */
export async function materiasAtivasIds(userId: string): Promise<string[]> {
  const agora = new Date();
  const acessos = await prisma.userMateria.findMany({
    where: {
      userId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: agora } }],
      materia: { ativa: true },
    },
    select: { materiaId: true },
  });
  return acessos.map((a) => a.materiaId);
}

export async function carregarPainel(userId: string) {
  const agora = new Date();
  const ids = await materiasAtivasIds(userId);
  const desde = new Date(agora.getTime() - 365 * DIA);
  const noEscopo = { topico: { bloco: { materiaId: { in: ids } } } };

  const [user, devidas, hist, revs, erros] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { metaDiaria: true, dataProva: true } }),
    prisma.revisaoFlashcard.count({
      where: { userId, proximaRevisao: { lte: agora }, flashcard: noEscopo },
    }),
    prisma.historicoRespostaQuiz.findMany({
      where: { userId, createdAt: { gte: desde } },
      select: { createdAt: true },
    }),
    prisma.revisaoFlashcard.findMany({
      where: { userId, updatedAt: { gte: desde } },
      select: { updatedAt: true },
    }),
    prisma.respostaQuiz.count({ where: { userId, correta: false, quiz: noEscopo } }),
  ]);

  const datas = [...hist.map((h) => h.createdAt), ...revs.map((r) => r.updatedAt)];
  const porDia = new Map<string, number>();
  for (const d of datas) porDia.set(diaBR(d), (porDia.get(diaBR(d)) ?? 0) + 1);

  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(agora.getTime() - (6 - i) * DIA);
    return { dia: diaBR(d), total: porDia.get(diaBR(d)) ?? 0 };
  });

  const dataProva = user?.dataProva ?? null;
  return {
    metaDiaria: user?.metaDiaria ?? 20,
    dataProva: dataProva ? dataProva.toISOString() : null,
    diasParaProva: dataProva
      ? Math.ceil((inicioDoDiaBR(dataProva).getTime() - inicioDoDiaBR(agora).getTime()) / DIA)
      : null,
    streak: calcularStreak(datas, agora),
    hoje: porDia.get(diaBR(agora)) ?? 0,
    ultimos7,
    revisoesDevidas: devidas,
    errosAbertos: erros,
  };
}

export type Painel = Awaited<ReturnType<typeof carregarPainel>>;
