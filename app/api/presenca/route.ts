import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Sinal de vida do aluno (chamado a cada ~45s pelo navegador).
 *  - 200: sessão válida; atualiza "visto por último" (base do indicador de online)
 *  - 401: sem sessão válida (o cliente tenta renovar o token)
 *  - 409: o login foi feito em outro aparelho (sessão única) → o cliente encerra esta sessão
 */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { ativo: true, role: true, sessionId: true },
  });
  if (!user || !user.ativo) return NextResponse.json({ error: "Usuário inativo." }, { status: 401 });

  if (user.role === "USER" && user.sessionId && session.sid !== user.sessionId) {
    return NextResponse.json({ error: "Sessão encerrada.", motivo: "outro-dispositivo" }, { status: 409 });
  }

  await prisma.user.update({ where: { id: session.sub }, data: { lastSeenAt: new Date() } });
  return NextResponse.json({ ok: true });
}
