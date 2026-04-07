import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/quiz — cria uma nova questão com opções
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pergunta, explicacao, ordem, topicoId, opcoes } = body;

    if (!pergunta || !topicoId || !opcoes || opcoes.length < 2) {
      return NextResponse.json(
        { error: "pergunta, topicoId e pelo menos 2 opções são obrigatórios" },
        { status: 400 }
      );
    }

    const temCorreta = opcoes.some((o: { correta?: boolean }) => o.correta);
    if (!temCorreta) {
      return NextResponse.json(
        { error: "É necessário marcar pelo menos uma opção como correta" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        pergunta,
        explicacao,
        ordem: ordem ?? 0,
        topicoId,
        opcoes: {
          create: opcoes.map(
            (o: { texto: string; correta?: boolean; ordem?: number }, idx: number) => ({
              texto: o.texto,
              correta: o.correta ?? false,
              ordem: o.ordem ?? idx,
            })
          ),
        },
      },
      include: { opcoes: true },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quiz]", error);
    return NextResponse.json(
      { error: "Erro ao criar questão" },
      { status: 500 }
    );
  }
}

// GET /api/quiz?topicoId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicoId = searchParams.get("topicoId");

    const quizzes = await prisma.quiz.findMany({
      where: topicoId ? { topicoId } : undefined,
      orderBy: { ordem: "asc" },
      include: {
        opcoes: { orderBy: { ordem: "asc" } },
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("[GET /api/quiz]", error);
    return NextResponse.json(
      { error: "Erro ao buscar questões" },
      { status: 500 }
    );
  }
}
