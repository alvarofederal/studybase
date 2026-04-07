"use client";

import { useState } from "react";

export default function PerfilCliente({ email }: { email: string }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (novaSenha !== confirma) {
      setMsg({ tipo: "erro", texto: "As senhas não coincidem." });
      return;
    }
    if (novaSenha.length < 8) {
      setMsg({ tipo: "erro", texto: "A nova senha deve ter pelo menos 8 caracteres." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ tipo: "erro", texto: data.error ?? "Erro ao alterar senha." });
      } else {
        setMsg({ tipo: "ok", texto: "Senha alterada com sucesso!" });
        setSenhaAtual("");
        setNovaSenha("");
        setConfirma("");
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <div>
        <p className="text-xs text-gray-500">E-mail da conta</p>
        <p className="text-sm text-gray-300 mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Senha atual</label>
          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Confirmar nova senha</label>
          <input
            type="password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="••••••••"
          />
        </div>

        {msg && (
          <div
            className={`text-sm px-3 py-2 rounded-lg border ${
              msg.tipo === "ok"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {msg.texto}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? "Salvando…" : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}
