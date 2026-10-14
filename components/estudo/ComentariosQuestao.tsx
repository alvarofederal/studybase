"use client";

import { useCallback, useEffect, useState } from "react";

interface Comentario {
  id: string;
  paiId: string | null;
  texto: string;
  createdAt: string;
  autor: string;
  equipe: boolean;
  meu: boolean;
  curtidas: number;
  curti: boolean;
}
interface Raiz extends Comentario {
  respostas: Comentario[];
}

const MAX = 2000;

function tempoRelativo(iso: string): string {
  const seg = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seg < 60) return "agora";
  const min = Math.round(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `há ${d} d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

/**
 * Discussão da questão (estilo QC Concursos): o aluno explica o raciocínio, responde a colegas
 * e marca comentários como úteis. Só aparece depois que a questão foi respondida.
 */
export default function ComentariosQuestao({ quizId }: { quizId: string }) {
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState<Raiz[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [texto, setTexto] = useState("");
  const [respondendo, setRespondendo] = useState<string | null>(null);
  const [textoResp, setTextoResp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`/api/estudo/comentarios?quizId=${quizId}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const d = (await res.json()) as { comentarios: Raiz[] };
      setLista(d.comentarios);
      setTotal(d.comentarios.reduce((a, c) => a + 1 + c.respostas.length, 0));
    } catch {
      setErro("Não foi possível carregar os comentários.");
    }
  }, [quizId]);

  // Só busca ao abrir (evita uma requisição por questão ao listar o tópico)
  useEffect(() => {
    if (aberto && lista === null) void carregar();
  }, [aberto, lista, carregar]);

  async function enviar(conteudo: string, paiId: string | null) {
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/estudo/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, texto: conteudo, paiId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(d.error ?? "Não foi possível enviar.");
        return;
      }
      if (paiId) { setTextoResp(""); setRespondendo(null); } else setTexto("");
      await carregar();
    } finally {
      setEnviando(false);
    }
  }

  async function curtir(id: string) {
    const res = await fetch(`/api/estudo/comentarios/${id}/curtir`, { method: "POST" });
    if (res.ok) await carregar();
    else setErro((await res.json().catch(() => ({}))).error ?? "Não foi possível curtir.");
  }

  async function apagar(id: string) {
    if (!window.confirm("Apagar este comentário?")) return;
    const res = await fetch(`/api/estudo/comentarios/${id}`, { method: "DELETE" });
    if (res.ok) await carregar();
  }

  async function denunciar(id: string) {
    if (!window.confirm("Denunciar este comentário como inadequado?")) return;
    const res = await fetch(`/api/estudo/comentarios/${id}/denunciar`, { method: "POST" });
    setErro(res.ok ? null : (await res.json().catch(() => ({}))).error ?? "Não foi possível denunciar.");
    if (res.ok) window.alert("Denúncia enviada. Obrigado por ajudar a manter a comunidade respeitosa.");
  }

  function Item({ c, raiz }: { c: Comentario; raiz?: boolean }) {
    return (
      <div className={raiz ? "" : "mt-3 border-l-2 border-gray-700 pl-3"}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`font-semibold ${c.equipe ? "text-emerald-400" : "text-gray-200"}`}>
            {c.autor}
            {c.equipe && <span className="ml-1 rounded bg-emerald-900/50 px-1 py-px text-[9px] uppercase">equipe</span>}
          </span>
          <span className="text-gray-600">{tempoRelativo(c.createdAt)}</span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">{c.texto}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {!c.meu && (
            <button
              onClick={() => curtir(c.id)}
              className={`transition hover:text-emerald-400 ${c.curti ? "font-semibold text-emerald-400" : ""}`}
              title="Marcar como útil"
            >
              👍 Útil{c.curtidas > 0 ? ` · ${c.curtidas}` : ""}
            </button>
          )}
          {c.meu && c.curtidas > 0 && <span>👍 {c.curtidas}</span>}
          {raiz && (
            <button onClick={() => setRespondendo(respondendo === c.id ? null : c.id)} className="transition hover:text-gray-300">
              Responder
            </button>
          )}
          {c.meu && (
            <button onClick={() => apagar(c.id)} className="transition hover:text-red-400">
              Apagar
            </button>
          )}
          {!c.meu && (
            <button onClick={() => denunciar(c.id)} className="transition hover:text-amber-400">
              Denunciar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-800 pt-3">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-white"
        aria-expanded={aberto}
      >
        💬 Comentários{total !== null ? ` (${total})` : ""} <span className="text-gray-600">{aberto ? "▲" : "▼"}</span>
      </button>

      {aberto && (
        <div className="mt-3 space-y-4">
          {erro && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{erro}</p>}

          {/* Novo comentário */}
          <div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, MAX))}
              rows={3}
              placeholder="Explique seu raciocínio, aponte a pegadinha ou compartilhe um macete…"
              className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[11px] text-gray-600">{texto.length}/{MAX} · seja respeitoso, sem spoilers de outras questões</span>
              <button
                onClick={() => enviar(texto, null)}
                disabled={enviando || texto.trim().length < 2}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-40"
              >
                {enviando ? "Enviando…" : "Comentar"}
              </button>
            </div>
          </div>

          {/* Lista */}
          {lista === null ? (
            <p className="text-xs text-gray-600">Carregando…</p>
          ) : lista.length === 0 ? (
            <p className="text-xs text-gray-600">Ninguém comentou ainda. Seja o primeiro a explicar!</p>
          ) : (
            <div className="space-y-4">
              {lista.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-800 bg-gray-950/40 p-3">
                  <Item c={c} raiz />
                  {c.respostas.map((r) => (
                    <Item key={r.id} c={r} />
                  ))}
                  {respondendo === c.id && (
                    <div className="mt-3 border-l-2 border-emerald-700/50 pl-3">
                      <textarea
                        value={textoResp}
                        onChange={(e) => setTextoResp(e.target.value.slice(0, MAX))}
                        rows={2}
                        autoFocus
                        placeholder={`Responder a ${c.autor}…`}
                        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="mt-1 flex justify-end gap-2">
                        <button onClick={() => setRespondendo(null)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-300">
                          Cancelar
                        </button>
                        <button
                          onClick={() => enviar(textoResp, c.id)}
                          disabled={enviando || textoResp.trim().length < 2}
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
                        >
                          Responder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
