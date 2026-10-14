"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Erro ao processar solicitação.");
        return;
      }

      setEnviado(true);
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
          <h2 className="text-xl font-medium text-[#292827] mb-2">Recuperar senha</h2>
          <p className="text-[#666666] text-sm mb-6">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>

          {enviado ? (
            <div className="bg-[#2f6fbd]/10 border border-[#2f6fbd]/30 rounded-lg px-4 py-6 text-center">
              <span className="text-4xl block mb-3">📧</span>
              <p className="text-[#2f6fbd] font-medium">E-mail enviado!</p>
              <p className="text-[#666666] text-sm mt-2">
                Verifique sua caixa de entrada e a pasta de spam.
                <br />O link expira em 1 hora.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#292827] mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
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
                {carregando ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#666666]">
            <Link href="/login" className="text-[#2f6fbd] hover:underline transition">
              ← Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
