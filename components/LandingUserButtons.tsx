"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <ThemeToggle
        compact
        className="w-8 h-8 justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
      />
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
