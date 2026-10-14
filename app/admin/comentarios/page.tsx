"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Filtro = "denunciados" | "recentes";

interface Item {
  id: string;
  texto: string;
  ocultado: boolean;
  resposta: boolean;
  createdAt: string;
  autor: { id: string; nome: string; email: string };
  questao: string;
  topico: string;
  materia: string;
  denuncias: number;
  curtidas: number;
}

export default function ComentariosAdminPage() {
  const [filtro, setFiltro] = useState<Filtro>("denunciados");
  const [itens, setItens] = useState<Item[] | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const carregar = useCallback(async (f: Filtro) => {
    const res = await fetch(`/api/admin/comentarios?filtro=${f}`, { cache: "no-store" });
    if (res.ok) setItens(((await res.json()) as { comentarios: Item[] }).comentarios);
  }, []);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/admin/comentarios?filtro=${filtro}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo && d) setItens(d.comentarios); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [filtro]);

  async function alternarOculto(c: Item) {
    setOcupado(c.id);
    await fetch(`/api/admin/comentarios/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ocultado: !c.ocultado }),
    });
    await carregar(filtro);
    setOcupado(null);
  }

  async function apagar(c: Item) {
    if (!window.confirm("Apagar este comentário (e as respostas a ele)? Não dá para desfazer.")) return;
    setOcupado(c.id);
    await fetch(`/api/estudo/comentarios/${c.id}`, { method: "DELETE" });
    await carregar(filtro);
    setOcupado(null);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="transition hover:text-gray-300">Admin</Link>
          <span>/</span>
          <span className="text-gray-300">Comentários</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Moderação de comentários</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Discussões das questões. Comentários com 3 denúncias de alunos distintos são ocultados automaticamente
          até você revisar.
        </p>
      </div>

      <div className="mb-5 flex w-fit gap-1 rounded-xl border border-gray-800 bg-gray-900 p-1">
        {(["denunciados", "recentes"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => { setItens(null); setFiltro(f); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filtro === f ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f === "denunciados" ? "Denunciados / ocultos" : "Mais recentes"}
          </button>
        ))}
      </div>

      {itens === null ? (
        <p className="py-16 text-center text-gray-500">Carregando…</p>
      ) : itens.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-16 text-center">
          <div className="mb-3 text-4xl">{filtro === "denunciados" ? "✅" : "💬"}</div>
          <p className="font-medium text-gray-400">
            {filtro === "denunciados" ? "Nenhum comentário denunciado." : "Ainda não há comentários."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {itens.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl border p-4 ${
                c.ocultado ? "border-amber-700/40 bg-amber-900/10" : "border-gray-800 bg-gray-900"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-300">{c.autor.nome}</span>
                <span>({c.autor.email})</span>
                <span>· {new Date(c.createdAt).toLocaleString("pt-BR")}</span>
                {c.resposta && <span className="rounded bg-gray-800 px-1.5 py-0.5">resposta</span>}
                {c.ocultado && <span className="rounded bg-amber-900/50 px-1.5 py-0.5 text-amber-400">oculto</span>}
                {c.denuncias > 0 && <span className="rounded bg-red-900/40 px-1.5 py-0.5 text-red-400">🚩 {c.denuncias}</span>}
                <span>👍 {c.curtidas}</span>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-gray-200">{c.texto}</p>
              <p className="mt-2 truncate text-[11px] text-gray-600">
                {c.materia} › {c.topico} — “{c.questao}”
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => alternarOculto(c)}
                  disabled={ocupado === c.id}
                  className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-800 disabled:opacity-40"
                >
                  {c.ocultado ? "Reexibir (limpa denúncias)" : "Ocultar"}
                </button>
                <button
                  onClick={() => apagar(c)}
                  disabled={ocupado === c.id}
                  className="rounded-lg border border-red-700/40 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-900/30 disabled:opacity-40"
                >
                  Apagar
                </button>
                <Link
                  href={`/admin/usuarios/${c.autor.id}`}
                  className="ml-auto self-center text-xs text-gray-500 transition hover:text-gray-300"
                >
                  Ver autor →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
