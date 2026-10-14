/**
 * Segredos JWT. Em produção a ausência da variável é erro fatal: nunca
 * assinamos tokens com um valor padrão conhecido publicamente.
 * Em desenvolvimento mantém um fallback para facilitar o setup local.
 */
function segredo(nome: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"): Uint8Array {
  const valor = process.env[nome];
  if (!valor) {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error(`${nome} não definida`);
    }
    return new TextEncoder().encode(`dev-only-${nome.toLowerCase()}`);
  }
  return new TextEncoder().encode(valor);
}

let access: Uint8Array | undefined;
let refresh: Uint8Array | undefined;

export const getAccessSecret = () => (access ??= segredo("JWT_ACCESS_SECRET"));
export const getRefreshSecret = () => (refresh ??= segredo("JWT_REFRESH_SECRET"));
