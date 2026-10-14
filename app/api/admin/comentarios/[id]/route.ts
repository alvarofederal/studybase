import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Ocultar/reexibir um comentário. Reexibir também zera as denúncias (revisado pelo admin). */
export async function PATCH(req: NextRequest, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const { id } = await params;
  const { ocultado } = (await req.json()) as { ocultado?: boolean };
  if (typeof ocultado !== "boolean") {
    return NextResponse.json({ error: "ocultado deve ser boolean." }, { status: 400 });
  }

  await prisma.comentarioQuiz.update({ where: { id }, data: { ocultado } });
  if (!ocultado) await prisma.comentarioDenuncia.deleteMany({ where: { comentarioId: id } });
  return NextResponse.json({ ok: true });
}
