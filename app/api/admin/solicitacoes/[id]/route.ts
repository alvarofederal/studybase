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
  const { acao } = await req.json() as { acao: "aprovar" | "rejeitar" | "renovar" };

  if (!["aprovar", "rejeitar", "renovar"].includes(acao)) {
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }

  const solicitacao = await prisma.solicitacaoMateria.findUnique({ where: { id } });
  if (!solicitacao) {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }

  // Renovar: estende expiresAt em +30 dias a partir de AGORA (mesmo que já expirado)
  if (acao === "renovar") {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.userMateria.upsert({
      where: {
        userId_materiaId: {
          userId: solicitacao.userId,
          materiaId: solicitacao.materiaId,
        },
      },
      update: { expiresAt },
      create: {
        userId: solicitacao.userId,
        materiaId: solicitacao.materiaId,
        expiresAt,
      },
    });
    // Garante que a solicitação fica como APROVADA
    await prisma.solicitacaoMateria.update({
      where: { id },
      data: { status: "APROVADA" },
    });
    return NextResponse.json({ ok: true });
  }

  if (acao === "aprovar") {
    // Respeita o limite de matérias ativas simultâneas do aluno
    const agora = new Date();
    const jaTem = await prisma.userMateria.findFirst({
      where: {
        userId: solicitacao.userId,
        materiaId: solicitacao.materiaId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: agora } }],
      },
    });
    if (!jaTem) {
      const ativas = await prisma.userMateria.count({
        where: { userId: solicitacao.userId, OR: [{ expiresAt: null }, { expiresAt: { gt: agora } }] },
      });
      if (ativas >= 3) {
        return NextResponse.json(
          { error: "O aluno já tem 3 matérias ativas. Aguarde expirar ou revogue uma antes de aprovar." },
          { status: 409 },
        );
      }
    }

    // Acesso válido por 30 dias a partir de agora
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
        update: { expiresAt },   // renova validade se já existia
        create: {
          userId: solicitacao.userId,
          materiaId: solicitacao.materiaId,
          expiresAt,
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
