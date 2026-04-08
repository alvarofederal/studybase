import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import PerfilCliente from "./PerfilCliente";
import RevogarAcessoBtn from "./RevogarAcessoBtn";

export const dynamic = "force-dynamic";

export const metadata = { title: "Meu Perfil | StudyBase" };

/* ── helpers ─────────────────────────────────────────────── */
function badgeExpiracao(expiresAt: Date | null): {
  texto: string;
  classe: string;
} | null {
  if (!expiresAt) return null;   // legado sem expiração
  const diff = expiresAt.getTime() - Date.now();
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (dias <= 0) return { texto: "Expirado",           classe: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (dias <= 7) return { texto: `Expira em ${dias}d`, classe: "text-red-400 bg-red-500/10 border-red-500/20" };
  const data = expiresAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  return         { texto: `Válido até ${data}`,         classe: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
}

async function getDados() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");

  let payload: { sub: string; role: string } | undefined;
  try {
    payload = (await verifyAccessToken(token)) as { sub: string; role: string };
  } catch {
    redirect("/login");
  }
  if (!payload) redirect("/login");
  if (payload.role === "ADMIN") redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, nome: true, email: true, createdAt: true },
  });
  if (!user) redirect("/login");

  const agora = new Date();

  const userMaterias = await prisma.userMateria.findMany({
    where: {
      userId: payload.sub,
      // Mostra todas — incluindo expiradas, para o usuário ver o histórico
    },
    include: {
      materia: { select: { id: true, nome: true, icone: true, slug: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Separa ativas e expiradas
  const materiasAtivas    = userMaterias.filter((um) => !um.expiresAt || um.expiresAt > agora);
  const materiasExpiradas = userMaterias.filter((um) => um.expiresAt && um.expiresAt <= agora);

  return { user, materiasAtivas, materiasExpiradas };
}

export default async function PerfilPage() {
  const { user, materiasAtivas, materiasExpiradas } = await getDados();
  const inicial = user.nome.charAt(0).toUpperCase();
  const membroDesde = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* ══ SIDEBAR (desktop) ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-gray-900/60 border-r border-gray-800/60 h-screen sticky top-0">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800/60">
          <Link href="/estudo" className="flex items-center gap-2 group">
            <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              StudyBase
            </span>
            <span className="text-[10px] text-gray-600 font-mono bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded">
              CONCURSOS
            </span>
          </Link>
        </div>

        {/* User card */}
        <div className="mx-4 my-4 p-4 bg-gray-800/60 border border-gray-700/60 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/25 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
              {inicial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.nome}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700/40">
            <p className="text-[11px] text-gray-600">Membro desde {membroDesde}</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mx-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-emerald-400">{materiasAtivas.length}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Ativas</div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-gray-500">3</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Limite</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/estudo"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all group"
          >
            <span className="text-base">📚</span>
            <span>Minhas Matérias</span>
          </Link>
          <Link
            href="/estudo/perfil"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
          >
            <span className="text-base">👤</span>
            <span>Meu Perfil</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800/60">
          <PerfilCliente email={user.email} showLogoutOnly />
        </div>
      </aside>

      {/* ══ MAIN ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800/60 lg:border-none lg:bg-transparent lg:backdrop-blur-none">
          <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <Link href="/estudo" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                ← Início
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <Link href="/estudo" className="hover:text-gray-300 transition-colors">Início</Link>
              <span>›</span>
              <span className="text-gray-300">Meu Perfil</span>
            </div>
            <div className="lg:hidden">
              <PerfilCliente email={user.email} showLogoutOnly />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">

          {/* Cabeçalho de perfil */}
          <div className="bg-gradient-to-br from-emerald-900/20 via-gray-900 to-teal-900/10 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-400 shrink-0">
                {inicial}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.nome}</h1>
                <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
                <p className="text-gray-600 text-xs mt-1.5">Membro desde {membroDesde}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400">{materiasAtivas.length}</div>
                  <div className="text-xs text-gray-500">de 3 matérias</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dois painéis */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Matérias com acesso — 2/3 */}
            <div className="xl:col-span-2 space-y-6">

              {/* Ativas */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Matérias ativas
                  </h2>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">
                    {materiasAtivas.length} / 3
                  </span>
                </div>

                {materiasAtivas.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <p className="text-gray-400 font-medium text-sm">Nenhuma matéria liberada</p>
                    <p className="text-gray-600 text-xs mt-1 mb-4">Solicite acesso na página principal</p>
                    <Link
                      href="/estudo"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                      Ir para Início →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {materiasAtivas.map(({ materia, expiresAt }) => {
                      const badge = badgeExpiracao(expiresAt);
                      return (
                        <div
                          key={materia.id}
                          className="flex flex-col p-4 bg-gray-900 border border-gray-800 rounded-xl transition-all hover:border-gray-700"
                        >
                          <Link
                            href={`/estudo/${materia.slug}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-xl shrink-0 group-hover:border-emerald-500/40 transition-colors">
                              {materia.icone ?? "📚"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                                {materia.nome}
                              </p>
                              {badge ? (
                                <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border mt-0.5 ${badge.classe}`}>
                                  {badge.texto}
                                </span>
                              ) : (
                                <p className="text-xs text-gray-600 mt-0.5">Acesso liberado</p>
                              )}
                            </div>
                            <span className="text-gray-600 group-hover:text-emerald-400 transition-colors text-sm shrink-0">→</span>
                          </Link>
                          <RevogarAcessoBtn materiaId={materia.id} nomeMateria={materia.nome} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Expiradas */}
              {materiasExpiradas.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                      Expiradas
                    </h2>
                    <span className="text-xs text-gray-700 bg-gray-900 border border-gray-800 px-2 py-1 rounded-lg">
                      {materiasExpiradas.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {materiasExpiradas.map(({ materia }) => (
                      <div
                        key={materia.id}
                        className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-800/50 rounded-xl opacity-60"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700/50 flex items-center justify-center text-xl shrink-0 grayscale">
                          {materia.icone ?? "📚"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500 truncate">{materia.nome}</p>
                          <p className="text-xs text-red-500/70 mt-0.5">Acesso expirado</p>
                        </div>
                        <Link
                          href="/estudo"
                          className="text-[11px] text-gray-600 hover:text-emerald-400 transition-colors shrink-0"
                        >
                          Solicitar →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Segurança — 1/3 */}
            <div className="xl:col-span-1">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Segurança
                </h2>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <PerfilCliente email={user.email} />
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
