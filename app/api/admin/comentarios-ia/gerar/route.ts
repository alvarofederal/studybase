import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";
import { ErroIa, gerarComentario } from "@/lib/ia/anthropic";
import { contextoDaQuestao } from "@/lib/ia/contexto-questao";

export const dynamic = "force-dynamic";
// Uma geração com raciocínio pode levar dezenas de segundos
export const maxDuration = 60; // limite seguro em qualquer plano da Vercel

/** Gera (ou regenera) o comentário de IA de uma questão — RF-IA-07. */
export async function POST(req: NextRequest) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const { quizId } = (await req.json().catch(() => ({}))) as { quizId?: string };
  if (!quizId) return NextResponse.json({ error: "quizId obrigatório." }, { status: 400 });

  const contexto = await contextoDaQuestao(quizId);
  if (!contexto) return NextResponse.json({ error: "Questão da trilha não encontrada." }, { status: 404 });

  try {
    const saida = await gerarComentario(contexto);
    // Regenerar substitui o texto e volta o comentário para "não revisado"
    const dados = {
      texto: saida.comentario,
      alertaGabarito: saida.alertaGabarito,
      motivoAlerta: saida.motivoAlerta,
      modelo: saida.modelo,
      revisado: false,
      oculto: false,
      geradoEm: new Date(),
    };
    const comentario = await prisma.comentarioIaQuiz.upsert({
      where: { quizId },
      update: dados,
      create: { quizId, ...dados },
    });
    return NextResponse.json({ comentario });
  } catch (e) {
    if (e instanceof ErroIa) {
      const status = e.codigo === "indisponivel" ? 503 : e.codigo === "api" ? 502 : 422;
      return NextResponse.json({ error: e.message, codigo: e.codigo }, { status });
    }
    console.error("[COMENTARIO-IA]", e);
    return NextResponse.json({ error: "Erro inesperado ao gerar o comentário." }, { status: 500 });
  }
}
