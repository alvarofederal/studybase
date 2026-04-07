"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  nome: string;
  perfilHref: string;
}

export default function UserMenuWidget({ nome, perfilHref }: Props) {
  const router = useRouter();
  const inicial = nome.charAt(0).toUpperCase();
  const primeiroNome = nome.split(" ")[0];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-0.5">
      {/* Avatar + nome → perfil */}
      <Link
        href={perfilHref}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 active:bg-gray-800 transition-colors group"
        title="Meu perfil"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 group-hover:border-emerald-400/60 active:border-emerald-400/60 transition-colors shrink-0">
          {inicial}
        </div>
        <span className="hidden sm:inline text-sm text-gray-300 group-hover:text-white transition-colors max-w-[120px] truncate">
          {primeiroNome}
        </span>
      </Link>

      {/* Sair — sempre visível, ícone em mobile, texto em desktop */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/10 active:text-red-400 transition-colors"
        title="Sair"
        aria-label="Sair"
      >
        {/* Ícone no mobile */}
        <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        {/* Texto no desktop */}
        <span className="hidden sm:inline text-xs">Sair</span>
      </button>
    </div>
  );
}
