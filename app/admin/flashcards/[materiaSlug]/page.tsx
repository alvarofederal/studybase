"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

type Flashcard = {
  id: string;
  frente: string;
  verso: string;
  dica: string | null;
  topicoTitulo?: string;
  blocoNome?: string;
};
type Topico  = { id: string; titulo: string; slug: string };
type Bloco   = { id: string; nome: string; topicos: Topico[] };
type Materia = { id: string; nome: string; slug: string; icone: string | null; cor: string | null; descricao: string | null; blocos: Bloco[] };

const CORES = ["emerald", "teal", "blue", "violet", "rose", "amber", "cyan"];

export default function AdminFlashcardsMateriaPage() {
  const { materiaSlug } = useParams<{ materiaSlug: string }>();

  const [materia, setMateria]     = useState<Materia | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState("");
  const [sucesso, setSucesso]     = useState("");

  // Edição da matéria
  const [showEditMateria, setShowEditMateria] = useState(false);
  const [editMateria, setEditMateria]         = useState({ nome: "", slug: "", descricao: "", icone: "", cor: "" });
  const [salvandoMateria, setSalvandoMateria] = useState(false);

  // Seletores cascata
  const [blocoId, setBlocoId]   = useState("");
  const [topicoId, setTopicoId] = useState("");

  // Campos
  const [frente, setFrente] = useState("");
  const [verso, setVerso]   = useState("");
  const [dica, setDica]     = useState("");

  // ── Carregamento ──────────────────────────────────────────────
  const carregarFlashcards = async (mat: Materia) => {
    const all: Flashcard[] = [];
    for (const b of mat.blocos) {
      for (const t of b.topicos) {
        const r = await fetch(`/api/flashcards?topicoId=${t.id}`);
        const fcs: Flashcard[] = await r.json();
        fcs.forEach((f) =>
          all.push({ ...f, topicoTitulo: t.titulo, blocoNome: b.nome })
        );
      }
    }
    setFlashcards(all);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/materias?tree=true`);
        const mats: Materia[] = await res.json();
        const mat = mats.find((m) => m.slug === materiaSlug);
        if (!mat) return;
        setMateria(mat);
        await carregarFlashcards(mat);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [materiaSlug]);

  // ── Derivados ─────────────────────────────────────────────────
  const blocos  = materia?.blocos ?? [];
  const topicos = blocos.find((b) => b.id === blocoId)?.topicos ?? [];

  const resetForm = () => {
    setBlocoId(""); setTopicoId("");
    setFrente(""); setVerso(""); setDica(""); setErro("");
  };

  // ── Editar matéria ─────────────────────────────────────────────
  const abrirEditMateria = () => {
    if (!materia) return;
    setEditMateria({
      nome:      materia.nome,
      slug:      materia.slug,
      descricao: materia.descricao ?? "",
      icone:     materia.icone ?? "",
      cor:       materia.cor ?? "emerald",
    });
    setShowEditMateria(true);
    setErro("");
  };

  const salvarMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia) return;
    setErro(""); setSalvandoMateria(true);
    try {
      const res = await fetch(`/api/materias/${materia.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMateria),
      });
      if (!res.ok) { setErro((await res.json()).error ?? "Erro ao salvar."); return; }
      const updated = await res.json();
      setMateria((prev) => prev ? { ...prev, ...updated } : prev);
      setShowEditMateria(false);
      setSucesso("Matéria atualizada!"); setTimeout(() => setSucesso(""), 3000);
      if (updated.slug && updated.slug !== materia.slug) {
        window.location.href = `/admin/flashcards/${updated.slug}`;
      }
    } catch { setErro("Erro ao salvar."); }
    finally { setSalvandoMateria(false); }
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); setSucesso("");

    if (!topicoId)      return setErro("Selecione um tópico.");
    if (!frente.trim()) return setErro("Preencha a frente do card.");
    if (!verso.trim())  return setErro("Preencha o verso do card.");

    setSalvando(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frente: frente.trim(),
          verso: verso.trim(),
          dica: dica.trim() || null,
          topicoId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao salvar.");
      }
      if (materia) await carregarFlashcards(materia);
      setSucesso("Flashcard criado!");
      resetForm(); setShowForm(false);
      setTimeout(() => setSucesso(""), 3000);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  // ── Agrupamento por bloco → tópico ──────────────────────────
  const grupos = blocos
    .map((b) => ({
      bloco: b,
      topicos: b.topicos
        .map((t) => ({
          topico: t,
          fcs: flashcards.filter(
            (f) => f.topicoTitulo === t.titulo && f.blocoNome === b.nome
          ),
        }))
        .filter((g) => g.fcs.length > 0),
    }))
    .filter((g) => g.topicos.length > 0);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="text-white p-8">
      <div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <Link href="/admin/flashcards" className="hover:text-gray-300">Flashcards</Link>
              <span>›</span>
              <span className="text-gray-400">{materia?.nome ?? materiaSlug}</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              {materia?.icone && <span>{materia.icone}</span>}
              <span>
                {loading ? "…" : materia?.nome ?? materiaSlug}
                {" "}
                <span className="text-emerald-400">— Flashcards</span>
              </span>
            </h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-1">
                {flashcards.length} card{flashcards.length !== 1 ? "s" : ""} cadastrado{flashcards.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => showEditMateria ? setShowEditMateria(false) : abrirEditMateria()}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                showEditMateria
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30"
              }`}
            >
              {showEditMateria ? "✕ Fechar edição" : "✏️ Editar matéria"}
            </button>
            <button
              onClick={() => { setShowForm((v) => !v); setErro(""); }}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                showForm
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {showForm ? "✕ Cancelar" : "+ Novo flashcard"}
            </button>
          </div>
        </div>

        {/* ── Card de edição da matéria ── */}
        {showEditMateria && (
          <form onSubmit={salvarMateria} className="mb-6">
            <div className="bg-gray-900 border border-amber-500/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                ✏️ Editar matéria: <span className="text-amber-300">{materia?.nome}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={editMateria.nome}
                    onChange={(e) => setEditMateria((f) => ({ ...f, nome: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={editMateria.slug}
                    onChange={(e) => setEditMateria((f) => ({ ...f, slug: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ícone (emoji)</label>
                  <input
                    type="text"
                    value={editMateria.icone}
                    onChange={(e) => setEditMateria((f) => ({ ...f, icone: e.target.value }))}
                    placeholder="🏦"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Descrição</label>
                  <textarea
                    value={editMateria.descricao}
                    onChange={(e) => setEditMateria((f) => ({ ...f, descricao: e.target.value }))}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {CORES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditMateria((f) => ({ ...f, cor: c }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          editMateria.cor === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: `var(--color-${c}-500, #10b981)` }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {erro && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {erro}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={salvandoMateria}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {salvandoMateria ? "Salvando…" : "Salvar alterações"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditMateria(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Feedback */}
        {sucesso && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-300">
            ✓ {sucesso}
          </div>
        )}

        {/* ── Formulário ── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-5">
            <h2 className="text-base font-bold text-white">Novo flashcard</h2>

            {/* Cascata bloco → tópico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  label: "Bloco",
                  value: blocoId,
                  onChange: (v: string) => { setBlocoId(v); setTopicoId(""); },
                  options: blocos.map((b) => ({ value: b.id, label: b.nome })),
                  disabled: false,
                },
                {
                  label: "Tópico",
                  value: topicoId,
                  onChange: (v: string) => setTopicoId(v),
                  options: topicos.map((t) => ({ value: t.id, label: t.titulo })),
                  disabled: !blocoId,
                },
              ].map(({ label, value, onChange, options, disabled }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                  >
                    <option value="">Selecione…</option>
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Frente */}
            <div>
              <label className="block text-xs text-emerald-500 mb-1 font-medium">
                Frente <span className="text-red-400">*</span>
                <span className="text-gray-600 ml-1 font-normal">— a pergunta ou conceito</span>
              </label>
              <textarea
                value={frente}
                onChange={(e) => setFrente(e.target.value)}
                rows={2}
                placeholder="Ex: O que é o SPI e qual sua relação com o Pix?"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Verso */}
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Verso <span className="text-red-400">*</span>
                <span className="text-gray-600 ml-1 font-normal">— a resposta ou definição</span>
              </label>
              <textarea
                value={verso}
                onChange={(e) => setVerso(e.target.value)}
                rows={4}
                placeholder="Ex: O SPI é a infraestrutura tecnológica operada pelo Banco Central…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Dica */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Dica <span className="text-gray-600">(opcional)</span>
              </label>
              <input
                type="text"
                value={dica}
                onChange={(e) => setDica(e.target.value)}
                placeholder="Uma dica para ajudar a lembrar…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                ⚠ {erro}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={salvando}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? "Salvando…" : "Salvar flashcard"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* ── Lista hierárquica por bloco/tópico ── */}
        {loading ? (
          <div className="text-center py-16 text-gray-600 animate-pulse">Carregando flashcards…</div>
        ) : flashcards.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-4xl mb-4">🃏</div>
            <p>Nenhum flashcard cadastrado para esta matéria.</p>
            <p className="text-xs mt-2 text-gray-700">
              Use o botão acima para criar o primeiro flashcard.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {grupos.map(({ bloco: b, topicos: gTopicos }, bi) => {
              const totalBloco = gTopicos.reduce((a, t) => a + t.fcs.length, 0);
              return (
                <div key={b.id} className="pl-4 border-l-2 border-gray-800">
                  {/* Cabeçalho do Bloco */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold bg-gray-800 text-gray-400 rounded px-1.5 py-0.5">
                      {String(bi + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-200">{b.nome}</h3>
                    <span className="text-xs text-gray-600">{totalBloco} cards</span>
                  </div>

                  <div className="space-y-5">
                    {gTopicos.map(({ topico: t, fcs }, ti) => (
                      <div key={t.id} className="pl-4 border-l border-gray-800/60">
                        {/* Cabeçalho do Tópico */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-mono text-gray-600">{bi + 1}.{ti + 1}</span>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.titulo}</h4>
                          <span className="text-xs text-gray-700">{fcs.length} card{fcs.length !== 1 ? "s" : ""}</span>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fcs.map((fc, idx) => (
                            <div key={fc.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                              <div className="bg-gray-800/50 px-3 py-1.5 border-b border-gray-800">
                                <span className="text-xs text-gray-600 font-mono">#{idx + 1}</span>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <div className="text-xs text-emerald-500 uppercase tracking-wider mb-1 font-medium">Frente</div>
                                  <p className="text-sm text-white leading-relaxed">{fc.frente}</p>
                                </div>
                                <div className="border-t border-gray-800 pt-3">
                                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Verso</div>
                                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{fc.verso}</p>
                                </div>
                                {fc.dica && (
                                  <div className="text-xs text-amber-400 italic">💡 {fc.dica}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
