import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

// GET /api/materias/[slug] — retorna matéria com blocos e tópicos
export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const materia = await prisma.materia.findUnique({
      where: { slug },
      include: {
        blocos: {
          orderBy: { ordem: "asc" },
          include: {
            topicos: {
              orderBy: { ordem: "asc" },
              include: {
                _count: {
                  select: { quizzes: true, flashcards: true },
                },
              },
            },
          },
        },
      },
    });

    if (!materia) {
      return NextResponse.json(
        { error: "Matéria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(materia);
  } catch (error) {
    console.error("[GET /api/materias/[slug]]", error);
    return NextResponse.json(
      { error: "Erro ao buscar matéria" },
      { status: 500 }
    );
  }
}

// PATCH /api/materias/[slug] — atualiza matéria
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const materia = await prisma.materia.update({
      where: { slug },
      data: body,
    });

    return NextResponse.json(materia);
  } catch (error) {
    console.error("[PATCH /api/materias/[slug]]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar matéria" },
      { status: 500 }
    );
  }
}

// DELETE /api/materias/[slug] — remove matéria (cascade)
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    await prisma.materia.delete({ where: { slug } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/materias/[slug]]", error);
    return NextResponse.json(
      { error: "Erro ao deletar matéria" },
      { status: 500 }
    );
  }
}
