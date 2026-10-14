import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { materiasAtivasIds } from "@/lib/study/painel";
import { corrigir, embaralhar, type RespostaSimulado } from "@/lib/study/simulado";

export const dynamic = "force-dynamic";

/**
 * GET /api/estudo/simulado?materia=<slug|todas>&n=20&modo=aleatorio|erros
 * Devolve as questões SEM o gabarito.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const userId = session.sub;

  const sp = req.nextUrl.searchParams;
  const slug = sp.get("materia");
  const modo = sp.get("modo") === "erros" ? "erros" : "aleatorio";
  const n = Math.min(Math.max(parseInt(sp.get("n") ?? "20", 10) || 20, 1), 100);

  let ids = await materiasAtivasIds(userId);
  if (slug && slug !== "todas") {
    const m = await prisma.materia.findUnique({ where: { slug }, select: { id: true } });
    ids = m && ids.includes(m.id) ? [m.id] : [];
  }
  if (!ids.length) return NextResponse.json({ questoes: [] });

  const escopo = { publicado: true, bloco: { materiaId: { in: ids } } };
  const candidatas = await prisma.quiz.findMany({
    where: {
      topico: escopo,
      ...(modo === "erros" ? { respostas: { some: { userId, correta: false } } } : {}),
    },
    select: { id: true },
  });
  const sorteadas = embaralhar(candidatas).slice(0, n).map((q) => q.id);

  const questoes = await prisma.quiz.findMany({
    where: { id: { in: sorteadas } },
    select: {
      id: true,
      pergunta: true,
      dificuldade: true,
      topico: { select: { titulo: true, bloco: { select: { materia: { select: { nome: true } } } } } },
      opcoes: { orderBy: { ordem: "asc" }, select: { id: true, texto: true } },
    },
  });

  return NextResponse.json({
    questoes: embaralhar(questoes).map((q) => ({
      id: q.id,
      pergunta: q.pergunta,
      dificuldade: q.dificuldade,
      topico: q.topico.titulo,
      materia: q.topico.bloco.materia.nome,
      opcoes: q.opcoes,
    })),
  });
}

/**
 * POST /api/estudo/simulado  { respostas: [{ quizId, opcaoId|null }] }
 * Corrige no servidor, grava no histórico e devolve gabarito + comentários.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const userId = session.sub;

  const { respostas } = (await req.json().catch(() => ({}))) as { respostas?: RespostaSimulado[] };
  if (!Array.isArray(respostas) || !respostas.length || respostas.length > 100) {
    return NextResponse.json({ error: "Respostas inválidas." }, { status: 400 });
  }

  const ids = await materiasAtivasIds(userId);
  const quizzes = await prisma.quiz.findMany({
    where: {
      id: { in: respostas.map((r) => String(r.quizId)) },
      topico: { bloco: { materiaId: { in: ids } } },
    },
    select: {
      id: true,
      pergunta: true,
      explicacao: true,
      topicoId: true,
      topico: { select: { titulo: true } },
      opcoes: { orderBy: { ordem: "asc" }, select: { id: true, texto: true, correta: true } },
    },
  });

  const resultado = corrigir(quizzes, respostas);

  const respondidos = resultado.itens.filter((i) => !i.emBranco);
  if (respondidos.length) {
    const tentativas = await prisma.historicoRespostaQuiz.groupBy({
      by: ["quizId"],
      where: { userId, quizId: { in: respondidos.map((i) => i.quizId) } },
      _count: { _all: true },
    });
    const base = new Map(tentativas.map((t) => [t.quizId, t._count._all]));
    const topicoDe = new Map(quizzes.map((q) => [q.id, q.topicoId]));

    try {
      await prisma.$transaction([
        prisma.historicoRespostaQuiz.createMany({
          data: respondidos.map((i) => ({
            userId,
            quizId: i.quizId,
            opcaoId: i.opcaoEscolhida!,
            correta: i.correta,
            topicoId: topicoDe.get(i.quizId)!,
            tentativa: (base.get(i.quizId) ?? 0) + 1,
          })),
        }),
        ...respondidos.map((i) =>
          prisma.respostaQuiz.upsert({
            where: { userId_quizId: { userId, quizId: i.quizId } },
            update: { opcaoId: i.opcaoEscolhida!, correta: i.correta, topicoId: topicoDe.get(i.quizId)! },
            create: {
              userId,
              quizId: i.quizId,
              opcaoId: i.opcaoEscolhida!,
              correta: i.correta,
              topicoId: topicoDe.get(i.quizId)!,
            },
          }),
        ),
      ]);
    } catch (err) {
      console.error("[SIMULADO]", err);
      return NextResponse.json({ error: "Erro ao gravar o simulado." }, { status: 500 });
    }
  }

  const info = new Map(quizzes.map((q) => [q.id, q]));
  return NextResponse.json({
    ...resultado,
    itens: resultado.itens.map((i) => {
      const q = info.get(i.quizId)!;
      return {
        ...i,
        pergunta: q.pergunta,
        topico: q.topico.titulo,
        explicacao: q.explicacao,
        opcoes: q.opcoes.map((o) => ({ id: o.id, texto: o.texto })),
      };
    }),
  });
}
