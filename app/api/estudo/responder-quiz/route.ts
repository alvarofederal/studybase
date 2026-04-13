import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/estudo/responder-quiz
 * Grava (ou atualiza) a última resposta e registra no histórico de tentativas.
 */
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

  const userId = session.sub;

  // Conta quantas tentativas já existem para determinar o número da próxima
  const totalTentativas = await prisma.historicoRespostaQuiz.count({
    where: { userId, quizId },
  });

  // Executa os dois writes em paralelo
  await Promise.all([
    // 1) Upsert da última resposta (usado para cálculo de progresso)
    prisma.respostaQuiz.upsert({
      where: { userId_quizId: { userId, quizId } },
      update: { opcaoId, correta, topicoId, updatedAt: new Date() },
      create: { userId, quizId, opcaoId, correta, topicoId },
    }),
    // 2) Registro permanente no histórico de tentativas
    prisma.historicoRespostaQuiz.create({
      data: { userId, quizId, opcaoId, correta, topicoId, tentativa: totalTentativas + 1 },
    }),
  ]);

  return NextResponse.json({ ok: true, tentativa: totalTentativas + 1 });
}

/**
 * DELETE /api/estudo/responder-quiz
 * Body: { quizId }
 * Remove a última resposta gravada para permitir nova tentativa limpa.
 * O histórico de tentativas é preservado.
 */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { quizId } = await req.json() as { quizId: string };
  if (!quizId) {
    return NextResponse.json({ error: "quizId obrigatório." }, { status: 400 });
  }

  await prisma.respostaQuiz.deleteMany({
    where: { userId: session.sub, quizId },
  });

  return NextResponse.json({ ok: true });
}
