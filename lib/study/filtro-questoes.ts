import type { Prisma } from "@prisma/client";

/**
 * Banco de questões — normalização dos filtros e montagem do `where` (RF-BQ-01, RF-BQ-02).
 * Função pura, testada em filtro-questoes.test.ts.
 */

export const POR_PAGINA_BANCO = 10;

export const SITUACOES = ["todas", "nao-respondidas", "erradas", "certas"] as const;
export type Situacao = (typeof SITUACOES)[number];
const DIFICULDADES = ["FACIL", "MEDIO", "DIFICIL"] as const;
const TIPOS = ["MULTIPLA", "CERTO_ERRADO"] as const;

export interface FiltroBanco {
  materiaSlug: string | null;
  blocoId: string | null;
  dificuldade: (typeof DIFICULDADES)[number] | null;
  tipo: (typeof TIPOS)[number] | null;
  situacao: Situacao;
  pagina: number;
}

type Leitor = { get(nome: string): string | null };

function entre<T extends string>(valor: string | null, opcoes: readonly T[]): T | null {
  return valor && (opcoes as readonly string[]).includes(valor) ? (valor as T) : null;
}

/** Lê os parâmetros da URL descartando valores desconhecidos (nunca repassa texto livre ao banco). */
export function normalizarFiltro(sp: Leitor): FiltroBanco {
  const texto = (nome: string) => {
    const v = sp.get(nome)?.trim();
    return v && v.length <= 100 ? v : null;
  };
  const pagina = Number.parseInt(sp.get("pagina") ?? "1", 10);
  return {
    materiaSlug: texto("materia"),
    blocoId: texto("bloco"),
    dificuldade: entre(sp.get("dificuldade"), DIFICULDADES),
    tipo: entre(sp.get("tipo"), TIPOS),
    situacao: entre(sp.get("situacao"), SITUACOES) ?? "todas",
    pagina: Number.isFinite(pagina) && pagina > 0 ? Math.min(pagina, 10_000) : 1,
  };
}

/**
 * `where` das questões: só da trilha (sem itens CE derivados), de tópicos publicados e de matérias
 * com acesso ativo do aluno — independentemente do que vier na URL (RNF-01).
 */
export function montarWhereQuestoes(f: FiltroBanco, userId: string, materiaIds: string[]): Prisma.QuizWhereInput {
  const bloco: Prisma.BlocoWhereInput = { materiaId: { in: materiaIds } };
  if (f.materiaSlug) bloco.materia = { slug: f.materiaSlug };
  if (f.blocoId) bloco.id = f.blocoId;

  const where: Prisma.QuizWhereInput = {
    origemId: null,
    topico: { publicado: true, bloco },
  };
  if (f.dificuldade) where.dificuldade = f.dificuldade;
  if (f.tipo) where.tipo = f.tipo;

  if (f.situacao === "nao-respondidas") where.respostas = { none: { userId } };
  else if (f.situacao === "erradas") where.respostas = { some: { userId, correta: false } };
  else if (f.situacao === "certas") where.respostas = { some: { userId, correta: true } };

  return where;
}

/**
 * "Não respondidas" e "que errei" funcionam como fila: ao responder, a questão sai do filtro.
 * Nesses modos a tela recarrega do início em vez de avançar a página (senão pularia questões).
 */
export function situacaoEhFila(s: Situacao): boolean {
  return s === "nao-respondidas" || s === "erradas";
}
