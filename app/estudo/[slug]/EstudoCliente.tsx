"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Opcao     = { id: string; texto: string; correta: boolean; ordem: number };
type Quiz      = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[] };
type Flashcard = { id: string; frente: string; verso: string; dica: string | null };
type Topico    = { id: string; titulo: string; slug: string; conteudo: string; resumo: string | null; quizzes: Quiz[]; flashcards: Flashcard[] };
type Bloco     = { id: string; nome: string; slug: string; topicos: Topico[] };
type Materia   = { id: string; nome: string; slug: string; icone: string | null; descricao: string | null; blocos: Bloco[] };
type UserInfo  = { nome: string; id: string };

/* ─────────────────────────────────────────────────────────────────
   SIDEBAR NAV — componente de nível de módulo
───────────────────────────────────────────────────────────────── */
interface SidebarNavProps {
  materia: Materia;
  topicoAtivo: Topico | null;
  blocoAbertoId: string | null;
  blocosConcluidos: Set<string>;
  onToggleBloco: (id: string) => void;
  onSelectTopico: (t: Topico) => void;
}

function SidebarNav({
  materia,
  topicoAtivo,
  blocoAbertoId,
  blocosConcluidos,
  onToggleBloco,
  onSelectTopico,
}: SidebarNavProps) {
  return (
    <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
      {materia.blocos.map((bloco, bi) => {
        const concluido = blocosConcluidos.has(bloco.id);
        const aberto    = blocoAbertoId === bloco.id;
        const numBloco  = String(bi + 1).padStart(2, "0");
        return (
          <div key={bloco.id}>
            {/* Botão do bloco — touch target mínimo 44px */}
            <button
              onClick={() => onToggleBloco(bloco.id)}
              className="w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors text-left group"
            >
              <span className={`shrink-0 text-[10px] font-mono font-bold w-7 h-7 flex items-center justify-center rounded-lg ${
                concluido ? "bg-emerald-500/20 text-emerald-400"
                : aberto  ? "bg-gray-700 text-gray-200"
                          : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
              }`}>
                {concluido ? "✓" : numBloco}
              </span>
              <span className={`flex-1 text-xs font-semibold uppercase tracking-wide leading-tight ${
                concluido ? "text-emerald-400" : "text-gray-400 group-hover:text-gray-200"
              }`}>
                {bloco.nome}
              </span>
              <span className="text-gray-600 text-xs shrink-0">{aberto ? "▾" : "▸"}</span>
            </button>

            {aberto && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-800 pl-3">
                {bloco.topicos.map((topico, ti) => {
                  const ativo     = topicoAtivo?.id === topico.id;
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
                      <div className="min-w-0">
                        <div className="font-medium leading-snug">{topico.titulo}</div>
                        {(topico.quizzes.length > 0 || topico.flashcards.length > 0) && (
                          <div className="flex gap-2 mt-1 opacity-70 text-[10px]">
                            {topico.quizzes.length > 0    && <span>🧠 {topico.quizzes.length}</span>}
                            {topico.flashcards.length > 0 && <span>🃏 {topico.flashcards.length}</span>}
                          </div>
                        )}
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

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export default function EstudoCliente({ materia, user }: { materia: Materia; user: UserInfo }) {
  const router = useRouter();

  const [topicoAtivo,      setTopicoAtivo]      = useState<Topico | null>(null);
  const [abaAtiva,         setAbaAtiva]          = useState<"conteudo" | "quiz" | "flashcards">("conteudo");
  const [blocoAbertoId,    setBlocoAbertoId]     = useState<string | null>(null);
  const [blocosConcluidos, setBlocosConcluidos]  = useState<Set<string>>(new Set());
  const [sidebarAberta,    setSidebarAberta]     = useState(false);
  const [respostas,        setRespostas]         = useState<Record<string, string>>({});
  const [revelados,        setRevelados]         = useState<Set<string>>(new Set());
  const [fcIndex,          setFcIndex]           = useState(0);
  const [fcVirado,         setFcVirado]          = useState(false);

  const inicial      = user.nome.charAt(0).toUpperCase();
  const primeiroNome = user.nome.split(" ")[0];

  const totalTopicos    = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes    = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
  const totalFlashcards = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);
  const acertos = [...revelados].filter((qid) => {
    const quiz = materia.blocos.flatMap((b) => b.topicos).flatMap((t) => t.quizzes).find((q) => q.id === qid);
    return quiz?.opcoes.find((o) => o.id === respostas[qid])?.correta;
  }).length;

  const toggleBloco  = (id: string) => setBlocoAbertoId((prev) => (prev === id ? null : id));
  const marcarBloco  = (blocoId: string) => setBlocosConcluidos((prev) => new Set([...prev, blocoId]));
  const responder    = (quizId: string, opcaoId: string) => {
    if (revelados.has(quizId)) return;
    setRespostas((r) => ({ ...r, [quizId]: opcaoId }));
  };
  const revelar = (quizId: string) => setRevelados((r) => new Set([...r, quizId]));

  const handleTopico = (topico: Topico) => {
    const pai = materia.blocos.find((b) => b.topicos.some((t) => t.id === topico.id));
    if (pai) setBlocoAbertoId(pai.id);
    setTopicoAtivo(topico);
    setAbaAtiva("conteudo");
    setRespostas({});
    setRevelados(new Set());
    setFcIndex(0);
    setFcVirado(false);
    setSidebarAberta(false);
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navProps: SidebarNavProps = {
    materia, topicoAtivo, blocoAbertoId, blocosConcluidos,
    onToggleBloco: toggleBloco,
    onSelectTopico: handleTopico,
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ══ NAVBAR ════════════════════════════════════════════════════ */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-3 gap-2 shrink-0 z-20">
        {/* Hamburger — mobile */}
        <button
          onClick={() => setSidebarAberta(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-800 active:bg-gray-700 text-gray-400 shrink-0"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Voltar — desktop */}
        <Link
          href="/estudo"
          className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors shrink-0"
        >
          ← Início
        </Link>
        <span className="hidden md:inline text-gray-700 shrink-0">|</span>

        {/* Título */}
        <span className="text-sm text-white font-medium truncate flex-1 min-w-0">
          {materia.icone} {materia.nome}
        </span>

        {/* Stats — desktop */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500 shrink-0">
          <span>📚 {totalTopicos}</span>
          <span>🧠 {totalQuizzes}</span>
          <span>🃏 {totalFlashcards}</span>
          {acertos > 0 && <span className="text-emerald-400 font-semibold">✓ {acertos}</span>}
        </div>

        {/* Usuário */}
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

      {/* ══ LAYOUT ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR DESKTOP ──────────────────────────────────────── */}
        <aside className="hidden md:flex md:flex-col w-64 xl:w-72 shrink-0 bg-gray-900 border-r border-gray-800 overflow-hidden">
          <SidebarNav {...navProps} />
        </aside>

        {/* ── DRAWER MOBILE ────────────────────────────────────────── */}
        {sidebarAberta && (
          <div
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
            onClick={() => setSidebarAberta(false)}
          />
        )}
        <div className={[
          "fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-gray-900 border-r border-gray-800",
          "flex flex-col md:hidden",
          "transform transition-transform duration-300 ease-in-out",
          sidebarAberta ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}>
          {/* Header do drawer */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-800 shrink-0">
            <Link
              href="/estudo"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
              onClick={() => setSidebarAberta(false)}
            >
              ← Início
            </Link>
            <button
              onClick={() => setSidebarAberta(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-800 active:bg-gray-700 text-gray-400"
            >
              ✕
            </button>
          </div>
          <SidebarNav {...navProps} />
        </div>

        {/* ══ CONTEÚDO PRINCIPAL ════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto w-full">

          {/* Estado vazio: nenhum tópico selecionado */}
          {!topicoAtivo ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4 px-6 text-center">
              <span className="text-6xl">📖</span>
              <div>
                <p className="text-base font-medium text-gray-400 mb-1">
                  {materia.icone} {materia.nome}
                </p>
                {/* Mobile: botão grande para abrir sidebar */}
                <button
                  onClick={() => setSidebarAberta(true)}
                  className="md:hidden mt-3 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-500 text-white text-sm font-medium px-5 py-3 rounded-2xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Ver tópicos
                </button>
                <p className="hidden md:block text-sm mt-2 text-gray-600">
                  Selecione um tópico na barra lateral para começar
                </p>
              </div>
            </div>
          ) : (
            /* ── Tópico ativo ─────────────────────────────────── */
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6">

              {/* Breadcrumb + botão concluir */}
              {(() => {
                const bloco = materia.blocos.find((b) => b.topicos.some((t) => t.id === topicoAtivo.id));
                return bloco ? (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs text-gray-600 shrink-0">{bloco.nome}</span>
                    <span className="text-gray-700 shrink-0">›</span>
                    <span className="text-xs text-gray-400 min-w-0 truncate flex-1">{topicoAtivo.titulo}</span>
                    {!blocosConcluidos.has(bloco.id) ? (
                      <button
                        onClick={() => marcarBloco(bloco.id)}
                        className="text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-400 border border-gray-800 hover:border-emerald-500/50 rounded-full px-3 py-1.5 transition-all shrink-0"
                      >
                        ✓ Concluir bloco
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 shrink-0">✓ Concluído</span>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Tabs — ícone + texto curto no mobile */}
              <div className="flex mb-6 bg-gray-900/80 rounded-xl p-1 border border-gray-800 w-full">
                {(["conteudo", "quiz", "flashcards"] as const).map((aba) => (
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
                      {aba === "conteudo"   && "Conteúdo"}
                      {aba === "quiz"       && `Quiz (${topicoAtivo.quizzes.length})`}
                      {aba === "flashcards" && `Cards (${topicoAtivo.flashcards.length})`}
                    </span>
                    <span className="sm:hidden text-xs">
                      {aba === "conteudo"   && "Leitura"}
                      {aba === "quiz"       && `Quiz${topicoAtivo.quizzes.length > 0 ? ` (${topicoAtivo.quizzes.length})` : ""}`}
                      {aba === "flashcards" && `Cards${topicoAtivo.flashcards.length > 0 ? ` (${topicoAtivo.flashcards.length})` : ""}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── CONTEÚDO ──────────────────────────────────── */}
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
                    const todos = materia.blocos.flatMap((b) => b.topicos);
                    const idx   = todos.findIndex((t) => t.id === topicoAtivo.id);
                    const prev  = idx > 0 ? todos[idx - 1] : null;
                    const next  = idx < todos.length - 1 ? todos[idx + 1] : null;
                    return (
                      <div className="flex gap-3 mt-10 pt-6 border-t border-gray-800">
                        {prev ? (
                          <button
                            onClick={() => handleTopico(prev)}
                            className="flex-1 text-left text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-3 px-1"
                          >
                            ← {prev.titulo}
                          </button>
                        ) : <div className="flex-1" />}
                        {next ? (
                          <button
                            onClick={() => handleTopico(next)}
                            className="flex-1 text-right text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-3 px-1"
                          >
                            {next.titulo} →
                          </button>
                        ) : <div className="flex-1" />}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── QUIZ ──────────────────────────────────────── */}
              {abaAtiva === "quiz" && (
                <div className="space-y-4">
                  {topicoAtivo.quizzes.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-4xl mb-3">🧠</div>
                      <p className="text-sm">Nenhuma questão cadastrada para este tópico.</p>
                    </div>
                  ) : (
                    <>
                      {/* Placar */}
                      {(() => {
                        const total       = topicoAtivo.quizzes.length;
                        const respondidas = topicoAtivo.quizzes.filter((q) => revelados.has(q.id)).length;
                        const certas      = topicoAtivo.quizzes.filter((q) =>
                          revelados.has(q.id) && q.opcoes.find((o) => o.id === respostas[q.id])?.correta
                        ).length;
                        return respondidas > 0 ? (
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 text-sm mb-2">
                            <span className="text-gray-400">{respondidas}/{total} respondidas</span>
                            <span className="text-emerald-400 font-semibold">{certas} corretas</span>
                            {certas > 0 && <span className="text-gray-500">{Math.round((certas / respondidas) * 100)}%</span>}
                          </div>
                        ) : null;
                      })()}

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
                                    {isRevelado && opcao.correta                            && <span className="mr-2">✓</span>}
                                    {isRevelado && opcao.id === respostaId && !opcao.correta && <span className="mr-2">✗</span>}
                                    {opcao.texto}
                                  </button>
                                );
                              })}
                            </div>
                            {respostaId && !isRevelado && (
                              <button
                                onClick={() => revelar(quiz.id)}
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
                  )}
                </div>
              )}

              {/* ── FLASHCARDS ────────────────────────────────── */}
              {abaAtiva === "flashcards" && (
                <div>
                  {topicoAtivo.flashcards.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-4xl mb-3">🃏</div>
                      <p className="text-sm">Nenhum flashcard cadastrado para este tópico.</p>
                    </div>
                  ) : (
                    <div>
                      {/* Card com flip */}
                      <div
                        className="cursor-pointer select-none"
                        style={{ perspective: "1000px" }}
                        onClick={() => setFcVirado((v) => !v)}
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
                            className="absolute inset-0 bg-gray-900 border border-gray-800 hover:border-emerald-500/40 active:border-emerald-500/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <div className="text-xs text-gray-600 uppercase tracking-widest mb-3">Toque para revelar</div>
                            <p className="text-white text-base sm:text-lg font-semibold leading-relaxed">
                              {topicoAtivo.flashcards[fcIndex].frente}
                            </p>
                            {topicoAtivo.flashcards[fcIndex].dica && (
                              <p className="text-xs text-gray-600 mt-3">💡 {topicoAtivo.flashcards[fcIndex].dica}</p>
                            )}
                          </div>
                          {/* Verso */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            <div className="text-xs text-emerald-600 uppercase tracking-widest mb-3">Resposta</div>
                            <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                              {topicoAtivo.flashcards[fcIndex].verso}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progresso */}
                      <div className="flex items-center gap-2 mt-4">
                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${((fcIndex + 1) / topicoAtivo.flashcards.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">{fcIndex + 1}/{topicoAtivo.flashcards.length}</span>
                      </div>

                      {/* Navegação prev/next — botões grandes para mobile */}
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

                      {/* Dots de navegação */}
                      {topicoAtivo.flashcards.length <= 20 && (
                        <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
                          {topicoAtivo.flashcards.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => { setFcIndex(i); setFcVirado(false); }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === fcIndex ? "bg-emerald-400" : "bg-gray-700 hover:bg-gray-500"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Espaço extra no final para mobile (safe area) */}
              <div className="h-8 md:h-0" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
