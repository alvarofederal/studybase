import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/topicos/[id]
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const topico = await prisma.topico.findUnique({ where: { id } });
    if (!topico) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(topico);
  } catch (error) {
    console.error("[GET /api/topicos/[id]]", error);
    return NextResponse.json({ error: "Erro ao buscar tópico" }, { status: 500 });
  }
}

// PATCH /api/topicos/[id] — atualiza título, slug, resumo e/ou conteúdo
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titulo, slug, resumo, conteudo } = body;

    const topico = await prisma.topico.update({
      where: { id },
      data: {
        ...(titulo    !== undefined && { titulo }),
        ...(slug      !== undefined && { slug }),
        ...(resumo    !== undefined && { resumo }),
        ...(conteudo  !== undefined && { conteudo }),
      },
    });

    return NextResponse.json(topico);
  } catch (error) {
    console.error("[PATCH /api/topicos/[id]]", error);
    return NextResponse.json({ error: "Erro ao atualizar tópico" }, { status: 500 });
  }
}
