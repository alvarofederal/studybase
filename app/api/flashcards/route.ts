import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/flashcards — cria um flashcard
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { frente, verso, dica, ordem, topicoId } = body;

    if (!frente || !verso || !topicoId) {
      return NextResponse.json(
        { error: "frente, verso e topicoId são obrigatórios" },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        frente,
        verso,
        dica,
        ordem: ordem ?? 0,
        topicoId,
      },
    });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error("[POST /api/flashcards]", error);
    return NextResponse.json(
      { error: "Erro ao criar flashcard" },
      { status: 500 }
    );
  }
}

// GET /api/flashcards?topicoId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicoId = searchParams.get("topicoId");

    const flashcards = await prisma.flashcard.findMany({
      where: topicoId ? { topicoId } : undefined,
      orderBy: { ordem: "asc" },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("[GET /api/flashcards]", error);
    return NextResponse.json(
      { error: "Erro ao buscar flashcards" },
      { status: 500 }
    );
  }
}
