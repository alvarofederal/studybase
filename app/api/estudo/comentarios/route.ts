import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { limitar, respostaLimitada } from "@/lib/security/rate-limit";
import { MAX_TEXTO, jaRespondeu, nomePublico, resolverQuestao, temAcessoMateria } from "@/lib/estudo/comentarios";

export const dynamic = "force-dynamic";

/** Lista os comentários (e respostas) de uma questão. */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const quizId = req.nextUrl.searchParams.get("quizId");
  if (!quizId) return NextResponse.json({ error: "quizId obrigatório." }, { status: 400 });

  const q = await resolverQuestao(quizId);
  if (!q) return NextResponse.json({ error: "Questão não encontrada." }, { status: 404 });
  if (!(await temAcessoMateria(session.sub, session.role, q.materiaId))) {
    return NextResponse.json({ error: "Sem acesso a esta matéria." }, { status: 403 });
  }
  const podeParticipar = session.role === "ADMIN" || (await jaRespondeu(session.sub, q.idsRelacionados));
  // Sem ter respondido, o aluno não vê a discussão (ela pode revelar o gabarito)
  if (!podeParticipar) return NextResponse.json({ comentarios: [], podeParticipar: false });

  const rows = await prisma.comentarioQuiz.findMany({
    where: { quizId: q.raizId, ocultado: false },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      paiId: true,
      texto: true,
      createdAt: true,
      userId: true,
      user: { select: { nome: true, role: true } },
      _count: { select: { curtidas: true } },
      curtidas: { where: { userId: session.sub }, select: { id: true } },
    },
  });

  const mapa = rows.map((c) => ({
    id: c.id,
    paiId: c.paiId,
    texto: c.texto,
    createdAt: c.createdAt.toISOString(),
    autor: c.user.role === "ADMIN" ? "Equipe StudyBase" : nomePublico(c.user.nome),
    equipe: c.user.role === "ADMIN",
    meu: c.userId === session.sub,
    curtidas: c._count.curtidas,
    curti: c.curtidas.length > 0,
  }));

  // Raízes mais úteis primeiro (curtidas), depois as mais antigas; respostas em ordem cronológica
  const raizes = mapa
    .filter((c) => !c.paiId)
    .sort((a, b) => b.curtidas - a.curtidas || a.createdAt.localeCompare(b.createdAt));
  const comentarios = raizes.map((r) => ({ ...r, respostas: mapa.filter((c) => c.paiId === r.id) }));

  return NextResponse.json({ comentarios, podeParticipar: true });
}

/** Cria um comentário ou uma resposta. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const rl = limitar(`coment:${session.sub}`, 8, 60_000);
  if (!rl.ok) return respostaLimitada(rl.retryAfter);

  let body: { quizId?: unknown; texto?: unknown; paiId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const quizId = typeof body.quizId === "string" ? body.quizId : "";
  const texto = typeof body.texto === "string" ? body.texto.trim() : "";
  const paiId = typeof body.paiId === "string" ? body.paiId : null;
  if (!quizId) return NextResponse.json({ error: "quizId obrigatório." }, { status: 400 });
  if (texto.length < 2) return NextResponse.json({ error: "Escreva um comentário." }, { status: 400 });
  if (texto.length > MAX_TEXTO) {
    return NextResponse.json({ error: `Máximo de ${MAX_TEXTO} caracteres.` }, { status: 400 });
  }

  const q = await resolverQuestao(quizId);
  if (!q) return NextResponse.json({ error: "Questão não encontrada." }, { status: 404 });
  if (!(await temAcessoMateria(session.sub, session.role, q.materiaId))) {
    return NextResponse.json({ error: "Sem acesso a esta matéria." }, { status: 403 });
  }
  if (session.role !== "ADMIN" && !(await jaRespondeu(session.sub, q.idsRelacionados))) {
    return NextResponse.json({ error: "Responda a questão antes de participar da discussão." }, { status: 403 });
  }

  if (paiId) {
    const pai = await prisma.comentarioQuiz.findUnique({
      where: { id: paiId },
      select: { quizId: true, paiId: true, ocultado: true },
    });
    if (!pai || pai.quizId !== q.raizId || pai.ocultado) {
      return NextResponse.json({ error: "Comentário respondido não encontrado." }, { status: 404 });
    }
    if (pai.paiId) {
      return NextResponse.json({ error: "Só é possível responder a comentários principais." }, { status: 400 });
    }
  }

  const c = await prisma.comentarioQuiz.create({
    data: { quizId: q.raizId, userId: session.sub, paiId, texto },
    select: { id: true },
  });
  return NextResponse.json({ ok: true, id: c.id }, { status: 201 });
}
