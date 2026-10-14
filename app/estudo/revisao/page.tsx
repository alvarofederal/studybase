import Link from "next/link";
import prisma from "@/lib/prisma";
import { exigirAluno } from "@/lib/auth/pagina";
import { materiasAtivasIds } from "@/lib/study/painel";
import RevisaoCliente from "./RevisaoCliente";

export const dynamic = "force-dynamic";
export const metadata = { title: "Revisão de hoje | StudyBase" };

const LIMITE = 50;

export default async function RevisaoPage() {
  const { sub: userId } = await exigirAluno();
  const ids = await materiasAtivasIds(userId);
  const agora = new Date();

  // Primeiro os vencidos (mais atrasados antes); se sobrar espaço, cards ainda nunca vistos.
  const vencidos = await prisma.revisaoFlashcard.findMany({
    where: {
      userId,
      proximaRevisao: { lte: agora },
      flashcard: { topico: { publicado: true, bloco: { materiaId: { in: ids } } } },
    },
    orderBy: { proximaRevisao: "asc" },
    take: LIMITE,
    select: { flashcardId: true },
  });

  const jaVistos = await prisma.revisaoFlashcard.findMany({ where: { userId }, select: { flashcardId: true } });
  const novos =
    vencidos.length < LIMITE
      ? await prisma.flashcard.findMany({
          where: {
            id: { notIn: jaVistos.map((r) => r.flashcardId) },
            topico: { publicado: true, bloco: { materiaId: { in: ids } } },
          },
          take: Math.min(10, LIMITE - vencidos.length),
          select: { id: true },
        })
      : [];

  const ordem = [...vencidos.map((v) => v.flashcardId), ...novos.map((n) => n.id)];
  const cards = await prisma.flashcard.findMany({
    where: { id: { in: ordem } },
    select: {
      id: true,
      frente: true,
      verso: true,
      dica: true,
      topico: { select: { titulo: true, bloco: { select: { materia: { select: { nome: true } } } } } },
    },
  });
  const porId = new Map(cards.map((c) => [c.id, c]));
  const fila = ordem
    .map((id) => porId.get(id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => ({
      id: c.id,
      frente: c.frente,
      verso: c.verso,
      dica: c.dica,
      topico: c.topico.titulo,
      materia: c.topico.bloco.materia.nome,
    }));

  return (
    <div className="min-h-screen text-white">
      <header className="h-14 glass !rounded-none !border-x-0 !border-t-0 flex items-center px-4 gap-3">
        <Link href="/estudo" className="text-gray-400 hover:text-white text-sm">← Início</Link>
        <h1 className="font-bold text-sm">Revisão de hoje</h1>
      </header>
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <RevisaoCliente fila={fila} vencidos={vencidos.length} />
      </main>
    </div>
  );
}
