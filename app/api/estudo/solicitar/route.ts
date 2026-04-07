import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { materiaId } = await req.json();
  if (!materiaId) {
    return NextResponse.json({ error: "materiaId obrigatório." }, { status: 400 });
  }

  // Verifica se já tem acesso
  const jaTemAcesso = await prisma.userMateria.findUnique({
    where: { userId_materiaId: { userId: session.sub, materiaId } },
  });
  if (jaTemAcesso) {
    return NextResponse.json({ error: "Você já tem acesso a esta matéria." }, { status: 409 });
  }

  // Cria ou retorna solicitação existente (upsert)
  const solicitacao = await prisma.solicitacaoMateria.upsert({
    where: { userId_materiaId: { userId: session.sub, materiaId } },
    update: { status: "PENDENTE", updatedAt: new Date() },
    create: { userId: session.sub, materiaId, status: "PENDENTE" },
  });

  return NextResponse.json({ solicitacao }, { status: 201 });
}
