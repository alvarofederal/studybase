import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

// GET /api/admin/materias/[slug]/export
// Gera backup completo da matéria em JSON (blocos → tópicos → quizzes → flashcards)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { slug } = await params;

  const materia = await prisma.materia.findUnique({
    where: { slug },
    include: {
      blocos: {
        orderBy: { ordem: "asc" },
        include: {
          topicos: {
            orderBy: { ordem: "asc" },
            include: {
              quizzes: {
                orderBy: { ordem: "asc" },
                include: { opcoes: { orderBy: { ordem: "asc" } } },
              },
              flashcards: { orderBy: { ordem: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!materia) {
    return NextResponse.json({ error: "Matéria não encontrada" }, { status: 404 });
  }

  const totalQuizzes    = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
  const totalFlashcards = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);
  const totalTopicos    = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);

  const backup = {
    _meta: {
      exportedAt:      new Date().toISOString(),
      version:         "1.0",
      slug:            materia.slug,
      totalBlocos:     materia.blocos.length,
      totalTopicos,
      totalQuizzes,
      totalFlashcards,
    },
    materia: {
      id:       materia.id,
      nome:     materia.nome,
      slug:     materia.slug,
      descricao: materia.descricao,
      icone:    materia.icone,
      cor:      materia.cor,
      blocos:   materia.blocos.map((b) => ({
        id:       b.id,
        nome:     b.nome,
        slug:     b.slug,
        descricao: b.descricao,
        ordem:    b.ordem,
        topicos:  b.topicos.map((t) => ({
          id:        t.id,
          titulo:    t.titulo,
          slug:      t.slug,
          resumo:    t.resumo,
          conteudo:  t.conteudo,
          publicado: t.publicado,
          ordem:     t.ordem,
          quizzes:   t.quizzes.map((q) => ({
            id:          q.id,
            pergunta:    q.pergunta,
            tipo:        q.tipo,
            explicacao:  q.explicacao,
            dificuldade: q.dificuldade,
            tags:        q.tags,
            ordem:       q.ordem,
            opcoes:      q.opcoes.map((o) => ({
              texto:   o.texto,
              correta: o.correta,
              ordem:   o.ordem,
            })),
          })),
          flashcards: t.flashcards.map((f) => ({
            id:     f.id,
            frente: f.frente,
            verso:  f.verso,
            dica:   f.dica,
            ordem:  f.ordem,
          })),
        })),
      })),
    },
  };

  return NextResponse.json(backup, {
    headers: {
      "Content-Disposition": `attachment; filename="backup-${slug}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Content-Type": "application/json",
    },
  });
}
