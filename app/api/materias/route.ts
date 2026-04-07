import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/materias — lista todas as matérias
// ?tree=true  →  inclui blocos → topicos (para selects em cascata no admin)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tree = searchParams.get("tree") === "true";

  try {
    const materias = await prisma.materia.findMany({
      where: { ativa: true },
      orderBy: { ordem: "asc" },
      include: tree
        ? {
            blocos: {
              orderBy: { ordem: "asc" },
              include: {
                topicos: {
                  orderBy: { ordem: "asc" },
                  select: { id: true, titulo: true, slug: true },
                },
              },
            },
          }
        : { _count: { select: { blocos: true } } },
    });
    return NextResponse.json(materias);
  } catch (error) {
    console.error("[GET /api/materias]", error);
    return NextResponse.json(
      { error: "Erro ao buscar matérias" },
      { status: 500 }
    );
  }
}

// POST /api/materias — cria uma nova matéria
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, slug, descricao, icone, cor, ordem } = body;

    if (!nome || !slug) {
      return NextResponse.json(
        { error: "nome e slug são obrigatórios" },
        { status: 400 }
      );
    }

    const materia = await prisma.materia.create({
      data: {
        nome,
        slug,
        descricao,
        icone,
        cor,
        ordem: ordem ?? 0,
      },
    });

    return NextResponse.json(materia, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/materias]", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe uma matéria com esse slug" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar matéria" },
      { status: 500 }
    );
  }
}
