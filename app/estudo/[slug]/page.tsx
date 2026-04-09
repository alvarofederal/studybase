import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getMateriaData } from "@/lib/getMateriaData";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import EstudoCliente from "./EstudoCliente";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const materia = await getMateriaData(slug);
  if (!materia) return { title: "Não encontrado" };
  return {
    title: `${materia.nome} | StudyBase`,
    description: materia.descricao ?? undefined,
  };
}

export default async function EstudoPage({ params }: Props) {
  const { slug } = await params;

  // ── Autenticação ─────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");

  let payload: { sub: string; role: string } | undefined;
  try {
    payload = await verifyAccessToken(token) as { sub: string; role: string };
  } catch {
    redirect("/login");
  }
  if (!payload) redirect("/login");
  if (payload.role === "ADMIN") redirect("/admin");

  // ── Dados do usuário ──────────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true },
  });
  if (!user) redirect("/login");

  // ── Verifica acesso à matéria (incluindo expiração) ───────────────────
  const materia = await getMateriaData(slug);
  if (!materia) notFound();

  const acesso = await prisma.userMateria.findUnique({
    where: { userId_materiaId: { userId: payload.sub, materiaId: materia.id } },
    select: { id: true, expiresAt: true },
  });

  const agora = new Date();
  if (!acesso || (acesso.expiresAt !== null && acesso.expiresAt <= agora)) {
    redirect("/estudo?acesso=negado");
  }

  // ── Progresso do usuário nesta matéria ───────────────────────────────
  // Respostas de quiz (uma por questão — upsert garante a mais recente)
  const respostasDb = await prisma.respostaQuiz.findMany({
    where: {
      userId: payload.sub,
      quiz: { topico: { bloco: { materiaId: materia.id } } },
    },
    select: { quizId: true, opcaoId: true, correta: true },
  });

  // Revisões de flashcard
  const revisoesDb = await prisma.revisaoFlashcard.findMany({
    where: {
      userId: payload.sub,
      flashcard: { topico: { bloco: { materiaId: materia.id } } },
    },
    select: { flashcardId: true, acertou: true },
  });

  const progressoInicial = {
    // quizId → opcaoId escolhida
    respostas: Object.fromEntries(respostasDb.map((r) => [r.quizId, r.opcaoId])),
    // quizIds já revelados (= todos que foram respondidos e gravados)
    revelados: respostasDb.map((r) => r.quizId),
    // flashcardId → acertou
    revisoes: Object.fromEntries(revisoesDb.map((r) => [r.flashcardId, r.acertou])),
  };

  return (
    <EstudoCliente
      materia={materia}
      user={user}
      progressoInicial={progressoInicial}
    />
  );
}
