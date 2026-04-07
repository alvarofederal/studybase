import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// Aprovar ou rejeitar solicitação
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  const { acao } = await req.json() as { acao: "aprovar" | "rejeitar" };

  if (!["aprovar", "rejeitar"].includes(acao)) {
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }

  const solicitacao = await prisma.solicitacaoMateria.findUnique({ where: { id } });
  if (!solicitacao) {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }

  if (acao === "aprovar") {
    // Usa transaction: atualiza status + libera acesso
    await prisma.$transaction([
      prisma.solicitacaoMateria.update({
        where: { id },
        data: { status: "APROVADA" },
      }),
      prisma.userMateria.upsert({
        where: {
          userId_materiaId: {
            userId: solicitacao.userId,
            materiaId: solicitacao.materiaId,
          },
        },
        update: {},
        create: {
          userId: solicitacao.userId,
          materiaId: solicitacao.materiaId,
        },
      }),
    ]);
  } else {
    await prisma.solicitacaoMateria.update({
      where: { id },
      data: { status: "REJEITADA" },
    });
  }

  return NextResponse.json({ ok: true });
}
