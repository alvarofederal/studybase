"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  role: "ADMIN" | "USER";
}

export default function LandingUserButtons({ role }: Props) {
  const router = useRouter();
  const destino = role === "ADMIN" ? "/admin" : "/estudo";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={destino}
        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-3 py-1.5 transition-colors"
      >
        Acessar →
      </Link>
      <button
        onClick={handleLogout}
        className="text-xs text-gray-500 hover:text-red-400 border border-gray-700 hover:border-red-500/40 rounded-lg px-3 py-1.5 transition-colors"
      >
        Sair
      </button>
    </div>
  );
}
