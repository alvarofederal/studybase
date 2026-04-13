import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";
const DIFICULDADES: Dificuldade[] = ["FACIL", "MEDIO", "DIFICIL"];
const LETRAS = ["A", "B", "C", "D"] as const;

interface QuestaoRow {
  bloco:       string;
  topico:      string;
  pergunta:    string;
  opcaoA:      string;
  opcaoB:      string;
  opcaoC:      string;
  opcaoD:      string;
  correta:     string;
  explicacao?: string;
  dificuldade?: string;
  tags?:       string;
}

interface FlashcardRow {
  bloco:  string;
  topico: string;
  frente: string;
  verso:  string;
  dica?:  string;
}

function normalizeDific(raw?: string): Dificuldade {
  const u = raw?.trim().toUpperCase() as Dificuldade;
  return DIFICULDADES.includes(u) ? u : "MEDIO";
}

// ── POST /api/admin/materias/[slug]/import-bulk ───────────────────────────────
// Body: { questoes: QuestaoRow[], flashcards: FlashcardRow[], substituir: boolean }
// - substituir=true → apaga TODOS os quizzes e flashcards da matéria antes de inserir
// - Faz match de bloco por nome (case-insensitive) e tópico por título (case-insensitive)
// - Se bloco ou tópico não encontrado, a linha é registrada como erro (não cria novos)
export async function POST(
  request: Request,
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
        include: { topicos: true },
      },
    },
  });

  if (!materia) {
    return NextResponse.json({ error: "Matéria não encontrada" }, { status: 404 });
  }

  const body = await request.json() as {
    questoes:    QuestaoRow[];
    flashcards:  FlashcardRow[];
    substituir:  boolean;
  };

  const { questoes = [], flashcards = [], substituir = false } = body;

  // ── Helper: resolve bloco e tópico pelo nome ──────────────────────────────
  function resolveTopico(blocoNome: string, topicoNome: string) {
    const blocoNomeLower = blocoNome.trim().toLowerCase();
    const bloco = materia!.blocos.find(
      (b) => b.nome.toLowerCase() === blocoNomeLower
    );
    if (!bloco) return { erro: `Bloco não encontrado: "${blocoNome}"` };

    const topicoNomeLower = topicoNome.trim().toLowerCase();
    const topico = bloco.topicos.find(
      (t) => t.titulo.toLowerCase() === topicoNomeLower
    );
    if (!topico) return { erro: `Tópico não encontrado: "${topicoNome}" no bloco "${blocoNome}"` };

    return { topicoId: topico.id };
  }

  // ── Modo substituir: apaga tudo da matéria ────────────────────────────────
  let apagadasQuizzes    = 0;
  let apagadasFlashcards = 0;

  if (substituir) {
    const topicoIds = materia!.blocos
      .flatMap((b) => b.topicos)
      .map((t) => t.id);

    if (topicoIds.length > 0) {
      apagadasQuizzes = await prisma.quiz.count({
        where: { topicoId: { in: topicoIds } },
      });
      apagadasFlashcards = await prisma.flashcard.count({
        where: { topicoId: { in: topicoIds } },
      });

      await prisma.quiz.deleteMany({
        where: { topicoId: { in: topicoIds } },
      });
      await prisma.flashcard.deleteMany({
        where: { topicoId: { in: topicoIds } },
      });
    }
  }

  // ── Importar questões ─────────────────────────────────────────────────────
  const errosQ: string[] = [];
  let criadasQ = 0;

  for (let i = 0; i < questoes.length; i++) {
    const q = questoes[i];
    const res = resolveTopico(q.bloco, q.topico);
    if (res.erro) { errosQ.push(`Questão ${i + 1}: ${res.erro}`); continue; }

    const idxCorreta = LETRAS.indexOf(
      (q.correta ?? "").trim().toUpperCase() as typeof LETRAS[number]
    );
    if (idxCorreta === -1) {
      errosQ.push(`Questão ${i + 1}: campo "correta" deve ser A, B, C ou D`);
      continue;
    }

    try {
      const ordemBase = substituir ? i : await prisma.quiz.count({ where: { topicoId: res.topicoId } });
      await prisma.quiz.create({
        data: {
          pergunta:    q.pergunta.trim(),
          explicacao:  q.explicacao?.trim() || null,
          dificuldade: normalizeDific(q.dificuldade),
          tags:        q.tags?.trim() || null,
          ordem:       substituir ? i : ordemBase,
          topicoId:    res.topicoId!,
          opcoes: {
            create: [q.opcaoA, q.opcaoB, q.opcaoC, q.opcaoD].map((texto, oi) => ({
              texto:   texto.trim(),
              correta: oi === idxCorreta,
              ordem:   oi,
            })),
          },
        },
      });
      criadasQ++;
    } catch (err) {
      errosQ.push(`Questão ${i + 1}: erro interno — ${(err as Error).message}`);
    }
  }

  // ── Importar flashcards ───────────────────────────────────────────────────
  const errosF: string[] = [];
  let criadasF = 0;

  for (let i = 0; i < flashcards.length; i++) {
    const f = flashcards[i];
    const res = resolveTopico(f.bloco, f.topico);
    if (res.erro) { errosF.push(`Flashcard ${i + 1}: ${res.erro}`); continue; }

    try {
      const ordemBase = substituir ? i : await prisma.flashcard.count({ where: { topicoId: res.topicoId } });
      await prisma.flashcard.create({
        data: {
          frente:   f.frente.trim(),
          verso:    f.verso.trim(),
          dica:     f.dica?.trim() || null,
          ordem:    substituir ? i : ordemBase,
          topicoId: res.topicoId!,
        },
      });
      criadasF++;
    } catch (err) {
      errosF.push(`Flashcard ${i + 1}: erro interno — ${(err as Error).message}`);
    }
  }

  return NextResponse.json({
    criadasQ,
    criadasF,
    apagadasQuizzes,
    apagadasFlashcards,
    errosQ,
    errosF,
  }, { status: 201 });
}
