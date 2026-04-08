"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminContextPage() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  const fetchContext = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/context");
      const text = await res.text();
      setMarkdown(text);
    } catch {
      setMarkdown("Erro ao gerar snapshot. Verifique a conexão com o banco.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  const copiar = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const linhas = markdown.split("\n").length;
  const chars = markdown.length;

  return (
    <div className="text-white p-8">
      <div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <span>Context</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Snapshot do Banco
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Cole este Markdown no início de qualquer chat de IA para dar contexto completo do projeto.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchContext}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
            >
              <span className={loading ? "animate-spin" : ""}>↻</span>
              Atualizar
            </button>
            <button
              onClick={copiar}
              disabled={loading || !markdown}
              className={`flex items-center gap-1.5 text-xs rounded-lg px-4 py-2 font-medium transition-all disabled:opacity-50 ${
                copiado
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {copiado ? "✓ Copiado!" : "📋 Copiar tudo"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {!loading && markdown && (
          <div className="flex gap-4 mb-4">
            <span className="text-xs text-gray-600">
              <span className="text-emerald-400 font-semibold">{linhas}</span> linhas
            </span>
            <span className="text-xs text-gray-600">
              <span className="text-emerald-400 font-semibold">{chars.toLocaleString("pt-BR")}</span> caracteres
            </span>
            <span className="text-xs text-gray-600">
              ≈ <span className="text-emerald-400 font-semibold">{Math.ceil(chars / 4).toLocaleString("pt-BR")}</span> tokens estimados
            </span>
          </div>
        )}

        {/* Instruções de uso */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4 text-sm">
          <p className="font-semibold text-emerald-400 mb-1">Como usar</p>
          <ol className="text-emerald-200/80 text-xs space-y-1 list-decimal list-inside">
            <li>Clique em <strong>Copiar tudo</strong></li>
            <li>Abra um novo chat no Claude, ChatGPT ou qualquer IA</li>
            <li>Cole o conteúdo e diga: <em>"Este é o contexto do meu projeto StudyBase."</em></li>
            <li>A IA terá conhecimento completo da estrutura e conteúdo do banco</li>
          </ol>
        </div>

        {/* Área do Markdown */}
        <div className="relative">
          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-600">
              <div className="text-2xl mb-3 animate-pulse">⚙️</div>
              <p>Gerando snapshot do banco...</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={markdown}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full h-[60vh] bg-gray-900 border border-gray-800 rounded-2xl p-5 text-xs font-mono text-gray-300 leading-relaxed resize-none focus:outline-none focus:border-emerald-500/50 cursor-text"
              placeholder="Carregando..."
            />
          )}

          {/* Botão flutuante copiar */}
          {!loading && markdown && (
            <button
              onClick={copiar}
              className={`absolute top-3 right-3 text-xs rounded-lg px-3 py-1.5 font-medium transition-all ${
                copiado
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {copiado ? "✓" : "copiar"}
            </button>
          )}
        </div>

        {/* Link para download */}
        {!loading && markdown && (
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                const blob = new Blob([markdown], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `studybase-context-${new Date().toISOString().slice(0, 10)}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ⬇ Baixar como .md
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
