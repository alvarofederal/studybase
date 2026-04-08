import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import EstudoDashboard from "./EstudoDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Início | StudyBase",
};

async function getDados() {
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

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect("/login");

  const todasMaterias = await prisma.materia.findMany({
    where: { ativa: true },
    orderBy: { ordem: "asc" },
    include: {
      blocos: {
        orderBy: { ordem: "asc" },
        include: {
          topicos: {
            orderBy: { ordem: "asc" },
            include: { _count: { select: { quizzes: true, flashcards: true } } },
          },
        },
      },
    },
  });

  const agora = new Date();

  // Todos os acessos do usuário (incluindo expirados)
  const userMaterias = await prisma.userMateria.findMany({
    where: { userId: user.id },
    select: { materiaId: true, expiresAt: true },
  });

  // Mapa: materiaId → expiresAt (null = legado sem expiração)
  const acessoMap = new Map<string, Date | null>();
  for (const um of userMaterias) acessoMap.set(um.materiaId, um.expiresAt);

  // Acesso ativo = sem expiração (legado) ou dentro do prazo
  const idsAtivos = new Set(
    [...acessoMap.entries()]
      .filter(([, exp]) => exp === null || exp > agora)
      .map(([id]) => id),
  );

  const solicitacoes = await prisma.solicitacaoMateria.findMany({
    where: { userId: user.id },
    select: { materiaId: true, status: true },
  });
  const statusSolicitacao: Record<string, string> = {};
  for (const s of solicitacoes) statusSolicitacao[s.materiaId] = s.status;

  // expiresAt por materiaId (apenas para os ativos, para exibir nos cards)
  const expiresAtMap: Record<string, string | null> = {};
  for (const [id, exp] of acessoMap.entries()) {
    if (idsAtivos.has(id)) {
      expiresAtMap[id] = exp ? exp.toISOString() : null;
    }
  }

  return { user, todasMaterias, idsAtivos, statusSolicitacao, expiresAtMap };
}

type PageProps = { searchParams: Promise<{ acesso?: string }> };

export default async function EstudoIndexPage({ searchParams }: PageProps) {
  const { user, todasMaterias, idsAtivos, statusSolicitacao, expiresAtMap } = await getDados();
  const sp = await searchParams;

  const materiasComAcesso     = todasMaterias.filter((m) => idsAtivos.has(m.id));
  const materiasParaSolicitar = todasMaterias.filter((m) => !idsAtivos.has(m.id));

  return (
    <EstudoDashboard
      user={{ ...user, createdAt: user.createdAt }}
      materiasComAcesso={materiasComAcesso}
      materiasParaSolicitar={materiasParaSolicitar}
      statusSolicitacao={statusSolicitacao}
      expiresAtMap={expiresAtMap}
      acessoNegado={sp.acesso === "negado"}
    />
  );
}
