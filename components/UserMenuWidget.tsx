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
    <div className="flex items-center gap-1">
      {/* Avatar + nome → perfil */}
      <Link
        href={perfilHref}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors group"
        title="Meu perfil"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 group-hover:border-emerald-400/60 transition-colors shrink-0">
          {inicial}
        </div>
        <span className="hidden sm:inline text-sm text-gray-300 group-hover:text-white transition-colors max-w-[120px] truncate">
          {primeiroNome}
        </span>
      </Link>

      {/* Separador */}
      <span className="text-gray-700 text-xs hidden sm:inline">|</span>

      {/* Sair */}
      <button
        onClick={handleLogout}
        className="px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        title="Sair"
      >
        Sair
      </button>
    </div>
  );
}
