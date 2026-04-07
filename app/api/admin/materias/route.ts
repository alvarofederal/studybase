import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const materias = await prisma.materia.findMany({
    select: { id: true, nome: true, slug: true, icone: true, cor: true, ativa: true },
    orderBy: { ordem: "asc" },
  });

  return NextResponse.json({ materias });
}
