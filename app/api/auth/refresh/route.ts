import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/jwt";
import { hashToken } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshTokenRaw = cookieStore.get("refresh_token")?.value;

    if (!refreshTokenRaw) {
      return NextResponse.json({ error: "Sem refresh token." }, { status: 401 });
    }

    // Valida assinatura
    let userId: string;
    try {
      userId = await verifyRefreshToken(refreshTokenRaw);
    } catch {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    // Verifica no banco
    const tokenHash = hashToken(refreshTokenRaw);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token expirado." }, { status: 401 });
    }

    // Busca usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.ativo) {
      return NextResponse.json({ error: "Usuário inativo." }, { status: 401 });
    }

    // Rotaciona: apaga o antigo, cria um novo
    await prisma.refreshToken.delete({ where: { tokenHash } });
    const newRefreshRaw = await signRefreshToken(user.id);
    const newHash = hashToken(newRefreshRaw);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { tokenHash: newHash, userId: user.id, expiresAt },
    });

    // Novo access token
    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Atualiza cookies
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60,
    });
    cookieStore.set("refresh_token", newRefreshRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[REFRESH]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
