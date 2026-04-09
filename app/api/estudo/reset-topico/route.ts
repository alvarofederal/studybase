import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/estudo/reset-topico
 *
 * Apaga do banco as respostas de quiz OU revisões de flashcard de um tópico
 * para o usuário autenticado. Chamado quando o usuário clica em "Refazer" /
 * "Rever", garantindo que o estado local e o banco fiquem em sincronia.
 *
 * Body: { topicoId: string, tipo: "quiz" | "flashcard" }
 */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { topicoId, tipo } =
    (await req.json()) as { topicoId: string; tipo: "quiz" | "flashcard" };

  if (!topicoId || !tipo) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes." },
      { status: 400 },
    );
  }

  if (tipo === "quiz") {
    await prisma.respostaQuiz.deleteMany({
      where: { userId: session.sub, topicoId },
    });
  } else {
    await prisma.revisaoFlashcard.deleteMany({
      where: { userId: session.sub, topicoId },
    });
  }

  return NextResponse.json({ ok: true });
}
