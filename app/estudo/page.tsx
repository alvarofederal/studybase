import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import MateriasCliente from "./MateriasCliente";
import UserMenuWidget from "@/components/UserMenuWidget";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Minhas Matérias | StudyBase",
};

async function getDados() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");

  let payload;
  try {
    payload = await verifyAccessToken(token);
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect("/login");

  // Admin não usa /estudo — tem o painel próprio
  if (user.role === "ADMIN") redirect("/admin");

  // Busca todas as matérias ativas
  const todasMaterias = await prisma.materia.findMany({
    where: { ativa: true },
    orderBy: { ordem: "asc" },
    include: {
      blocos: {
        orderBy: { ordem: "asc" },
        include: {
          topicos: {
            orderBy: { ordem: "asc" },
            include: {
              _count: { select: { quizzes: true, flashcards: true } },
            },
          },
        },
      },
    },
  });

  // Matérias que o usuário já tem acesso
  const userMaterias = await prisma.userMateria.findMany({
    where: { userId: user.id },
    select: { materiaId: true },
  });
  const idsComAcesso = new Set(userMaterias.map((um) => um.materiaId));

  // Solicitações pendentes ou rejeitadas do usuário
  const solicitacoes = await prisma.solicitacaoMateria.findMany({
    where: { userId: user.id },
    select: { materiaId: true, status: true },
  });
  const statusSolicitacao: Record<string, string> = {};
  for (const s of solicitacoes) statusSolicitacao[s.materiaId] = s.status;

  return { user, todasMaterias, idsComAcesso, statusSolicitacao };
}

type PageProps = { searchParams: Promise<{ acesso?: string }> };

export default async function EstudoIndexPage({ searchParams }: PageProps) {
  const { user, todasMaterias, idsComAcesso, statusSolicitacao } = await getDados();
  const sp = await searchParams;
  const acessoNegado = sp.acesso === "negado";

  const materiasComAcesso = todasMaterias.filter((m) => idsComAcesso.has(m.id));
  const materiasParaSolicitar = todasMaterias.filter((m) => !idsComAcesso.has(m.id));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              StudyBase
            </span>
            <span className="hidden sm:inline text-[10px] text-gray-600 font-mono bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded">
              CONCURSOS
            </span>
          </div>
          <UserMenuWidget nome={user.nome} perfilHref="/estudo/perfil" />
        </div>
      </nav>

      {/* Banner: acesso negado */}
      {acessoNegado && (
        <div className="bg-red-500/10 border-b border-red-500/20">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <span className="text-red-400 text-sm">🔒</span>
            <p className="text-red-400 text-sm">
              Você não tem acesso a essa matéria. Solicite abaixo ou aguarde aprovação.
            </p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Perfil do usuário */}
        <div className="flex items-center gap-4 mb-10 p-5 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-400 shrink-0">
            {user.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{user.nome}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-gray-700/40 text-gray-400 border-gray-600/40">
              Usuário
            </span>
            <span className="text-[11px] text-gray-600">
              Desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Matérias com acesso */}
        {materiasComAcesso.length > 0 ? (
          <section className="mb-12">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">Suas matérias</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {materiasComAcesso.length} matéria{materiasComAcesso.length !== 1 ? "s" : ""} liberada{materiasComAcesso.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {materiasComAcesso.map((m) => (
                <MateriaCard key={m.id} materia={m} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl mb-12">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Nenhuma matéria disponível ainda
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Solicite acesso às matérias abaixo ou entre em contato com o administrador.
            </p>
          </div>
        )}

        {/* Matérias para solicitar */}
        {materiasParaSolicitar.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">Solicitar acesso</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Clique em uma matéria para solicitar acesso — o administrador será notificado.
              </p>
            </div>
            <MateriasCliente
              materias={materiasParaSolicitar.map((m) => ({
                id: m.id,
                slug: m.slug,
                nome: m.nome,
                descricao: m.descricao ?? null,
                icone: m.icone ?? null,
                totalBlocos: m.blocos.length,
                totalTopicos: m.blocos.reduce((a, b) => a + b.topicos.length, 0),
                totalQuizzes: m.blocos.reduce(
                  (a, b) => a + b.topicos.reduce((c, t) => c + t._count.quizzes, 0),
                  0
                ),
                totalFlashcards: m.blocos.reduce(
                  (a, b) => a + b.topicos.reduce((c, t) => c + t._count.flashcards, 0),
                  0
                ),
                blocos: m.blocos.map((b) => ({ id: b.id, nome: b.nome })),
              }))}
              statusInicial={statusSolicitacao}
            />
          </section>
        )}
      </main>
    </div>
  );
}

// ── Card de matéria com acesso ──────────────────────────────────────
function MateriaCard({
  materia,
  status,
}: {
  materia: {
    id: string;
    slug: string;
    nome: string;
    descricao: string | null;
    icone: string | null;
    blocos: {
      id: string;
      nome: string;
      topicos: { _count: { quizzes: number; flashcards: number } }[];
    }[];
  };
  status: "acesso";
}) {
  const totalTopicos = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes = materia.blocos.reduce(
    (a, b) => a + b.topicos.reduce((c, t) => c + t._count.quizzes, 0),
    0
  );
  const totalFlashcards = materia.blocos.reduce(
    (a, b) => a + b.topicos.reduce((c, t) => c + t._count.flashcards, 0),
    0
  );

  return (
    <Link
      href={`/estudo/${materia.slug}`}
      className="group flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.2)]"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="flex-1 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl shrink-0 group-hover:border-emerald-500/40 transition-colors">
            {materia.icone ?? "📖"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
              {materia.nome}
            </h3>
            {materia.descricao && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {materia.descricao}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { n: materia.blocos.length, l: "Blocos",   icon: "📦" },
            { n: totalTopicos,          l: "Tópicos",  icon: "📝" },
            { n: totalQuizzes,          l: "Questões", icon: "🧠" },
            { n: totalFlashcards,       l: "Cards",    icon: "🃏" },
          ].map(({ n, l, icon }) => (
            <div key={l} className="bg-gray-800/60 rounded-xl p-2 text-center">
              <div className="text-xs mb-0.5">{icon}</div>
              <div className="text-sm font-bold text-white">{n}</div>
              <div className="text-[10px] text-gray-500">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {materia.blocos.slice(0, 3).map((b) => (
            <span key={b.id} className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md truncate max-w-[130px]">
              {b.nome}
            </span>
          ))}
          {materia.blocos.length > 3 && (
            <span className="text-[10px] text-gray-600 px-1 py-0.5">+{materia.blocos.length - 3}</span>
          )}
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-3 flex items-center justify-between bg-gray-900/40">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-500">Acesso liberado</span>
        </div>
        <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform inline-block">
          Estudar →
        </span>
      </div>
    </Link>
  );
}

