/**
 * Desempenho do aluno — regras puras (sem banco), testadas em desempenho.test.ts.
 *
 * Definições (spec/01 §6):
 *  - item respondido: última resposta do aluno a uma questão (inclui itens CE do simulado);
 *  - questão da trilha: aparece nos tópicos (Quiz.origemId = null);
 *  - tentativa: cada resposta registrada no histórico.
 */

export const MIN_RESPONDIDOS_PONTO_FRACO = 3;
export const CORTE_PONTO_FRACO_PCT = 70;
export const MAX_PONTOS_FRACOS = 6;

/* ─── Entrada ─────────────────────────────────────────────────────────── */

export interface TopicoMeta {
  topicoId: string;
  titulo: string;
  ordem: number;
  blocoId: string;
  blocoNome: string;
  blocoOrdem: number;
  materiaId: string;
  materiaNome: string;
  materiaSlug: string;
  materiaIcone: string | null;
  materiaOrdem: number;
  /** questões da trilha do tópico */
  questoesTrilha: number;
  flashcards: number;
}

export interface ContagemTopico {
  topicoId: string;
  respondidos: number;
  acertos: number;
  /** respondidos que são questões da trilha (para o progresso) */
  respondidosTrilha: number;
  fcRevisados: number;
  fcAcertos: number;
}

/* ─── Saída ───────────────────────────────────────────────────────────── */

export interface BlocoDesempenho {
  id: string;
  nome: string;
  respondidos: number;
  acertos: number;
  pct: number | null;
  trilhaRespondidas: number;
  trilhaTotal: number;
}

export interface MateriaDesempenho {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  respondidos: number;
  acertos: number;
  pct: number | null;
  trilhaRespondidas: number;
  trilhaTotal: number;
  fcRevisados: number;
  fcAcertos: number;
  fcTotal: number;
  blocos: BlocoDesempenho[];
}

export interface PontoFraco {
  topicoId: string;
  titulo: string;
  blocoNome: string;
  materiaNome: string;
  materiaSlug: string;
  respondidos: number;
  pct: number;
}

export interface Desempenho {
  geral: {
    respondidos: number;
    acertos: number;
    pct: number | null;
    fcRevisados: number;
    fcAcertos: number;
    fcPct: number | null;
  };
  materias: MateriaDesempenho[];
  pontosFracos: PontoFraco[];
}

/** Percentual inteiro, ou null quando não há base (evita mostrar "0%" sem nenhuma resposta). */
export function pct(acertos: number, total: number): number | null {
  return total > 0 ? Math.round((acertos / total) * 100) : null;
}

export function montarDesempenho(topicos: TopicoMeta[], contagens: ContagemTopico[]): Desempenho {
  const porTopico = new Map(contagens.map((c) => [c.topicoId, c]));
  const vazio: ContagemTopico = { topicoId: "", respondidos: 0, acertos: 0, respondidosTrilha: 0, fcRevisados: 0, fcAcertos: 0 };

  const ordenados = [...topicos].sort(
    (a, b) => a.materiaOrdem - b.materiaOrdem || a.blocoOrdem - b.blocoOrdem || a.ordem - b.ordem,
  );

  const materias = new Map<string, MateriaDesempenho>();
  const blocos = new Map<string, BlocoDesempenho>();
  const pontos: PontoFraco[] = [];

  for (const t of ordenados) {
    const c = porTopico.get(t.topicoId) ?? vazio;
    // Respondidos da trilha não passam do total (defensivo: questão apagada depois de respondida)
    const trilhaResp = Math.min(c.respondidosTrilha, t.questoesTrilha);

    let m = materias.get(t.materiaId);
    if (!m) {
      m = {
        id: t.materiaId, nome: t.materiaNome, slug: t.materiaSlug, icone: t.materiaIcone,
        respondidos: 0, acertos: 0, pct: null, trilhaRespondidas: 0, trilhaTotal: 0,
        fcRevisados: 0, fcAcertos: 0, fcTotal: 0, blocos: [],
      };
      materias.set(t.materiaId, m);
    }
    m.respondidos += c.respondidos;
    m.acertos += c.acertos;
    m.trilhaRespondidas += trilhaResp;
    m.trilhaTotal += t.questoesTrilha;
    m.fcRevisados += c.fcRevisados;
    m.fcAcertos += c.fcAcertos;
    m.fcTotal += t.flashcards;

    let b = blocos.get(t.blocoId);
    if (!b) {
      b = { id: t.blocoId, nome: t.blocoNome, respondidos: 0, acertos: 0, pct: null, trilhaRespondidas: 0, trilhaTotal: 0 };
      blocos.set(t.blocoId, b);
      m.blocos.push(b);
    }
    b.respondidos += c.respondidos;
    b.acertos += c.acertos;
    b.trilhaRespondidas += trilhaResp;
    b.trilhaTotal += t.questoesTrilha;

    const p = pct(c.acertos, c.respondidos);
    if (c.respondidos >= MIN_RESPONDIDOS_PONTO_FRACO && p !== null && p < CORTE_PONTO_FRACO_PCT) {
      pontos.push({
        topicoId: t.topicoId, titulo: t.titulo, blocoNome: t.blocoNome,
        materiaNome: t.materiaNome, materiaSlug: t.materiaSlug, respondidos: c.respondidos, pct: p,
      });
    }
  }

  for (const b of blocos.values()) b.pct = pct(b.acertos, b.respondidos);
  const lista = [...materias.values()];
  for (const m of lista) m.pct = pct(m.acertos, m.respondidos);

  const respondidos = lista.reduce((a, m) => a + m.respondidos, 0);
  const acertos = lista.reduce((a, m) => a + m.acertos, 0);
  const fcRevisados = lista.reduce((a, m) => a + m.fcRevisados, 0);
  const fcAcertos = lista.reduce((a, m) => a + m.fcAcertos, 0);

  return {
    geral: { respondidos, acertos, pct: pct(acertos, respondidos), fcRevisados, fcAcertos, fcPct: pct(fcAcertos, fcRevisados) },
    materias: lista,
    pontosFracos: pontos
      .sort((a, b) => a.pct - b.pct || b.respondidos - a.respondidos)
      .slice(0, MAX_PONTOS_FRACOS),
  };
}

/* ─── Evolução semanal ────────────────────────────────────────────────── */

const DIA_MS = 24 * 60 * 60 * 1000;
const SEMANA_MS = 7 * DIA_MS;
/** Brasília: UTC−3 o ano todo (sem horário de verão desde 2019). */
const OFFSET_BRT_MS = -3 * 60 * 60 * 1000;

export interface SemanaDesempenho {
  /** segunda-feira da semana, AAAA-MM-DD no horário de Brasília */
  inicio: string;
  tentativas: number;
  acertos: number;
  pct: number | null;
}

/** Instante UTC da segunda-feira 00:00 (Brasília) da semana que contém `agora`. */
export function inicioDaSemanaBRT(agora: Date): number {
  const local = new Date(agora.getTime() + OFFSET_BRT_MS); // campos UTC = relógio de Brasília
  const diaSemana = (local.getUTCDay() + 6) % 7; // segunda = 0
  const meiaNoiteLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - diaSemana);
  return meiaNoiteLocal - OFFSET_BRT_MS;
}

export function evolucaoSemanal(
  tentativas: { createdAt: Date; correta: boolean }[],
  agora: Date,
  semanas = 8,
): SemanaDesempenho[] {
  const atual = inicioDaSemanaBRT(agora);
  const primeira = atual - (semanas - 1) * SEMANA_MS;

  const saida: SemanaDesempenho[] = Array.from({ length: semanas }, (_, i) => {
    const inicioLocal = new Date(primeira + i * SEMANA_MS + OFFSET_BRT_MS);
    return { inicio: inicioLocal.toISOString().slice(0, 10), tentativas: 0, acertos: 0, pct: null };
  });

  for (const t of tentativas) {
    const idx = Math.floor((t.createdAt.getTime() - primeira) / SEMANA_MS);
    if (idx < 0 || idx >= semanas) continue;
    saida[idx].tentativas += 1;
    if (t.correta) saida[idx].acertos += 1;
  }
  for (const s of saida) s.pct = pct(s.acertos, s.tentativas);
  return saida;
}

/** Instante UTC a partir do qual buscar tentativas para `evolucaoSemanal`. */
export function inicioJanelaSemanas(agora: Date, semanas = 8): Date {
  return new Date(inicioDaSemanaBRT(agora) - (semanas - 1) * SEMANA_MS);
}
