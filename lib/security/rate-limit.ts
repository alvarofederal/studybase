/**
 * Limitador de taxa em memória (janela fixa).
 *
 * Em serverless cada instância tem seu próprio contador, então é uma barreira
 * de melhor esforço contra força bruta — não uma garantia global.
 */
const baldes = new Map<string, { count: number; reset: number }>();

export function limitar(chave: string, max: number, janelaMs: number) {
  const agora = Date.now();

  if (baldes.size > 5000) {
    for (const [k, v] of baldes) if (v.reset <= agora) baldes.delete(k);
  }

  const atual = baldes.get(chave);
  if (!atual || atual.reset <= agora) {
    baldes.set(chave, { count: 1, reset: agora + janelaMs });
    return { ok: true, retryAfter: 0 };
  }
  atual.count++;
  return {
    ok: atual.count <= max,
    retryAfter: Math.ceil((atual.reset - agora) / 1000),
  };
}

export function ipDe(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export function respostaLimitada(retryAfter: number) {
  return Response.json(
    { error: `Muitas tentativas. Tente novamente em ${retryAfter}s.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
