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

  // ── Autenticação ────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");

  // eslint-disable-next-line prefer-const
  let payload: { sub: string; role: string } | undefined;
  try {
    payload = await verifyAccessToken(token) as { sub: string; role: string };
  } catch {
    redirect("/login");
  }
  if (!payload) redirect("/login");

  // Admin não usa /estudo
  if (payload.role === "ADMIN") redirect("/admin");

  // ── Dados do usuário ───────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true },
  });
  if (!user) redirect("/login");

  // ── Verifica acesso à matéria ───────────────────────────────────────
  const materia = await getMateriaData(slug);
  if (!materia) notFound();

  const acesso = await prisma.userMateria.findUnique({
    where: {
      userId_materiaId: {
        userId: payload.sub,
        materiaId: materia.id,
      },
    },
    select: { id: true },
  });

  if (!acesso) {
    // Usuário não tem permissão — volta para /estudo com aviso via searchParam
    redirect("/estudo?acesso=negado");
  }

  return <EstudoCliente materia={materia} user={user} />;
}
