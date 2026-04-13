import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/* ─── Tipos retornados ─────────────────────────────────────────────────────── */
export type QuestaoStat = {
  quizId: string;
  pergunta: string;
  dificuldade: string;
  tags: string | null;
  topicoId: string;
  topicoTitulo: string;
  blocoNome: string;
  materiaNome: string;
  materiaSlug: string;
  materiaIcone: string | null;
  totalUsuarios: number;   // usuários únicos que responderam (última resposta)
  acertos: number;         // acertos na última resposta
  acertoPct: number;       // % de acerto (última resposta)
  totalTentativas: number; // tentativas históricas totais (histórico)
};

export type TopicoStat = {
  topicoId: string;
  topicoTitulo: string;
  blocoNome: string;
  materiaNome: string;
  materiaSlug: string;
  materiaIcone: string | null;
  totalRevisoes: number;
  totalUsuarios: number;
  acertos: number;
  acertoPct: number;
  totalQuizzes: number;
  totalFlashcards: number;
};

export type MateriaStat = {
  materiaId: string;
  materiaNome: string;
  materiaSlug: string;
  materiaIcone: string | null;
  totalAlunos: number;       // alunos com acesso
  totalRespostas: number;    // respostas de quiz (últimas)
  acertoPct: number;
  totalRevisoes: number;     // revisões de flashcard
  acertoPctFc: number;
  totalTopicos: number;
  totalQuestoes: number;
  totalFlashcards: number;
};

export type StatsOverview = {
  totalRespostas: number;
  acertoPctGeral: number;
  totalAlunosAtivos: number;
  totalTentativas: number;
  questoesRespondidas: number;
  questoesSemResposta: number;
  topicosMaisRevisados: number;
};

export type StatsPayload = {
  overview: StatsOverview;
  questoes: QuestaoStat[];
  topicos: TopicoStat[];
  materias: MateriaStat[];
};

/* ─── Helper: BigInt → number ─────────────────────────────────────────────── */
function n(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "bigint") return Number(v);
  return Number(v) || 0;
}

/* ─── GET /api/admin/stats ─────────────────────────────────────────────────── */
export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  // ── 1. Questões com contexto ──────────────────────────────────────────────
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      pergunta: true,
      dificuldade: true,
      tags: true,
      topico: {
        select: {
          id: true,
          titulo: true,
          _count: { select: { quizzes: true, flashcards: true } },
          bloco: {
            select: {
              nome: true,
              materia: { select: { id: true, nome: true, slug: true, icone: true } },
            },
          },
        },
      },
    },
  });

  // ── 2. Tópicos com contexto ───────────────────────────────────────────────
  const topicos = await prisma.topico.findMany({
    select: {
      id: true,
      titulo: true,
      _count: { select: { quizzes: true, flashcards: true } },
      bloco: {
        select: {
          nome: true,
          materia: { select: { id: true, nome: true, slug: true, icone: true } },
        },
      },
    },
  });

  // ── 3. Agregações SQL (todas em paralelo) ─────────────────────────────────
  type RespostaRow = { quizId: string; totalUsuarios: bigint; acertos: bigint };
  type HistoricoRow = { quizId: string; totalTentativas: bigint };
  type FlashcardRow = { topicoId: string; totalRevisoes: bigint; totalUsuarios: bigint; acertos: bigint };
  type MateriaRespostaRow = { materiaId: string; totalRespostas: bigint; acertos: bigint };
  type MateriaFlashcardRow = { materiaId: string; totalRevisoes: bigint; acertos: bigint };
  type MateriaAlunosRow = { materiaId: string; totalAlunos: bigint };

  const [
    respostasAgg,
    historicoAgg,
    flashcardAgg,
    materiaRespostaAgg,
    materiaFlashcardAgg,
    materiaAlunosAgg,
  ] = await Promise.all([
    // Última resposta por usuário por questão
    prisma.$queryRaw<RespostaRow[]>`
      SELECT quizId,
             COUNT(*)                                              AS totalUsuarios,
             SUM(CASE WHEN correta = 1 THEN 1 ELSE 0 END)         AS acertos
      FROM   respostas_quiz
      GROUP  BY quizId
    `,
    // Tentativas históricas totais
    prisma.$queryRaw<HistoricoRow[]>`
      SELECT quizId, COUNT(*) AS totalTentativas
      FROM   historico_respostas_quiz
      GROUP  BY quizId
    `,
    // Revisões de flashcard por tópico
    prisma.$queryRaw<FlashcardRow[]>`
      SELECT topicoId,
             COUNT(*)                                              AS totalRevisoes,
             COUNT(DISTINCT userId)                                AS totalUsuarios,
             SUM(CASE WHEN acertou = 1 THEN 1 ELSE 0 END)         AS acertos
      FROM   revisoes_flashcard
      GROUP  BY topicoId
    `,
    // Respostas de quiz agrupadas por matéria (via JOIN)
    prisma.$queryRaw<MateriaRespostaRow[]>`
      SELECT m.id AS materiaId,
             COUNT(rq.id)                                          AS totalRespostas,
             SUM(CASE WHEN rq.correta = 1 THEN 1 ELSE 0 END)       AS acertos
      FROM   respostas_quiz rq
      JOIN   quizzes        q  ON q.id  = rq.quizId
      JOIN   topicos        t  ON t.id  = q.topicoId
      JOIN   blocos         b  ON b.id  = t.blocoId
      JOIN   materias       m  ON m.id  = b.materiaId
      GROUP  BY m.id
    `,
    // Revisões de flashcard por matéria
    prisma.$queryRaw<MateriaFlashcardRow[]>`
      SELECT m.id AS materiaId,
             COUNT(rf.id)                                          AS totalRevisoes,
             SUM(CASE WHEN rf.acertou = 1 THEN 1 ELSE 0 END)       AS acertos
      FROM   revisoes_flashcard rf
      JOIN   flashcards         fc ON fc.id = rf.flashcardId
      JOIN   topicos            t  ON t.id  = fc.topicoId
      JOIN   blocos             b  ON b.id  = t.blocoId
      JOIN   materias           m  ON m.id  = b.materiaId
      GROUP  BY m.id
    `,
    // Alunos com acesso ativo por matéria
    prisma.$queryRaw<MateriaAlunosRow[]>`
      SELECT materiaId, COUNT(DISTINCT userId) AS totalAlunos
      FROM   user_materias
      WHERE  expiresAt IS NULL OR expiresAt > NOW()
      GROUP  BY materiaId
    `,
  ]);

  // ── 4. Indexar agregações por ID ──────────────────────────────────────────
  const respostasMap     = new Map(respostasAgg.map((r) => [r.quizId, r]));
  const historicoMap     = new Map(historicoAgg.map((r) => [r.quizId, r]));
  const flashcardMap     = new Map(flashcardAgg.map((r) => [r.topicoId, r]));
  const matRespostasMap  = new Map(materiaRespostaAgg.map((r) => [r.materiaId, r]));
  const matFlashcardMap  = new Map(materiaFlashcardAgg.map((r) => [r.materiaId, r]));
  const matAlunosMap     = new Map(materiaAlunosAgg.map((r) => [r.materiaId, r]));

  // ── 5. Montar QuestaoStat[] ───────────────────────────────────────────────
  const questoes: QuestaoStat[] = quizzes.map((q) => {
    const res   = respostasMap.get(q.id);
    const hist  = historicoMap.get(q.id);
    const totalUsuarios   = n(res?.totalUsuarios);
    const acertos         = n(res?.acertos);
    const totalTentativas = n(hist?.totalTentativas);
    return {
      quizId:        q.id,
      pergunta:      q.pergunta,
      dificuldade:   q.dificuldade,
      tags:          q.tags,
      topicoId:      q.topico.id,
      topicoTitulo:  q.topico.titulo,
      blocoNome:     q.topico.bloco.nome,
      materiaNome:   q.topico.bloco.materia.nome,
      materiaSlug:   q.topico.bloco.materia.slug,
      materiaIcone:  q.topico.bloco.materia.icone,
      totalUsuarios,
      acertos,
      acertoPct:     totalUsuarios > 0 ? Math.round((acertos / totalUsuarios) * 100) : 0,
      totalTentativas,
    };
  });

  // ── 6. Montar TopicoStat[] ────────────────────────────────────────────────
  const topicoStats: TopicoStat[] = topicos.map((t) => {
    const fc = flashcardMap.get(t.id);
    const totalRevisoes  = n(fc?.totalRevisoes);
    const totalUsuarios  = n(fc?.totalUsuarios);
    const acertos        = n(fc?.acertos);
    return {
      topicoId:      t.id,
      topicoTitulo:  t.titulo,
      blocoNome:     t.bloco.nome,
      materiaNome:   t.bloco.materia.nome,
      materiaSlug:   t.bloco.materia.slug,
      materiaIcone:  t.bloco.materia.icone,
      totalRevisoes,
      totalUsuarios,
      acertos,
      acertoPct: totalRevisoes > 0 ? Math.round((acertos / totalRevisoes) * 100) : 0,
      totalQuizzes:    t._count.quizzes,
      totalFlashcards: t._count.flashcards,
    };
  });

  // ── 7. Montar MateriaStat[] ───────────────────────────────────────────────
  // Agregar contagens de conteúdo por matéria
  const materiaContentMap = new Map<string, { totalTopicos: number; totalQuestoes: number; totalFlashcards: number }>();
  for (const t of topicos) {
    const mid = t.bloco.materia.id;
    const cur = materiaContentMap.get(mid) ?? { totalTopicos: 0, totalQuestoes: 0, totalFlashcards: 0 };
    materiaContentMap.set(mid, {
      totalTopicos:    cur.totalTopicos + 1,
      totalQuestoes:   cur.totalQuestoes + t._count.quizzes,
      totalFlashcards: cur.totalFlashcards + t._count.flashcards,
    });
  }

  // Matérias únicas a partir dos tópicos
  const materiasUnicas = new Map<string, { id: string; nome: string; slug: string; icone: string | null }>();
  for (const t of topicos) {
    const m = t.bloco.materia;
    if (!materiasUnicas.has(m.id)) materiasUnicas.set(m.id, m);
  }

  const materias: MateriaStat[] = Array.from(materiasUnicas.values()).map((m) => {
    const rq  = matRespostasMap.get(m.id);
    const rfc = matFlashcardMap.get(m.id);
    const al  = matAlunosMap.get(m.id);
    const content = materiaContentMap.get(m.id) ?? { totalTopicos: 0, totalQuestoes: 0, totalFlashcards: 0 };
    const totalRespostas = n(rq?.totalRespostas);
    const acertosQz      = n(rq?.acertos);
    const totalRevisoes  = n(rfc?.totalRevisoes);
    const acertosFc      = n(rfc?.acertos);
    return {
      materiaId:      m.id,
      materiaNome:    m.nome,
      materiaSlug:    m.slug,
      materiaIcone:   m.icone,
      totalAlunos:    n(al?.totalAlunos),
      totalRespostas,
      acertoPct:      totalRespostas > 0 ? Math.round((acertosQz / totalRespostas) * 100) : 0,
      totalRevisoes,
      acertoPctFc:    totalRevisoes > 0 ? Math.round((acertosFc / totalRevisoes) * 100) : 0,
      ...content,
    };
  });

  // ── 8. Overview geral ─────────────────────────────────────────────────────
  const totalRespostas      = questoes.reduce((a, q) => a + q.totalUsuarios, 0);
  const totalAcertos        = questoes.reduce((a, q) => a + q.acertos, 0);
  const totalTentativas     = questoes.reduce((a, q) => a + q.totalTentativas, 0);
  const questoesRespondidas = questoes.filter((q) => q.totalUsuarios > 0).length;
  const topicosMaisRevisados = topicoStats.filter((t) => t.totalRevisoes > 0).length;

  const alunosAtivosSet = new Set<string>();
  materiaAlunosAgg.forEach(() => {}); // já temos matAlunosMap
  // Conta alunos únicos ativos via query separada
  const alunosAtivos = await prisma.userMateria.findMany({
    where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { userId: true },
    distinct: ["userId"],
  });

  const overview: StatsOverview = {
    totalRespostas,
    acertoPctGeral:    totalRespostas > 0 ? Math.round((totalAcertos / totalRespostas) * 100) : 0,
    totalAlunosAtivos: alunosAtivos.length,
    totalTentativas,
    questoesRespondidas,
    questoesSemResposta: quizzes.length - questoesRespondidas,
    topicosMaisRevisados,
  };

  const payload: StatsPayload = { overview, questoes, topicos: topicoStats, materias };
  return NextResponse.json(payload);
}
