"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Painel } from "@/lib/study/painel";

const DIAS = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function PainelEstudo({ painel }: { painel: Painel }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [meta, setMeta] = useState(String(painel.metaDiaria));
  const [prova, setProva] = useState(painel.dataProva ? painel.dataProva.slice(0, 10) : "");
  const [erro, setErro] = useState<string | null>(null);

  const pct = Math.min(100, Math.round((painel.hoje / painel.metaDiaria) * 100));
  const max = Math.max(1, ...painel.ultimos7.map((d) => d.total));

  async function salvar() {
    setErro(null);
    const res = await fetch("/api/estudo/preferencias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metaDiaria: Number(meta), dataProva: prova || null }),
    });
    if (!res.ok) {
      setErro((await res.json().catch(() => ({}))).error ?? "Erro ao salvar.");
      return;
    }
    setEditando(false);
    router.refresh();
  }

  const prova_ =
    painel.diasParaProva === null
      ? null
      : painel.diasParaProva > 0
        ? `${painel.diasParaProva} dia${painel.diasParaProva !== 1 ? "s" : ""} para a prova`
        : painel.diasParaProva === 0
          ? "A prova é hoje!"
          : "Prova realizada";

  return (
    <section className="mb-8 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Meta do dia */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Meta de hoje</span>
            <button onClick={() => setEditando((v) => !v)} className="text-[11px] text-gray-500 hover:text-emerald-400">
              {editando ? "fechar" : "ajustar"}
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{painel.hoje}</span>
            <span className="text-sm text-gray-500">/ {painel.metaDiaria}</span>
            {pct >= 100 && <span className="ml-2 text-emerald-400 text-sm">✓ meta batida</span>}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[11px] text-gray-600 mt-2">questões respondidas + flashcards revisados</p>
        </div>

        {/* Sequência + semana */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sequência</span>
            {prova_ && <span className="text-[11px] text-amber-400 font-semibold">{prova_}</span>}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{painel.streak}</span>
            <span className="text-sm text-gray-500">dia{painel.streak !== 1 ? "s" : ""} seguidos 🔥</span>
          </div>
          <div className="flex items-end gap-1.5 h-12 mt-3">
            {painel.ultimos7.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1" title={`${d.dia}: ${d.total}`}>
                <div
                  className={`w-full rounded-sm ${d.total ? "bg-emerald-500" : "bg-gray-800"}`}
                  style={{ height: `${Math.max(6, (d.total / max) * 32)}px` }}
                />
                <span className="text-[9px] text-gray-600">{DIAS[new Date(`${d.dia}T12:00:00`).getDay()]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 gap-2">
          <Link
            href="/estudo/revisao"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-emerald-500/50 rounded-2xl px-4 py-3 transition-colors"
          >
            <span className="text-sm font-semibold text-white">🃏 Revisão de hoje</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${painel.revisoesDevidas ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
              {painel.revisoesDevidas} card{painel.revisoesDevidas !== 1 ? "s" : ""}
            </span>
          </Link>
          <Link
            href="/estudo/erros"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-red-500/50 rounded-2xl px-4 py-3 transition-colors"
          >
            <span className="text-sm font-semibold text-white">📕 Caderno de erros</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${painel.errosAbertos ? "bg-red-500/20 text-red-400" : "bg-gray-800 text-gray-500"}`}>
              {painel.errosAbertos}
            </span>
          </Link>
          <Link
            href="/estudo/simulado"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-violet-500/50 rounded-2xl px-4 py-3 transition-colors"
          >
            <span className="text-sm font-semibold text-white">⚖️ Simulado CEBRASPE</span>
            <span className="text-xs text-gray-500">→</span>
          </Link>
          <Link
            href="/estudo/questoes"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-teal-500/50 rounded-2xl px-4 py-3 transition-colors"
          >
            <span className="text-sm font-semibold text-white">🗂️ Banco de questões</span>
            <span className="text-xs text-gray-500">filtrar e praticar →</span>
          </Link>
          <Link
            href="/estudo/desempenho"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-amber-500/50 rounded-2xl px-4 py-3 transition-colors"
          >
            <span className="text-sm font-semibold text-white">📈 Desempenho</span>
            <span className="text-xs text-gray-500">acerto por assunto →</span>
          </Link>
        </div>
      </div>

      {editando && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="text-xs text-gray-400">
            Meta diária (atividades)
            <input
              type="number"
              min={1}
              max={500}
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="block mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-gray-400">
            Data da prova
            <input
              type="date"
              value={prova}
              onChange={(e) => setProva(e.target.value)}
              className="block mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>
          <button onClick={salvar} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white">
            Salvar
          </button>
          {erro && <span className="text-xs text-red-400">{erro}</span>}
        </div>
      )}
    </section>
  );
}
