"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

/* ─── Tipos da API ────────────────────────────────────────────────────── */

type Filtro = "alertas" | "nao-revisados" | "todos" | "sem-comentario";

interface Resumo {
  materiaId: string;
  nome: string;
  icone: string | null;
  questoes: number;
  comComentario: number;
  revisados: number;
  alertas: number;
}
interface Lote {
  id: string;
  total: number;
  status: "ENVIADO" | "COLETADO" | "FALHOU";
  sucesso: number;
  falhas: number;
  criadoEm: string;
  coletadoEm: string | null;
  materia: { id: string; nome: string };
}
interface Comentario {
  id: string;
  texto: string;
  alertaGabarito: boolean;
  motivoAlerta: string | null;
  revisado: boolean;
  oculto: boolean;
  modelo: string;
  geradoEm: string;
}
interface Item {
  quizId: string;
  pergunta: string;
  tipo: "MULTIPLA" | "CERTO_ERRADO";
  explicacao: string | null;
  opcoes: { texto: string; correta: boolean }[];
  topico: string;
  bloco: string;
  comentario: Comentario | null;
}
interface Dados {
  ia: { disponivel: boolean; modelo: string; esforco: string };
  resumo: Resumo[];
  lotes: Lote[];
  itens: Item[];
  totalItens: number;
  pagina: number;
  porPagina: number;
}

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "alertas", rotulo: "Com alerta de gabarito" },
  { valor: "nao-revisados", rotulo: "Não revisados" },
  { valor: "todos", rotulo: "Todos com comentário" },
  { valor: "sem-comentario", rotulo: "Sem comentário" },
];
const LETRAS = "ABCDEFGH";
const fmtData = (iso: string) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

/* ─── Página ──────────────────────────────────────────────────────────── */

export default function ComentariosIaAdminPage() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [materiaId, setMateriaId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("alertas");
  const [pagina, setPagina] = useState(1);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [editando, setEditando] = useState<{ id: string; texto: string } | null>(null);

  const carregar = useCallback(async () => {
    const qs = new URLSearchParams();
    if (materiaId) {
      qs.set("materiaId", materiaId);
      qs.set("filtro", filtro);
      qs.set("pagina", String(pagina));
    }
    const res = await fetch(`/api/admin/comentarios-ia?${qs}`, { cache: "no-store" });
    if (res.ok) setDados(await res.json());
    else setAviso({ tipo: "erro", texto: "Não foi possível carregar os dados." });
  }, [materiaId, filtro, pagina]);

  useEffect(() => {
    let vivo = true;
    const qs = new URLSearchParams();
    if (materiaId) {
      qs.set("materiaId", materiaId);
      qs.set("filtro", filtro);
      qs.set("pagina", String(pagina));
    }
    fetch(`/api/admin/comentarios-ia?${qs}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo && d) setDados(d); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [materiaId, filtro, pagina]);

  async function chamar(chave: string, url: string, init: RequestInit, sucesso: (d: Record<string, unknown>) => string) {
    setOcupado(chave);
    setAviso(null);
    try {
      const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) setAviso({ tipo: "erro", texto: d.error ?? "A operação falhou." });
      else setAviso({ tipo: "ok", texto: sucesso(d) });
      await carregar();
    } finally {
      setOcupado(null);
    }
  }

  const gerarLote = (r: Resumo) => {
    const sem = r.questoes - r.comComentario;
    if (!window.confirm(
      `Enviar ${sem} questões de ${r.nome} para a IA em lote?\n\n` +
      `O lote usa a Message Batches API (metade do preço) e costuma terminar em menos de 1 hora. ` +
      `Depois, clique em "Coletar" na lista de lotes.`,
    )) return;
    void chamar(`lote:${r.materiaId}`, "/api/admin/comentarios-ia/lotes", { method: "POST", body: JSON.stringify({ materiaId: r.materiaId }) },
      () => `Lote de ${r.nome} enviado.`);
  };
  const coletar = (l: Lote) =>
    chamar(`coletar:${l.id}`, `/api/admin/comentarios-ia/lotes/${l.id}/coletar`, { method: "POST" },
      (d) => String(d.mensagem ?? "Lote consultado."));
  const gerar = (it: Item) =>
    chamar(`gerar:${it.quizId}`, "/api/admin/comentarios-ia/gerar", { method: "POST", body: JSON.stringify({ quizId: it.quizId }) },
      () => "Comentário gerado.");
  const atualizar = (c: Comentario, corpo: Record<string, unknown>, msg: string) =>
    chamar(`edit:${c.id}`, `/api/admin/comentarios-ia/${c.id}`, { method: "PATCH", body: JSON.stringify(corpo) }, () => msg);

  if (!dados) return <div className="p-6 text-gray-500">Carregando…</div>;

  const materiaSel = dados.resumo.find((r) => r.materiaId === materiaId) ?? null;
  const totalPaginas = Math.max(1, Math.ceil(dados.totalItens / dados.porPagina));
  const loteAberto = (id: string) => dados.lotes.some((l) => l.materia.id === id && l.status === "ENVIADO");

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="transition hover:text-gray-300">Admin</Link>
          <span>/</span>
          <span className="text-gray-300">Comentários IA</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Comentários gerados por IA</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Um comentário por questão da trilha, mostrado ao aluno depois que ele responde. Comentários com alerta de
          gabarito ficam retidos até você revisar.
        </p>
      </div>

      {/* Situação da IA — RF-IA-10 */}
      {dados.ia.disponivel ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-xs text-gray-400">
          IA configurada · modelo <span className="font-mono text-gray-200">{dados.ia.modelo}</span> · esforço{" "}
          <span className="font-mono text-gray-200">{dados.ia.esforco}</span> · lote custa metade do preço da geração individual.
        </div>
      ) : (
        <div className="rounded-xl border border-amber-700/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-300">
          A variável <span className="font-mono">ANTHROPIC_API_KEY</span> não está configurada no servidor. Cadastre a chave
          nas variáveis de ambiente da Vercel e faça um novo deploy para habilitar a geração. Revisão e edição continuam
          disponíveis.
        </div>
      )}

      {aviso && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${aviso.tipo === "ok" ? "border-emerald-700/40 bg-emerald-900/20 text-emerald-300" : "border-red-700/40 bg-red-900/20 text-red-300"}`}>
          {aviso.texto}
        </div>
      )}

      {/* Resumo por matéria — RF-IA-09 */}
      <section className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Matéria</th>
              <th className="px-4 py-3 text-right">Questões</th>
              <th className="px-4 py-3 text-right">Com comentário</th>
              <th className="px-4 py-3 text-right">Revisados</th>
              <th className="px-4 py-3 text-right">Alertas</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.resumo.map((r) => {
              const sem = r.questoes - r.comComentario;
              const pct = r.questoes ? Math.round((r.comComentario / r.questoes) * 100) : 0;
              return (
                <tr key={r.materiaId} className={`border-b border-gray-800/50 ${materiaId === r.materiaId ? "bg-gray-800/40" : ""}`}>
                  <td className="px-4 py-3 text-white">{r.icone ?? "📖"} {r.nome}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.questoes}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.comComentario} <span className="text-gray-600">({pct}%)</span></td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.revisados}</td>
                  <td className={`px-4 py-3 text-right ${r.alertas ? "font-semibold text-amber-400" : "text-gray-500"}`}>{r.alertas}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => gerarLote(r)}
                        disabled={!dados.ia.disponivel || sem === 0 || loteAberto(r.materiaId) || ocupado !== null}
                        title={loteAberto(r.materiaId) ? "Há um lote desta matéria em processamento" : undefined}
                        className="rounded-lg border border-sky-700/40 bg-sky-900/20 px-3 py-1.5 text-xs text-sky-300 transition hover:bg-sky-900/40 disabled:opacity-40"
                      >
                        {ocupado === `lote:${r.materiaId}` ? "Enviando…" : sem === 0 ? "Completo" : `Gerar lote (${sem})`}
                      </button>
                      <button
                        onClick={() => { setMateriaId(r.materiaId); setPagina(1); setEditando(null); }}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-800"
                      >
                        Revisar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Lotes — RF-IA-06 */}
      {dados.lotes.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-white">Lotes</h2>
          <div className="space-y-2">
            {dados.lotes.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm">
                <span className="text-white">{l.materia.nome}</span>
                <span className="text-xs text-gray-500">{l.total} questões · enviado {fmtData(l.criadoEm)}</span>
                {l.status === "ENVIADO" ? (
                  <>
                    <span className="rounded bg-sky-900/40 px-2 py-0.5 text-xs text-sky-300">em processamento</span>
                    <button
                      onClick={() => coletar(l)}
                      disabled={ocupado !== null}
                      className="ml-auto rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-40"
                    >
                      {ocupado === `coletar:${l.id}` ? "Consultando…" : "Coletar resultados"}
                    </button>
                  </>
                ) : (
                  <span className="ml-auto text-xs text-gray-400">
                    coletado {l.coletadoEm ? fmtData(l.coletadoEm) : ""} · {l.sucesso} gravados
                    {l.falhas ? <span className="text-amber-400"> · {l.falhas} falhas</span> : null}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Revisão — RF-IA-08 */}
      {materiaSel && (
        <section>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-bold text-white">Revisão · {materiaSel.nome}</h2>
            <div className="flex flex-wrap gap-1 rounded-xl border border-gray-800 bg-gray-900 p-1">
              {FILTROS.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => { setFiltro(f.valor); setPagina(1); setEditando(null); }}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${filtro === f.valor ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {f.rotulo}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500">{dados.totalItens} questão(ões)</span>
          </div>

          {dados.itens.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center text-sm text-gray-500">
              Nada neste filtro.
            </div>
          ) : (
            <div className="space-y-3">
              {dados.itens.map((it) => {
                const c = it.comentario;
                return (
                  <article
                    key={it.quizId}
                    className={`rounded-2xl border p-4 ${c?.alertaGabarito && !c.revisado ? "border-amber-700/50 bg-amber-950/10" : "border-gray-800 bg-gray-900"}`}
                  >
                    <p className="text-[11px] text-gray-500">{it.bloco} › {it.topico} · {it.tipo === "CERTO_ERRADO" ? "Certo/Errado" : "Múltipla escolha"}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-200">{it.pergunta}</p>
                    <ul className="mt-2 space-y-0.5 text-xs">
                      {it.opcoes.map((o, i) => (
                        <li key={i} className={o.correta ? "font-semibold text-emerald-400" : "text-gray-500"}>
                          {it.tipo === "CERTO_ERRADO" ? "" : `${LETRAS[i]}) `}{o.texto}{o.correta ? " ✓" : ""}
                        </li>
                      ))}
                    </ul>

                    {c ? (
                      <div className="mt-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-gray-500">🤖 {c.modelo} · {fmtData(c.geradoEm)}</span>
                          {c.revisado && <span className="rounded bg-emerald-900/40 px-1.5 py-0.5 text-emerald-400">revisado</span>}
                          {c.oculto && <span className="rounded bg-gray-800 px-1.5 py-0.5 text-gray-400">oculto</span>}
                          {c.alertaGabarito && <span className="rounded bg-amber-900/50 px-1.5 py-0.5 text-amber-400">alerta de gabarito</span>}
                        </div>
                        {c.alertaGabarito && c.motivoAlerta && (
                          <p className="mb-2 rounded-lg bg-amber-900/20 px-3 py-2 text-xs text-amber-300">Motivo: {c.motivoAlerta}</p>
                        )}
                        {editando?.id === c.id ? (
                          <div>
                            <textarea
                              value={editando.texto}
                              onChange={(e) => setEditando({ id: c.id, texto: e.target.value })}
                              rows={8}
                              className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-[13px] text-white focus:border-sky-500 focus:outline-none"
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={async () => { await atualizar(c, { texto: editando.texto, revisado: true }, "Comentário salvo e marcado como revisado."); setEditando(null); }}
                                disabled={ocupado !== null}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
                              >
                                Salvar e marcar revisado
                              </button>
                              <button onClick={() => setEditando(null)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm"><MarkdownRenderer content={c.texto} /></div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-gray-600">Sem comentário de IA.</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {c && editando?.id !== c.id && (
                        <>
                          <button
                            onClick={() => atualizar(c, { revisado: !c.revisado }, c.revisado ? "Marcado como não revisado." : "Marcado como revisado.")}
                            disabled={ocupado !== null}
                            className="rounded-lg border border-emerald-700/40 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-900/20 disabled:opacity-40"
                          >
                            {c.revisado ? "Desfazer revisão" : "✓ Marcar revisado"}
                          </button>
                          <button
                            onClick={() => setEditando({ id: c.id, texto: c.texto })}
                            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => atualizar(c, { oculto: !c.oculto }, c.oculto ? "Comentário reexibido." : "Comentário ocultado dos alunos.")}
                            disabled={ocupado !== null}
                            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                          >
                            {c.oculto ? "Reexibir" : "Ocultar"}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (c && !window.confirm("Regenerar substitui o texto atual (e a revisão). Continuar?")) return;
                          void gerar(it);
                        }}
                        disabled={!dados.ia.disponivel || ocupado !== null}
                        className="rounded-lg border border-sky-700/40 px-3 py-1.5 text-xs text-sky-300 hover:bg-sky-900/20 disabled:opacity-40"
                      >
                        {ocupado === `gerar:${it.quizId}` ? "Gerando…" : c ? "Regenerar" : "Gerar agora"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="rounded-lg border border-gray-700 px-3 py-1.5 text-gray-300 disabled:opacity-40">← Anterior</button>
              <span className="text-gray-500">Página {pagina} de {totalPaginas}</span>
              <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="rounded-lg border border-gray-700 px-3 py-1.5 text-gray-300 disabled:opacity-40">Próxima →</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
