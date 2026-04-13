"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";

type Opcao   = { id: string; texto: string; correta: boolean; ordem: number };
type Quiz    = {
  id: string;
  pergunta: string;
  explicacao: string | null;
  dificuldade: Dificuldade;
  tags: string | null;
  opcoes: Opcao[];
  topicoTitulo?: string;
  blocoNome?: string;
};
type Topico  = { id: string; titulo: string; slug: string };
type Bloco   = { id: string; nome: string; topicos: Topico[] };
type Materia = { id: string; nome: string; slug: string; icone: string | null; cor: string | null; descricao: string | null; blocos: Bloco[] };

const LETRAS  = ["A", "B", "C", "D"];
const CORES   = ["emerald", "teal", "blue", "violet", "rose", "amber", "cyan"];
const novaOpcao = () => ({ texto: "", correta: false });

const DIFICULDADE_META: Record<Dificuldade, { label: string; cls: string; dot: string }> = {
  FACIL:   { label: "Fácil",  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  MEDIO:   { label: "Médio",  cls: "bg-amber-500/15   text-amber-400   border-amber-500/30",   dot: "bg-amber-400"   },
  DIFICIL: { label: "Difícil",cls: "bg-red-500/15     text-red-400     border-red-500/30",     dot: "bg-red-400"     },
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function AdminQuizMateriaPage() {
  const { materiaSlug } = useParams<{ materiaSlug: string }>();

  const [materia, setMateria]   = useState<Materia | null>(null);
  const [quizzes, setQuizzes]   = useState<Quiz[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]         = useState("");
  const [sucesso, setSucesso]   = useState("");

  // Filtros
  const [filtroNivel, setFiltroNivel]   = useState<Dificuldade | "TODAS">("TODAS");
  const [filtroTag, setFiltroTag]       = useState("");

  // Edição da matéria
  const [showEditMateria, setShowEditMateria] = useState(false);
  const [editMateria, setEditMateria]         = useState({ nome: "", slug: "", descricao: "", icone: "", cor: "" });
  const [salvandoMateria, setSalvandoMateria] = useState(false);

  // Edição/exclusão de quiz
  const [editingQuizId, setEditingQuizId]     = useState<string | null>(null);
  const [editQuiz, setEditQuiz]               = useState({
    pergunta: "", explicacao: "", dificuldade: "MEDIO" as Dificuldade, tags: "",
    opcoes: [{ texto: "", correta: false }, { texto: "", correta: false }, { texto: "", correta: false }, { texto: "", correta: false }],
  });
  const [salvandoQuiz, setSalvandoQuiz]       = useState(false);
  const [deletandoQuizId, setDeletandoQuizId] = useState<string | null>(null);

  // Seletores cascata
  const [blocoId, setBlocoId]   = useState("");
  const [topicoId, setTopicoId] = useState("");

  // Campos do novo formulário
  const [pergunta, setPergunta]         = useState("");
  const [explicacao, setExplicacao]     = useState("");
  const [dificuldade, setDificuldade]   = useState<Dificuldade>("MEDIO");
  const [tags, setTags]                 = useState("");
  const [opcoes, setOpcoes]             = useState([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);

  // ── Carregamento ──────────────────────────────────────────────
  const carregarQuizzes = async (mat: Materia) => {
    const all: Quiz[] = [];
    for (const b of mat.blocos) {
      for (const t of b.topicos) {
        const r = await fetch(`/api/quiz?topicoId=${t.id}`);
        const qs: Quiz[] = await r.json();
        qs.forEach((q) => all.push({ ...q, topicoTitulo: t.titulo, blocoNome: b.nome }));
      }
    }
    setQuizzes(all);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/materias?tree=true");
        const mats: Materia[] = await res.json();
        const mat = mats.find((m) => m.slug === materiaSlug) ?? null;
        setMateria(mat);
        if (mat) await carregarQuizzes(mat);
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiaSlug]);

  // ── Derivados ─────────────────────────────────────────────────
  const topicosDoBloco = materia?.blocos.find((b) => b.id === blocoId)?.topicos ?? [];

  // Todas as tags únicas do conjunto
  const allTags = useMemo(() => {
    const set = new Set<string>();
    quizzes.forEach((q) => parseTags(q.tags).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [quizzes]);

  // Quizzes filtrados
  const quizzesFiltrados = useMemo(() => {
    return quizzes.filter((q) => {
      if (filtroNivel !== "TODAS" && q.dificuldade !== filtroNivel) return false;
      if (filtroTag && !parseTags(q.tags).includes(filtroTag)) return false;
      return true;
    });
  }, [quizzes, filtroNivel, filtroTag]);

  const resetForm = () => {
    setBlocoId(""); setTopicoId("");
    setPergunta(""); setExplicacao("");
    setDificuldade("MEDIO"); setTags("");
    setOpcoes([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);
    setErro("");
  };

  const setTextoOpcao = (i: number, texto: string) =>
    setOpcoes((p) => p.map((o, idx) => (idx === i ? { ...o, texto } : o)));
  const marcarCorreta = (i: number) =>
    setOpcoes((p) => p.map((o, idx) => ({ ...o, correta: idx === i })));

  // ── Editar matéria ─────────────────────────────────────────────
  const abrirEditMateria = () => {
    if (!materia) return;
    setEditMateria({
      nome: materia.nome, slug: materia.slug,
      descricao: materia.descricao ?? "", icone: materia.icone ?? "",
      cor: materia.cor ?? "emerald",
    });
    setShowEditMateria(true); setErro("");
  };

  const salvarMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia) return;
    setErro(""); setSalvandoMateria(true);
    try {
      const res = await fetch(`/api/materias/${materia.slug}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMateria),
      });
      if (!res.ok) { setErro((await res.json()).error ?? "Erro ao salvar."); return; }
      const updated = await res.json();
      setMateria((prev) => prev ? { ...prev, ...updated } : prev);
      setShowEditMateria(false);
      setSucesso("Matéria atualizada!"); setTimeout(() => setSucesso(""), 3000);
      if (updated.slug && updated.slug !== materia.slug) {
        window.location.href = `/admin/quiz/${updated.slug}`;
      }
    } catch { setErro("Erro ao salvar."); }
    finally { setSalvandoMateria(false); }
  };

  // ── Editar quiz ───────────────────────────────────────────────
  const abrirEditQuiz = (quiz: Quiz) => {
    const ops = [...quiz.opcoes].sort((a, b) => a.ordem - b.ordem);
    while (ops.length < 4) ops.push({ id: "", texto: "", correta: false, ordem: ops.length });
    setEditQuiz({
      pergunta:    quiz.pergunta,
      explicacao:  quiz.explicacao ?? "",
      dificuldade: quiz.dificuldade ?? "MEDIO",
      tags:        parseTags(quiz.tags).join(", "),
      opcoes:      ops.map((o) => ({ texto: o.texto, correta: o.correta })),
    });
    setEditingQuizId(quiz.id);
  };

  const salvarQuiz = async (e: React.FormEvent, quizId: string) => {
    e.preventDefault();
    const validas = editQuiz.opcoes.filter((o) => o.texto.trim());
    if (validas.length < 2) return setErro("Preencha pelo menos 2 opções.");
    if (!validas.some((o) => o.correta)) return setErro("Marque a resposta correta.");
    setSalvandoQuiz(true); setErro("");
    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta:    editQuiz.pergunta,
          explicacao:  editQuiz.explicacao || null,
          dificuldade: editQuiz.dificuldade,
          tags:        editQuiz.tags || null,
          opcoes:      validas.map((o, i) => ({ texto: o.texto.trim(), correta: o.correta, ordem: i })),
        }),
      });
      if (!res.ok) { setErro((await res.json()).error ?? "Erro"); return; }
      const updated = await res.json();
      setQuizzes((prev) => prev.map((q) => q.id === quizId ? { ...q, ...updated } : q));
      setEditingQuizId(null);
      setSucesso("Questão atualizada!"); setTimeout(() => setSucesso(""), 3000);
    } catch { setErro("Erro ao salvar."); }
    finally { setSalvandoQuiz(false); }
  };

  const deletarQuiz = async (quizId: string) => {
    if (!confirm("Excluir esta questão? Essa ação não pode ser desfeita.")) return;
    setDeletandoQuizId(quizId);
    try {
      await fetch(`/api/quiz/${quizId}`, { method: "DELETE" });
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      setSucesso("Questão excluída!"); setTimeout(() => setSucesso(""), 3000);
    } finally { setDeletandoQuizId(null); }
  };

  // ── Submit nova questão ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); setSucesso("");
    if (!topicoId)          return setErro("Selecione um tópico.");
    if (!pergunta.trim())   return setErro("Digite a pergunta.");
    const validas = opcoes.filter((o) => o.texto.trim());
    if (validas.length < 2) return setErro("Preencha pelo menos 2 opções.");
    if (!validas.some((o) => o.correta)) return setErro("Marque a resposta correta.");

    setSalvando(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: pergunta.trim(),
          explicacao: explicacao.trim() || null,
          dificuldade,
          tags: tags.trim() || null,
          topicoId,
          opcoes: validas.map((o, i) => ({ texto: o.texto.trim(), correta: o.correta, ordem: i })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao salvar.");

      const bloco  = materia!.blocos.find((b) => b.id === blocoId)!;
      const topico = bloco.topicos.find((t) => t.id === topicoId)!;
      const r = await fetch(`/api/quiz?topicoId=${topicoId}`);
      const novos: Quiz[] = (await r.json()).map((q: Quiz) => ({ ...q, topicoTitulo: topico.titulo, blocoNome: bloco.nome }));
      setQuizzes((prev) => [
        ...prev.filter((q) => !(q.topicoTitulo === topico.titulo && q.blocoNome === bloco.nome)),
        ...novos,
      ]);
      setSucesso("Questão criada com sucesso!");
      resetForm(); setShowForm(false);
      setTimeout(() => setSucesso(""), 3000);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  // ── Agrupamento hierárquico ───────────────────────────────────
  const grupos = (materia?.blocos ?? [])
    .map((b, bi) => ({
      bloco: b, bi,
      topicos: b.topicos
        .map((t, ti) => ({
          topico: t, ti,
          qs: quizzesFiltrados.filter((q) => q.topicoTitulo === t.titulo && q.blocoNome === b.nome),
        }))
        .filter((g) => g.qs.length > 0),
    }))
    .filter((g) => g.topicos.length > 0);

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-600 animate-pulse">
      Carregando…
    </div>
  );

  if (!materia) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Matéria não encontrada.{" "}
      <Link href="/admin/quiz" className="text-emerald-400 ml-2 hover:underline">Voltar</Link>
    </div>
  );

  const totalQuizzes = quizzes.length;
  const contPorNivel = {
    FACIL:   quizzes.filter((q) => q.dificuldade === "FACIL").length,
    MEDIO:   quizzes.filter((q) => q.dificuldade === "MEDIO").length,
    DIFICIL: quizzes.filter((q) => q.dificuldade === "DIFICIL").length,
  };

  return (
    <div className="text-white p-8">
      <div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <Link href="/admin/quiz" className="hover:text-gray-300">Questões</Link>
              <span>›</span>
              <span className="text-gray-400">{materia.nome}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              {materia.icone && <span className="text-3xl">{materia.icone}</span>}
              <div>
                <h1 className="text-2xl font-black text-white">{materia.nome}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalQuizzes} questões · {materia.blocos.length} blocos · {materia.blocos.reduce((a, b) => a + b.topicos.length, 0)} tópicos
                </p>
              </div>
            </div>
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
                showForm ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {showForm ? "✕ Cancelar" : "+ Nova questão"}
            </button>
          </div>
        </div>

        {/* ── Card de edição da matéria ── */}
        {showEditMateria && (
          <form onSubmit={salvarMateria} className="mb-8">
            <div className="bg-gray-900 border border-amber-500/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                ✏️ Editar matéria: <span className="text-amber-300">{materia.nome}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nome *</label>
                  <input type="text" value={editMateria.nome} required
                    onChange={(e) => setEditMateria((f) => ({ ...f, nome: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                  <input type="text" value={editMateria.slug} required
                    onChange={(e) => setEditMateria((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ícone (emoji)</label>
                  <input type="text" value={editMateria.icone} placeholder="🏦"
                    onChange={(e) => setEditMateria((f) => ({ ...f, icone: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Descrição</label>
                  <textarea value={editMateria.descricao} rows={2}
                    onChange={(e) => setEditMateria((f) => ({ ...f, descricao: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {CORES.map((c) => (
                      <button key={c} type="button"
                        onClick={() => setEditMateria((f) => ({ ...f, cor: c }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${editMateria.cor === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                        style={{ backgroundColor: `var(--color-${c}-500, #10b981)` }} title={c} />
                    ))}
                  </div>
                </div>
              </div>
              {erro && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {erro}</p>}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={salvandoMateria}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-50">
                  {salvandoMateria ? "Salvando…" : "Salvar alterações"}
                </button>
                <button type="button" onClick={() => setShowEditMateria(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-xl transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="border-t border-gray-800 mb-6" />

        {/* Feedback */}
        {sucesso && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-300">
            ✓ {sucesso}
          </div>
        )}

        {/* ── Formulário nova questão ── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-5">
            <h2 className="text-base font-bold text-white">Nova questão — {materia.nome}</h2>

            {/* Bloco → Tópico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bloco</label>
                <select value={blocoId}
                  onChange={(e) => { setBlocoId(e.target.value); setTopicoId(""); }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Selecione…</option>
                  {materia.blocos.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tópico</label>
                <select value={topicoId} onChange={(e) => setTopicoId(e.target.value)} disabled={!blocoId}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40">
                  <option value="">Selecione…</option>
                  {topicosDoBloco.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              </div>
            </div>

            {/* Pergunta */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Pergunta <span className="text-red-400">*</span></label>
              <textarea value={pergunta} onChange={(e) => setPergunta(e.target.value)} rows={3}
                placeholder="Digite a pergunta…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none" />
            </div>

            {/* Opções */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Opções <span className="text-red-400">*</span>
                <span className="text-gray-600 ml-1">— clique na letra para marcar a correta</span>
              </label>
              <div className="space-y-2">
                {opcoes.map((opcao, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button type="button" onClick={() => marcarCorreta(i)}
                      className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        opcao.correta
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-600 text-gray-500 hover:border-emerald-500/60 hover:text-gray-300"
                      }`}>
                      {LETRAS[i]}
                    </button>
                    <input type="text" value={opcao.texto} onChange={(e) => setTextoOpcao(i, e.target.value)}
                      placeholder={`Opção ${LETRAS[i]}…`}
                      className={`flex-1 bg-gray-800 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                        opcao.correta ? "border-emerald-500/50 focus:border-emerald-500" : "border-gray-700 focus:border-gray-500"
                      }`} />
                    {opcao.correta && <span className="text-xs text-emerald-400 shrink-0 font-medium">✓ correta</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Dificuldade + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Dificuldade</label>
                <div className="flex gap-2">
                  {(["FACIL", "MEDIO", "DIFICIL"] as Dificuldade[]).map((d) => (
                    <button key={d} type="button" onClick={() => setDificuldade(d)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        dificuldade === d
                          ? DIFICULDADE_META[d].cls + " scale-105"
                          : "border-gray-700 text-gray-600 hover:border-gray-600 hover:text-gray-400"
                      }`}>
                      {DIFICULDADE_META[d].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tags <span className="text-gray-600">(separadas por vírgula)</span>
                </label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="SFN, Regulação, Mercado…"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            {/* Explicação */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Explicação <span className="text-gray-600">(opcional)</span></label>
              <textarea value={explicacao} onChange={(e) => setExplicacao(e.target.value)} rows={2}
                placeholder="Explique o porquê da resposta correta…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none" />
            </div>

            {erro && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">⚠ {erro}</p>}

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={salvando}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {salvando ? "Salvando…" : "Salvar questão"}
              </button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-xl transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* ── Barra de filtros ── */}
        {quizzes.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            {/* Resumo por dificuldade */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-600">Filtrar:</span>
              {(["TODAS", "FACIL", "MEDIO", "DIFICIL"] as const).map((d) => {
                const count = d === "TODAS" ? totalQuizzes : contPorNivel[d];
                const active = filtroNivel === d;
                const meta   = d !== "TODAS" ? DIFICULDADE_META[d] : null;
                return (
                  <button key={d} onClick={() => setFiltroNivel(d)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      active
                        ? (meta ? meta.cls : "bg-gray-700 text-white border-gray-600")
                        : "bg-gray-800 text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300"
                    }`}>
                    {meta && <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />}
                    {d === "TODAS" ? "Todas" : meta!.label}
                    <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Filtro por tag */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-600">Tag:</span>
                <select value={filtroTag} onChange={(e) => setFiltroTag(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Todas</option>
                  {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* Indicador de filtro ativo */}
            {(filtroNivel !== "TODAS" || filtroTag) && (
              <button onClick={() => { setFiltroNivel("TODAS"); setFiltroTag(""); }}
                className="text-xs text-gray-500 hover:text-white transition-colors ml-1">
                ✕ Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* ── Lista hierárquica ── */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-4xl mb-4">🧠</div>
            <p>Nenhuma questão cadastrada para esta matéria.</p>
            <p className="text-xs mt-2 text-gray-700">Use o botão acima para criar a primeira questão.</p>
          </div>
        ) : grupos.length === 0 ? (
          <div className="text-center py-10 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            <p>Nenhuma questão corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grupos.map(({ bloco: b, bi, topicos: gTopicos }) => (
              <div key={b.id} className="pl-4 border-l-2 border-gray-800">
                {/* Bloco */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono font-bold bg-gray-800 text-gray-400 rounded px-1.5 py-0.5">
                    {String(bi + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-300">{b.nome}</h3>
                  <span className="text-xs text-gray-600">
                    {gTopicos.reduce((a, t) => a + t.qs.length, 0)} questões
                  </span>
                </div>

                <div className="space-y-5">
                  {gTopicos.map(({ topico: t, ti, qs }) => (
                    <div key={t.id} className="pl-4 border-l border-gray-800/60">
                      {/* Tópico */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-mono text-gray-600">{bi + 1}.{ti + 1}</span>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.titulo}</h4>
                        <span className="text-xs text-gray-700">{qs.length} questão{qs.length !== 1 ? "s" : ""}</span>
                      </div>

                      <div className="space-y-2">
                        {qs.map((quiz, qi) => (
                          <div key={quiz.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                            {editingQuizId === quiz.id ? (
                              /* ── Formulário de edição inline ── */
                              <form onSubmit={(e) => salvarQuiz(e, quiz.id)} className="p-4 space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Pergunta *</label>
                                  <textarea value={editQuiz.pergunta} required rows={2}
                                    onChange={(e) => setEditQuiz((f) => ({ ...f, pergunta: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none" />
                                </div>

                                {/* Opções */}
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Opções — clique no círculo para marcar a correta</label>
                                  <div className="space-y-1.5">
                                    {editQuiz.opcoes.map((op, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <button type="button"
                                          onClick={() => setEditQuiz((f) => ({ ...f, opcoes: f.opcoes.map((o, j) => ({ ...o, correta: j === i })) }))}
                                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${op.correta ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-600 text-gray-500 hover:border-emerald-500/60"}`}>
                                          {LETRAS[i]}
                                        </button>
                                        <input type="text" value={op.texto} placeholder={`Opção ${LETRAS[i]}`}
                                          onChange={(e) => setEditQuiz((f) => ({ ...f, opcoes: f.opcoes.map((o, j) => j === i ? { ...o, texto: e.target.value } : o) }))}
                                          className={`flex-1 bg-gray-800 border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none transition-colors ${op.correta ? "border-emerald-500/50" : "border-gray-700 focus:border-gray-500"}`} />
                                        {op.correta && <span className="text-xs text-emerald-400 shrink-0">✓</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Dificuldade + Tags na edição */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Dificuldade</label>
                                    <div className="flex gap-2">
                                      {(["FACIL", "MEDIO", "DIFICIL"] as Dificuldade[]).map((d) => (
                                        <button key={d} type="button"
                                          onClick={() => setEditQuiz((f) => ({ ...f, dificuldade: d }))}
                                          className={`flex-1 py-1 rounded-md border text-[11px] font-semibold transition-all ${
                                            editQuiz.dificuldade === d
                                              ? DIFICULDADE_META[d].cls
                                              : "border-gray-700 text-gray-600 hover:text-gray-400"
                                          }`}>
                                          {DIFICULDADE_META[d].label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tags <span className="text-gray-600">(separadas por vírgula)</span></label>
                                    <input type="text" value={editQuiz.tags} placeholder="SFN, Regulação…"
                                      onChange={(e) => setEditQuiz((f) => ({ ...f, tags: e.target.value }))}
                                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Explicação (opcional)</label>
                                  <textarea value={editQuiz.explicacao} rows={2}
                                    onChange={(e) => setEditQuiz((f) => ({ ...f, explicacao: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none" />
                                </div>

                                {erro && <p className="text-xs text-red-400">⚠ {erro}</p>}
                                <div className="flex gap-2">
                                  <button type="submit" disabled={salvandoQuiz}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                                    {salvandoQuiz ? "Salvando…" : "Salvar"}
                                  </button>
                                  <button type="button" onClick={() => setEditingQuizId(null)}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-4 py-1.5 rounded-lg transition-colors">
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            ) : (
                              /* ── Visualização normal ── */
                              <>
                                <div className="flex items-start gap-3 px-4 pt-4 pb-2">
                                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{qi + 1}</span>
                                  <p className="text-sm font-medium text-white leading-relaxed flex-1">{quiz.pergunta}</p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* Badge de dificuldade */}
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFICULDADE_META[quiz.dificuldade ?? "MEDIO"].cls}`}>
                                      {DIFICULDADE_META[quiz.dificuldade ?? "MEDIO"].label}
                                    </span>
                                    <button onClick={() => abrirEditQuiz(quiz)}
                                      className="text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors">
                                      ✏️
                                    </button>
                                    <button onClick={() => deletarQuiz(quiz.id)} disabled={deletandoQuizId === quiz.id}
                                      className="text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 bg-gray-800 px-2 py-1 rounded-lg transition-colors disabled:opacity-40">
                                      {deletandoQuizId === quiz.id ? "…" : "🗑"}
                                    </button>
                                  </div>
                                </div>

                                {/* Tags */}
                                {parseTags(quiz.tags).length > 0 && (
                                  <div className="px-4 pb-2 flex flex-wrap gap-1">
                                    {parseTags(quiz.tags).map((tag) => (
                                      <button key={tag} onClick={() => setFiltroTag(tag === filtroTag ? "" : tag)}
                                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                          filtroTag === tag
                                            ? "bg-teal-500/20 border-teal-500/50 text-teal-300"
                                            : "bg-gray-800 border-gray-700 text-gray-500 hover:border-teal-500/40 hover:text-teal-400"
                                        }`}>
                                        #{tag}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                <div className="px-4 pb-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                  {quiz.opcoes.sort((a, b) => a.ordem - b.ordem).map((o, oi) => (
                                    <div key={o.id}
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${o.correta ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-gray-800 text-gray-500"}`}>
                                      <span className="font-mono shrink-0 text-gray-600">{LETRAS[oi]}</span>
                                      <span>{o.texto}</span>
                                      {o.correta && <span className="ml-auto font-medium">✓</span>}
                                    </div>
                                  ))}
                                </div>
                                {quiz.explicacao && (
                                  <div className="px-4 pb-3 text-xs text-amber-400/80 italic border-t border-gray-800 pt-2">
                                    💡 {quiz.explicacao}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
