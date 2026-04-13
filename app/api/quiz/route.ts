import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/quiz — cria uma nova questão com opções
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pergunta, explicacao, ordem, topicoId, opcoes, dificuldade, tags } = body;

    if (!pergunta || !topicoId || !opcoes || opcoes.length < 2) {
      return NextResponse.json(
        { error: "pergunta, topicoId e pelo menos 2 opções são obrigatórios" },
        { status: 400 }
      );
    }

    const temCorreta = opcoes.some((o: { correta?: boolean }) => o.correta);
    if (!temCorreta) {
      return NextResponse.json(
        { error: "É necessário marcar pelo menos uma opção como correta" },
        { status: 400 }
      );
    }

    // Normaliza tags: array ou string → string CSV sem espaços extras
    const tagsStr = normalizeTags(tags);

    const quiz = await prisma.quiz.create({
      data: {
        pergunta,
        explicacao,
        ordem: ordem ?? 0,
        topicoId,
        dificuldade: dificuldade ?? "MEDIO",
        tags: tagsStr,
        opcoes: {
          create: opcoes.map(
            (o: { texto: string; correta?: boolean; ordem?: number }, idx: number) => ({
              texto: o.texto,
              correta: o.correta ?? false,
              ordem: o.ordem ?? idx,
            })
          ),
        },
      },
      include: { opcoes: true },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quiz]", error);
    return NextResponse.json(
      { error: "Erro ao criar questão" },
      { status: 500 }
    );
  }
}

// GET /api/quiz?topicoId=xxx&dificuldade=FACIL&tag=SFN
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicoId    = searchParams.get("topicoId");
    const dificuldade = searchParams.get("dificuldade") as "FACIL" | "MEDIO" | "DIFICIL" | null;

    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(topicoId    ? { topicoId }    : {}),
        ...(dificuldade ? { dificuldade } : {}),
      },
      orderBy: { ordem: "asc" },
      include: {
        opcoes: { orderBy: { ordem: "asc" } },
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("[GET /api/quiz]", error);
    return NextResponse.json(
      { error: "Erro ao buscar questões" },
      { status: 500 }
    );
  }
}

// ── Utilitários ──────────────────────────────────────────────────
function normalizeTags(raw: unknown): string | null {
  if (!raw) return null;
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
