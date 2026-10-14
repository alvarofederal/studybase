"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/estudo";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Erro ao fazer login.");
        return;
      }

      // Redireciona baseado na role
      const role = data.user?.role;
      if (role === "ADMIN") {
        router.push(next.startsWith("/admin") ? next : "/admin");
      } else {
        router.push(next.startsWith("/estudo") ? next : "/estudo");
      }
      router.refresh();
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-ceu mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-medium text-[#ffffff]">StudyBase</h1>
          <p className="text-[#ffffff]/85 mt-1 text-sm">Estudos para concursos</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="text-xl font-medium text-[#292827] mb-6">Entrar na conta</h2>

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

            <div>
              <label className="block text-sm font-medium text-[#292827] mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
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
              className="w-full bg-[#12305e] hover:bg-[#1d4585] disabled:opacity-50 disabled:cursor-not-allowed text-[#ffffff] font-medium py-3 px-4 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#2f6fbd] focus:ring-offset-2"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-[#666666]">
              <Link
                href="/recuperar-senha"
                className="text-[#2f6fbd] hover:underline transition"
              >
                Esqueci minha senha
              </Link>
            </p>
            <p className="text-[#666666]">
              Não tem conta?{" "}
              <Link
                href="/cadastro"
                className="text-[#2f6fbd] hover:underline transition"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
