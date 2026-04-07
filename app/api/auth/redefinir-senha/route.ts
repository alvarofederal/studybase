import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashToken } from "@/lib/auth/hash";
import { hashPassword } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, novaSenha } = await req.json();

    if (!token || !novaSenha) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usado || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token inválido ou expirado." },
        { status: 400 }
      );
    }

    const senhaHash = await hashPassword(novaSenha);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { senha: senhaHash },
      }),
      prisma.passwordResetToken.update({
        where: { tokenHash },
        data: { usado: true },
      }),
      // Invalida todas as sessões ativas
      prisma.refreshToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    return NextResponse.json({ message: "Senha redefinida com sucesso." });
  } catch (err) {
    console.error("[REDEFINIR_SENHA]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
