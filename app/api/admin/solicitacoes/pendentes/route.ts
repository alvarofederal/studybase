import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ total: 0 });
  }

  const total = await prisma.solicitacaoMateria.count({
    where: { status: "PENDENTE" },
  });

  return NextResponse.json({ total });
}
