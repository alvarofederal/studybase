import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const MAX_LOTE = 500;
const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

// Aprovar várias solicitações pendentes de uma vez
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  let body: { ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((i): i is string => typeof i === "string") : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "Nenhuma solicitação informada." }, { status: 400 });
  }
  if (ids.length > MAX_LOTE) {
    return NextResponse.json({ error: `Máximo de ${MAX_LOTE} solicitações por vez.` }, { status: 400 });
  }

  // Só aprova o que ainda está pendente (evita reaprovar rejeitadas por engano)
  const pendentes = await prisma.solicitacaoMateria.findMany({
    where: { id: { in: ids }, status: "PENDENTE" },
    select: { id: true, userId: true, materiaId: true },
  });

  const expiresAt = new Date(Date.now() + TRINTA_DIAS_MS);

  await prisma.$transaction(
    pendentes.flatMap((s) => [
      prisma.solicitacaoMateria.update({ where: { id: s.id }, data: { status: "APROVADA" } }),
      prisma.userMateria.upsert({
        where: { userId_materiaId: { userId: s.userId, materiaId: s.materiaId } },
        update: { expiresAt },
        create: { userId: s.userId, materiaId: s.materiaId, expiresAt },
      }),
    ]),
  );

  return NextResponse.json({ ok: true, aprovadas: pendentes.length });
}
