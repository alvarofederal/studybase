"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Materia = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
  _count?: { blocos: number };
};

const CORES = ["emerald", "teal", "blue", "violet", "rose", "amber", "cyan"];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function AdminMateriasPage() {
  const [materias, setMaterias]   = useState<Materia[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState("");
  const [sucesso, setSucesso]     = useState("");

  const emptyForm = { nome: "", slug: "", descricao: "", icone: "", cor: "emerald" };
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const fetchMaterias = async () => {
    const res = await fetch("/api/materias");
    setMaterias(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchMaterias(); }, []);

  const flash = (msg: string) => {
    setSucesso(msg); setTimeout(() => setSucesso(""), 3000);
  };

  // ── Criar ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); setSalvando(true);
    try {
      const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return setErro((await res.json()).error ?? "Erro ao criar.");
      setForm(emptyForm);
      setShowForm(false);
      await fetchMaterias();
      flash("Matéria criada!");
    } finally { setSalvando(false); }
  };

  // ── Editar ────────────────────────────────────────────────────
  const startEdit = (m: Materia) => {
    setEditingId(m.id);
    setEditForm({ nome: m.nome, slug: m.slug, descricao: m.descricao ?? "", icone: m.icone ?? "", cor: m.cor ?? "emerald" });
    setErro("");
  };

  const handleEdit = async (e: React.FormEvent, slug: string) => {
    e.preventDefault();
    setErro(""); setSalvando(true);
    try {
      const res = await fetch(`/api/materias/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) return setErro((await res.json()).error ?? "Erro ao salvar.");
      setEditingId(null);
      await fetchMaterias();
      flash("Matéria atualizada!");
    } finally { setSalvando(false); }
  };

  const CoresSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 flex-wrap">
      {CORES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            value === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: `var(--color-${c}-500, #10b981)` }}
          title={c}
        />
      ))}
    </div>
  );

  return (
    <div className="text-white p-8">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <span>Matérias</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Matérias</h1>
          </div>
          <div className="flex items-center gap-3">
            {sucesso && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                ✓ {sucesso}
              </span>
            )}
            <button
              onClick={() => { setShowForm(!showForm); setErro(""); }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                showForm ? "bg-gray-800 text-gray-400" : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {showForm ? "✕ Cancelar" : "+ Nova Matéria"}
            </button>
          </div>
        </div>

        {/* Form nova matéria */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-bold mb-5">Nova Matéria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nome *</label>
                <input type="text" value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value, slug: slugify(e.target.value) }))}
                  required placeholder="ex: Atualidades do Mercado Financeiro"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                <input type="text" value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Descrição</label>
                <textarea value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ícone (emoji)</label>
                <input type="text" value={form.icone}
                  onChange={(e) => setForm((f) => ({ ...f, icone: e.target.value }))}
                  placeholder="🏦"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Cor</label>
                <CoresSelect value={form.cor} onChange={(c) => setForm((f) => ({ ...f, cor: c }))} />
              </div>
            </div>
            {erro && <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {erro}</p>}
            <div className="mt-5">
              <button type="submit" disabled={salvando}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {salvando ? "Criando…" : "Criar Matéria"}
              </button>
            </div>
          </form>
        )}

        {/* Lista */}
        {loading ? (
          <div className="text-gray-500 text-center py-12 animate-pulse">Carregando...</div>
        ) : materias.length === 0 ? (
          <div className="text-gray-500 text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            Nenhuma matéria cadastrada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {materias.map((m) => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">

                {editingId === m.id ? (
                  /* ── Form de edição inline ── */
                  <form onSubmit={(e) => handleEdit(e, m.slug)} className="p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      ✏️ Editando: <span className="text-emerald-400">{m.nome}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Nome *</label>
                        <input type="text" value={editForm.nome}
                          onChange={(e) => setEditForm((f) => ({ ...f, nome: e.target.value }))}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                        <input type="text" value={editForm.slug}
                          onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Descrição</label>
                        <textarea value={editForm.descricao}
                          onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Ícone (emoji)</label>
                        <input type="text" value={editForm.icone}
                          onChange={(e) => setEditForm((f) => ({ ...f, icone: e.target.value }))}
                          placeholder="🏦"
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Cor</label>
                        <CoresSelect value={editForm.cor} onChange={(c) => setEditForm((f) => ({ ...f, cor: c }))} />
                      </div>
                    </div>
                    {erro && <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {erro}</p>}
                    <div className="mt-5 flex gap-3">
                      <button type="submit" disabled={salvando}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {salvando ? "Salvando…" : "Salvar alterações"}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ── Card normal ── */
                  <>
                    <div className="flex items-start justify-between gap-4 px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{m.icone || "📚"}</span>
                        <div>
                          <p className="font-semibold text-white text-base">{m.nome}</p>
                          {m.descricao && <p className="text-xs text-gray-500 mt-0.5 max-w-lg">{m.descricao}</p>}
                          <p className="text-xs text-gray-600 font-mono mt-1">/estudo/{m.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">
                          {m._count?.blocos ?? 0} blocos
                        </span>
                        <button
                          onClick={() => startEdit(m)}
                          className="text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <Link href={`/estudo/${m.slug}`} target="_blank"
                          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          ↗ Ver
                        </Link>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-3 px-6 py-3 border-t border-gray-800 bg-gray-900/30">
                      <Link href={`/admin/materias/${m.slug}`}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        📦 Blocos & Tópicos
                      </Link>
                      <Link href={`/admin/quiz/${m.slug}`}
                        className="flex items-center gap-1.5 text-xs text-violet-300 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🧠 Quiz
                      </Link>
                      <Link href={`/admin/flashcards/${m.slug}`}
                        className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🃏 Flashcards
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
