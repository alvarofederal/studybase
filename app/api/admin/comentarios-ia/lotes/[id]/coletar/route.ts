import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";
import { configIa, consultarLote, ErroIa, interpretarResposta, resultadosLote } from "@/lib/ia/anthropic";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // limite seguro em qualquer plano da Vercel

type Params = { params: Promise<{ id: string }> };

const TAMANHO_GRAVACAO = 100;

/**
 * Consulta o lote na Anthropic. Se terminou, grava os comentários válidos (RF-IA-06).
 * Questões que ganharam comentário individual enquanto o lote rodava são preservadas
 * (`skipDuplicates`). Recusas e erros ficam como falhas — dá para gerar individualmente depois.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const { id } = await params;
  const registro = await prisma.loteComentarioIa.findUnique({ where: { id } });
  if (!registro) return NextResponse.json({ error: "Lote não encontrado." }, { status: 404 });
  if (registro.status !== "ENVIADO") {
    return NextResponse.json({ lote: registro, mensagem: "Este lote já foi coletado." });
  }

  try {
    const lote = await consultarLote(registro.batchId);
    if (lote.processing_status !== "ended") {
      return NextResponse.json({
        lote: registro,
        andamento: { status: lote.processing_status, ...lote.request_counts },
        mensagem: "O lote ainda está em processamento. Tente de novo em alguns minutos.",
      });
    }

    const { modelo: modeloPadrao } = configIa();
    const validos: {
      quizId: string; texto: string; alertaGabarito: boolean; motivoAlerta: string | null; modelo: string;
    }[] = [];
    let falhas = 0;

    for await (const r of await resultadosLote(registro.batchId)) {
      if (r.result.type !== "succeeded") {
        falhas++;
        continue;
      }
      const msg = r.result.message;
      const lida = interpretarResposta(msg);
      if (!lida.ok) {
        falhas++;
        continue;
      }
      validos.push({
        quizId: r.custom_id,
        texto: lida.valor.comentario,
        alertaGabarito: lida.valor.alertaGabarito,
        motivoAlerta: lida.valor.motivoAlerta,
        modelo: msg.model ?? modeloPadrao,
      });
    }

    // Só grava para questões que ainda existem (podem ter sido apagadas enquanto o lote rodava)
    const existentes = new Set(
      (await prisma.quiz.findMany({ where: { id: { in: validos.map((v) => v.quizId) } }, select: { id: true } })).map((q) => q.id),
    );
    const paraGravar = validos.filter((v) => existentes.has(v.quizId));
    falhas += validos.length - paraGravar.length;

    let gravados = 0;
    for (let i = 0; i < paraGravar.length; i += TAMANHO_GRAVACAO) {
      const r = await prisma.comentarioIaQuiz.createMany({
        data: paraGravar.slice(i, i + TAMANHO_GRAVACAO),
        skipDuplicates: true,
      });
      gravados += r.count;
    }

    const atualizado = await prisma.loteComentarioIa.update({
      where: { id },
      data: { status: "COLETADO", sucesso: gravados, falhas, coletadoEm: new Date() },
    });
    return NextResponse.json({
      lote: atualizado,
      mensagem: `${gravados} comentário(s) gravado(s)` + (falhas ? `; ${falhas} falha(s) — gere individualmente pela lista "Sem comentário".` : "."),
    });
  } catch (e) {
    if (e instanceof ErroIa) {
      return NextResponse.json({ error: e.message, codigo: e.codigo }, { status: e.codigo === "indisponivel" ? 503 : 502 });
    }
    console.error("[COLETAR-LOTE-IA]", e);
    return NextResponse.json({ error: "Erro inesperado ao coletar o lote." }, { status: 500 });
  }
}
