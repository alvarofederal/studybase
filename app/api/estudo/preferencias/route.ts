import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** PATCH { metaDiaria?: number, dataProva?: "YYYY-MM-DD" | null } */
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { metaDiaria?: unknown; dataProva?: unknown };
  const data: { metaDiaria?: number; dataProva?: Date | null } = {};

  if (body.metaDiaria !== undefined) {
    const n = Number(body.metaDiaria);
    if (!Number.isInteger(n) || n < 1 || n > 500) {
      return NextResponse.json({ error: "Meta diária deve ser entre 1 e 500." }, { status: 400 });
    }
    data.metaDiaria = n;
  }
  if (body.dataProva !== undefined) {
    if (body.dataProva === null || body.dataProva === "") data.dataProva = null;
    else {
      const d = new Date(`${String(body.dataProva)}T12:00:00-03:00`);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Data inválida." }, { status: 400 });
      data.dataProva = d;
    }
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });

  await prisma.user.update({ where: { id: session.sub }, data });
  return NextResponse.json({ ok: true });
}
