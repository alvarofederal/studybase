import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "change-me-access-secret"
);

// Rotas que precisam de autenticação
const PROTECTED_PREFIXES = ["/estudo", "/admin"];

// Rotas que precisam de ADMIN
const ADMIN_PREFIXES = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e API de auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const isAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  // Lê o access token do cookie
  const accessToken = request.cookies.get("access_token")?.value;
  let payload: { sub?: string; role?: string } | null = null;

  if (accessToken) {
    try {
      const { payload: p } = await jwtVerify(accessToken, ACCESS_SECRET);
      payload = p as { sub?: string; role?: string };
    } catch {
      // Token expirado ou inválido
    }
  }

  // Se o access token expirou, tenta refrescar via redirect para endpoint interno
  if (!payload) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (refreshToken) {
      const refreshUrl = request.nextUrl.clone();
      refreshUrl.pathname = "/api/auth/refresh-redirect";
      refreshUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // Sem tokens — redireciona para login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ADMIN tentando acessar /estudo → manda para /admin
  if (!isAdmin && payload.role === "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // USER tentando acessar /admin → manda para /estudo
  if (isAdmin && payload.role !== "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/estudo";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/login|api/auth/register|api/auth/recuperar-senha|api/auth/redefinir-senha).*)",
  ],
};
