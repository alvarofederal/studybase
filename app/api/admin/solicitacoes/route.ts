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
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ solicitacoes });
}
