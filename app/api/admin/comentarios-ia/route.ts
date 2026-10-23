import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";
import { configIa } from "@/lib/ia/anthropic";

export const dynamic = "force-dynamic";

const POR_PAGINA = 20;
type Filtro = "alertas" | "nao-revisados" | "todos" | "sem-comentario";

const n = (v: unknown) => (typeof v === "bigint" ? Number(v) : Number(v ?? 0));

/**
 * Painel dos comentários de IA (RF-IA-08..10): situação da IA, resumo por matéria, lotes e,
 * quando `materiaId` vem na URL, a lista de questões para revisão.
 */
export async function GET(req: NextRequest) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const sp = req.nextUrl.searchParams;
  const materiaId = sp.get("materiaId");
  const filtroParam = sp.get("filtro");
  const filtro: Filtro = ["alertas", "nao-revisados", "todos", "sem-comentario"].includes(filtroParam ?? "")
    ? (filtroParam as Filtro)
    : "alertas";
  const pagina = Math.max(1, Number(sp.get("pagina")) || 1);

  // Uma consulta agregada para todas as matérias (o plano de banco tem limite de conexões/hora)
  const resumoRows = await prisma.$queryRaw<
    { materiaId: string; nome: string; icone: string | null; questoes: bigint; comComentario: bigint; revisados: unknown; alertas: unknown }[]
  >`
    SELECT m.id AS materiaId, m.nome, m.icone,
           COUNT(q.id)                                                    AS questoes,
           COUNT(c.id)                                                    AS comComentario,
           COALESCE(SUM(CASE WHEN c.revisado = 1 THEN 1 ELSE 0 END), 0)    AS revisados,
           COALESCE(SUM(CASE WHEN c.alertaGabarito = 1 AND c.revisado = 0 THEN 1 ELSE 0 END), 0) AS alertas
    FROM   materias m
    JOIN   blocos   b ON b.materiaId = m.id
    JOIN   topicos  t ON t.blocoId   = b.id
    JOIN   quizzes  q ON q.topicoId  = t.id AND q.origemId IS NULL
    LEFT JOIN comentarios_ia_quiz c ON c.quizId = q.id
    GROUP  BY m.id, m.nome, m.icone, m.ordem
    ORDER  BY m.ordem
  `;

  const lotes = await prisma.loteComentarioIa.findMany({
    orderBy: { criadoEm: "desc" },
    take: 20,
    select: {
      id: true, batchId: true, total: true, status: true, sucesso: true, falhas: true,
      criadoEm: true, coletadoEm: true, materia: { select: { id: true, nome: true } },
    },
  });

  let itens: unknown[] = [];
  let totalItens = 0;
  if (materiaId) {
    const base = { origemId: null, topico: { bloco: { materiaId } } };
    const where =
      filtro === "sem-comentario"
        ? { ...base, comentarioIa: null }
        : filtro === "alertas"
          ? { ...base, comentarioIa: { alertaGabarito: true, revisado: false } }
          : filtro === "nao-revisados"
            ? { ...base, comentarioIa: { revisado: false } }
            : { ...base, comentarioIa: { isNot: null } };

    const [total, linhas] = await Promise.all([
      prisma.quiz.count({ where }),
      prisma.quiz.findMany({
        where,
        orderBy: [{ topico: { bloco: { ordem: "asc" } } }, { topico: { ordem: "asc" } }, { ordem: "asc" }],
        skip: (pagina - 1) * POR_PAGINA,
        take: POR_PAGINA,
        select: {
          id: true,
          pergunta: true,
          tipo: true,
          explicacao: true,
          opcoes: { orderBy: { ordem: "asc" }, select: { texto: true, correta: true } },
          topico: { select: { titulo: true, bloco: { select: { nome: true } } } },
          comentarioIa: {
            select: {
              id: true, texto: true, alertaGabarito: true, motivoAlerta: true,
              revisado: true, oculto: true, modelo: true, geradoEm: true,
            },
          },
        },
      }),
    ]);
    totalItens = total;
    itens = linhas.map((q) => ({
      quizId: q.id,
      pergunta: q.pergunta,
      tipo: q.tipo,
      explicacao: q.explicacao,
      opcoes: q.opcoes,
      topico: q.topico.titulo,
      bloco: q.topico.bloco.nome,
      comentario: q.comentarioIa,
    }));
  }

  const { modelo, esforco, disponivel } = configIa();
  return NextResponse.json({
    ia: { disponivel, modelo, esforco },
    resumo: resumoRows.map((r) => ({
      materiaId: r.materiaId,
      nome: r.nome,
      icone: r.icone,
      questoes: n(r.questoes),
      comComentario: n(r.comComentario),
      revisados: n(r.revisados),
      alertas: n(r.alertas),
    })),
    lotes,
    itens,
    totalItens,
    pagina,
    porPagina: POR_PAGINA,
  });
}
