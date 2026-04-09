"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

/* ─── Tipos ─────────────────────────────────────────────────────────────── */
type Opcao     = { id: string; texto: string; correta: boolean; ordem: number };
type Quiz      = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[] };
type Flashcard = { id: string; frente: string; verso: string; dica: string | null };
type Topico    = { id: string; titulo: string; slug: string; conteudo: string; resumo: string | null; quizzes: Quiz[]; flashcards: Flashcard[] };
type Bloco     = { id: string; nome: string; slug: string; topicos: Topico[] };
type Materia   = { id: string; nome: string; slug: string; icone: string | null; descricao: string | null; blocos: Bloco[] };
type UserInfo  = { nome: string; id: string };

interface ProgressoInicial {
  respostas: Record<string, string>;   // quizId → opcaoId escolhida
  revelados: string[];                 // quizIds já revelados/gravados
  revisoes:  Record<string, boolean>;  // flashcardId → acertou
}

/* ─── Constante de aprovação ────────────────────────────────────────────── */
const MINIMO_APROVACAO = 90; // %

/* ─── SidebarNav — nível de módulo (evita "created during render") ───────── */
interface SidebarNavProps {
  materia:          Materia;
  topicoAtivo:      Topico | null;
  blocoAbertoId:    string | null;
  blocosConcluidos: Set<string>;
  blocosTrancados:  Set<string>;
  topicosConcluidos:Set<string>;
  onToggleBloco:    (id: string) => void;
  onSelectTopico:   (t: Topico) => void;
}

function SidebarNav({
  materia, topicoAtivo, blocoAbertoId,
  blocosConcluidos, blocosTrancados, topicosConcluidos,
  onToggleBloco, onSelectTopico,
}: SidebarNavProps) {
  return (
    <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
      {materia.blocos.map((bloco, bi) => {
        const concluido = blocosConcluidos.has(bloco.id);
        const trancado  = blocosTrancados.has(bloco.id);
        const aberto    = blocoAbertoId === bloco.id;
        const numBloco  = String(bi + 1).padStart(2, "0");

        // Progresso parcial (só para blocos não trancados e não concluídos)
        const topicosConcluídosNoBloco = trancado || concluido
          ? null
          : bloco.topicos.filter((t) => topicosConcluidos.has(t.id)).length;
        const temProgresso = topicosConcluídosNoBloco !== null && topicosConcluídosNoBloco > 0;
        const pctSidebar   = temProgresso
          ? Math.round((topicosConcluídosNoBloco! / bloco.topicos.length) * 100)
          : 0;

        return (
          <div key={bloco.id}>
            {/* ── Botão do bloco ── */}
            <button
              onClick={() => onToggleBloco(bloco.id)}
              className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl transition-colors text-left group ${
                trancado
                  ? "opacity-60 cursor-pointer hover:bg-gray-800/50"
                  : "hover:bg-gray-800 active:bg-gray-700"
              }`}
            >
              <span className={`shrink-0 text-[10px] font-mono font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                trancado   ? "bg-gray-800 text-gray-600"
                : concluido ? "bg-emerald-500/20 text-emerald-400"
                : aberto    ? "bg-gray-700 text-gray-200"
                            : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
              }`}>
                {trancado ? "🔒" : concluido ? "✓" : numBloco}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`block text-xs font-semibold uppercase tracking-wide leading-tight ${
                  trancado   ? "text-gray-600"
                  : concluido ? "text-emerald-400"
                              : "text-gray-400 group-hover:text-gray-200"
                }`}>
                  {bloco.nome}
                </span>
                {/* Barra de progresso parcial */}
                {temProgresso && !concluido && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600/70 rounded-full transition-all"
                        style={{ width: `${pctSidebar}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600 shrink-0">
                      {topicosConcluídosNoBloco}/{bloco.topicos.length}
                    </span>
                  </div>
                )}
              </div>
              {!trancado && (
                <span className="text-gray-600 text-xs shrink-0">{aberto ? "▾" : "▸"}</span>
              )}
            </button>

            {/* ── Tópicos (só se aberto e não trancado) ── */}
            {aberto && !trancado && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-800 pl-3">
                {bloco.topicos.map((topico, ti) => {
                  const ativo     = topicoAtivo?.id === topico.id;
                  const concluido = topicosConcluidos.has(topico.id);
                  const numTopico = `${bi + 1}.${ti + 1}`;
                  return (
                    <button
                      key={topico.id}
                      onClick={() => onSelectTopico(topico)}
                      className={`w-full text-left px-3 py-3 rounded-xl text-xs transition-all flex items-start gap-2 ${
                        ativo
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white active:bg-gray-700"
                      }`}
                    >
                      <span className={`shrink-0 text-[10px] font-mono mt-0.5 ${ativo ? "text-emerald-500" : "text-gray-600"}`}>
                        {numTopico}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium leading-snug">{topico.titulo}</div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          {topico.quizzes.length > 0 && (
                            <span className={concluido ? "text-emerald-400" : "opacity-50"}>
                              🧠 {topico.quizzes.length}
                            </span>
                          )}
                          {topico.flashcards.length > 0 && (
                            <span className={concluido ? "text-emerald-400" : "opacity-50"}>
                              🃏 {topico.flashcards.length}
                            </span>
                          )}
                          {concluido && (
                            <span className="text-emerald-400 font-bold ml-auto">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Componente principal ───────────────────────────────────────────────── */
export default function EstudoCliente({
  materia,
  user,
  progressoInicial,
}: {
  materia: Materia;
  user: UserInfo;
  progressoInicial: ProgressoInicial;
}) {
  const router = useRouter();

  /* ── Estado ── */
  const [topicoAtivo,    setTopicoAtivo]    = useState<Topico | null>(null);
  const [abaAtiva,       setAbaAtiva]       = useState<"conteudo" | "quiz" | "flashcards">("conteudo");
  const [blocoAbertoId,  setBlocoAbertoId]  = useState<string | null>(null);
  const [sidebarAberta,  setSidebarAberta]  = useState(false);
  const [fcIndex,        setFcIndex]        = useState(0);
  const [fcVirado,       setFcVirado]       = useState(false);

  // Progresso — inicializado a partir do banco, atualizado localmente
  const [respostas, setRespostas] = useState<Record<string, string>>(progressoInicial.respostas);
  const [revelados,  setRevelados] = useState<Set<string>>(new Set(progressoInicial.revelados));
  const [fcReviews,  setFcReviews] = useState<Record<string, boolean>>(progressoInicial.revisoes);

  // Modal de bloco trancado
  const [blocoTrancadoMsg, setBlocoTrancadoMsg] = useState<{
    bloco: Bloco;
    prevBloco: Bloco;
  } | null>(null);

  const inicial      = user.nome.charAt(0).toUpperCase();
  const primeiroNome = user.nome.split(" ")[0];

  const totalTopicos    = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes    = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
  const totalFlashcards = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);

  /* ─── Computação de progresso por tópico ─────────────────────────────── */
  function computeProgresso(topico: Topico) {
    const quizTotal       = topico.quizzes.length;
    const quizRespondidas = topico.quizzes.filter((q) => revelados.has(q.id)).length;
    const quizAcertos     = topico.quizzes.filter((q) =>
      revelados.has(q.id) && q.opcoes.find((o) => o.id === respostas[q.id])?.correta
    ).length;
    // null = ainda não respondeu tudo
    const quizPct: number | null =
      quizTotal === 0 ? 100
      : quizRespondidas === quizTotal ? Math.round((quizAcertos / quizTotal) * 100)
      : null;

    const fcTotal    = topico.flashcards.length;
    const fcRevisadas = topico.flashcards.filter((fc) => fcReviews[fc.id] !== undefined).length;
    const fcAcertos  = topico.flashcards.filter((fc) => fcReviews[fc.id] === true).length;
    const fcPct: number | null =
      fcTotal === 0 ? 100
      : fcRevisadas === fcTotal ? Math.round((fcAcertos / fcTotal) * 100)
      : null;

    const quizOk    = quizPct !== null && quizPct >= MINIMO_APROVACAO;
    const fcOk      = fcPct   !== null && fcPct   >= MINIMO_APROVACAO;
    const concluido = quizOk && fcOk;

    return { quizTotal, quizRespondidas, quizAcertos, quizPct, fcTotal, fcRevisadas, fcAcertos, fcPct, concluido };
  }

  /* ─── Sets derivados ────────────────────────────────────────────────── */
  const topicosConcluidos = new Set(
    materia.blocos.flatMap((b) => b.topicos).filter((t) => computeProgresso(t).concluido).map((t) => t.id)
  );
  const blocosConcluidos = new Set(
    materia.blocos.filter((b) => b.topicos.every((t) => topicosConcluidos.has(t.id))).map((b) => b.id)
  );
  const blocosTrancados = new Set(
    materia.blocos
      .filter((_, i) => i > 0 && !blocosConcluidos.has(materia.blocos[i - 1].id))
      .map((b) => b.id)
  );

  /* ─── Handlers ──────────────────────────────────────────────────────── */
  function handleToggleBloco(blocoId: string) {
    if (blocosTrancados.has(blocoId)) {
      const bi = materia.blocos.findIndex((b) => b.id === blocoId);
      setBlocoTrancadoMsg({
        bloco:     materia.blocos[bi],
        prevBloco: materia.blocos[bi - 1],
      });
      return;
    }
    setBlocoAbertoId((prev) => (prev === blocoId ? null : blocoId));
  }

  function handleTopico(topico: Topico) {
    const pai = materia.blocos.find((b) => b.topicos.some((t) => t.id === topico.id));
    if (!pai) return;
    const bi = materia.blocos.indexOf(pai);
    if (blocosTrancados.has(pai.id)) {
      setBlocoTrancadoMsg({ bloco: pai, prevBloco: materia.blocos[bi - 1] });
      return;
    }
    setBlocoAbertoId(pai.id);
    setTopicoAtivo(topico);
    setAbaAtiva("conteudo");
    setFcIndex(0);
    setFcVirado(false);
    setSidebarAberta(false);
    setBlocoTrancadoMsg(null);
  }

  function responder(quizId: string, opcaoId: string) {
    if (revelados.has(quizId)) return;
    setRespostas((r) => ({ ...r, [quizId]: opcaoId }));
  }

  function revelar(quiz: Quiz) {
    if (!topicoAtivo || revelados.has(quiz.id)) return;
    const opcaoId = respostas[quiz.id];
    if (!opcaoId) return;
    const correta = !!quiz.opcoes.find((o) => o.id === opcaoId)?.correta;
    setRevelados((r) => new Set([...r, quiz.id]));
    // Grava no banco (fire-and-forget — não bloqueia UI)
    fetch("/api/estudo/responder-quiz", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ quizId: quiz.id, opcaoId, correta, topicoId: topicoAtivo.id }),
    }).catch(() => {});
  }

  function marcarFlashcard(flashcardId: string, acertou: boolean) {
    if (!topicoAtivo) return;
    setFcReviews((prev) => ({ ...prev, [flashcardId]: acertou }));
    // Avança para o próximo card automaticamente
    if (fcIndex < topicoAtivo.flashcards.length - 1) {
      setFcIndex((i) => i + 1);
      setFcVirado(false);
    }
    fetch("/api/estudo/revisar-flashcard", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ flashcardId, acertou, topicoId: topicoAtivo.id }),
    }).catch(() => {});
  }

  // Limpa respostas/revisões de um tópico localmente E no banco para nova tentativa
  function resetarTopico(topico: Topico, tipo: "quiz" | "flashcard") {
    if (tipo === "quiz") {
      const qids = new Set(topico.quizzes.map((q) => q.id));
      setRespostas((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !qids.has(k))));
      setRevelados((prev) => { const n = new Set(prev); qids.forEach((id) => n.delete(id)); return n; });
    } else {
      const fcids = new Set(topico.flashcards.map((fc) => fc.id));
      setFcReviews((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !fcids.has(k))));
      setFcIndex(0);
      setFcVirado(false);
    }
    // Persiste o reset no banco — garante sincronia ao recarregar a página
    fetch("/api/estudo/reset-topico", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ topicoId: topico.id, tipo }),
    }).catch(() => {});
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navProps: SidebarNavProps = {
    materia, topicoAtivo, blocoAbertoId,
    blocosConcluidos, blocosTrancados, topicosConcluidos,
    onToggleBloco: handleToggleBloco,
    onSelectTopico: handleTopico,
  };

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-3 gap-2 shrink-0 z-20">
        <button
          onClick={() => setSidebarAberta(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-800 active:bg-gray-700 text-gray-400 shrink-0"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/estudo" className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors shrink-0">
          ← Início
        </Link>
        <span className="hidden md:inline text-gray-700 shrink-0">|</span>
        <span className="text-sm text-white font-medium truncate flex-1 min-w-0">
          {materia.icone} {materia.nome}
        </span>
        <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500 shrink-0">
          <span>📚 {totalTopicos}</span>
          <span>🧠 {totalQuizzes}</span>
          <span>🃏 {totalFlashcards}</span>
          {topicosConcluidos.size > 0 && (
            <span className="text-emerald-400 font-semibold">✓ {topicosConcluidos.size} tópicos</span>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0 border-l border-gray-800 pl-2 ml-1">
          <Link
            href="/estudo/perfil"
            className="flex items-center gap-1.5 px-2 py-2 rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors group"
            title="Meu perfil"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
              {inicial}
            </div>
            <span className="hidden sm:inline text-sm text-gray-300 group-hover:text-white transition-colors max-w-[90px] truncate">
              {primeiroNome}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-10 h-10 sm:w-auto sm:h-auto sm:px-2.5 sm:py-2 flex items-center justify-center rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/10 transition-colors"
            title="Sair"
          >
            <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline text-xs">Sair</span>
          </button>
        </div>
      </header>

      {/* ══ LAYOUT ══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar desktop ── */}
        <aside className="hidden md:flex md:flex-col w-64 xl:w-72 shrink-0 bg-gray-900 border-r border-gray-800 overflow-hidden">
          <SidebarNav {...navProps} />
        </aside>

        {/* ── Drawer mobile ── */}
        {sidebarAberta && (
          <div className="fixed inset-0 bg-black/70 z-30 md:hidden" onClick={() => setSidebarAberta(false)} />
        )}
        <div className={[
          "fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-gray-900 border-r border-gray-800",
          "flex flex-col md:hidden",
          "transform transition-transform duration-300 ease-in-out",
          sidebarAberta ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}>
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-800 shrink-0">
            <Link href="/estudo" className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5" onClick={() => setSidebarAberta(false)}>
              ← Início
            </Link>
            <button onClick={() => setSidebarAberta(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-800 active:bg-gray-700 text-gray-400">✕</button>
          </div>
          <SidebarNav {...navProps} />
        </div>

        {/* ══ CONTEÚDO PRINCIPAL ════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto w-full">

          {!topicoAtivo ? (
            /* ── Estado vazio ── */
            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4 px-6 text-center">
              <span className="text-6xl">📖</span>
              <div>
                <p className="text-base font-medium text-gray-400 mb-1">{materia.icone} {materia.nome}</p>
                <button
                  onClick={() => setSidebarAberta(true)}
                  className="md:hidden mt-3 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-500 text-white text-sm font-medium px-5 py-3 rounded-2xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Ver tópicos
                </button>
                <p className="hidden md:block text-sm mt-2 text-gray-600">Selecione um tópico na barra lateral para começar</p>
              </div>
            </div>
          ) : (
            /* ── Tópico ativo ── */
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6">

              {/* Breadcrumb */}
              {(() => {
                const bloco = materia.blocos.find((b) => b.topicos.some((t) => t.id === topicoAtivo.id));
                return bloco ? (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs text-gray-600 shrink-0">{bloco.nome}</span>
                    <span className="text-gray-700 shrink-0">›</span>
                    <span className="text-xs text-gray-400 min-w-0 truncate flex-1">{topicoAtivo.titulo}</span>
                    {topicosConcluidos.has(topicoAtivo.id) && (
                      <span className="text-xs text-emerald-400 shrink-0 flex items-center gap-1">
                        <span>✓</span> Tópico concluído
                      </span>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Tabs */}
              <div className="flex mb-6 bg-gray-900/80 rounded-xl p-1 border border-gray-800 w-full">
                {(["conteudo", "quiz", "flashcards"] as const).map((aba) => {
                  const prog = computeProgresso(topicoAtivo);
                  const badge =
                    aba === "quiz" && prog.quizPct !== null
                      ? { text: `${prog.quizPct}%`, ok: prog.quizPct >= MINIMO_APROVACAO }
                      : aba === "flashcards" && prog.fcPct !== null
                      ? { text: `${prog.fcPct}%`, ok: prog.fcPct >= MINIMO_APROVACAO }
                      : null;
                  return (
                    <button
                      key={aba}
                      onClick={() => { setAbaAtiva(aba); setFcVirado(false); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        abaAtiva === aba
                          ? "bg-emerald-500 text-white shadow"
                          : "text-gray-400 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                      }`}
                    >
                      <span>{aba === "conteudo" ? "📖" : aba === "quiz" ? "🧠" : "🃏"}</span>
                      <span className="hidden sm:inline">
                        {aba === "conteudo" && "Conteúdo"}
                        {aba === "quiz" && `Quiz (${topicoAtivo.quizzes.length})`}
                        {aba === "flashcards" && `Cards (${topicoAtivo.flashcards.length})`}
                      </span>
                      <span className="sm:hidden text-xs">
                        {aba === "conteudo" && "Leitura"}
                        {aba === "quiz" && `Quiz${topicoAtivo.quizzes.length > 0 ? ` (${topicoAtivo.quizzes.length})` : ""}`}
                        {aba === "flashcards" && `Cards${topicoAtivo.flashcards.length > 0 ? ` (${topicoAtivo.flashcards.length})` : ""}`}
                      </span>
                      {badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5 ${
                          badge.ok
                            ? abaAtiva === aba ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                            : abaAtiva === aba ? "bg-white/20 text-white" : "bg-red-500/20 text-red-400"
                        }`}>
                          {badge.text}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── ABA: CONTEÚDO ── */}
              {abaAtiva === "conteudo" && (
                <div>
                  {topicoAtivo.resumo && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6 text-emerald-200 text-sm leading-relaxed">
                      {topicoAtivo.resumo}
                    </div>
                  )}
                  <MarkdownRenderer content={topicoAtivo.conteudo} />

                  {/* Navegação prev/next */}
                  {(() => {
                    const todos   = materia.blocos.flatMap((b) => b.topicos);
                    const idx     = todos.findIndex((t) => t.id === topicoAtivo.id);
                    const prev    = idx > 0 ? todos[idx - 1] : null;
                    const next    = idx < todos.length - 1 ? todos[idx + 1] : null;
                    const nextPai = next ? materia.blocos.find((b) => b.topicos.some((t) => t.id === next.id)) : null;
                    const nextTrancado = nextPai ? blocosTrancados.has(nextPai.id) : false;
                    return (
                      <div className="flex gap-3 mt-10 pt-6 border-t border-gray-800">
                        {prev ? (
                          <button onClick={() => handleTopico(prev)} className="flex-1 text-left text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-3 px-1">
                            ← {prev.titulo}
                          </button>
                        ) : <div className="flex-1" />}
                        {next ? (
                          nextTrancado ? (
                            <div className="flex-1 text-right text-xs text-gray-700 py-3 px-1 flex items-center justify-end gap-1" title="Complete o bloco atual primeiro">
                              🔒 {next.titulo}
                            </div>
                          ) : (
                            <button onClick={() => handleTopico(next)} className="flex-1 text-right text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-3 px-1">
                              {next.titulo} →
                            </button>
                          )
                        ) : <div className="flex-1" />}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── ABA: QUIZ ── */}
              {abaAtiva === "quiz" && (
                <div className="space-y-4">
                  {topicoAtivo.quizzes.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-4xl mb-3">🧠</div>
                      <p className="text-sm">Nenhuma questão cadastrada para este tópico.</p>
                    </div>
                  ) : (() => {
                    const prog = computeProgresso(topicoAtivo);
                    const tudo = prog.quizRespondidas === prog.quizTotal;

                    return (
                      <>
                        {/* ── Card de resultado (quando tudo respondido) ── */}
                        {tudo && prog.quizPct !== null && (
                          <div className={`rounded-2xl p-5 border mb-2 ${
                            prog.quizPct >= MINIMO_APROVACAO
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          }`}>
                            <div className="flex items-center gap-4">
                              <span className="text-3xl">
                                {prog.quizPct >= MINIMO_APROVACAO ? "🎉" : "📚"}
                              </span>
                              <div className="flex-1">
                                <p className={`font-bold text-base ${prog.quizPct >= MINIMO_APROVACAO ? "text-emerald-300" : "text-red-300"}`}>
                                  {prog.quizPct >= MINIMO_APROVACAO
                                    ? `Aprovado! ${prog.quizAcertos}/${prog.quizTotal} corretas — ${prog.quizPct}%`
                                    : `${prog.quizAcertos}/${prog.quizTotal} corretas — ${prog.quizPct}%`}
                                </p>
                                <p className={`text-xs mt-0.5 ${prog.quizPct >= MINIMO_APROVACAO ? "text-emerald-400/70" : "text-red-400/70"}`}>
                                  {prog.quizPct >= MINIMO_APROVACAO
                                    ? "Quiz concluído ✓ — Avance para os Flashcards!"
                                    : `Mínimo para avançar: ${MINIMO_APROVACAO}%. Tente novamente.`}
                                </p>
                              </div>
                              {prog.quizPct < MINIMO_APROVACAO && (
                                <button
                                  onClick={() => resetarTopico(topicoAtivo, "quiz")}
                                  className="shrink-0 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-3 py-2 rounded-xl transition-colors"
                                >
                                  Refazer
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── Placar parcial ── */}
                        {!tudo && prog.quizRespondidas > 0 && (
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
                            <span className="text-gray-400">{prog.quizRespondidas}/{prog.quizTotal} respondidas</span>
                            <span className="text-emerald-400 font-semibold">{prog.quizAcertos} corretas</span>
                            <span className="text-gray-500">{Math.round((prog.quizAcertos / prog.quizRespondidas) * 100)}%</span>
                          </div>
                        )}

                        {/* ── Questões ── */}
                        {topicoAtivo.quizzes.map((quiz, qi) => {
                          const respostaId = respostas[quiz.id];
                          const isRevelado = revelados.has(quiz.id);
                          return (
                            <div key={quiz.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6">
                              <p className="text-white font-semibold mb-4 leading-relaxed text-sm sm:text-base">
                                <span className="text-emerald-400 text-sm mr-2 font-normal">Q{qi + 1}</span>
                                {quiz.pergunta}
                              </p>
                              <div className="space-y-2">
                                {quiz.opcoes.map((opcao) => {
                                  let cls = "w-full text-left px-4 py-4 rounded-xl border text-sm transition-all leading-snug ";
                                  if (!respostaId) {
                                    cls += "border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 active:bg-emerald-500/10 text-gray-300 cursor-pointer";
                                  } else if (isRevelado) {
                                    if (opcao.correta) {
                                      cls += "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-medium";
                                    } else if (opcao.id === respostaId && !opcao.correta) {
                                      cls += "border-red-500 bg-red-500/15 text-red-300";
                                    } else {
                                      cls += "border-gray-800 text-gray-600";
                                    }
                                  } else {
                                    cls += opcao.id === respostaId
                                      ? "border-emerald-500/60 bg-emerald-500/10 text-white"
                                      : "border-gray-700 text-gray-400";
                                  }
                                  return (
                                    <button key={opcao.id} className={cls} onClick={() => responder(quiz.id, opcao.id)} disabled={isRevelado}>
                                      {isRevelado && opcao.correta && <span className="mr-2">✓</span>}
                                      {isRevelado && opcao.id === respostaId && !opcao.correta && <span className="mr-2">✗</span>}
                                      {opcao.texto}
                                    </button>
                                  );
                                })}
                              </div>
                              {respostaId && !isRevelado && (
                                <button
                                  onClick={() => revelar(quiz)}
                                  className="mt-4 w-full py-3 text-sm text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-colors active:bg-emerald-500/10"
                                >
                                  Ver gabarito e explicação
                                </button>
                              )}
                              {isRevelado && quiz.explicacao && (
                                <div className="mt-4 bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
                                  💡 {quiz.explicacao}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* ── ABA: FLASHCARDS ── */}
              {abaAtiva === "flashcards" && (
                <div>
                  {topicoAtivo.flashcards.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-4xl mb-3">🃏</div>
                      <p className="text-sm">Nenhum flashcard cadastrado para este tópico.</p>
                    </div>
                  ) : (() => {
                    const prog = computeProgresso(topicoAtivo);
                    const tudo = prog.fcRevisadas === prog.fcTotal;
                    const cardAtual = topicoAtivo.flashcards[fcIndex];
                    const jaRevisado = fcReviews[cardAtual.id] !== undefined;

                    return (
                      <div>
                        {/* ── Resultado final ── */}
                        {tudo && prog.fcPct !== null && (
                          <div className={`rounded-2xl p-5 border mb-5 ${
                            prog.fcPct >= MINIMO_APROVACAO
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          }`}>
                            <div className="flex items-center gap-4">
                              <span className="text-3xl">
                                {prog.fcPct >= MINIMO_APROVACAO ? "🎉" : "🃏"}
                              </span>
                              <div className="flex-1">
                                <p className={`font-bold text-base ${prog.fcPct >= MINIMO_APROVACAO ? "text-emerald-300" : "text-red-300"}`}>
                                  {prog.fcPct >= MINIMO_APROVACAO
                                    ? `Ótimo! ${prog.fcAcertos}/${prog.fcTotal} memorizados — ${prog.fcPct}%`
                                    : `${prog.fcAcertos}/${prog.fcTotal} memorizados — ${prog.fcPct}%`}
                                </p>
                                <p className={`text-xs mt-0.5 ${prog.fcPct >= MINIMO_APROVACAO ? "text-emerald-400/70" : "text-red-400/70"}`}>
                                  {prog.fcPct >= MINIMO_APROVACAO
                                    ? "Flashcards concluídos ✓"
                                    : `Mínimo para avançar: ${MINIMO_APROVACAO}%. Revise novamente.`}
                                </p>
                              </div>
                              {prog.fcPct < MINIMO_APROVACAO && (
                                <button
                                  onClick={() => resetarTopico(topicoAtivo, "flashcard")}
                                  className="shrink-0 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-3 py-2 rounded-xl transition-colors"
                                >
                                  Rever
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── Progresso parcial ── */}
                        {!tudo && prog.fcRevisadas > 0 && (
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 text-sm mb-4">
                            <span className="text-gray-400">{prog.fcRevisadas}/{prog.fcTotal} revisados</span>
                            <span className="text-emerald-400 font-semibold">{prog.fcAcertos} memorizados</span>
                          </div>
                        )}

                        {/* ── Card com flip ── */}
                        <div
                          className="cursor-pointer select-none"
                          style={{ perspective: "1000px" }}
                          onClick={() => !fcVirado && setFcVirado(true)}
                        >
                          <div
                            className="relative transition-transform duration-500"
                            style={{
                              transformStyle: "preserve-3d",
                              transform: fcVirado ? "rotateY(180deg)" : "rotateY(0deg)",
                              minHeight: "clamp(220px, 50vw, 300px)",
                            }}
                          >
                            {/* Frente */}
                            <div
                              className="absolute inset-0 bg-gray-900 border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div className="text-xs text-gray-600 uppercase tracking-widest mb-3">Toque para revelar</div>
                              <p className="text-white text-base sm:text-lg font-semibold leading-relaxed">
                                {cardAtual.frente}
                              </p>
                              {cardAtual.dica && (
                                <p className="text-xs text-gray-600 mt-3">💡 {cardAtual.dica}</p>
                              )}
                            </div>
                            {/* Verso */}
                            <div
                              className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center"
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                              <div className="text-xs text-emerald-600 uppercase tracking-widest mb-3">Resposta</div>
                              <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {cardAtual.verso}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ── Botões Sabia / Não sabia (aparecem após virar) ── */}
                        {fcVirado && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => { marcarFlashcard(cardAtual.id, false); setFcVirado(false); }}
                              className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-colors border ${
                                jaRevisado && !fcReviews[cardAtual.id]
                                  ? "bg-red-500/20 border-red-500/40 text-red-300"
                                  : "bg-gray-800 hover:bg-red-500/15 border-gray-700 hover:border-red-500/40 text-gray-300 hover:text-red-300 active:bg-red-500/15"
                              }`}
                            >
                              ✗ Não sabia
                            </button>
                            <button
                              onClick={() => { marcarFlashcard(cardAtual.id, true); setFcVirado(false); }}
                              className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-colors border ${
                                jaRevisado && fcReviews[cardAtual.id]
                                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                  : "bg-gray-800 hover:bg-emerald-500/15 border-gray-700 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-300 active:bg-emerald-500/15"
                              }`}
                            >
                              ✓ Sabia
                            </button>
                          </div>
                        )}

                        {/* ── Navegação anterior/próximo (quando não virado) ── */}
                        {!fcVirado && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => { setFcIndex((i) => i - 1); setFcVirado(false); }}
                              disabled={fcIndex === 0}
                              className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 rounded-2xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              ← Anterior
                            </button>
                            <button
                              onClick={() => { setFcIndex((i) => i + 1); setFcVirado(false); }}
                              disabled={fcIndex === topicoAtivo.flashcards.length - 1}
                              className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 rounded-2xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              Próximo →
                            </button>
                          </div>
                        )}

                        {/* Barra de progresso */}
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${((fcIndex + 1) / topicoAtivo.flashcards.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">{fcIndex + 1}/{topicoAtivo.flashcards.length}</span>
                          {jaRevisado && (
                            <span className={`text-xs font-medium shrink-0 ${fcReviews[cardAtual.id] ? "text-emerald-400" : "text-red-400"}`}>
                              {fcReviews[cardAtual.id] ? "✓" : "✗"}
                            </span>
                          )}
                        </div>

                        {/* Dots */}
                        {topicoAtivo.flashcards.length <= 20 && (
                          <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
                            {topicoAtivo.flashcards.map((fc, i) => {
                              const rev = fcReviews[fc.id];
                              return (
                                <button
                                  key={i}
                                  onClick={() => { setFcIndex(i); setFcVirado(false); }}
                                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                    i === fcIndex
                                      ? "bg-emerald-400 scale-125"
                                      : rev === true  ? "bg-emerald-600"
                                      : rev === false ? "bg-red-600"
                                      : "bg-gray-700 hover:bg-gray-500"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="h-8 md:h-0" />
            </div>
          )}
        </main>
      </div>

      {/* ══ MODAL: BLOCO TRANCADO ════════════════════════════════════════ */}
      {blocoTrancadoMsg && (() => {
        // Primeiro tópico incompleto do bloco anterior — destino do atalho
        const primeiroIncompleto = blocoTrancadoMsg.prevBloco.topicos.find(
          (t) => !topicosConcluidos.has(t.id)
        ) ?? null;

        // Total de tópicos concluídos no bloco anterior
        const concluidos = blocoTrancadoMsg.prevBloco.topicos.filter(
          (t) => topicosConcluidos.has(t.id)
        ).length;
        const total = blocoTrancadoMsg.prevBloco.topicos.length;
        const pctBloco = Math.round((concluidos / total) * 100);

        return (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setBlocoTrancadoMsg(null)}
          >
            <div
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabeçalho */}
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">🔒</div>
                <h3 className="text-white font-bold text-lg">Bloco bloqueado</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Para acessar <span className="text-white font-medium">{blocoTrancadoMsg.bloco.nome}</span>,
                  conclua primeiro o bloco anterior com pelo menos{" "}
                  <span className="text-emerald-400 font-bold">{MINIMO_APROVACAO}%</span> em quiz e flashcards.
                </p>
              </div>

              {/* Barra de progresso geral do bloco anterior */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    {blocoTrancadoMsg.prevBloco.nome}
                  </p>
                  <span className={`text-xs font-bold ${pctBloco === 100 ? "text-emerald-400" : "text-gray-500"}`}>
                    {concluidos}/{total} tópicos
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pctBloco === 100 ? "bg-emerald-500" : "bg-emerald-600/60"}`}
                    style={{ width: `${pctBloco}%` }}
                  />
                </div>
              </div>

              {/* Status por tópico */}
              <div className="mb-5 space-y-2">
                {blocoTrancadoMsg.prevBloco.topicos.map((topico) => {
                  const prog = computeProgresso(topico);
                  const ok   = topicosConcluidos.has(topico.id);
                  const ehAlvo = primeiroIncompleto?.id === topico.id;
                  return (
                    <div
                      key={topico.id}
                      className={`rounded-xl p-3 border flex items-start gap-3 transition-colors ${
                        ok
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : ehAlvo
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-gray-800/60 border-gray-700/60"
                      }`}
                    >
                      <span className={`mt-0.5 text-sm shrink-0 ${ok ? "text-emerald-400" : ehAlvo ? "text-amber-400" : "text-gray-600"}`}>
                        {ok ? "✓" : ehAlvo ? "▶" : "○"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${ok ? "text-gray-300" : ehAlvo ? "text-amber-200" : "text-gray-400"}`}>
                          {topico.titulo}
                          {ehAlvo && <span className="ml-1 text-amber-400 text-[10px]">← próximo</span>}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          {topico.quizzes.length > 0 && (
                            <span className={`text-[11px] flex items-center gap-1 ${prog.quizPct !== null && prog.quizPct >= MINIMO_APROVACAO ? "text-emerald-400" : "text-gray-500"}`}>
                              🧠 {prog.quizPct !== null
                                ? `${prog.quizPct}%`
                                : `${prog.quizRespondidas}/${prog.quizTotal} resp.`}
                              {prog.quizPct !== null && prog.quizPct >= MINIMO_APROVACAO && " ✓"}
                            </span>
                          )}
                          {topico.flashcards.length > 0 && (
                            <span className={`text-[11px] flex items-center gap-1 ${prog.fcPct !== null && prog.fcPct >= MINIMO_APROVACAO ? "text-emerald-400" : "text-gray-500"}`}>
                              🃏 {prog.fcPct !== null
                                ? `${prog.fcPct}%`
                                : `${prog.fcRevisadas}/${prog.fcTotal} rev.`}
                              {prog.fcPct !== null && prog.fcPct >= MINIMO_APROVACAO && " ✓"}
                            </span>
                          )}
                          {topico.quizzes.length === 0 && topico.flashcards.length === 0 && (
                            <span className="text-[11px] text-emerald-400">Auto-concluído ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-2">
                {primeiroIncompleto && (
                  <button
                    onClick={() => {
                      setBlocoTrancadoMsg(null);
                      handleTopico(primeiroIncompleto);
                      // Abre a aba correta: quiz ou flashcards se conteúdo já ok
                      const prog = computeProgresso(primeiroIncompleto);
                      if (prog.quizTotal > 0 && (prog.quizPct === null || prog.quizPct < MINIMO_APROVACAO)) {
                        setAbaAtiva("quiz");
                      } else if (prog.fcTotal > 0 && (prog.fcPct === null || prog.fcPct < MINIMO_APROVACAO)) {
                        setAbaAtiva("flashcards");
                      }
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>▶</span>
                    <span>Ir para "{primeiroIncompleto.titulo}"</span>
                  </button>
                )}
                <button
                  onClick={() => setBlocoTrancadoMsg(null)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-colors text-sm ${
                    primeiroIncompleto
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                      : "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold"
                  }`}
                >
                  {primeiroIncompleto ? "Fechar" : "Entendido"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
