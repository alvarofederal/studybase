import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { limitar, respostaLimitada } from "@/lib/security/rate-limit";
import { DENUNCIAS_PARA_OCULTAR } from "@/lib/estudo/comentarios";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Denuncia um comentário. Com denúncias de alunos distintos suficientes, ele é ocultado até o admin revisar. */
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const rl = limitar(`denuncia:${session.sub}`, 10, 60 * 60_000);
  if (!rl.ok) return respostaLimitada(rl.retryAfter);

  const { id } = await params;
  const c = await prisma.comentarioQuiz.findUnique({ where: { id }, select: { userId: true } });
  if (!c) return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  if (c.userId === session.sub) {
    return NextResponse.json({ error: "Você não pode denunciar o próprio comentário." }, { status: 400 });
  }

  await prisma.comentarioDenuncia.upsert({
    where: { comentarioId_userId: { comentarioId: id, userId: session.sub } },
    update: {},
    create: { comentarioId: id, userId: session.sub },
  });
  const total = await prisma.comentarioDenuncia.count({ where: { comentarioId: id } });
  if (total >= DENUNCIAS_PARA_OCULTAR) {
    await prisma.comentarioQuiz.update({ where: { id }, data: { ocultado: true } });
  }
  return NextResponse.json({ ok: true });
}
