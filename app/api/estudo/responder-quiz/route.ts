import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { temAcessoMateria } from "@/lib/study/acesso";

export const dynamic = "force-dynamic";

/**
 * POST /api/estudo/responder-quiz
 * Body: { quizId, opcaoId }
 * O servidor decide se está correta e de qual tópico é a questão —
 * nunca confia em `correta`/`topicoId` vindos do navegador.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { quizId, opcaoId } = (await req.json().catch(() => ({}))) as {
    quizId?: string;
    opcaoId?: string;
  };
  if (!quizId || !opcaoId) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      topicoId: true,
      opcoes: { select: { id: true, correta: true } },
      topico: { select: { bloco: { select: { materiaId: true } } } },
    },
  });
  const opcao = quiz?.opcoes.find((o) => o.id === opcaoId);
  if (!quiz || !opcao) {
    return NextResponse.json({ error: "Questão ou alternativa inválida." }, { status: 400 });
  }

  const userId = session.sub;
  if (!(await temAcessoMateria(userId, quiz.topico.bloco.materiaId))) {
    return NextResponse.json({ error: "Sem acesso a esta matéria." }, { status: 403 });
  }

  const correta = opcao.correta;
  const topicoId = quiz.topicoId;

  // Transação + retry: a unique (userId, quizId, tentativa) impede números duplicados
  // quando duas respostas chegam ao mesmo tempo.
  for (let i = 0; i < 3; i++) {
    try {
      const tentativa = await prisma.$transaction(async (tx) => {
        const n = (await tx.historicoRespostaQuiz.count({ where: { userId, quizId } })) + 1;
        await tx.historicoRespostaQuiz.create({
          data: { userId, quizId, opcaoId, correta, topicoId, tentativa: n },
        });
        await tx.respostaQuiz.upsert({
          where: { userId_quizId: { userId, quizId } },
          update: { opcaoId, correta, topicoId },
          create: { userId, quizId, opcaoId, correta, topicoId },
        });
        return n;
      });
      return NextResponse.json({ ok: true, correta, tentativa });
    } catch (err) {
      if (i === 2) {
        console.error("[RESPONDER-QUIZ]", err);
        return NextResponse.json({ error: "Erro ao gravar resposta." }, { status: 500 });
      }
    }
  }
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

  const { quizId } = (await req.json().catch(() => ({}))) as { quizId?: string };
  if (!quizId) {
    return NextResponse.json({ error: "quizId obrigatório." }, { status: 400 });
  }

  await prisma.respostaQuiz.deleteMany({
    where: { userId: session.sub, quizId },
  });

  return NextResponse.json({ ok: true });
}
