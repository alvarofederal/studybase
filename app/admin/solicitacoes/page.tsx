"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Status = "PENDENTE" | "APROVADA" | "REJEITADA";

interface Solicitacao {
  id: string;
  status: Status;
  createdAt: string;
  expiresAt: string | null;
  user: { id: string; nome: string; email: string };
  materia: { id: string; nome: string; icone: string | null; slug: string };
}

function ExpiresAtBadge({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  const dias  = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const data  = new Date(expiresAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  if (dias <= 0) return <span className="text-xs text-red-400 font-medium">Expirado</span>;
  if (dias <= 7) return <span className="text-xs text-red-400 font-medium">Expira em {dias}d</span>;
  return               <span className="text-xs text-emerald-500">Válido até {data}</span>;
}

const ABAS: { label: string; value: Status; cor: string }[] = [
  { label: "Pendentes",  value: "PENDENTE",  cor: "amber"  },
  { label: "Aprovadas",  value: "APROVADA",  cor: "emerald" },
  { label: "Rejeitadas", value: "REJEITADA", cor: "red"    },
];

export default function SolicitacoesPage() {
  const [aba, setAba] = useState<Status>("PENDENTE");
  const [lista, setLista] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [contagens, setContagens] = useState<Record<Status, number>>({
    PENDENTE: 0, APROVADA: 0, REJEITADA: 0,
  });

  const carregar = useCallback(async (status: Status) => {
    setCarregando(true);
    const res = await fetch(`/api/admin/solicitacoes?status=${status}`);
    const data = await res.json();
    setLista(data.solicitacoes ?? []);
    setCarregando(false);
  }, []);

  const carregarContagens = useCallback(async () => {
    const [p, a, r] = await Promise.all([
      fetch("/api/admin/solicitacoes?status=PENDENTE").then(r => r.json()),
      fetch("/api/admin/solicitacoes?status=APROVADA").then(r => r.json()),
      fetch("/api/admin/solicitacoes?status=REJEITADA").then(r => r.json()),
    ]);
    setContagens({
      PENDENTE:  (p.solicitacoes ?? []).length,
      APROVADA:  (a.solicitacoes ?? []).length,
      REJEITADA: (r.solicitacoes ?? []).length,
    });
  }, []);

  useEffect(() => {
    carregar(aba);
  }, [aba, carregar]);

  useEffect(() => {
    carregarContagens();
  }, [carregarContagens]);

  async function agir(id: string, acao: "aprovar" | "rejeitar") {
    setProcessando(id);
    await fetch(`/api/admin/solicitacoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao }),
    });
    setProcessando(null);
    await Promise.all([carregar(aba), carregarContagens()]);
  }

  return (
    <div className="p-6">
      <div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin" className="hover:text-gray-300 transition">Admin</Link>
            <span>/</span>
            <span className="text-gray-300">Solicitações</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Solicitações de acesso</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Gerencie as solicitações de acesso às matérias.
              </p>
            </div>
            {contagens.PENDENTE > 0 && (
              <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 rounded-xl px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">
                  {contagens.PENDENTE} aguardando aprovação
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {ABAS.map((a) => (
            <button
              key={a.value}
              onClick={() => setAba(a.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === a.value
                  ? a.value === "PENDENTE"
                    ? "bg-amber-900/40 text-amber-300 border border-amber-700/40"
                    : a.value === "APROVADA"
                    ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
                    : "bg-red-900/40 text-red-300 border border-red-700/40"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {a.label}
              {contagens[a.value] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  aba === a.value
                    ? a.value === "PENDENTE" ? "bg-amber-800/60 text-amber-300"
                      : a.value === "APROVADA" ? "bg-emerald-800/60 text-emerald-300"
                      : "bg-red-800/60 text-red-300"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {contagens[a.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {carregando ? (
            <div className="p-16 text-center text-gray-500">Carregando...</div>
          ) : lista.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-4xl mb-3">
                {aba === "PENDENTE" ? "✅" : aba === "APROVADA" ? "📋" : "📋"}
              </div>
              <p className="text-gray-400 font-medium">
                {aba === "PENDENTE"
                  ? "Nenhuma solicitação pendente"
                  : aba === "APROVADA"
                  ? "Nenhuma solicitação aprovada"
                  : "Nenhuma solicitação rejeitada"}
              </p>
              {aba === "PENDENTE" && (
                <p className="text-gray-600 text-sm mt-1">
                  Quando usuários solicitarem acesso, aparecerão aqui.
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {lista.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition"
                >
                  {/* Matéria */}
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-xl shrink-0">
                    {s.materia.icone ?? "📖"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm truncate">
                        {s.materia.nome}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                        {s.user.nome.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-gray-400 text-xs">
                        {s.user.nome}
                        <span className="text-gray-600 ml-1">({s.user.email})</span>
                      </p>
                    </div>
                  </div>

                  {/* Data + validade */}
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-gray-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    {s.status === "APROVADA" && s.expiresAt ? (
                      <ExpiresAtBadge expiresAt={s.expiresAt} />
                    ) : (
                      <p className="text-gray-600 text-[11px]">
                        {new Date(s.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    {s.status === "PENDENTE" ? (
                      <>
                        <button
                          onClick={() => agir(s.id, "aprovar")}
                          disabled={processando === s.id}
                          className="flex items-center gap-1.5 bg-emerald-700/30 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-400 hover:text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                        >
                          {processando === s.id ? (
                            <span className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          ) : "✓"}
                          Aprovar
                        </button>
                        <button
                          onClick={() => agir(s.id, "rejeitar")}
                          disabled={processando === s.id}
                          className="flex items-center gap-1.5 bg-red-900/20 hover:bg-red-900/40 border border-red-700/30 text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                        >
                          ✕ Rejeitar
                        </button>
                      </>
                    ) : s.status === "APROVADA" ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aprovada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Rejeitada
                      </span>
                    )}

                    {/* Link para perfil do usuário */}
                    <Link
                      href={`/admin/usuarios/${s.user.id}`}
                      className="text-gray-600 hover:text-gray-400 text-xs transition ml-1"
                      title="Ver perfil"
                    >
                      →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
