import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Grava (ou atualiza) a resposta do usuário a uma questão de quiz.
// Chamado quando o usuário clica em "Ver gabarito" — salva a última tentativa.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { quizId, opcaoId, correta, topicoId } =
    await req.json() as {
      quizId: string;
      opcaoId: string;
      correta: boolean;
      topicoId: string;
    };

  if (!quizId || !opcaoId || !topicoId) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  await prisma.respostaQuiz.upsert({
    where: { userId_quizId: { userId: session.sub, quizId } },
    update: { opcaoId, correta, topicoId, updatedAt: new Date() },
    create:  { userId: session.sub, quizId, opcaoId, correta, topicoId },
  });

  return NextResponse.json({ ok: true });
}
