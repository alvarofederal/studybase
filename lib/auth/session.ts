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
