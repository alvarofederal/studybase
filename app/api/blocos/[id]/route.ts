import { NextResponse } from "next/server";
import { guardaAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/blocos/[id]
export async function GET(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const bloco = await prisma.bloco.findUnique({
      where: { id },
      include: { _count: { select: { topicos: true } } },
    });
    if (!bloco) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(bloco);
  } catch (error) {
    console.error("[GET /api/blocos/[id]]", error);
    return NextResponse.json({ error: "Erro ao buscar bloco" }, { status: 500 });
  }
}

// PATCH /api/blocos/[id] — atualiza nome, slug, descricao
export async function PATCH(request: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const { nome, slug, descricao } = await request.json();
    const bloco = await prisma.bloco.update({
      where: { id },
      data: {
        ...(nome      !== undefined && { nome }),
        ...(slug      !== undefined && { slug }),
        ...(descricao !== undefined && { descricao }),
      },
    });
    return NextResponse.json(bloco);
  } catch (error) {
    console.error("[PATCH /api/blocos/[id]]", error);
    return NextResponse.json({ error: "Erro ao atualizar bloco" }, { status: 500 });
  }
}

// DELETE /api/blocos/[id] — remove bloco e tudo em cascata
export async function DELETE(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    await prisma.bloco.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/blocos/[id]]", error);
    return NextResponse.json({ error: "Erro ao deletar bloco" }, { status: 500 });
  }
}
