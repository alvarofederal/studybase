import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/blocos — cria um novo bloco
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, slug, descricao, ordem, materiaId } = body;

    if (!nome || !slug || !materiaId) {
      return NextResponse.json(
        { error: "nome, slug e materiaId são obrigatórios" },
        { status: 400 }
      );
    }

    const bloco = await prisma.bloco.create({
      data: {
        nome,
        slug,
        descricao,
        ordem: ordem ?? 0,
        materiaId,
      },
    });

    return NextResponse.json(bloco, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/blocos]", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe um bloco com esse slug nesta matéria" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar bloco" },
      { status: 500 }
    );
  }
}

// GET /api/blocos?materiaId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const materiaId = searchParams.get("materiaId");

    const blocos = await prisma.bloco.findMany({
      where: materiaId ? { materiaId } : undefined,
      orderBy: { ordem: "asc" },
      include: {
        _count: { select: { topicos: true } },
      },
    });

    return NextResponse.json(blocos);
  } catch (error) {
    console.error("[GET /api/blocos]", error);
    return NextResponse.json(
      { error: "Erro ao buscar blocos" },
      { status: 500 }
    );
  }
}
