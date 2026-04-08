import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const LIMITE_MATERIAS = 3;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { materiaId } = await req.json();
  if (!materiaId) {
    return NextResponse.json({ error: "materiaId obrigatório." }, { status: 400 });
  }

  const agora = new Date();

  // Verifica se já tem acesso ativo (não expirado) a esta matéria
  const acessoAtivo = await prisma.userMateria.findFirst({
    where: {
      userId: session.sub,
      materiaId,
      OR: [
        { expiresAt: null },             // legado sem expiração
        { expiresAt: { gt: agora } },    // ainda dentro do prazo
      ],
    },
  });
  if (acessoAtivo) {
    return NextResponse.json(
      { error: "Você já tem acesso ativo a esta matéria." },
      { status: 409 },
    );
  }

  // Conta quantas matérias ativas o usuário já tem
  const totalAtivas = await prisma.userMateria.count({
    where: {
      userId: session.sub,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: agora } },
      ],
    },
  });
  if (totalAtivas >= LIMITE_MATERIAS) {
    return NextResponse.json(
      {
        error: `Limite de ${LIMITE_MATERIAS} matérias simultâneas atingido. Remova uma para poder solicitar outra.`,
        limiteMaterias: LIMITE_MATERIAS,
      },
      { status: 403 },
    );
  }

  // Cria ou reativa solicitação
  const solicitacao = await prisma.solicitacaoMateria.upsert({
    where: { userId_materiaId: { userId: session.sub, materiaId } },
    update: { status: "PENDENTE", updatedAt: agora },
    create: { userId: session.sub, materiaId, status: "PENDENTE" },
  });

  return NextResponse.json({ solicitacao }, { status: 201 });
}
