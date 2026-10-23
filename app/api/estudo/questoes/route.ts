import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { materiasAtivasIds } from "@/lib/study/painel";
import { POR_PAGINA_BANCO, montarWhereQuestoes, normalizarFiltro } from "@/lib/study/filtro-questoes";
import { comentarioVisivel } from "@/lib/ia/comentario-quiz";

export const dynamic = "force-dynamic";

/**
 * Banco de questões (RF-BQ-01, RF-BQ-02, RF-BQ-05): lista filtrada e paginada das questões da trilha
 * das matérias com acesso ativo, com a última resposta do aluno e o comentário de IA visível.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const userId = session.sub;
  const filtro = normalizarFiltro(req.nextUrl.searchParams);
  const materiaIds = await materiasAtivasIds(userId);
  if (!materiaIds.length) {
    return NextResponse.json({ total: 0, pagina: 1, porPagina: POR_PAGINA_BANCO, questoes: [] });
  }

  const where = montarWhereQuestoes(filtro, userId, materiaIds);
  const [total, linhas] = await Promise.all([
    prisma.quiz.count({ where }),
    prisma.quiz.findMany({
      where,
      orderBy: [
        { topico: { bloco: { materia: { ordem: "asc" } } } },
        { topico: { bloco: { ordem: "asc" } } },
        { topico: { ordem: "asc" } },
        { ordem: "asc" },
      ],
      skip: (filtro.pagina - 1) * POR_PAGINA_BANCO,
      take: POR_PAGINA_BANCO,
      select: {
        id: true,
        pergunta: true,
        tipo: true,
        dificuldade: true,
        explicacao: true,
        opcoes: { orderBy: { ordem: "asc" }, select: { id: true, texto: true, correta: true } },
        comentarioIa: { select: { texto: true, revisado: true, alertaGabarito: true, oculto: true } },
        respostas: { where: { userId }, select: { opcaoId: true, correta: true } },
        topico: {
          select: {
            id: true,
            titulo: true,
            bloco: { select: { nome: true, materia: { select: { nome: true, slug: true, icone: true } } } },
          },
        },
      },
    }),
  ]);

  const questoes = linhas.map((q) => ({
    id: q.id,
    pergunta: q.pergunta,
    tipo: q.tipo,
    dificuldade: q.dificuldade,
    explicacao: q.explicacao,
    opcoes: q.opcoes,
    comentarioIa: comentarioVisivel(q.comentarioIa) ? { texto: q.comentarioIa!.texto, revisado: q.comentarioIa!.revisado } : null,
    minhaResposta: q.respostas[0] ?? null,
    topico: { id: q.topico.id, titulo: q.topico.titulo },
    bloco: q.topico.bloco.nome,
    materia: q.topico.bloco.materia,
  }));

  return NextResponse.json({ total, pagina: filtro.pagina, porPagina: POR_PAGINA_BANCO, questoes });
}
