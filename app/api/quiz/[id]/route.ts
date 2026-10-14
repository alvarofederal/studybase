import { NextResponse } from "next/server";
import { guardaAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/quiz/[id]
export async function GET(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { opcoes: { orderBy: { ordem: "asc" } } },
    });
    if (!quiz) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("[GET /api/quiz/[id]]", error);
    return NextResponse.json({ error: "Erro ao buscar questão" }, { status: 500 });
  }
}

// PATCH /api/quiz/[id] — atualiza pergunta, explicacao, dificuldade, tags e opções
export async function PATCH(request: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    const { pergunta, explicacao, dificuldade, tags, opcoes } = await request.json();

    // Normaliza tags: array ou string CSV
    const tagsStr = normalizeTags(tags);

    // Atualiza a questão
    await prisma.quiz.update({
      where: { id },
      data: {
        ...(pergunta    !== undefined && { pergunta }),
        ...(explicacao  !== undefined && { explicacao }),
        ...(dificuldade !== undefined && { dificuldade }),
        ...(tags        !== undefined && { tags: tagsStr }),
      },
    });

    // Se veio lista de opções, recria (delete + create)
    if (Array.isArray(opcoes)) {
      await prisma.opcaoQuiz.deleteMany({ where: { quizId: id } });
      await prisma.opcaoQuiz.createMany({
        data: opcoes.map((o: { texto: string; correta: boolean }, idx: number) => ({
          quizId: id,
          texto: o.texto,
          correta: o.correta,
          ordem: idx,
        })),
      });
    }

    const updated = await prisma.quiz.findUnique({
      where: { id },
      include: { opcoes: { orderBy: { ordem: "asc" } } },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/quiz/[id]]", error);
    return NextResponse.json({ error: "Erro ao atualizar questão" }, { status: 500 });
  }
}

// DELETE /api/quiz/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;
  try {
    const { id } = await params;
    await prisma.quiz.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/quiz/[id]]", error);
    return NextResponse.json({ error: "Erro ao deletar questão" }, { status: 500 });
  }
}

// ── Utilitários ──────────────────────────────────────────────────
function normalizeTags(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  if (Array.isArray(raw)) {
    const str = raw.map((t) => String(t).trim()).filter(Boolean).join(",");
    return str || null;
  }
  if (typeof raw === "string") {
    const str = raw.split(",").map((t) => t.trim()).filter(Boolean).join(",");
    return str || null;
  }
  return null;
}
