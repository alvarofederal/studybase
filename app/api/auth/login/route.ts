import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { hashToken } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, senha } = body as { email: string; senha: string };

    if (!email || !senha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.ativo) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const senhaValida = await comparePassword(senha, user.senha);
    if (!senhaValida) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Gera tokens
    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshTokenRaw = await signRefreshToken(user.id);
    const tokenHash = hashToken(refreshTokenRaw);

    // Salva refresh token no banco (expira em 7 dias)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { tokenHash, userId: user.id, expiresAt },
    });

    // Define cookies httpOnly
    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60, // 5 minutos
    });
    cookieStore.set("refresh_token", refreshTokenRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
