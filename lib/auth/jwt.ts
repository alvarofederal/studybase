import { SignJWT, jwtVerify } from "jose";

import { getAccessSecret, getRefreshSecret } from "./secrets";

export interface JWTPayload {
  sub: string; // userId
  email: string;
  role: string;
  /** Identificador da sessão atual do usuário (sessão única por aparelho) */
  sid?: string;
}

// Access token — 5 minutos
export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role, ...(payload.sid ? { sid: payload.sid } : {}) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getAccessSecret());
}

// Refresh token — 7 dias
export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret());
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    role: payload.role as string,
    sid: typeof payload.sid === "string" ? payload.sid : undefined,
  };
}

export async function verifyRefreshToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, getRefreshSecret());
  return payload.sub as string;
}

// Extrai o token do header Authorization: Bearer <token>
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
