import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";
import { ErroIa, enviarLote, requisicaoLote } from "@/lib/ia/anthropic";
import { contextosSemComentario } from "@/lib/ia/contexto-questao";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // limite seguro em qualquer plano da Vercel

/**
 * Cria um lote na Message Batches API com as questões da matéria que ainda não têm comentário
 * (RF-IA-06 / ADR-02). O processamento é assíncrono; os resultados são lidos em /coletar.
 */
export async function POST(req: NextRequest) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const { materiaId } = (await req.json().catch(() => ({}))) as { materiaId?: string };
  if (!materiaId) return NextResponse.json({ error: "materiaId obrigatório." }, { status: 400 });

  const materia = await prisma.materia.findUnique({ where: { id: materiaId }, select: { id: true, nome: true } });
  if (!materia) return NextResponse.json({ error: "Matéria não encontrada." }, { status: 404 });

  // Um lote por matéria de cada vez: evita pagar duas vezes pelas mesmas questões
  const pendente = await prisma.loteComentarioIa.findFirst({ where: { materiaId, status: "ENVIADO" }, select: { id: true } });
  if (pendente) {
    return NextResponse.json(
      { error: "Já existe um lote desta matéria em processamento. Colete os resultados antes de enviar outro." },
      { status: 409 },
    );
  }

  const itens = await contextosSemComentario(materiaId);
  if (!itens.length) {
    return NextResponse.json({ error: `Todas as questões de ${materia.nome} já têm comentário.` }, { status: 400 });
  }

  try {
    const lote = await enviarLote(itens.map((i) => requisicaoLote(i.quizId, i.contexto)));
    const registro = await prisma.loteComentarioIa.create({
      data: { batchId: lote.id, materiaId, total: itens.length },
    });
    return NextResponse.json({ lote: registro }, { status: 201 });
  } catch (e) {
    if (e instanceof ErroIa) {
      return NextResponse.json({ error: e.message, codigo: e.codigo }, { status: e.codigo === "indisponivel" ? 503 : 502 });
    }
    console.error("[LOTE-IA]", e);
    return NextResponse.json({ error: "Erro inesperado ao criar o lote." }, { status: 500 });
  }
}
