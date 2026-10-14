import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Apaga um comentário: o próprio autor ou um administrador. */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const c = await prisma.comentarioQuiz.findUnique({ where: { id }, select: { userId: true } });
  if (!c) return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  if (c.userId !== session.sub && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  await prisma.comentarioQuiz.delete({ where: { id } }); // respostas e curtidas saem em cascata
  return NextResponse.json({ ok: true });
}
