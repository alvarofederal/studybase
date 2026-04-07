"use client";

import { useState } from "react";

interface MateriaInfo {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  totalBlocos: number;
  totalTopicos: number;
  totalQuizzes: number;
  totalFlashcards: number;
  blocos: { id: string; nome: string }[];
}

interface Props {
  materias: MateriaInfo[];
  statusInicial: Record<string, string>;
}

export default function MateriasCliente({ materias, statusInicial }: Props) {
  const [status, setStatus] = useState<Record<string, string>>(statusInicial);
  const [carregando, setCarregando] = useState<string | null>(null);

  async function solicitar(materiaId: string) {
    setCarregando(materiaId);
    try {
      const res = await fetch("/api/estudo/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materiaId }),
      });
      if (res.ok) {
        setStatus((prev) => ({ ...prev, [materiaId]: "PENDENTE" }));
      }
    } finally {
      setCarregando(null);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {materias.map((m) => {
        const st = status[m.id];
        const isPendente  = st === "PENDENTE";
        const isRejeitada = st === "REJEITADA";
        const isLoading   = carregando === m.id;

        return (
          <div
            key={m.id}
            className="flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            {/* Barra topo — cinza para não liberadas */}
            <div className={`h-1 ${isPendente ? "bg-amber-500/60" : isRejeitada ? "bg-red-500/40" : "bg-gray-700"}`} />

            <div className="flex-1 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl shrink-0 opacity-60">
                  {m.icone ?? "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-300 text-sm leading-tight line-clamp-2">
                    {m.nome}
                  </h3>
                  {m.descricao && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {m.descricao}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { n: m.totalBlocos,     l: "Blocos",   icon: "📦" },
                  { n: m.totalTopicos,    l: "Tópicos",  icon: "📝" },
                  { n: m.totalQuizzes,    l: "Questões", icon: "🧠" },
                  { n: m.totalFlashcards, l: "Cards",    icon: "🃏" },
                ].map(({ n, l, icon }) => (
                  <div key={l} className="bg-gray-800/40 rounded-xl p-2 text-center opacity-60">
                    <div className="text-xs mb-0.5">{icon}</div>
                    <div className="text-sm font-bold text-white">{n}</div>
                    <div className="text-[10px] text-gray-500">{l}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {m.blocos.slice(0, 3).map((b) => (
                  <span key={b.id} className="text-[10px] bg-gray-800/50 text-gray-600 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                    {b.nome}
                  </span>
                ))}
                {m.blocos.length > 3 && (
                  <span className="text-[10px] text-gray-700 px-1 py-0.5">+{m.blocos.length - 3}</span>
                )}
              </div>
            </div>

            {/* Rodapé com botão de ação */}
            <div className="border-t border-gray-800 px-4 sm:px-6 py-3 bg-gray-900/40">
              {isPendente ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-amber-400 font-medium">
                    Solicitação enviada — aguardando aprovação
                  </span>
                </div>
              ) : isRejeitada ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-red-400">Solicitação rejeitada</span>
                  </div>
                  <button
                    onClick={() => solicitar(m.id)}
                    disabled={isLoading}
                    className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "..." : "Tentar novamente"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => solicitar(m.id)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-emerald-700/60 border border-gray-600 hover:border-emerald-500/50 text-gray-300 hover:text-white text-xs font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>🔓</span>
                      Solicitar acesso
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
