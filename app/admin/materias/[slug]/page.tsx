"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

// ── Tipos ─────────────────────────────────────────────────────
type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";
type Opcao   = { id?: string; texto: string; correta: boolean };
type Quiz    = { id: string; pergunta: string; explicacao: string | null; dificuldade: Dificuldade; tags: string | null; opcoes: Opcao[] };

const DIFICULDADE_META: Record<Dificuldade, { label: string; cls: string }> = {
  FACIL:   { label: "Fácil",  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  MEDIO:   { label: "Médio",  cls: "bg-amber-500/15   text-amber-400   border-amber-500/30"   },
  DIFICIL: { label: "Difícil",cls: "bg-red-500/15     text-red-400     border-red-500/30"     },
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}
type Flashcard = { id: string; frente: string; verso: string; dica: string | null };
type Topico  = { id: string; titulo: string; slug: string; resumo: string | null; conteudo: string; ordem: number; publicado: boolean };
type CsvRow  = { pergunta: string; opcaoA: string; opcaoB: string; opcaoC: string; opcaoD: string; correta: string; explicacao: string; dificuldade: string; tags: string; erro?: string };
type Bloco   = { id: string; nome: string; slug: string; descricao: string | null; ordem: number; _count?: { topicos: number } };
type Materia = { id: string; nome: string; slug: string; icone: string | null; cor: string | null; descricao: string | null; blocos: Bloco[] };

const LETRAS = ["A", "B", "C", "D"];
const CORES  = ["emerald", "teal", "blue", "violet", "rose", "amber", "cyan"];
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

  // Edição da matéria
  const [showEditMateria, setShowEditMateria] = useState(false);
  const [editMateria, setEditMateria] = useState({ nome: "", slug: "", descricao: "", icone: "", cor: "" });
  const [salvandoMateria, setSalvandoMateria] = useState(false);

  // Form: Bloco
  const [formBloco, setFormBloco] = useState({ nome: "", slug: "", descricao: "" });

  // Form: Tópico
  const [formTop, setFormTop] = useState({ titulo: "", slug: "", resumo: "", conteudo: "" });

  // Form: Quiz
  const [pergunta, setPergunta]         = useState("");
  const [explicacao, setExplicacao]     = useState("");
  const [quizDific, setQuizDific]       = useState<Dificuldade>("MEDIO");
  const [quizTags, setQuizTags]         = useState("");
  const [opcoes, setOpcoes]             = useState<Opcao[]>([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);

  // Form: Flashcard
  const [frente, setFrente] = useState("");
  const [verso, setVerso]   = useState("");
  const [dica, setDica]     = useState("");

  // Edição do tópico
  const [showEditTopico, setShowEditTopico]     = useState(false);
  const [editTopico, setEditTopico]             = useState({ titulo: "", slug: "", resumo: "", conteudo: "" });
  const [salvandoTopico, setSalvandoTopico]     = useState(false);

  // Edição/exclusão de bloco
  const [editingBlocoId, setEditingBlocoId]     = useState<string | null>(null);
  const [editBloco, setEditBloco]               = useState({ nome: "", slug: "", descricao: "" });
  const [salvandoBloco, setSalvandoBloco]       = useState(false);
  const [deletandoBlocoId, setDeletandoBlocoId] = useState<string | null>(null);

  // Exclusão de tópico
  const [deletandoTopicoId, setDeletandoTopicoId] = useState<string | null>(null);

  // Toggle publicado
  const [toggleandoPublicadoId, setToggleandoPublicadoId] = useState<string | null>(null);

  // Importação CSV
  const [showImport, setShowImport]     = useState(false);
  const [csvText, setCsvText]           = useState("");
  const [csvPreview, setCsvPreview]     = useState<CsvRow[]>([]);
  const [csvErro, setCsvErro]           = useState("");
  const [importando, setImportando]     = useState(false);
  const [csvSubstituir, setCsvSubstituir] = useState(false);

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
    setShowEditTopico(false);
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

  // ── Editar tópico ────────────────────────────────────────
  const abrirEditTopico = () => {
    if (!topicoSel) return;
    setEditTopico({
      titulo:   topicoSel.titulo,
      slug:     topicoSel.slug,
      resumo:   topicoSel.resumo ?? "",
      conteudo: topicoSel.conteudo,
    });
    setShowEditTopico(true);
    setErro("");
  };

  const salvarTopico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicoSel) return;
    setErro(""); setSalvandoTopico(true);
    try {
      const res = await fetch(`/api/topicos/${topicoSel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTopico),
      });
      if (!res.ok) { setErro((await res.json()).error ?? "Erro ao salvar."); return; }
      const updated: Topico = await res.json();
      setTopicoSel(updated);
      // Atualiza na lista de tópicos
      setTopicos((prev) => prev.map((t) => t.id === updated.id ? updated : t));
      setShowEditTopico(false);
      flash("Tópico atualizado!");
    } catch { setErro("Erro ao salvar tópico."); }
    finally { setSalvandoTopico(false); }
  };

  // ── Editar bloco ──────────────────────────────────────────────
  const abrirEditBloco = (b: Bloco) => {
    setEditBloco({ nome: b.nome, slug: b.slug, descricao: b.descricao ?? "" });
    setEditingBlocoId(b.id);
  };

  const salvarBloco = async (e: React.FormEvent, blocoId: string) => {
    e.preventDefault();
    setSalvandoBloco(true); setErro("");
    try {
      const res = await fetch(`/api/blocos/${blocoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBloco),
      });
      if (!res.ok) { setErro((await res.json()).error ?? "Erro"); return; }
      const updated = await res.json();
      setBlocos((prev) => prev.map((b) => b.id === blocoId ? { ...b, ...updated } : b));
      if (blocoSel?.id === blocoId) setBlocoSel((prev) => prev ? { ...prev, ...updated } : prev);
      setEditingBlocoId(null);
      flash("Bloco atualizado!");
    } catch { setErro("Erro ao salvar bloco."); }
    finally { setSalvandoBloco(false); }
  };

  const deletarBloco = async (blocoId: string) => {
    if (!confirm("Excluir este bloco? Isso removerá todos os tópicos, questões e flashcards vinculados.")) return;
    setDeletandoBlocoId(blocoId);
    try {
      await fetch(`/api/blocos/${blocoId}`, { method: "DELETE" });
      setBlocos((prev) => prev.filter((b) => b.id !== blocoId));
      if (blocoSel?.id === blocoId) { setBlocoSel(null); setTopicos([]); setTopicoSel(null); }
      flash("Bloco excluído!");
    } finally { setDeletandoBlocoId(null); }
  };

  // ── Excluir tópico ────────────────────────────────────────────
  const deletarTopico = async (topicoId: string) => {
    if (!confirm("Excluir este tópico? Isso removerá todas as questões e flashcards vinculados.")) return;
    setDeletandoTopicoId(topicoId);
    try {
      await fetch(`/api/topicos/${topicoId}`, { method: "DELETE" });
      setTopicos((prev) => prev.filter((t) => t.id !== topicoId));
      if (topicoSel?.id === topicoId) { setTopicoSel(null); setShowEditTopico(false); }
      flash("Tópico excluído!");
    } finally { setDeletandoTopicoId(null); }
  };

  // ── Toggle publicado ─────────────────────────────────────────
  const togglePublicado = async (t: Topico) => {
    setToggleandoPublicadoId(t.id);
    try {
      const res = await fetch(`/api/topicos/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: !t.publicado }),
      });
      if (!res.ok) { flash("Erro ao alterar status."); return; }
      const updated: Topico = await res.json();
      setTopicos((prev) => prev.map((x) => x.id === t.id ? updated : x));
      if (topicoSel?.id === t.id) setTopicoSel(updated);
      flash(updated.publicado ? "Tópico publicado!" : "Tópico movido para rascunho!");
    } catch { flash("Erro ao alterar status."); }
    finally { setToggleandoPublicadoId(null); }
  };

  // ── CSV: parser de linha com suporte a aspas ─────────────────
  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  function parseCSV(text: string): CsvRow[] {
    const lines = text.trim().split("\n").filter((l) => l.trim());
    if (lines.length === 0) return [];
    // Pula linha de cabeçalho se tiver "pergunta"
    const start = lines[0].toLowerCase().includes("pergunta") ? 1 : 0;
    return lines.slice(start).map((line, i) => {
      const [pergunta = "", opcaoA = "", opcaoB = "", opcaoC = "", opcaoD = "", correta = "", explicacao = "", dificuldade = "", tags = ""] = parseCSVLine(line);
      const row: CsvRow = { pergunta, opcaoA, opcaoB, opcaoC, opcaoD, correta: correta.trim().toUpperCase(), explicacao, dificuldade, tags };
      if (!pergunta.trim()) row.erro = `Linha ${i + start + 1}: pergunta vazia`;
      else if (!opcaoA.trim() || !opcaoB.trim() || !opcaoC.trim() || !opcaoD.trim()) row.erro = `Linha ${i + start + 1}: opções incompletas`;
      else if (!["A", "B", "C", "D"].includes(row.correta)) row.erro = `Linha ${i + start + 1}: 'correta' deve ser A, B, C ou D`;
      return row;
    });
  }

  // ── Importar questões via API ─────────────────────────────────
  const importarQuestoes = async () => {
    if (!topicoSel) return;
    const validas = csvPreview.filter((r) => !r.erro);
    if (validas.length === 0) { setCsvErro("Nenhuma linha válida para importar."); return; }
    setImportando(true); setCsvErro("");
    try {
      const res = await fetch("/api/admin/quiz/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicoId: topicoSel.id,
          substituir: csvSubstituir,
          questoes: validas.map((r) => ({
            pergunta:    r.pergunta,
            opcaoA:      r.opcaoA,
            opcaoB:      r.opcaoB,
            opcaoC:      r.opcaoC,
            opcaoD:      r.opcaoD,
            correta:     r.correta,
            explicacao:  r.explicacao || null,
            dificuldade: r.dificuldade || "MEDIO",
            tags:        r.tags || null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setCsvErro(data.error ?? "Erro ao importar."); return; }
      if (data.erros?.length > 0) setCsvErro(`${data.erros.length} erro(s): ${data.erros[0]}`);
      const rQ = await fetch(`/api/quiz?topicoId=${topicoSel.id}`);
      setQuizzes(await rQ.json());
      setShowImport(false);
      setCsvText(""); setCsvPreview([]); setCsvSubstituir(false);
      const msg = data.apagadas > 0
        ? `${data.apagadas} substituída(s) → ${data.criadas} importada(s)!`
        : `${data.criadas} questão(ões) importada(s)!`;
      flash(msg);
    } catch { setCsvErro("Erro de rede ao importar."); }
    finally { setImportando(false); }
  };

  // ── Abrir edição da matéria ────────────────────────────────
  const abrirEditMateria = () => {
    if (!materia) return;
    setEditMateria({
      nome: materia.nome,
      slug: materia.slug,
      descricao: materia.descricao ?? "",
      icone: materia.icone ?? "",
      cor: materia.cor ?? "emerald",
    });
    setShowEditMateria(true);
    setErro("");
  };

  // ── Salvar edição da matéria ─────────────────────────────
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
      if (!res.ok) return setErro((await res.json()).error ?? "Erro ao salvar matéria.");
      const updated = await res.json();
      setMateria((prev) => prev ? { ...prev, ...updated } : prev);
      setShowEditMateria(false);
      flash("Matéria atualizada!");
      // Se o slug mudou, redireciona
      if (updated.slug && updated.slug !== materia.slug) {
        window.location.href = `/admin/materias/${updated.slug}`;
      }
    } catch {
      setErro("Erro ao salvar matéria.");
    } finally {
      setSalvandoMateria(false);
    }
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
      body: JSON.stringify({ pergunta, explicacao, dificuldade: quizDific, tags: quizTags.trim() || null, topicoId: topicoSel.id, opcoes }),
    });
    if (!res.ok) return setErro((await res.json()).error ?? "Erro");
    const r = await fetch(`/api/quiz?topicoId=${topicoSel.id}`);
    setQuizzes(await r.json());
    setPergunta(""); setExplicacao(""); setQuizDific("MEDIO"); setQuizTags(""); setOpcoes([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);
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
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
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
            <button
              onClick={() => showEditMateria ? setShowEditMateria(false) : abrirEditMateria()}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                showEditMateria
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30"
              }`}
            >
              {showEditMateria ? "✕ Fechar" : "✏️ Editar matéria"}
            </button>
            <Link
              href={`/admin/quiz/${materia.slug}`}
              className="text-xs px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors"
            >
              🧠 Questões
            </Link>
            <Link
              href={`/admin/flashcards/${materia.slug}`}
              className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
            >
              🃏 Flashcards
            </Link>
            <Link
              href={`/admin/materias/${materia.slug}/importar`}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 transition-colors font-semibold"
              title="Importação em lote via CSV (questões + flashcards)"
            >
              📥 Importar CSV
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

        {/* ── Card de edição da matéria ── */}
        {showEditMateria && (
          <form onSubmit={salvarMateria} className="px-6 pb-4 pt-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                ✏️ Editar matéria: <span className="text-emerald-400">{materia.nome}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={editMateria.nome}
                    onChange={(e) => setEditMateria((f) => ({ ...f, nome: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={editMateria.slug}
                    onChange={(e) => setEditMateria((f) => ({ ...f, slug: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ícone (emoji)</label>
                  <input
                    type="text"
                    value={editMateria.icone}
                    onChange={(e) => setEditMateria((f) => ({ ...f, icone: e.target.value }))}
                    placeholder="🏦"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
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
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={salvandoMateria}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
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
      </div>

      {/* ── Breadcrumb de posição atual ── */}
      <div className="px-6 py-2 bg-gray-950 border-b border-gray-800/60 flex items-center gap-1.5 text-xs text-gray-600 shrink-0 overflow-x-auto">
        {/* Matéria */}
        <span className="flex items-center gap-1 shrink-0">
          <span>📚</span>
          <span className="text-gray-500 font-medium">
            Matéria {blocos.length > 0 ? `1/${blocos.length} blocos` : ""}:
          </span>
          <span className="text-emerald-400 font-semibold">{materia.nome}</span>
        </span>

        {/* Bloco selecionado */}
        {blocoSel && (() => {
          const blocoIdx = blocos.findIndex((b) => b.id === blocoSel.id);
          return (
            <>
              <span className="text-gray-700">›</span>
              <span className="flex items-center gap-1 shrink-0">
                <span>📦</span>
                <span className="text-gray-500">Bloco {blocoIdx + 1}/{blocos.length}:</span>
                <span className="text-teal-400 font-semibold">{blocoSel.nome}</span>
                {topicos.length > 0 && <span className="text-gray-600">({topicos.length} tópico{topicos.length !== 1 ? "s" : ""})</span>}
              </span>
            </>
          );
        })()}

        {/* Tópico selecionado */}
        {topicoSel && (() => {
          const topicoIdx = topicos.findIndex((t) => t.id === topicoSel.id);
          return (
            <>
              <span className="text-gray-700">›</span>
              <span className="flex items-center gap-1 shrink-0">
                <span>📄</span>
                <span className="text-gray-500">Tópico {topicoIdx + 1}/{topicos.length}:</span>
                <span className="text-violet-400 font-semibold">{topicoSel.titulo}</span>
                {!topicoSel.publicado && (
                  <span className="text-amber-400 font-mono text-[10px] bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded">rascunho</span>
                )}
                {quizzes.length > 0 && <span className="text-gray-600">· {quizzes.length} questão{quizzes.length !== 1 ? "ões" : ""}</span>}
                {flashcards.length > 0 && <span className="text-gray-600">· {flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""}</span>}
              </span>
            </>
          );
        })()}

        {/* Instrução quando nada selecionado */}
        {!blocoSel && (
          <span className="text-gray-700 italic ml-1">← selecione um bloco para navegar</span>
        )}
        {blocoSel && !topicoSel && (
          <span className="text-gray-700 italic ml-1">← selecione um tópico</span>
        )}
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
                <div key={b.id} className={`border-l-2 transition-colors ${blocoSel?.id === b.id ? "border-emerald-500 bg-emerald-500/10" : "border-transparent"}`}>
                  {editingBlocoId === b.id ? (
                    /* ── Form edição de bloco ── */
                    <form onSubmit={(e) => salvarBloco(e, b.id)} className="px-3 py-2 space-y-1.5 bg-gray-800/40">
                      <input type="text" value={editBloco.nome} onChange={(e) => setEditBloco((f) => ({ ...f, nome: e.target.value }))} required placeholder="Nome *"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500" />
                      <input type="text" value={editBloco.slug} onChange={(e) => setEditBloco((f) => ({ ...f, slug: e.target.value }))} required placeholder="Slug *"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 font-mono focus:outline-none focus:border-emerald-500" />
                      <input type="text" value={editBloco.descricao} onChange={(e) => setEditBloco((f) => ({ ...f, descricao: e.target.value }))} placeholder="Descrição"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500" />
                      <div className="flex gap-1">
                        <button type="submit" disabled={salvandoBloco} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1 rounded transition-colors disabled:opacity-50">
                          {salvandoBloco ? "…" : "Salvar"}
                        </button>
                        <button type="button" onClick={() => setEditingBlocoId(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1 rounded transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ── Linha normal ── */
                    <div className={`flex items-center gap-1 pr-2 group ${blocoSel?.id === b.id ? "text-white" : "text-gray-300 hover:text-white hover:bg-gray-800/50"}`}>
                      <button onClick={() => selecionarBloco(b)} className="flex-1 text-left px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-600 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="text-sm font-medium leading-tight">{b.nome}</span>
                        </div>
                        {b.descricao && <p className="text-xs text-gray-600 mt-0.5 ml-6 truncate">{b.descricao}</p>}
                      </button>
                      <div className="hidden group-hover:flex gap-0.5 shrink-0">
                        <button onClick={() => abrirEditBloco(b)} className="text-gray-600 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded text-xs transition-colors" title="Editar">✏️</button>
                        <button onClick={() => deletarBloco(b.id)} disabled={deletandoBlocoId === b.id} className="text-gray-600 hover:text-red-400 hover:bg-red-500/10 bg-gray-800 p-1 rounded text-xs transition-colors disabled:opacity-40" title="Excluir">
                          {deletandoBlocoId === b.id ? "…" : "🗑"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                    <div key={t.id} className={`border-l-2 transition-colors ${topicoSel?.id === t.id ? "border-emerald-500 bg-emerald-500/10" : "border-transparent"}`}>
                      <div className={`flex items-center gap-1 pr-2 group ${topicoSel?.id === t.id ? "text-white" : "text-gray-300 hover:text-white hover:bg-gray-800/50"}`}>
                        <button onClick={() => selecionarTopico(t)} className="flex-1 text-left px-4 py-3 min-w-0">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-mono text-gray-600 shrink-0 mt-0.5">{idx + 1}.</span>
                            <span className="text-sm font-medium leading-tight">{t.titulo}</span>
                            {!t.publicado && (
                              <span className="text-[9px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded shrink-0 leading-none mt-0.5">
                                rascunho
                              </span>
                            )}
                          </div>
                          {t.resumo && <p className="text-xs text-gray-600 mt-0.5 ml-5 line-clamp-2">{t.resumo}</p>}
                        </button>
                        <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => togglePublicado(t)}
                            disabled={toggleandoPublicadoId === t.id}
                            title={t.publicado ? "Publicado — clique para rascunho" : "Rascunho — clique para publicar"}
                            className={`p-1.5 rounded text-xs transition-colors disabled:opacity-40 bg-gray-800 hover:bg-gray-700 ${
                              t.publicado ? "text-emerald-500" : "text-gray-600 hover:text-emerald-400"
                            }`}
                          >
                            {toggleandoPublicadoId === t.id ? "…" : (t.publicado ? "●" : "○")}
                          </button>
                          <button
                            onClick={() => deletarTopico(t.id)}
                            disabled={deletandoTopicoId === t.id}
                            className="text-gray-600 hover:text-red-400 hover:bg-red-500/10 bg-gray-800 p-1.5 rounded text-xs transition-colors disabled:opacity-40"
                            title="Excluir tópico"
                          >
                            {deletandoTopicoId === t.id ? "…" : "🗑"}
                          </button>
                        </div>
                      </div>
                    </div>
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
              <div className="border-b border-gray-800">
                {/* Título + botão */}
                <div className="flex items-start justify-between px-6 pt-4 pb-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500 mb-1">Tópico selecionado</p>
                    <h2 className="text-base font-black text-white leading-tight">{topicoSel.titulo}</h2>
                  </div>
                  <button
                    onClick={() => showEditTopico ? setShowEditTopico(false) : abrirEditTopico()}
                    className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                      showEditTopico
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-teal-500 hover:bg-teal-400 text-gray-950 shadow-lg shadow-teal-900/40"
                    }`}
                  >
                    {showEditTopico ? "✕ Fechar" : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                        Editar conteúdo
                      </>
                    )}
                  </button>
                </div>

                {/* Preview do conteúdo */}
                {!showEditTopico && topicoSel.resumo && (
                  <div className="mx-6 mb-3 px-3 py-2.5 bg-teal-500/5 border border-teal-500/15 rounded-xl">
                    <p className="text-xs text-teal-200/80 leading-relaxed italic line-clamp-2">
                      &ldquo;{topicoSel.resumo}&rdquo;
                    </p>
                  </div>
                )}
                {!showEditTopico && !topicoSel.resumo && topicoSel.conteudo && (
                  <div className="mx-6 mb-3 px-3 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl">
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 font-mono">
                      {topicoSel.conteudo.replace(/[#*`_>\[\]]/g, "").slice(0, 180)}…
                    </p>
                  </div>
                )}

                {/* ── Editor do tópico ── */}
                {showEditTopico && (
                  <form onSubmit={salvarTopico} className="px-6 pb-5 pt-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Título *</label>
                        <input
                          type="text"
                          value={editTopico.titulo}
                          onChange={(e) => setEditTopico((f) => ({ ...f, titulo: e.target.value }))}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                        <input
                          type="text"
                          value={editTopico.slug}
                          onChange={(e) => setEditTopico((f) => ({ ...f, slug: e.target.value }))}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Resumo</label>
                      <input
                        type="text"
                        value={editTopico.resumo}
                        onChange={(e) => setEditTopico((f) => ({ ...f, resumo: e.target.value }))}
                        placeholder="Frase de resumo exibida nos cards"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Conteúdo (Markdown) *</label>
                      <textarea
                        value={editTopico.conteudo}
                        onChange={(e) => setEditTopico((f) => ({ ...f, conteudo: e.target.value }))}
                        required
                        rows={14}
                        spellCheck={false}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500 resize-y"
                      />
                    </div>
                    {erro && (
                      <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {erro}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={salvandoTopico}
                        className="bg-teal-500 hover:bg-teal-400 text-gray-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow shadow-teal-900/40"
                      >
                        {salvandoTopico ? "Salvando…" : "✓ Salvar conteúdo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditTopico(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
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
                          🧠 Questões
                          <span className="text-xs font-mono text-gray-600">{quizzes.length} questões</span>
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setShowImport((v) => !v); setShowFormQuiz(false); setCsvText(""); setCsvPreview([]); setCsvErro(""); }}
                            className={`text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                              showImport
                                ? "bg-gray-800 text-gray-500 border-gray-700"
                                : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-violet-300 hover:border-violet-500/40"
                            }`}
                          >
                            {showImport ? "✕" : "⬆ CSV"}
                          </button>
                          <button
                            onClick={() => { setShowFormQuiz((v) => !v); setShowImport(false); setErro(""); }}
                            className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                              showFormQuiz
                                ? "bg-gray-800 text-gray-500"
                                : "bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30"
                            }`}
                          >
                            {showFormQuiz ? "✕ Cancelar" : "+ Questão"}
                          </button>
                        </div>
                      </div>

                      {/* Modal importação CSV */}
                      {showImport && (
                        <div className="bg-gray-900 border border-violet-500/20 rounded-xl p-5 mb-4 space-y-4">
                          <h4 className="text-sm font-bold text-violet-300">⬆ Importar questões via CSV</h4>

                          {/* Instruções */}
                          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 space-y-1">
                            <p className="text-[10px] text-gray-400 font-mono">
                              pergunta,opcaoA,opcaoB,opcaoC,opcaoD,correta,explicacao,dificuldade,tags
                            </p>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                              <span className="text-gray-500 font-semibold">correta</span>: A, B, C ou D &nbsp;·&nbsp;
                              <span className="text-gray-500 font-semibold">dificuldade</span>: FACIL, MEDIO ou DIFICIL (opcional) &nbsp;·&nbsp;
                              Use aspas duplas para texto com vírgulas
                            </p>
                          </div>

                          {/* Textarea CSV */}
                          <textarea
                            value={csvText}
                            onChange={(e) => {
                              setCsvText(e.target.value);
                              setCsvPreview(e.target.value.trim() ? parseCSV(e.target.value) : []);
                              setCsvErro("");
                            }}
                            rows={6}
                            placeholder={"pergunta,opcaoA,opcaoB,opcaoC,opcaoD,correta,explicacao,dificuldade,tags\n\"Qual é o CMN?\",\"Banco Central\",\"CMN\",\"CVM\",\"Susep\",B,\"O CMN regula o SFN\",MEDIO,SFN"}
                            spellCheck={false}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500 resize-y"
                          />

                          {/* Preview das linhas parseadas */}
                          {csvPreview.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">
                                <span className="text-emerald-400 font-semibold">{csvPreview.filter((r) => !r.erro).length}</span> válida(s) &nbsp;·&nbsp;
                                <span className="text-red-400 font-semibold">{csvPreview.filter((r) => r.erro).length}</span> com erro
                              </p>
                              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                {csvPreview.map((row, i) => (
                                  <div
                                    key={i}
                                    className={`text-xs px-3 py-2 rounded-lg border ${
                                      row.erro
                                        ? "border-red-500/30 bg-red-500/5 text-red-400"
                                        : "border-gray-700 bg-gray-800/60 text-gray-300"
                                    }`}
                                  >
                                    {row.erro ? (
                                      <span>{row.erro}</span>
                                    ) : (
                                      <div className="flex items-start gap-2">
                                        <span className="text-violet-400 font-mono shrink-0">{i + 1}.</span>
                                        <div className="min-w-0">
                                          <p className="truncate font-medium">{row.pergunta}</p>
                                          <p className="text-gray-600 text-[10px] mt-0.5">
                                            ✓ {row.correta} &nbsp;·&nbsp; {[row.opcaoA, row.opcaoB, row.opcaoC, row.opcaoD].join(" / ")}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {csvErro && (
                            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠ {csvErro}</p>
                          )}

                          {/* Toggle substituir */}
                          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            csvSubstituir
                              ? "border-amber-500/40 bg-amber-500/10"
                              : "border-gray-700 bg-gray-800/40 hover:border-gray-600"
                          }`}>
                            <input
                              type="checkbox"
                              checked={csvSubstituir}
                              onChange={(e) => setCsvSubstituir(e.target.checked)}
                              className="mt-0.5 accent-amber-500"
                            />
                            <div>
                              <p className={`text-xs font-semibold ${csvSubstituir ? "text-amber-300" : "text-gray-400"}`}>
                                Substituir todas as questões existentes
                              </p>
                              <p className="text-[10px] text-gray-600 mt-0.5">
                                Apaga as questões atuais do tópico antes de importar. Use quando o CSV já contém as questões anteriores mais as novas.
                              </p>
                            </div>
                          </label>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={importarQuestoes}
                              disabled={importando || csvPreview.filter((r) => !r.erro).length === 0}
                              className={`disabled:opacity-40 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors ${
                                csvSubstituir
                                  ? "bg-amber-600 hover:bg-amber-500"
                                  : "bg-violet-600 hover:bg-violet-500"
                              }`}
                            >
                              {importando
                                ? "Importando…"
                                : csvSubstituir
                                  ? `Substituir tudo (${csvPreview.filter((r) => !r.erro).length} questões)`
                                  : `Adicionar ${csvPreview.filter((r) => !r.erro).length} questão(ões)`}
                            </button>
                            <button
                              onClick={() => { setShowImport(false); setCsvText(""); setCsvPreview([]); setCsvSubstituir(false); }}
                              className="text-xs text-gray-600 hover:text-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

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
                          {/* Dificuldade + Tags */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1.5">Dificuldade</label>
                              <div className="flex gap-1">
                                {(["FACIL", "MEDIO", "DIFICIL"] as Dificuldade[]).map((d) => (
                                  <button key={d} type="button" onClick={() => setQuizDific(d)}
                                    className={`flex-1 py-1 rounded-md border text-[10px] font-semibold transition-all ${
                                      quizDific === d ? DIFICULDADE_META[d].cls : "border-gray-700 text-gray-600 hover:text-gray-400"
                                    }`}>
                                    {DIFICULDADE_META[d].label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tags <span className="text-gray-600">(vírgula)</span></label>
                              <input type="text" value={quizTags} onChange={(e) => setQuizTags(e.target.value)}
                                placeholder="SFN, Regulação…"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500" />
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
                                <p className="text-sm text-white leading-relaxed flex-1">{q.pergunta}</p>
                                {q.dificuldade && (
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${DIFICULDADE_META[q.dificuldade].cls}`}>
                                    {DIFICULDADE_META[q.dificuldade].label}
                                  </span>
                                )}
                              </div>
                              {parseTags(q.tags).length > 0 && (
                                <div className="px-4 pb-1 flex flex-wrap gap-1">
                                  {parseTags(q.tags).map((tag) => (
                                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-500">#{tag}</span>
                                  ))}
                                </div>
                              )}
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
