import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * Conteúdo completo de UM tópico (texto, questões com alternativas/explicações e flashcards).
 * A tela de estudo carrega só o esqueleto da matéria e busca cada tópico quando o aluno o abre.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const topico = await prisma.topico.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      slug: true,
      conteudo: true,
      resumo: true,
      publicado: true,
      bloco: { select: { materiaId: true, materia: { select: { ativa: true } } } },
      quizzes: {
        where: { origemId: null },
        orderBy: { ordem: "asc" },
        select: {
          id: true,
          pergunta: true,
          explicacao: true,
          opcoes: { orderBy: { ordem: "asc" }, select: { id: true, texto: true, correta: true, ordem: true } },
        },
      },
      flashcards: { orderBy: { ordem: "asc" }, select: { id: true, frente: true, verso: true, dica: true } },
    },
  });
  if (!topico || !topico.bloco.materia.ativa) {
    return NextResponse.json({ error: "Tópico não encontrado." }, { status: 404 });
  }

  // Alunos só leem tópicos de matérias com acesso ativo (e publicados); admin lê tudo
  if (session.role !== "ADMIN") {
    if (!topico.publicado) return NextResponse.json({ error: "Tópico não encontrado." }, { status: 404 });
    const acesso = await prisma.userMateria.findFirst({
      where: {
        userId: session.sub,
        materiaId: topico.bloco.materiaId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { id: true },
    });
    if (!acesso) return NextResponse.json({ error: "Sem acesso a esta matéria." }, { status: 403 });
  }

  const { bloco: _bloco, publicado: _publicado, ...dados } = topico;
  void _bloco; void _publicado;
  return NextResponse.json(dados, { headers: { "Cache-Control": "private, max-age=60" } });
}
