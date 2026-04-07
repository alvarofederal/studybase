"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Tipos ─────────────────────────────────────────────────────
type Opcao   = { id?: string; texto: string; correta: boolean };
type Quiz    = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[] };
type Flashcard = { id: string; frente: string; verso: string; dica: string | null };
type Topico  = { id: string; titulo: string; slug: string; resumo: string | null; conteudo: string; ordem: number };
type Bloco   = { id: string; nome: string; slug: string; descricao: string | null; ordem: number; _count?: { topicos: number } };
type Materia = { id: string; nome: string; slug: string; icone: string | null; blocos: Bloco[] };

const LETRAS = ["A", "B", "C", "D"];
const novaOpcao = (): Opcao => ({ texto: "", correta: false });

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

// ── Componente principal ──────────────────────────────────────
export default function MateriaDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Estado geral
  const [materia, setMateria]       = useState<Materia | null>(null);
  const [blocos, setBlocos]         = useState<Bloco[]>([]);
  const [topicos, setTopicos]       = useState<Topico[]>([]);
  const [quizzes, setQuizzes]       = useState<Quiz[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  // Seleção
  const [blocoSel, setBlocoSel]   = useState<Bloco | null>(null);
  const [topicoSel, setTopicoSel] = useState<Topico | null>(null);

  // Loading
  const [loadingBase, setLoadingBase]   = useState(true);
  const [loadingTop, setLoadingTop]     = useState(false);
  const [loadingConteudo, setLoadingConteudo] = useState(false);

  // Formulários visíveis
  const [showFormBloco,    setShowFormBloco]    = useState(false);
  const [showFormTopico,   setShowFormTopico]   = useState(false);
  const [showFormQuiz,     setShowFormQuiz]     = useState(false);
  const [showFormFlash,    setShowFormFlash]    = useState(false);

  // Form: Bloco
  const [formBloco, setFormBloco] = useState({ nome: "", slug: "", descricao: "" });

  // Form: Tópico
  const [formTop, setFormTop] = useState({ titulo: "", slug: "", resumo: "", conteudo: "" });

  // Form: Quiz
  const [pergunta, setPergunta]     = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [opcoes, setOpcoes]         = useState<Opcao[]>([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);

  // Form: Flashcard
  const [frente, setFrente] = useState("");
  const [verso, setVerso]   = useState("");
  const [dica, setDica]     = useState("");

  // Feedback
  const [erro, setErro]       = useState("");
  const [sucesso, setSucesso] = useState("");

  // ── Carregamento base ─────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoadingBase(true);
      try {
        // Matéria
        const resMat = await fetch(`/api/materias?tree=true`);
        const mats: Materia[] = await resMat.json();
        const mat = mats.find((m) => m.slug === slug);
        if (!mat) return;
        setMateria(mat);

        // Blocos
        const resBl = await fetch(`/api/blocos?materiaId=${mat.id}`);
        setBlocos(await resBl.json());
      } finally {
        setLoadingBase(false);
      }
    };
    init();
  }, [slug]);

  // ── Selecionar bloco → carrega tópicos ───────────────────
  const selecionarBloco = useCallback(async (b: Bloco) => {
    setBlocoSel(b);
    setTopicoSel(null);
    setTopicos([]);
    setQuizzes([]);
    setFlashcards([]);
    setShowFormTopico(false);
    setShowFormQuiz(false);
    setShowFormFlash(false);
    setLoadingTop(true);
    try {
      const r = await fetch(`/api/topicos?blocoId=${b.id}`);
      setTopicos(await r.json());
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // ── Selecionar tópico → carrega quiz + flashcards ────────
  const selecionarTopico = useCallback(async (t: Topico) => {
    setTopicoSel(t);
    setShowFormQuiz(false);
    setShowFormFlash(false);
    setLoadingConteudo(true);
    try {
      const [rQ, rF] = await Promise.all([
        fetch(`/api/quiz?topicoId=${t.id}`),
        fetch(`/api/flashcards?topicoId=${t.id}`),
      ]);
      setQuizzes(await rQ.json());
      setFlashcards(await rF.json());
    } finally {
      setLoadingConteudo(false);
    }
  }, []);

  // ── Feedback temporário ───────────────────────────────────
  const flash = (msg: string) => {
    setSucesso(msg);
    setTimeout(() => setSucesso(""), 3000);
  };

  // ── Criar bloco ───────────────────────────────────────────
  const criarBloco = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!materia) return;
    const res = await fetch("/api/blocos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formBloco, ordem: blocos.length, materiaId: materia.id }),
    });
    if (!res.ok) return setErro((await res.json()).error ?? "Erro");
    const resBl = await fetch(`/api/blocos?materiaId=${materia.id}`);
    setBlocos(await resBl.json());
    setFormBloco({ nome: "", slug: "", descricao: "" });
    setShowFormBloco(false);
    flash("Bloco criado!");
  };

  // ── Criar tópico ──────────────────────────────────────────
  const criarTopico = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!blocoSel) return;
    const res = await fetch("/api/topicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formTop, ordem: topicos.length, blocoId: blocoSel.id }),
    });
    if (!res.ok) return setErro((await res.json()).error ?? "Erro");
    const r = await fetch(`/api/topicos?blocoId=${blocoSel.id}`);
    setTopicos(await r.json());
    setFormTop({ titulo: "", slug: "", resumo: "", conteudo: "" });
    setShowFormTopico(false);
    flash("Tópico criado!");
  };

  // ── Criar quiz ────────────────────────────────────────────
  const criarQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!topicoSel) return;
    if (!opcoes.some((o) => o.correta)) return setErro("Marque pelo menos uma opção como correta.");
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, explicacao, topicoId: topicoSel.id, opcoes }),
    });
    if (!res.ok) return setErro((await res.json()).error ?? "Erro");
    const r = await fetch(`/api/quiz?topicoId=${topicoSel.id}`);
    setQuizzes(await r.json());
    setPergunta(""); setExplicacao(""); setOpcoes([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);
    setShowFormQuiz(false);
    flash("Questão criada!");
  };

  // ── Criar flashcard ───────────────────────────────────────
  const criarFlash = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!topicoSel) return;
    const res = await fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frente, verso, dica: dica || null, topicoId: topicoSel.id }),
    });
    if (!res.ok) return setErro((await res.json()).error ?? "Erro");
    const r = await fetch(`/api/flashcards?topicoId=${topicoSel.id}`);
    setFlashcards(await r.json());
    setFrente(""); setVerso(""); setDica("");
    setShowFormFlash(false);
    flash("Flashcard criado!");
  };

  if (loadingBase) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-sm animate-pulse">
        Carregando…
      </div>
    );
  }

  if (!materia) {
    return (
      <div className="p-8 text-gray-400">
        Matéria não encontrada.{" "}
        <Link href="/admin/materias" className="text-emerald-400 hover:underline">Voltar</Link>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{materia.icone ?? "📚"}</span>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <Link href="/admin/materias" className="hover:text-gray-300">Matérias</Link>
              <span>›</span>
              <span className="text-gray-300">{materia.nome}</span>
            </div>
            <h1 className="text-lg font-bold text-white leading-none">{materia.nome}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sucesso && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              ✓ {sucesso}
            </span>
          )}
          {erro && (
            <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              ⚠ {erro}
            </span>
          )}
          <Link
            href={`/admin/quiz/${materia.slug}`}
            className="text-xs px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors"
          >
            🧠 Quiz
          </Link>
          <Link
            href={`/admin/flashcards/${materia.slug}`}
            className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
          >
            🃏 Flashcards
          </Link>
          <Link
            href={`/estudo/${materia.slug}`}
            target="_blank"
            className="text-xs px-3 py-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            ↗ Ver
          </Link>
        </div>
      </div>

      {/* 3 colunas */}
      <div className="flex flex-1 overflow-hidden divide-x divide-gray-800">

        {/* ══ COLUNA 1: BLOCOS ══ */}
        <div className="w-72 shrink-0 flex flex-col overflow-hidden bg-gray-950">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Blocos
              <span className="ml-2 font-mono text-gray-600">{blocos.length}</span>
            </span>
            <button
              onClick={() => setShowFormBloco((v) => !v)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                showFormBloco ? "bg-gray-800 text-gray-500" : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
              }`}
            >
              {showFormBloco ? "✕" : "+ Bloco"}
            </button>
          </div>

          {/* Form criar bloco */}
          {showFormBloco && (
            <form onSubmit={criarBloco} className="px-4 py-3 border-b border-gray-800 space-y-2 bg-gray-900">
              <input
                type="text"
                placeholder="Nome do bloco *"
                value={formBloco.nome}
                onChange={(e) => {
                  const nome = e.target.value;
                  setFormBloco((f) => ({ ...f, nome, slug: slugify(nome) }));
                }}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Slug *"
                value={formBloco.slug}
                onChange={(e) => setFormBloco((f) => ({ ...f, slug: e.target.value }))}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={formBloco.descricao}
                onChange={(e) => setFormBloco((f) => ({ ...f, descricao: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
              >
                Criar bloco
              </button>
            </form>
          )}

          {/* Lista de blocos */}
          <div className="flex-1 overflow-y-auto py-1">
            {blocos.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-600">
                Nenhum bloco ainda.<br />Crie o primeiro acima.
              </div>
            ) : (
              blocos.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => selecionarBloco(b)}
                  className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                    blocoSel?.id === b.id
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "border-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-600 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium leading-tight">{b.nome}</span>
                  </div>
                  {b.descricao && (
                    <p className="text-xs text-gray-600 mt-0.5 ml-6 truncate">{b.descricao}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ══ COLUNA 2: TÓPICOS ══ */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden bg-gray-950">
          {!blocoSel ? (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-700 text-center px-6">
              ← Selecione um bloco para ver os tópicos
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Tópicos
                    <span className="ml-2 font-mono text-gray-600">{topicos.length}</span>
                  </span>
                  <p className="text-[10px] text-gray-600 truncate">{blocoSel.nome}</p>
                </div>
                <button
                  onClick={() => setShowFormTopico((v) => !v)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors shrink-0 ${
                    showFormTopico ? "bg-gray-800 text-gray-500" : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                  }`}
                >
                  {showFormTopico ? "✕" : "+ Tópico"}
                </button>
              </div>

              {/* Form criar tópico */}
              {showFormTopico && (
                <form onSubmit={criarTopico} className="px-4 py-3 border-b border-gray-800 space-y-2 bg-gray-900">
                  <input
                    type="text"
                    placeholder="Título do tópico *"
                    value={formTop.titulo}
                    onChange={(e) => {
                      const titulo = e.target.value;
                      setFormTop((f) => ({ ...f, titulo, slug: slugify(titulo) }));
                    }}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Slug *"
                    value={formTop.slug}
                    onChange={(e) => setFormTop((f) => ({ ...f, slug: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Resumo (opcional)"
                    value={formTop.resumo}
                    onChange={(e) => setFormTop((f) => ({ ...f, resumo: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <textarea
                    placeholder="Conteúdo em Markdown *"
                    value={formTop.conteudo}
                    onChange={(e) => setFormTop((f) => ({ ...f, conteudo: e.target.value }))}
                    rows={4}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none font-mono text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
                  >
                    Criar tópico
                  </button>
                </form>
              )}

              {/* Lista de tópicos */}
              <div className="flex-1 overflow-y-auto py-1">
                {loadingTop ? (
                  <div className="text-center py-8 text-xs text-gray-600 animate-pulse">Carregando…</div>
                ) : topicos.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-gray-600">
                    Nenhum tópico neste bloco.<br />Crie o primeiro acima.
                  </div>
                ) : (
                  topicos.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => selecionarTopico(t)}
                      className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                        topicoSel?.id === t.id
                          ? "bg-emerald-500/10 border-emerald-500 text-white"
                          : "border-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-mono text-gray-600 shrink-0 mt-0.5">{idx + 1}.</span>
                        <span className="text-sm font-medium leading-tight">{t.titulo}</span>
                      </div>
                      {t.resumo && (
                        <p className="text-xs text-gray-600 mt-0.5 ml-5 line-clamp-2">{t.resumo}</p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* ══ COLUNA 3: CONTEÚDO (Quiz + Flashcards) ══ */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
          {!topicoSel ? (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-700 text-center px-6">
              ← Selecione um tópico para gerenciar questões e flashcards
            </div>
          ) : (
            <>
              {/* Header do tópico */}
              <div className="px-6 py-3 border-b border-gray-800">
                <h2 className="text-sm font-bold text-white">{topicoSel.titulo}</h2>
                {topicoSel.resumo && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{topicoSel.resumo}</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConteudo ? (
                  <div className="text-center py-16 text-xs text-gray-600 animate-pulse">Carregando…</div>
                ) : (
                  <div className="p-6 space-y-10">

                    {/* ── QUIZ ── */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                          🧠 Quiz
                          <span className="text-xs font-mono text-gray-600">{quizzes.length} questões</span>
                        </h3>
                        <button
                          onClick={() => { setShowFormQuiz((v) => !v); setErro(""); }}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                            showFormQuiz
                              ? "bg-gray-800 text-gray-500"
                              : "bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30"
                          }`}
                        >
                          {showFormQuiz ? "✕ Cancelar" : "+ Questão"}
                        </button>
                      </div>

                      {/* Form quiz */}
                      {showFormQuiz && (
                        <form onSubmit={criarQuiz} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4 space-y-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Pergunta *</label>
                            <textarea
                              value={pergunta}
                              onChange={(e) => setPergunta(e.target.value)}
                              required rows={2}
                              placeholder="Digite a pergunta…"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-2">Opções (marque a correta) *</label>
                            <div className="space-y-2">
                              {opcoes.map((op, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 font-mono w-5 shrink-0">{LETRAS[i]}</span>
                                  <input
                                    type="text"
                                    value={op.texto}
                                    onChange={(e) => setOpcoes((prev) => prev.map((o, j) => j === i ? { ...o, texto: e.target.value } : o))}
                                    placeholder={`Opção ${LETRAS[i]}`}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setOpcoes((prev) => prev.map((o, j) => ({ ...o, correta: j === i })))}
                                    className={`shrink-0 w-6 h-6 rounded-full border-2 transition-colors ${
                                      op.correta
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-gray-600 hover:border-gray-400"
                                    }`}
                                    title="Marcar como correta"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Explicação (opcional)</label>
                            <textarea
                              value={explicacao}
                              onChange={(e) => setExplicacao(e.target.value)}
                              rows={2}
                              placeholder="Explicação da resposta correta…"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium px-5 py-2 rounded-lg transition-colors"
                          >
                            Salvar questão
                          </button>
                        </form>
                      )}

                      {/* Lista quiz */}
                      {quizzes.length === 0 ? (
                        <div className="text-xs text-gray-700 bg-gray-900 border border-gray-800 rounded-xl px-4 py-6 text-center">
                          Nenhuma questão ainda.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {quizzes.map((q, qi) => (
                            <div key={q.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                              <div className="flex items-start gap-3 px-4 py-3">
                                <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                                  Q{qi + 1}
                                </span>
                                <p className="text-sm text-white leading-relaxed">{q.pergunta}</p>
                              </div>
                              <div className="px-4 pb-3 space-y-1">
                                {q.opcoes.map((op, oi) => (
                                  <div
                                    key={oi}
                                    className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${
                                      op.correta
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    <span className="font-mono w-4 shrink-0">{LETRAS[oi]}</span>
                                    <span>{op.texto}</span>
                                    {op.correta && <span className="ml-auto">✓</span>}
                                  </div>
                                ))}
                              </div>
                              {q.explicacao && (
                                <div className="px-4 pb-3 text-xs text-amber-400/80 italic border-t border-gray-800 pt-2">
                                  💡 {q.explicacao}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* ── FLASHCARDS ── */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                          🃏 Flashcards
                          <span className="text-xs font-mono text-gray-600">{flashcards.length} cards</span>
                        </h3>
                        <button
                          onClick={() => { setShowFormFlash((v) => !v); setErro(""); }}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                            showFormFlash
                              ? "bg-gray-800 text-gray-500"
                              : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30"
                          }`}
                        >
                          {showFormFlash ? "✕ Cancelar" : "+ Flashcard"}
                        </button>
                      </div>

                      {/* Form flashcard */}
                      {showFormFlash && (
                        <form onSubmit={criarFlash} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4 space-y-3">
                          <div>
                            <label className="block text-xs text-emerald-500 mb-1 font-medium">
                              Frente * <span className="text-gray-600 font-normal">— pergunta ou conceito</span>
                            </label>
                            <textarea
                              value={frente}
                              onChange={(e) => setFrente(e.target.value)}
                              required rows={2}
                              placeholder="Ex: O que é o SPI?"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">
                              Verso * <span className="text-gray-600 font-normal">— resposta</span>
                            </label>
                            <textarea
                              value={verso}
                              onChange={(e) => setVerso(e.target.value)}
                              required rows={3}
                              placeholder="Ex: O SPI é a infraestrutura…"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Dica (opcional)</label>
                            <input
                              type="text"
                              value={dica}
                              onChange={(e) => setDica(e.target.value)}
                              placeholder="Uma dica para lembrar…"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2 rounded-lg transition-colors"
                          >
                            Salvar flashcard
                          </button>
                        </form>
                      )}

                      {/* Lista flashcards */}
                      {flashcards.length === 0 ? (
                        <div className="text-xs text-gray-700 bg-gray-900 border border-gray-800 rounded-xl px-4 py-6 text-center">
                          Nenhum flashcard ainda.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {flashcards.map((fc, idx) => (
                            <div key={fc.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                              <div className="bg-gray-800/50 px-3 py-1 border-b border-gray-800">
                                <span className="text-[10px] font-mono text-gray-600">#{idx + 1}</span>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <div className="text-[10px] text-emerald-500 uppercase tracking-wider mb-1 font-medium">Frente</div>
                                  <p className="text-sm text-white leading-relaxed">{fc.frente}</p>
                                </div>
                                <div className="border-t border-gray-800 pt-3">
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">Verso</div>
                                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{fc.verso}</p>
                                </div>
                                {fc.dica && <div className="text-xs text-amber-400 italic">💡 {fc.dica}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
