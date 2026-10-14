/**
 * Endpoint interno usado pelo middleware para tentar renovar o access token
 * antes de redirecionar o usuário para o login.
 */
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

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") ?? "/";

  try {
    const cookieStore = await cookies();
    const refreshTokenRaw = cookieStore.get("refresh_token")?.value;
    if (!refreshTokenRaw) throw new Error("no refresh token");

    const userId = await verifyRefreshToken(refreshTokenRaw);
    const tokenHash = hashToken(refreshTokenRaw);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.expiresAt < new Date()) throw new Error("expired");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.ativo) throw new Error("inactive");

    // Rotaciona tokens
    // O token antigo continua válido por mais 60s (em vez de ser apagado na hora): quando duas
    // requisições (prefetch, heartbeat, clique) renovam ao mesmo tempo com o mesmo cookie, a
    // segunda não falha nem derruba a sessão.
    await prisma.refreshToken.update({
      where: { tokenHash },
      data: { expiresAt: new Date(Math.min(stored.expiresAt.getTime(), Date.now() + 60_000)) },
    });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });
    const newRefreshRaw = await signRefreshToken(user.id);
    const newHash = hashToken(newRefreshRaw);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { tokenHash: newHash, userId: user.id, expiresAt },
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: user.role === "USER" ? user.sessionId ?? undefined : undefined,
    });

    // Garante que admin vai para /admin e user vai para /estudo
    const destino =
      user.role === "ADMIN"
        ? next.startsWith("/admin") ? next : "/admin"
        : next.startsWith("/estudo") ? next : "/estudo";

    const response = NextResponse.redirect(new URL(destino, req.url));
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60,
    });
    response.cookies.set("refresh_token", newRefreshRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", next);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}
