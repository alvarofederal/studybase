import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { materiaTemConteudo } from "@/lib/study/conteudo-materia";

export const dynamic = "force-dynamic";

const LIMITE_MATERIAS = 3;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { materiaId } = await req.json();
  if (!materiaId) {
    return NextResponse.json({ error: "materiaId obrigatório." }, { status: 400 });
  }

  // Só é possível solicitar matérias ativas e com conteúdo (tópicos, questões e flashcards),
  // as mesmas que a tela mostra — a API não confia que o cliente filtrou a lista.
  const materia = await prisma.materia.findFirst({ where: { id: materiaId, ativa: true }, select: { id: true } });
  if (!materia) {
    return NextResponse.json({ error: "Esta matéria não está disponível para solicitação." }, { status: 404 });
  }
  const [topicos, quizzes, flashcards] = await Promise.all([
    prisma.topico.count({ where: { bloco: { materiaId } } }),
    // itens CE derivados servem só ao simulado; não contam como conteúdo da matéria
    prisma.quiz.count({ where: { origemId: null, topico: { bloco: { materiaId } } } }),
    prisma.flashcard.count({ where: { topico: { bloco: { materiaId } } } }),
  ]);
  if (!materiaTemConteudo({ topicos, quizzes, flashcards })) {
    return NextResponse.json({ error: "Esta matéria ainda não está disponível para solicitação." }, { status: 404 });
  }

  const agora = new Date();

  // Verifica se já tem acesso ativo (não expirado) a esta matéria
  const acessoAtivo = await prisma.userMateria.findFirst({
    where: {
      userId: session.sub,
      materiaId,
      OR: [
        { expiresAt: null },             // legado sem expiração
        { expiresAt: { gt: agora } },    // ainda dentro do prazo
      ],
    },
  });
  if (acessoAtivo) {
    return NextResponse.json(
      { error: "Você já tem acesso ativo a esta matéria." },
      { status: 409 },
    );
  }

  // Conta quantas matérias ativas o usuário já tem
  const totalAtivas = await prisma.userMateria.count({
    where: {
      userId: session.sub,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: agora } },
      ],
    },
  });
  // Solicitações pendentes (de outras matérias) também ocupam vaga: sem isso dava para
  // pedir várias matérias de uma vez e estourar o limite quando o admin aprovasse.
  const totalPendentes = await prisma.solicitacaoMateria.count({
    where: { userId: session.sub, status: "PENDENTE", materiaId: { not: materiaId } },
  });
  if (totalAtivas + totalPendentes >= LIMITE_MATERIAS) {
    return NextResponse.json(
      {
        error: `Limite de ${LIMITE_MATERIAS} matérias atingido (contando as solicitações pendentes). Aguarde a aprovação ou remova uma para solicitar outra.`,
        limiteMaterias: LIMITE_MATERIAS,
      },
      { status: 403 },
    );
  }

  // Cria ou reativa solicitação
  const solicitacao = await prisma.solicitacaoMateria.upsert({
    where: { userId_materiaId: { userId: session.sub, materiaId } },
    update: { status: "PENDENTE", updatedAt: agora },
    create: { userId: session.sub, materiaId, status: "PENDENTE" },
  });

  return NextResponse.json({ solicitacao }, { status: 201 });
}
