import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Limpa os cookies e manda para o login com o motivo (usado quando o login ocorreu em outro aparelho). */
export async function GET(req: NextRequest) {
  const motivo = req.nextUrl.searchParams.get("motivo") === "outro-dispositivo" ? "outro-dispositivo" : "sessao";
  const res = NextResponse.redirect(new URL(`/login?motivo=${motivo}`, req.url));
  res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  return res;
}
