"use client";

import Link from "next/link";

export default function LandingGuestButtons() {
  return (
    <Link
      href="/login"
      className="rounded-lg border border-[#292827]/25 bg-white/40 px-4 py-1.5 text-sm font-medium text-[#292827] backdrop-blur transition-colors hover:bg-white/70"
    >
      Entrar
    </Link>
  );
}
