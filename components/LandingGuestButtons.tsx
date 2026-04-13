"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingGuestButtons() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle
        compact
        className="w-8 h-8 justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
      />
      <Link
        href="/login"
        className="text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors font-medium"
      >
        Entrar
      </Link>
    </div>
  );
}
