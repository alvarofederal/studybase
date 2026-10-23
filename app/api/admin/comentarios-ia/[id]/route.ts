import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";
import { MAX_CARACTERES_COMENTARIO } from "@/lib/ia/comentario-quiz";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Revisão do admin: editar texto, marcar revisado, ocultar/reexibir — RF-IA-08. */
export async function PATCH(req: NextRequest, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { texto?: unknown; revisado?: unknown; oculto?: unknown };

  const data: { texto?: string; revisado?: boolean; oculto?: boolean } = {};
  if (body.texto !== undefined) {
    if (typeof body.texto !== "string" || body.texto.trim().length < 20) {
      return NextResponse.json({ error: "O comentário precisa de pelo menos 20 caracteres." }, { status: 400 });
    }
    if (body.texto.length > MAX_CARACTERES_COMENTARIO) {
      return NextResponse.json({ error: `Máximo de ${MAX_CARACTERES_COMENTARIO} caracteres.` }, { status: 400 });
    }
    data.texto = body.texto.trim();
  }
  if (body.revisado !== undefined) {
    if (typeof body.revisado !== "boolean") return NextResponse.json({ error: "revisado deve ser boolean." }, { status: 400 });
    data.revisado = body.revisado;
  }
  if (body.oculto !== undefined) {
    if (typeof body.oculto !== "boolean") return NextResponse.json({ error: "oculto deve ser boolean." }, { status: 400 });
    data.oculto = body.oculto;
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });

  const existe = await prisma.comentarioIaQuiz.findUnique({ where: { id }, select: { id: true } });
  if (!existe) return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });

  const comentario = await prisma.comentarioIaQuiz.update({ where: { id }, data });
  return NextResponse.json({ comentario });
}
