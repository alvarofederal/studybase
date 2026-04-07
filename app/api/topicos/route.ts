import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/topicos — cria um novo tópico
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, slug, conteudo, resumo, ordem, blocoId } = body;

    if (!titulo || !slug || !conteudo || !blocoId) {
      return NextResponse.json(
        { error: "titulo, slug, conteudo e blocoId são obrigatórios" },
        { status: 400 }
      );
    }

    const topico = await prisma.topico.create({
      data: {
        titulo,
        slug,
        conteudo,
        resumo,
        ordem: ordem ?? 0,
        blocoId,
      },
    });

    return NextResponse.json(topico, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/topicos]", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe um tópico com esse slug neste bloco" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar tópico" },
      { status: 500 }
    );
  }
}

// GET /api/topicos?blocoId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blocoId = searchParams.get("blocoId");

    const topicos = await prisma.topico.findMany({
      where: blocoId ? { blocoId } : undefined,
      orderBy: { ordem: "asc" },
      include: {
        _count: { select: { quizzes: true, flashcards: true } },
      },
    });

    return NextResponse.json(topicos);
  } catch (error) {
    console.error("[GET /api/topicos]", error);
    return NextResponse.json(
      { error: "Erro ao buscar tópicos" },
      { status: 500 }
    );
  }
}
