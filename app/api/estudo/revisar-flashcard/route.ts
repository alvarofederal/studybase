import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { temAcessoMateria } from "@/lib/study/acesso";
import { ESTADO_INICIAL, proximaRevisao } from "@/lib/study/sm2";

export const dynamic = "force-dynamic";

// Grava a revisão de um flashcard ("Sabia ✓" / "Não sabia ✗") e agenda a próxima
// revisão com repetição espaçada.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { flashcardId, acertou } = (await req.json().catch(() => ({}))) as {
    flashcardId?: string;
    acertou?: boolean;
  };
  if (!flashcardId || typeof acertou !== "boolean") {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const card = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    select: { topicoId: true, topico: { select: { bloco: { select: { materiaId: true } } } } },
  });
  if (!card) return NextResponse.json({ error: "Flashcard inválido." }, { status: 400 });

  const userId = session.sub;
  if (!(await temAcessoMateria(userId, card.topico.bloco.materiaId))) {
    return NextResponse.json({ error: "Sem acesso a esta matéria." }, { status: 403 });
  }

  const atual = await prisma.revisaoFlashcard.findUnique({
    where: { userId_flashcardId: { userId, flashcardId } },
    select: { facilidade: true, intervaloDias: true, repeticoes: true },
  });
  const novo = proximaRevisao(atual ?? ESTADO_INICIAL, acertou);

  await prisma.revisaoFlashcard.upsert({
    where: { userId_flashcardId: { userId, flashcardId } },
    update: { acertou, topicoId: card.topicoId, ...novo },
    create: { userId, flashcardId, acertou, topicoId: card.topicoId, ...novo },
  });

  return NextResponse.json({ ok: true, proximaRevisao: novo.proximaRevisao, intervaloDias: novo.intervaloDias });
}
