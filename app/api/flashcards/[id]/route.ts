import { NextResponse } from "next/server";
import { guardaAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/flashcards/[id]
export async function GET(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const fc = await prisma.flashcard.findUnique({ where: { id } });
    if (!fc) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(fc);
  } catch (error) {
    console.error("[GET /api/flashcards/[id]]", error);
    return NextResponse.json({ error: "Erro ao buscar flashcard" }, { status: 500 });
  }
}

// PATCH /api/flashcards/[id] — atualiza frente, verso, dica
export async function PATCH(request: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const { frente, verso, dica } = await request.json();
    const fc = await prisma.flashcard.update({
      where: { id },
      data: {
        ...(frente !== undefined && { frente }),
        ...(verso  !== undefined && { verso }),
        ...(dica   !== undefined && { dica }),
      },
    });
    return NextResponse.json(fc);
  } catch (error) {
    console.error("[PATCH /api/flashcards/[id]]", error);
    return NextResponse.json({ error: "Erro ao atualizar flashcard" }, { status: 500 });
  }
}

// DELETE /api/flashcards/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    await prisma.flashcard.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/flashcards/[id]]", error);
    return NextResponse.json({ error: "Erro ao deletar flashcard" }, { status: 500 });
  }
}
