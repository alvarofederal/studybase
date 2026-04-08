import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Usuário remove o próprio acesso a uma matéria.
// Após isso, pode solicitar novamente (passa pela aprovação do admin).
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { materiaId } = await req.json() as { materiaId: string };
  if (!materiaId) {
    return NextResponse.json({ error: "materiaId obrigatório." }, { status: 400 });
  }

  // Deleta o acesso — garante que só apaga o do próprio usuário
  await prisma.userMateria.deleteMany({
    where: { userId: session.sub, materiaId },
  });

  // Reseta a solicitação para que o usuário possa pedir de novo
  await prisma.solicitacaoMateria.updateMany({
    where: { userId: session.sub, materiaId },
    data: { status: "PENDENTE", updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
