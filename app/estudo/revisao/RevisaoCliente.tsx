"use client";

import { useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Card {
  id: string;
  frente: string;
  verso: string;
  dica: string | null;
  topico: string;
  materia: string;
}

export default function RevisaoCliente({ fila, vencidos }: { fila: Card[]; vencidos: number }) {
  const [i, setI] = useState(0);
  const [virado, setVirado] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (fila.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-lg font-bold">Nada para revisar agora</h2>
        <p className="text-gray-500 text-sm mt-2">Volte amanhã — os próximos cards já estão agendados.</p>
        <Link href="/estudo" className="inline-block mt-6 text-emerald-400 text-sm">← Voltar ao início</Link>
      </div>
    );
  }

  if (i >= fila.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-lg font-bold">Revisão concluída</h2>
        <p className="text-gray-400 text-sm mt-2">
          Você sabia {acertos} de {fila.length} ({Math.round((acertos / fila.length) * 100)}%).
          Os que errou voltam amanhã; os que acertou ficam cada vez mais espaçados.
        </p>
        <Link href="/estudo" className="inline-block mt-6 text-emerald-400 text-sm">← Voltar ao início</Link>
      </div>
    );
  }

  const card = fila[i];

  async function responder(acertou: boolean) {
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/estudo/revisar-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: card.id, acertou }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Erro ao salvar.");
      if (acertou) setAcertos((a) => a + 1);
      setVirado(false);
      setI((n) => n + 1);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>
          {i + 1} / {fila.length}
          {i === 0 && vencidos > 0 && ` · ${vencidos} vencido${vencidos !== 1 ? "s" : ""}`}
        </span>
        <span className="truncate ml-4">{card.materia} · {card.topico}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(i / fila.length) * 100}%` }} />
      </div>

      <div className="glass p-5 sm:p-6 min-h-[220px]">
        <MarkdownRenderer content={card.frente} />
        {!virado && card.dica && <p className="text-xs text-amber-400/80 mt-4">💡 Dica: {card.dica}</p>}
        {virado && (
          <div className="mt-5 pt-5 border-t border-gray-800">
            <MarkdownRenderer content={card.verso} />
          </div>
        )}
      </div>

      {erro && <p className="text-red-400 text-sm mt-3">{erro}</p>}

      <div className="mt-4">
        {!virado ? (
          <button
            onClick={() => setVirado(true)}
            className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold text-sm"
          >
            Mostrar resposta
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={enviando}
              onClick={() => responder(false)}
              className="py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25 font-semibold text-sm disabled:opacity-50"
            >
              ✗ Não sabia
            </button>
            <button
              disabled={enviando}
              onClick={() => responder(true)}
              className="py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 font-semibold text-sm disabled:opacity-50"
            >
              ✓ Sabia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
