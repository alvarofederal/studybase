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
  let expiresAtMap: Record<string, Date | null> = {};
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

  const resultado = solicitacoes.map((s) => ({
    ...s,
    expiresAt: expiresAtMap[`${s.userId}_${s.materiaId}`] ?? null,
  }));

  return NextResponse.json({ solicitacoes: resultado });
}
