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
   SIDEBAR NAV — componente de nível de módulo (não criado no render)
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
            <button
              onClick={() => onToggleBloco(bloco.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-800 active:bg-gray-800 transition-colors text-left group"
            >
              <span className={`shrink-0 text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded-md ${
                concluido ? "bg-emerald-500/20 text-emerald-400"
                : aberto  ? "bg-gray-700 text-gray-200"
                          : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
              }`}>
                {concluido ? "✓" : numBloco}
              </span>
              <span className={`flex-1 text-xs font-semibold uppercase tracking-wider leading-tight ${
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
                      className={`w-full text-left px-2 py-2.5 rounded-lg text-xs transition-all flex items-start gap-2 ${
                        ativo
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white active:bg-gray-700"
                      }`}
                    >
                      <span className={`shrink-0 text-[10px] font-mono mt-0.5 ${ativo ? "text-emerald-500" : "text-gray-600"}`}>
                        {numTopico}
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium leading-tight">{topico.titulo}</div>
                        <div className="flex gap-2 mt-0.5 opacity-70">
                          {topico.quizzes.length > 0    && <span>{topico.quizzes.length} quiz</span>}
                          {topico.flashcards.length > 0 && <span>{topico.flashcards.length} cards</span>}
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

/* ─────────────────────────────────────────────────────────────────
   CLIENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export default function EstudoCliente({ materia, user }: { materia: Materia; user: UserInfo }) {
  const router = useRouter();

  const [topicoAtivo,       setTopicoAtivo]       = useState<Topico | null>(null);
  const [abaAtiva,          setAbaAtiva]           = useState<"conteudo" | "quiz" | "flashcards">("conteudo");
  const [blocoAbertoId,     setBlocoAbertoId]      = useState<string | null>(null);
  const [blocosConcluidos,  setBlocosConcluidos]   = useState<Set<string>>(new Set());
  const [sidebarAberta,     setSidebarAberta]      = useState(false);
  const [respostas,         setRespostas]          = useState<Record<string, string>>({});
  const [revelados,         setRevelados]          = useState<Set<string>>(new Set());
  const [fcIndex,           setFcIndex]            = useState(0);
  const [fcVirado,          setFcVirado]           = useState(false);

  const inicial       = user.nome.charAt(0).toUpperCase();
  const primeiroNome  = user.nome.split(" ")[0];
  const totalTopicos    = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes    = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
  const totalFlashcards = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);
  const acertos = [...revelados].filter((qid) => {
    const quiz = materia.blocos.flatMap((b) => b.topicos).flatMap((t) => t.quizzes).find((q) => q.id === qid);
    return quiz?.opcoes.find((o) => o.id === respostas[qid])?.correta;
  }).length;

  const toggleBloco = (id: string) => setBlocoAbertoId((prev) => (prev === id ? null : id));

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

  const responder = (quizId: string, opcaoId: string) => {
    if (revelados.has(quizId)) return;
    setRespostas((r) => ({ ...r, [quizId]: opcaoId }));
  };
  const revelar     = (quizId: string) => setRevelados((r) => new Set([...r, quizId]));
  const marcarBloco = (blocoId: string) => setBlocosConcluidos((prev) => new Set([...prev, blocoId]));

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navProps: SidebarNavProps = {
    materia,
    topicoAtivo,
    blocoAbertoId,
    blocosConcluidos,
    onToggleBloco: toggleBloco,
    onSelectTopico: handleTopico,
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-3 gap-2 shrink-0 z-20">
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setSidebarAberta(true)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-800 active:bg-gray-700 text-gray-400 shrink-0"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Voltar (desktop) */}
        <Link
          href="/estudo"
          className="hidden md:flex text-gray-400 hover:text-white transition-colors text-sm items-center gap-1.5 shrink-0"
        >
          ← Início
        </Link>
        <span className="hidden md:inline text-gray-700 shrink-0">|</span>

        {/* Título da matéria */}
        <span className="text-sm text-white font-medium truncate flex-1">
          {materia.icone} {materia.nome}
        </span>

        {/* Stats (desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500 shrink-0">
          <span>📚 {totalTopicos}</span>
          <span>🧠 {totalQuizzes}</span>
          <span>🃏 {totalFlashcards}</span>
          {acertos > 0 && <span className="text-emerald-400 font-semibold">✓ {acertos}</span>}
        </div>

        {/* Usuário — avatar + nome + sair */}
        <div className="flex items-center gap-0.5 shrink-0 border-l border-gray-800 pl-2 ml-1">
          <Link
            href="/estudo/perfil"
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 active:bg-gray-800 transition-colors group"
            title="Meu perfil"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
              {inicial}
            </div>
            <span className="hidden sm:inline text-sm text-gray-300 group-hover:text-white transition-colors max-w-[100px] truncate">
              {primeiroNome}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-8 sm:px-2.5 sm:w-auto sm:h-auto sm:py-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sair"
          >
            <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline text-xs">Sair</span>
          </button>
        </div>
      </header>

      {/* ── LAYOUT ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══ SIDEBAR DESKTOP (sempre visível em md+) ══════════════════ */}
        <aside className="hidden md:flex md:flex-col w-64 xl:w-72 shrink-0 bg-gray-900 border-r border-gray-800 overflow-hidden">
          <SidebarNav {...navProps} />
        </aside>

        {/* ══ DRAWER MOBILE ════════════════════════════════════════════ */}
        {sidebarAberta && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarAberta(false)}
          />
        )}
        <div
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800",
            "flex flex-col md:hidden",
            "transform transition-transform duration-300 ease-in-out",
            sidebarAberta ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {/* Mobile drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
            <Link
              href="/estudo"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
              onClick={() => setSidebarAberta(false)}
            >
              ← Início
            </Link>
            <button
              onClick={() => setSidebarAberta(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-500"
            >
              ✕
            </button>
          </div>
          <SidebarNav {...navProps} />
        </div>

        {/* ══ CONTEÚDO PRINCIPAL ════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto w-full">
          {!topicoAtivo ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3 px-6 text-center">
              <span className="text-5xl">📖</span>
              <p className="text-sm">
                <button
                  onClick={() => setSidebarAberta(true)}
                  className="text-emerald-500 hover:text-emerald-400 md:hidden"
                >
                  Toque aqui
                </button>
                <span className="md:hidden"> para escolher um tópico</span>
                <span className="hidden md:inline">Selecione um tópico na barra lateral</span>
              </p>
            </div>
          ) : (
            <div className="mx-auto px-4 sm:px-6 md:px-8 py-6">

              {/* Breadcrumb */}
              {(() => {
                const bloco = materia.blocos.find((b) => b.topicos.some((t) => t.id === topicoAtivo.id));
                return bloco ? (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs text-gray-600">{bloco.nome}</span>
                    <span className="text-gray-700">›</span>
                    <span className="text-xs text-gray-400 flex-1 min-w-0 truncate">{topicoAtivo.titulo}</span>
                    {!blocosConcluidos.has(bloco.id) ? (
                      <button
                        onClick={() => marcarBloco(bloco.id)}
                        className="text-xs text-gray-600 hover:text-emerald-400 border border-gray-800 hover:border-emerald-500/50 rounded-full px-3 py-1 transition-all shrink-0"
                      >
                        ✓ Concluir bloco
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 shrink-0">✓ Concluído</span>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Tabs */}
              <div className="flex mb-6 bg-gray-900 rounded-xl p-1 border border-gray-800 w-full sm:w-fit">
                {(["conteudo", "quiz", "flashcards"] as const).map((aba) => (
                  <button
                    key={aba}
                    onClick={() => { setAbaAtiva(aba); setFcVirado(false); }}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      abaAtiva === aba
                        ? "bg-emerald-500 text-white shadow"
                        : "text-gray-400 hover:text-white hover:bg-gray-800 active:bg-gray-800"
                    }`}
                  >
                    {aba === "conteudo"   && "📖 Conteúdo"}
                    {aba === "quiz"       && `🧠 Quiz (${topicoAtivo.quizzes.length})`}
                    {aba === "flashcards" && `🃏 Cards (${topicoAtivo.flashcards.length})`}
                  </button>
                ))}
              </div>

              {/* ── CONTEÚDO ── */}
              {abaAtiva === "conteudo" && (
                <div>
                  {topicoAtivo.resumo && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6 text-emerald-200 text-sm leading-relaxed">
                      {topicoAtivo.resumo}
                    </div>
                  )}
                  <MarkdownRenderer content={topicoAtivo.conteudo} />

                  {/* Navegação entre tópicos */}
                  {(() => {
                    const todos = materia.blocos.flatMap((b) => b.topicos);
                    const idx   = todos.findIndex((t) => t.id === topicoAtivo.id);
                    const prev  = idx > 0 ? todos[idx - 1] : null;
                    const next  = idx < todos.length - 1 ? todos[idx + 1] : null;
                    return (
                      <div className="flex justify-between gap-4 mt-10 pt-6 border-t border-gray-800">
                        {prev ? (
                          <button
                            onClick={() => handleTopico(prev)}
                            className="flex-1 text-left text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-2"
                          >
                            ← {prev.titulo}
                          </button>
                        ) : <div className="flex-1" />}
                        {next ? (
                          <button
                            onClick={() => handleTopico(next)}
                            className="flex-1 text-right text-xs text-gray-500 hover:text-emerald-400 active:text-emerald-300 transition-colors py-2"
                          >
                            {next.titulo} →
                          </button>
                        ) : <div className="flex-1" />}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── QUIZ ── */}
              {abaAtiva === "quiz" && (
                <div className="space-y-5">
                  {topicoAtivo.quizzes.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-3xl mb-3">🧠</div>
                      <p className="text-sm">Nenhuma questão cadastrada para este tópico.</p>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const total      = topicoAtivo.quizzes.length;
                        const respondidas = topicoAtivo.quizzes.filter((q) => revelados.has(q.id)).length;
                        const certas     = topicoAtivo.quizzes.filter((q) => {
                          if (!revelados.has(q.id)) return false;
                          return q.opcoes.find((o) => o.id === respostas[q.id])?.correta;
                        }).length;
                        return respondidas > 0 ? (
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
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
                            <p className="text-white font-semibold mb-4 leading-relaxed">
                              <span className="text-emerald-400 text-sm mr-2 font-normal">Q{qi + 1}</span>
                              {quiz.pergunta}
                            </p>
                            <div className="space-y-2">
                              {quiz.opcoes.map((opcao) => {
                                let cls = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all leading-snug ";
                                if (!respostaId) {
                                  cls += "border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 active:bg-emerald-500/10 text-gray-300 hover:text-white cursor-pointer";
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
                                    {isRevelado && opcao.correta                       && <span className="mr-2">✓</span>}
                                    {isRevelado && opcao.id === respostaId && !opcao.correta && <span className="mr-2">✗</span>}
                                    {opcao.texto}
                                  </button>
                                );
                              })}
                            </div>

                            {respostaId && !isRevelado && (
                              <button
                                onClick={() => revelar(quiz.id)}
                                className="mt-4 w-full sm:w-auto text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-2 py-1"
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

              {/* ── FLASHCARDS ── */}
              {abaAtiva === "flashcards" && (
                <div>
                  {topicoAtivo.flashcards.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-3xl mb-3">🃏</div>
                      <p className="text-sm">Nenhum flashcard cadastrado para este tópico.</p>
                    </div>
                  ) : (
                    <div>
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
                            minHeight: "clamp(200px, 40vw, 260px)",
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-gray-900 border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <div className="text-xs text-gray-600 uppercase tracking-widest mb-3">Clique para revelar</div>
                            <p className="text-white text-base sm:text-lg font-semibold leading-relaxed">
                              {topicoAtivo.flashcards[fcIndex].frente}
                            </p>
                            {topicoAtivo.flashcards[fcIndex].dica && (
                              <p className="text-xs text-gray-600 mt-3">💡 {topicoAtivo.flashcards[fcIndex].dica}</p>
                            )}
                          </div>
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

                      <div className="flex items-center justify-between mt-5 gap-3">
                        <button
                          onClick={() => { setFcIndex((i) => i - 1); setFcVirado(false); }}
                          disabled={fcIndex === 0}
                          className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          ← Anterior
                        </button>
                        <div className="text-center shrink-0">
                          <span className="text-sm text-gray-400">{fcIndex + 1} / {topicoAtivo.flashcards.length}</span>
                          <div className="flex gap-1 justify-center mt-2">
                            {topicoAtivo.flashcards.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => { setFcIndex(i); setFcVirado(false); }}
                                className={`w-2 h-2 rounded-full transition-colors ${i === fcIndex ? "bg-emerald-400" : "bg-gray-700 hover:bg-gray-500"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => { setFcIndex((i) => i + 1); setFcVirado(false); }}
                          disabled={fcIndex === topicoAtivo.flashcards.length - 1}
                          className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Próximo →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
