import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashToken, generateToken } from "@/lib/auth/hash";
import { sendPasswordRecoveryEmail } from "@/lib/auth/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Resposta genérica — não revela se o e-mail existe
    if (!user) {
      return NextResponse.json({
        message: "Se o e-mail estiver cadastrado, você receberá as instruções.",
      });
    }

    // Invalida tokens anteriores
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usado: false },
      data: { usado: true },
    });

    const rawToken = generateToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
      data: { tokenHash, userId: user.id, expiresAt },
    });

    await sendPasswordRecoveryEmail(user.email, user.nome, rawToken);

    return NextResponse.json({
      message: "Se o e-mail estiver cadastrado, você receberá as instruções.",
    });
  } catch (err) {
    console.error("[RECUPERAR_SENHA]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
