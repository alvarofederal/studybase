import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "PENDENTE";

  const solicitacoes = await prisma.solicitacaoMateria.findMany({
    where: { status: status as "PENDENTE" | "APROVADA" | "REJEITADA" },
    include: {
      user: { select: { id: true, nome: true, email: true } },
      materia: { select: { id: true, nome: true, icone: true, slug: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Para aprovadas, enriquecer com a data de validade do UserMateria
  const expiresAtMap: Record<string, Date | null> = {};
  if (status === "APROVADA" && solicitacoes.length > 0) {
    const pares = solicitacoes.map((s) => ({
      userId: s.userId,
      materiaId: s.materiaId,
    }));
    const userMaterias = await prisma.userMateria.findMany({
      where: { OR: pares },
      select: { userId: true, materiaId: true, expiresAt: true },
    });
    for (const um of userMaterias) {
      expiresAtMap[`${um.userId}_${um.materiaId}`] = um.expiresAt;
    }
  }

  // Para pendentes, quantas matérias ativas o aluno já tem (limite de 3)
  const ativasPorUsuario: Record<string, number> = {};
  if (status === "PENDENTE" && solicitacoes.length > 0) {
    const agora = new Date();
    const userIds = [...new Set(solicitacoes.map((s) => s.userId))];
    const grupos = await prisma.userMateria.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, OR: [{ expiresAt: null }, { expiresAt: { gt: agora } }] },
      _count: { _all: true },
    });
    for (const g of grupos) ativasPorUsuario[g.userId] = g._count._all;
  }

  const resultado = solicitacoes.map((s) => ({
    ...s,
    expiresAt: expiresAtMap[`${s.userId}_${s.materiaId}`] ?? null,
    ativasDoAluno: ativasPorUsuario[s.userId] ?? 0,
  }));

  return NextResponse.json({ solicitacoes: resultado });
}
