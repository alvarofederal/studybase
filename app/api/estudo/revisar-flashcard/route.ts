import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Grava (ou atualiza) se o usuário soube ou não um flashcard.
// Chamado quando o usuário clica em "Sabia ✓" ou "Não sabia ✗".
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { flashcardId, acertou, topicoId } =
    await req.json() as { flashcardId: string; acertou: boolean; topicoId: string };

  if (!flashcardId || !topicoId) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  await prisma.revisaoFlashcard.upsert({
    where: { userId_flashcardId: { userId: session.sub, flashcardId } },
    update: { acertou, topicoId, updatedAt: new Date() },
    create:  { userId: session.sub, flashcardId, acertou, topicoId },
  });

  return NextResponse.json({ ok: true });
}
