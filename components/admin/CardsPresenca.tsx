"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  cadastradosInicial: number;
  pendentes: number;
}

/** Cards de topo do dashboard admin: usuários cadastrados, usuários online (LED) e pendências. */
export default function CardsPresenca({ cadastradosInicial, pendentes }: Props) {
  const [cadastrados, setCadastrados] = useState(cadastradosInicial);
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let vivo = true;
    async function carregar() {
      try {
        const res = await fetch("/api/admin/presenca", { cache: "no-store" });
        if (!res.ok) return;
        const d = (await res.json()) as { cadastrados: number; online: number };
        if (!vivo) return;
        setCadastrados(d.cadastrados);
        setOnline(d.online);
      } catch {
        /* mantém o último valor */
      }
    }
    carregar();
    const id = window.setInterval(carregar, 30_000);
    return () => { vivo = false; window.clearInterval(id); };
  }, []);

  const temOnline = (online ?? 0) > 0;
  const led = online === null
    ? "bg-gray-600"
    : temOnline
    ? "bg-green-400 shadow-[0_0_10px_3px_rgba(74,222,128,0.75)] animate-pulse"
    : "bg-red-500 shadow-[0_0_10px_3px_rgba(239,68,68,0.7)]";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Link
        href="/admin/usuarios"
        className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl">👥</span>
          <span className="text-xs text-gray-600 transition group-hover:text-gray-400">Ver usuários →</span>
        </div>
        <div className="mt-2 text-4xl font-black text-white">{cadastrados}</div>
        <div className="mt-1 text-xs text-gray-500">Usuários cadastrados</div>
      </Link>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl">🟢</span>
          <span
            className={`h-3.5 w-3.5 rounded-full ${led}`}
            role="img"
            aria-label={online === null ? "Carregando" : temOnline ? "Há usuários online" : "Ninguém online"}
          />
        </div>
        <div className="mt-2 text-4xl font-black text-white">{online ?? "—"}</div>
        <div className="mt-1 text-xs text-gray-500">
          Usuários online agora <span className="text-gray-600">(últimos 2 min)</span>
        </div>
      </div>

      <Link
        href="/admin/solicitacoes"
        className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl">📨</span>
          <span className="text-xs text-gray-600 transition group-hover:text-gray-400">Analisar →</span>
        </div>
        <div className={`mt-2 text-4xl font-black ${pendentes > 0 ? "text-amber-400" : "text-white"}`}>{pendentes}</div>
        <div className="mt-1 text-xs text-gray-500">Solicitações pendentes</div>
      </Link>
    </div>
  );
}
