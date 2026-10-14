import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { limitar, respostaLimitada } from "@/lib/security/rate-limit";
import { resolverQuestao, temAcessoMateria } from "@/lib/estudo/comentarios";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Marca/desmarca "útil" em um comentário. */
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const rl = limitar(`curtir:${session.sub}`, 60, 60_000);
  if (!rl.ok) return respostaLimitada(rl.retryAfter);

  const { id } = await params;
  const c = await prisma.comentarioQuiz.findUnique({
    where: { id },
    select: { quizId: true, userId: true, ocultado: true },
  });
  if (!c || c.ocultado) return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  if (c.userId === session.sub) {
    return NextResponse.json({ error: "Você não pode curtir o próprio comentário." }, { status: 400 });
  }

  const q = await resolverQuestao(c.quizId);
  if (!q || !(await temAcessoMateria(session.sub, session.role, q.materiaId))) {
    return NextResponse.json({ error: "Sem acesso." }, { status: 403 });
  }

  const existente = await prisma.comentarioCurtida.findUnique({
    where: { comentarioId_userId: { comentarioId: id, userId: session.sub } },
    select: { id: true },
  });
  if (existente) await prisma.comentarioCurtida.delete({ where: { id: existente.id } });
  else await prisma.comentarioCurtida.create({ data: { comentarioId: id, userId: session.sub } });

  const total = await prisma.comentarioCurtida.count({ where: { comentarioId: id } });
  return NextResponse.json({ curti: !existente, curtidas: total });
}
