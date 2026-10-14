"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch("/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Erro ao redefinir senha.");
        return;
      }

      setSucesso(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="sh-landing relative isolate min-h-screen flex items-center justify-center px-4 py-10">
      <div className="ceu-hero !fixed" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-ceu mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-medium text-[#ffffff]">StudyBase</h1>
        </div>

        <div className="glass p-8">
          <h2 className="text-xl font-medium text-[#292827] mb-2">Nova senha</h2>
          <p className="text-[#666666] text-sm mb-6">
            Escolha uma senha segura de pelo menos 6 caracteres.
          </p>

          {sucesso ? (
            <div className="bg-[#2f6fbd]/10 border border-[#2f6fbd]/30 rounded-lg px-4 py-6 text-center">
              <span className="text-4xl block mb-3">✅</span>
              <p className="text-[#2f6fbd] font-medium">Senha redefinida!</p>
              <p className="text-[#666666] text-sm mt-1">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#292827] mb-1">
                  Nova senha
                </label>
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white/80 border border-[#e3e3e2] rounded-lg px-4 py-3 text-[#292827] placeholder-[#8a8885] focus:outline-none focus:border-[#2f6fbd] focus:ring-1 focus:ring-[#2f6fbd] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#292827] mb-1">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  required
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-white/80 border border-[#e3e3e2] rounded-lg px-4 py-3 text-[#292827] placeholder-[#8a8885] focus:outline-none focus:border-[#2f6fbd] focus:ring-1 focus:ring-[#2f6fbd] transition"
                />
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#12305e] hover:bg-[#1d4585] disabled:opacity-50 disabled:cursor-not-allowed text-[#ffffff] font-medium py-3 px-4 rounded-xl transition"
              >
                {carregando ? "Salvando..." : "Redefinir senha"}
              </button>
            </form>
          )}

          {!sucesso && (
            <p className="mt-6 text-center text-sm text-[#666666]">
              <Link href="/login" className="text-[#2f6fbd] hover:underline transition">
                ← Voltar ao login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
