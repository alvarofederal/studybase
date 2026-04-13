import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ── Tipos ────────────────────────────────────────────────────────────────────
type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";

interface QuestaoImport {
  pergunta:   string;
  opcaoA:     string;
  opcaoB:     string;
  opcaoC:     string;
  opcaoD:     string;
  correta:    "A" | "B" | "C" | "D";
  explicacao?: string | null;
  dificuldade?: Dificuldade;
  tags?:       string | null;
}

const DIFICULDADES_VALIDAS: Dificuldade[] = ["FACIL", "MEDIO", "DIFICIL"];
const LETRAS = ["A", "B", "C", "D"] as const;

function normalizeDificuldade(raw: unknown): Dificuldade {
  if (typeof raw !== "string") return "MEDIO";
  const upper = raw.trim().toUpperCase() as Dificuldade;
  return DIFICULDADES_VALIDAS.includes(upper) ? upper : "MEDIO";
}

// ── POST /api/admin/quiz/import ──────────────────────────────────────────────
// Body: { topicoId: string, questoes: QuestaoImport[], substituir?: boolean }
// Se substituir=true: apaga TODAS as questões do tópico antes de inserir.
// Cria todos os quizzes e opções em paralelo. Retorna { criadas, erros, apagadas }.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topicoId, questoes, substituir } = body as {
      topicoId: string;
      questoes: QuestaoImport[];
      substituir?: boolean;
    };

    if (!topicoId || typeof topicoId !== "string") {
      return NextResponse.json({ error: "topicoId é obrigatório" }, { status: 400 });
    }
    if (!Array.isArray(questoes) || questoes.length === 0) {
      return NextResponse.json({ error: "Nenhuma questão para importar" }, { status: 400 });
    }

    // Valida que o tópico existe
    const topico = await prisma.topico.findUnique({ where: { id: topicoId } });
    if (!topico) {
      return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
    }

    // Modo substituir: apaga tudo antes de inserir (cascade remove as opções)
    let apagadas = 0;
    if (substituir) {
      apagadas = await prisma.quiz.count({ where: { topicoId } });
      await prisma.quiz.deleteMany({ where: { topicoId } });
    }

    // Ordem base (0 se substituiu, ou continua após as existentes)
    const ordemBase = substituir ? 0 : await prisma.quiz.count({ where: { topicoId } });

    // Cria cada questão com suas opções (createMany não suporta nested creates)
    const results = await Promise.allSettled(
      questoes.map(async (q, idx) => {
        const textoOpcoes = [q.opcaoA, q.opcaoB, q.opcaoC, q.opcaoD];
        const idxCorreta = LETRAS.indexOf(q.correta.toUpperCase() as typeof LETRAS[number]);
        if (idxCorreta === -1) throw new Error(`Questão ${idx + 1}: 'correta' deve ser A, B, C ou D`);

        return prisma.quiz.create({
          data: {
            pergunta:    q.pergunta.trim(),
            explicacao:  q.explicacao?.trim() || null,
            dificuldade: normalizeDificuldade(q.dificuldade),
            tags:        q.tags?.trim() || null,
            ordem:       ordemBase + idx,
            topicoId,
            opcoes: {
              create: textoOpcoes.map((texto, i) => ({
                texto:   texto.trim(),
                correta: i === idxCorreta,
                ordem:   i,
              })),
            },
          },
        });
      })
    );

    const criadas  = results.filter((r) => r.status === "fulfilled").length;
    const erros    = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason?.message ?? "Erro desconhecido");

    return NextResponse.json({ criadas, erros, apagadas }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/quiz/import]", error);
    return NextResponse.json({ error: "Erro interno ao importar" }, { status: 500 });
  }
}
