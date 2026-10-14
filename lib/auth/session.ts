import { cookies } from "next/headers";
import { verifyAccessToken, type JWTPayload } from "./jwt";

/**
 * Lê e valida o access token do cookie.
 * Retorna null se ausente ou expirado.
 */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

/**
 * Como getSession(), mas lança 401 se não autenticado.
 */
export async function requireSession(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) {
    throw new Response("Não autorizado", { status: 401 });
  }
  return session;
}

/**
 * Requer ADMIN — lança 403 se role for diferente.
 */
export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireSession();
  if (session.role !== "ADMIN") {
    throw new Response("Acesso negado", { status: 403 });
  }
  return session;
}

/**
 * Guarda para route handlers: devolve a resposta 401/403 a ser retornada,
 * ou null se o chamador é ADMIN. Uso: `const negado = await guardaAdmin(); if (negado) return negado;`
 */
export async function guardaAdmin(): Promise<Response | null> {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  if (session.role !== "ADMIN") return Response.json({ error: "Acesso negado." }, { status: 403 });
  return null;
}
