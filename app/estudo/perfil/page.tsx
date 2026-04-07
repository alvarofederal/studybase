import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import UserMenuWidget from "@/components/UserMenuWidget";
import PerfilCliente from "./PerfilCliente";

export const dynamic = "force-dynamic";

export const metadata = { title: "Meu Perfil | StudyBase" };

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

  const materias = await prisma.userMateria.findMany({
    where: { userId: payload.sub },
    include: {
      materia: { select: { id: true, nome: true, icone: true, slug: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return { user, materias };
}

export default async function PerfilPage() {
  const { user, materias } = await getDados();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/estudo"
            className="text-gray-400 hover:text-white active:text-white transition-colors text-sm flex items-center gap-1.5"
          >
            ← Minhas matérias
          </Link>
          <UserMenuWidget nome={user.nome} perfilHref="/estudo/perfil" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-7">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xl sm:text-2xl font-bold text-emerald-400 shrink-0">
            {user.nome.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{user.nome}</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5 truncate">{user.email}</p>
            <p className="text-gray-600 text-xs mt-1">
              Membro desde{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Matérias com acesso */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Matérias liberadas ({materias.length})
          </h2>
          {materias.length === 0 ? (
            <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-500 text-sm">
              Nenhuma matéria liberada ainda.{" "}
              <Link href="/estudo" className="text-emerald-400 hover:underline">
                Solicite acesso
              </Link>
              .
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {materias.map(({ materia }) => (
                <Link
                  key={materia.id}
                  href={`/estudo/${materia.slug}`}
                  className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/40 active:border-emerald-500/40 hover:bg-gray-900/70 transition-all group"
                >
                  <span className="text-xl shrink-0">{materia.icone ?? "📚"}</span>
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate flex-1">
                    {materia.nome}
                  </span>
                  <span className="text-gray-600 group-hover:text-emerald-400 transition-colors text-sm shrink-0">→</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Alterar senha */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
            Segurança
          </h2>
          <PerfilCliente email={user.email} />
        </section>
      </main>
    </div>
  );
}
