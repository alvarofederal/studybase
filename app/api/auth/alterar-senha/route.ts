import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { comparePassword, hashPassword } from "@/lib/auth/hash";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { senhaAtual, novaSenha } = body ?? {};

  if (!senhaAtual || !novaSenha) {
    return NextResponse.json(
      { error: "Informe a senha atual e a nova senha." },
      { status: 400 }
    );
  }

  if (typeof novaSenha !== "string" || novaSenha.length < 8) {
    return NextResponse.json(
      { error: "A nova senha deve ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, senha: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const ok = await comparePassword(senhaAtual, user.senha);
  if (!ok) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
  }

  const novoHash = await hashPassword(novaSenha);
  await prisma.user.update({
    where: { id: user.id },
    data: { senha: novoHash },
  });

  return NextResponse.json({ ok: true });
}
