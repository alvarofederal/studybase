/**
 * Comentário de IA para questões — regras puras (sem SDK, sem banco). Testado em comentario-quiz.test.ts.
 * Requisitos: RF-IA-02 (conteúdo do comentário), RF-IA-03 (nunca contradizer o gabarito).
 */

export const MAX_CARACTERES_COMENTARIO = 4000;

export interface ContextoQuestao {
  materia: string;
  bloco: string;
  topico: string;
  /** conteúdo teórico do tópico (Markdown), enviado inteiro */
  conteudoTopico: string;
  tipo: "MULTIPLA" | "CERTO_ERRADO";
  pergunta: string;
  explicacao: string | null;
  opcoes: { texto: string; correta: boolean }[];
}

export interface SaidaComentario {
  comentario: string;
  alertaGabarito: boolean;
  motivoAlerta: string | null;
}

/**
 * Instruções fixas (primeiro bloco do system). Ficam idênticas entre requisições para
 * aproveitar o cache de prompt; tudo que varia vem depois.
 */
export const INSTRUCOES_SISTEMA = `Você é professor de cursos preparatórios para concursos públicos, com experiência em provas da banca CEBRASPE. Sua tarefa é escrever o comentário de uma questão para alunos que acabaram de respondê-la.

O gabarito informado é o oficial do material. Explique por que ele está correto e não o contradiga no comentário. Se encontrar um motivo concreto para suspeitar que o gabarito está errado (por exemplo, a assertiva contraria o texto legal), mantenha o comentário coerente com o gabarito, marque alertaGabarito como true e explique o motivo em motivoAlerta. Sem suspeita concreta, alertaGabarito é false e motivoAlerta é uma string vazia.

Como escrever o comentário:
- Português do Brasil, tom de professor, direto. No máximo 180 palavras.
- Múltipla escolha: explique por que a alternativa correta está certa e, em uma frase para cada, por que as demais estão erradas.
- Certo ou Errado: explique o que torna a assertiva certa ou errada e, quando for o caso, qual palavra ou troca mudou o sentido da frase.
- Aponte a pegadinha típica da banca quando houver: generalização ("sempre", "somente", "nunca"), troca de prazo ou de competência, exceção omitida, inversão de conceito.
- Cite dispositivo legal ou conceito quando ajudar, mas só o que estiver no conteúdo do tópico ou que você saiba com segurança; não invente número de artigo.
- Markdown simples: **negrito** para o ponto central e listas com "- " ao comentar várias alternativas. Sem títulos e sem tabelas.
- Não repita o enunciado nem a explicação que o material já traz; aprofunde.

O conteúdo do tópico, quando fornecido, é a base teórica do material e deve ser a referência principal.`;

/** JSON Schema da saída (output_config.format). */
export const SCHEMA_SAIDA = {
  type: "object",
  properties: {
    comentario: { type: "string", description: "Comentário da questão em Markdown simples." },
    alertaGabarito: { type: "boolean", description: "true se houver motivo concreto para suspeitar do gabarito." },
    motivoAlerta: { type: "string", description: "Motivo da suspeita; string vazia quando alertaGabarito é false." },
  },
  required: ["comentario", "alertaGabarito", "motivoAlerta"],
  additionalProperties: false,
} as const;

const LETRAS = "ABCDEFGH";

/** Segundo bloco do system: o tópico. Varia por tópico e é compartilhado por todas as questões dele. */
export function montarBlocoTopico(q: Pick<ContextoQuestao, "materia" | "bloco" | "topico" | "conteudoTopico">): string {
  const conteudo = q.conteudoTopico.trim();
  return [
    `Matéria: ${q.materia}`,
    `Bloco: ${q.bloco}`,
    `Tópico: ${q.topico}`,
    "",
    conteudo ? `Conteúdo do tópico:\n<conteudo>\n${conteudo}\n</conteudo>` : "Este tópico não tem conteúdo teórico cadastrado.",
  ].join("\n");
}

/** Mensagem do usuário: a questão com o gabarito marcado. */
export function montarMensagemQuestao(q: ContextoQuestao): string {
  const linhas: string[] = [];
  if (q.tipo === "CERTO_ERRADO") {
    const certa = q.opcoes.find((o) => o.correta);
    linhas.push("Tipo: Certo ou Errado (estilo CEBRASPE)", "", "Assertiva:", q.pergunta.trim(), "");
    linhas.push(`Gabarito oficial: ${certa ? certa.texto.trim().toUpperCase() : "não informado"}`);
  } else {
    linhas.push("Tipo: múltipla escolha", "", "Enunciado:", q.pergunta.trim(), "", "Alternativas:");
    q.opcoes.forEach((o, i) => {
      linhas.push(`${LETRAS[i] ?? String(i + 1)}) ${o.texto.trim()}${o.correta ? "   ← GABARITO" : ""}`);
    });
  }
  if (q.explicacao?.trim()) {
    linhas.push("", "Explicação que o material já traz:", q.explicacao.trim());
  }
  linhas.push("", "Escreva o comentário desta questão.");
  return linhas.join("\n");
}

/** Valida o JSON devolvido pelo modelo. Nunca confia no formato sem checar. */
export function validarSaida(dado: unknown): { ok: true; valor: SaidaComentario } | { ok: false; erro: string } {
  if (!dado || typeof dado !== "object") return { ok: false, erro: "Saída não é um objeto." };
  const o = dado as Record<string, unknown>;
  if (typeof o.comentario !== "string" || o.comentario.trim().length < 20) {
    return { ok: false, erro: "Comentário ausente ou curto demais." };
  }
  if (o.comentario.length > MAX_CARACTERES_COMENTARIO) return { ok: false, erro: "Comentário longo demais." };
  if (typeof o.alertaGabarito !== "boolean") return { ok: false, erro: "alertaGabarito ausente." };
  const motivo = typeof o.motivoAlerta === "string" ? o.motivoAlerta.trim() : "";
  if (o.alertaGabarito && !motivo) return { ok: false, erro: "Alerta de gabarito sem motivo." };
  return {
    ok: true,
    valor: { comentario: o.comentario.trim(), alertaGabarito: o.alertaGabarito, motivoAlerta: o.alertaGabarito ? motivo : null },
  };
}

/** Extrai e valida o JSON do texto da resposta. */
export function lerSaida(texto: string) {
  try {
    return validarSaida(JSON.parse(texto));
  } catch {
    return { ok: false as const, erro: "Resposta não é JSON válido." };
  }
}

/** Regra de exibição ao aluno (RF-IA-05 / ADR-04). */
export function comentarioVisivel(c: { oculto: boolean; alertaGabarito: boolean; revisado: boolean } | null): boolean {
  if (!c || c.oculto) return false;
  if (c.alertaGabarito && !c.revisado) return false;
  return true;
}
