"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type UserInfo = { nome: string; id: string; role: string };

const PAGE_LABELS: Record<string, string> = {
  "/admin":              "Dashboard",
  "/admin/materias":     "Matérias",
  "/admin/quiz":         "Quiz",
  "/admin/flashcards":   "Flashcards",
  "/admin/solicitacoes": "Solicitações",
  "/admin/usuarios":     "Usuários",
  "/admin/context":      "Contexto IA",
};

function getPageLabel(pathname: string): string {
  // Exact match first
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  // Prefix match (ordenado do mais específico ao menos)
  const sorted = Object.keys(PAGE_LABELS).sort((a, b) => b.length - a.length);
  for (const key of sorted) {
    if (key !== "/admin" && pathname.startsWith(key)) return PAGE_LABELS[key];
  }
  return "Admin";
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser({ nome: d.user.nome, id: d.user.id, role: d.user.role ?? "admin" });
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const pageLabel = getPageLabel(pathname);

  return (
    <header className="h-14 shrink-0 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Título da página atual */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-200">{pageLabel}</span>
      </div>

      {/* Ações direita */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Link para a área do aluno */}
        <Link
          href="/estudo"
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
        >
          Ver plataforma ↗
        </Link>

        {/* Perfil */}
        {user ? (
          <Link
            href={`/admin/usuarios/${user.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400 group-hover:border-emerald-400 transition-colors shrink-0">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-300 group-hover:text-white transition-colors font-medium">
              {user.nome.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse" />
        )}

        {/* Divisor */}
        <div className="w-px h-5 bg-gray-800" />

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </header>
  );
}
