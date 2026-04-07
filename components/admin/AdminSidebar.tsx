"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Materia = {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
};

type UserInfo = { nome: string; id: string };

export default function AdminSidebar() {
  const pathname = usePathname();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [pendentes, setPendentes] = useState(0);
  const [adminUser, setAdminUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/materias")
      .then((r) => r.json())
      .then((d) => setMaterias(Array.isArray(d) ? d : []))
      .catch(() => {});

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setAdminUser({ nome: d.user.nome, id: d.user.id });
      })
      .catch(() => {});
  }, []);

  // Busca contagem de solicitações pendentes a cada 30s
  useEffect(() => {
    function buscar() {
      fetch("/api/admin/solicitacoes/pendentes")
        .then((r) => r.json())
        .then((d) => setPendentes(d.total ?? 0))
        .catch(() => {});
    }
    buscar();
    const interval = setInterval(buscar, 30_000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navItems = [
    { href: "/admin",              label: "Dashboard",    icon: "⊞", exact: true,  badge: 0 },
    { href: "/admin/materias",     label: "Matérias",     icon: "📚", exact: false, badge: 0 },
    { href: "/admin/quiz",         label: "Quiz",         icon: "🧠", exact: false, badge: 0 },
    { href: "/admin/flashcards",   label: "Flashcards",   icon: "🃏", exact: false, badge: 0 },
    { href: "/admin/solicitacoes", label: "Solicitações", icon: "🔔", exact: false, badge: pendentes },
    { href: "/admin/usuarios",     label: "Usuários",     icon: "👥", exact: false, badge: 0 },
    { href: "/admin/context",      label: "Contexto IA",  icon: "🤖", exact: false, badge: 0 },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-lg font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            StudyBase
          </span>
          <span className="text-[10px] text-gray-600 font-mono bg-gray-800 px-1.5 py-0.5 rounded">
            admin
          </span>
        </Link>
      </div>

      {/* Nav principal */}
      <nav className="px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon, exact, badge }) => {
          const active = exact ? pathname === href : isActive(href) && href !== "/admin";
          const dashboardActive = href === "/admin" && pathname === "/admin";
          const finalActive = dashboardActive || (!exact && active);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                finalActive
                  ? "bg-emerald-500/15 text-emerald-300 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-gray-950 text-[10px] font-black flex items-center justify-center leading-none">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Matérias rápidas */}
      {materias.length > 0 && (
        <div className="flex-1 overflow-y-auto px-2 py-2 border-t border-gray-800 mt-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">
            Matérias
          </p>
          <div className="space-y-0.5">
            {materias.map((m) => {
              const href = `/admin/materias/${m.slug}`;
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={m.id}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors truncate ${
                    active
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  <span>{m.icone ?? "📚"}</span>
                  <span className="truncate">{m.nome}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Rodapé — usuário logado */}
      <div className="px-3 py-3 border-t border-gray-800 space-y-1">
        {adminUser && (
          <Link
            href={`/admin/usuarios/${adminUser.id}`}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors group"
            title="Meu perfil"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 group-hover:border-emerald-400/60 transition-colors shrink-0">
              {adminUser.nome.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors truncate">
                {adminUser.nome.split(" ")[0]}
              </p>
              <p className="text-[10px] text-gray-600">Meu perfil</p>
            </div>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="text-sm">→</span> Sair
        </button>
      </div>
    </aside>
  );
}
