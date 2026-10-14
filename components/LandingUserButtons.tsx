"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  role: "ADMIN" | "USER";
  /** "claro" sobre o parchment/hero em vidro; mantém a API para outras telas */
  className?: string;
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
        className="rounded-2xl bg-[#12305e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4585]"
      >
        Acessar →
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-lg border border-[#292827]/20 px-3 py-2 text-sm text-[#666666] transition-colors hover:text-[#292827]"
      >
        Sair
      </button>
    </div>
  );
}
