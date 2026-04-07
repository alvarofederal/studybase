import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashToken } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshTokenRaw = cookieStore.get("refresh_token")?.value;

    if (refreshTokenRaw) {
      const tokenHash = hashToken(refreshTokenRaw);
      await prisma.refreshToken.deleteMany({ where: { tokenHash } });
    }

    cookieStore.set("access_token", "", { maxAge: 0, path: "/" });
    cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[LOGOUT]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
