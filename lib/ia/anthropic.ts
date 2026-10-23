import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  INSTRUCOES_SISTEMA,
  SCHEMA_SAIDA,
  lerSaida,
  montarBlocoTopico,
  montarMensagemQuestao,
  type ContextoQuestao,
  type SaidaComentario,
} from "./comentario-quiz";

/**
 * Integração com a API da Anthropic para os comentários de IA (spec/01, ADR-02 e ADR-03).
 * Só roda no servidor: a chave nunca chega ao navegador (RNF-02).
 */

const MODELO_PADRAO = "claude-opus-5-5";
const ESFORCOS = ["low", "medium", "high", "xhigh", "max"] as const;
type Esforco = (typeof ESFORCOS)[number];

export function configIa() {
  const modelo = process.env.ANTHROPIC_MODEL?.trim() || MODELO_PADRAO;
  const pedido = process.env.ANTHROPIC_EFFORT?.trim() as Esforco | undefined;
  const esforco: Esforco = pedido && ESFORCOS.includes(pedido) ? pedido : "medium";
  const disponivel = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  return { modelo, esforco, disponivel };
}

export class ErroIa extends Error {
  constructor(
    message: string,
    readonly codigo: "indisponivel" | "recusa" | "saida_invalida" | "api",
  ) {
    super(message);
  }
}

let cliente: Anthropic | null = null;
function obterCliente(): Anthropic {
  if (!configIa().disponivel) throw new ErroIa("ANTHROPIC_API_KEY não configurada no servidor.", "indisponivel");
  cliente ??= new Anthropic({ maxRetries: 2 });
  return cliente;
}

/** System em dois blocos: instruções fixas + tópico (cacheado — compartilhado pelas questões do tópico). */
function blocosSistema(q: ContextoQuestao): Anthropic.TextBlockParam[] {
  return [
    { type: "text", text: INSTRUCOES_SISTEMA },
    { type: "text", text: montarBlocoTopico(q), cache_control: { type: "ephemeral" } },
  ];
}

function traduzirErro(e: unknown): never {
  if (e instanceof Anthropic.AuthenticationError) throw new ErroIa("Chave da API da Anthropic inválida.", "api");
  if (e instanceof Anthropic.PermissionDeniedError) throw new ErroIa("A chave não tem permissão para este modelo.", "api");
  if (e instanceof Anthropic.RateLimitError) throw new ErroIa("Limite de uso da API atingido. Tente de novo em instantes.", "api");
  if (e instanceof Anthropic.BadRequestError) throw new ErroIa(`Requisição recusada pela API: ${e.message}`, "api");
  if (e instanceof Anthropic.APIError) throw new ErroIa(`Erro da API da Anthropic (${e.status ?? "sem status"}).`, "api");
  throw e;
}

/** Lê o texto de uma resposta e valida o JSON. Usado na geração individual e no lote. */
export function interpretarResposta(m: {
  stop_reason: string | null;
  content: { type: string; text?: string }[];
}): { ok: true; valor: SaidaComentario } | { ok: false; erro: string; recusa?: boolean } {
  if (m.stop_reason === "refusal") return { ok: false, erro: "O modelo recusou gerar este comentário.", recusa: true };
  if (m.stop_reason === "max_tokens") return { ok: false, erro: "Resposta cortada pelo limite de tokens." };
  const texto = m.content.map((b) => (b.type === "text" ? b.text ?? "" : "")).join("");
  return lerSaida(texto);
}

/** Geração individual (RF-IA-07). Com `fallbacks: "default"`, uma recusa é reprocessada em outro modelo no servidor. */
export async function gerarComentario(q: ContextoQuestao): Promise<SaidaComentario & { modelo: string }> {
  const { modelo, esforco } = configIa();
  let resposta;
  try {
    resposta = await obterCliente().beta.messages.create({
      model: modelo,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: blocosSistema(q),
      messages: [{ role: "user", content: montarMensagemQuestao(q) }],
      output_config: { effort: esforco, format: { type: "json_schema", schema: SCHEMA_SAIDA } },
    });
  } catch (e) {
    traduzirErro(e);
  }
  const r = interpretarResposta(resposta);
  if (!r.ok) throw new ErroIa(r.erro, r.recusa ? "recusa" : "saida_invalida");
  return { ...r.valor, modelo: resposta.model };
}

/* ─── Lote (Message Batches API, 50% do preço) — RF-IA-06 ─────────────── */

export function requisicaoLote(customId: string, q: ContextoQuestao) {
  const { modelo, esforco } = configIa();
  return {
    custom_id: customId,
    params: {
      model: modelo,
      max_tokens: 16000,
      system: blocosSistema(q),
      messages: [{ role: "user" as const, content: montarMensagemQuestao(q) }],
      output_config: { effort: esforco, format: { type: "json_schema" as const, schema: SCHEMA_SAIDA } },
    },
  } satisfies Anthropic.Messages.BatchCreateParams.Request;
}

export async function enviarLote(requisicoes: Anthropic.Messages.BatchCreateParams.Request[]) {
  try {
    return await obterCliente().messages.batches.create({ requests: requisicoes });
  } catch (e) {
    traduzirErro(e);
  }
}

export async function consultarLote(batchId: string) {
  try {
    return await obterCliente().messages.batches.retrieve(batchId);
  } catch (e) {
    traduzirErro(e);
  }
}

export async function resultadosLote(batchId: string) {
  try {
    return await obterCliente().messages.batches.results(batchId);
  } catch (e) {
    traduzirErro(e);
  }
}
