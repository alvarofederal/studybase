import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** Considera "online" quem deu sinal de vida nos últimos 2 minutos. */
const JANELA_ONLINE_MS = 2 * 60_000;

export async function GET() {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const limite = new Date(Date.now() - JANELA_ONLINE_MS);
  const [cadastrados, online] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "USER", ativo: true, lastSeenAt: { gte: limite } } }),
  ]);

  return NextResponse.json({ cadastrados, online });
}
