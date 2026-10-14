import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { guardaAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** Moderação: filtro "denunciados" (ocultos + com denúncia; padrão) ou "recentes". */
export async function GET(req: NextRequest) {
  const negado = await guardaAdmin();
  if (negado) return negado;

  const filtro = req.nextUrl.searchParams.get("filtro") === "recentes" ? "recentes" : "denunciados";
  const rows = await prisma.comentarioQuiz.findMany({
    where: filtro === "denunciados" ? { OR: [{ ocultado: true }, { denuncias: { some: {} } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      texto: true,
      ocultado: true,
      paiId: true,
      createdAt: true,
      user: { select: { id: true, nome: true, email: true } },
      quiz: {
        select: {
          pergunta: true,
          topico: { select: { titulo: true, bloco: { select: { materia: { select: { nome: true } } } } } },
        },
      },
      _count: { select: { denuncias: true, curtidas: true } },
    },
  });

  return NextResponse.json({
    comentarios: rows.map((c) => ({
      id: c.id,
      texto: c.texto,
      ocultado: c.ocultado,
      resposta: !!c.paiId,
      createdAt: c.createdAt.toISOString(),
      autor: c.user,
      questao: c.quiz.pergunta.slice(0, 160),
      topico: c.quiz.topico.titulo,
      materia: c.quiz.topico.bloco.materia.nome,
      denuncias: c._count.denuncias,
      curtidas: c._count.curtidas,
    })),
  });
}
