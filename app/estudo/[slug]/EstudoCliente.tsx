"use client";

import { useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import UserMenuWidget from "@/components/UserMenuWidget";

type Opcao = { id: string; texto: string; correta: boolean; ordem: number };
type Quiz = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[] };
type Flashcard = { id: string; frente: string; verso: string; dica: string | null };
type Topico = {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  resumo: string | null;
  quizzes: Quiz[];
  flashcards: Flashcard[];
};
type Bloco = { id: string; nome: string; slug: string; topicos: Topico[] };
type Materia = {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  descricao: string | null;
  blocos: Bloco[];
};

const TAG_COLORS: Record<string, string> = {
  hot: "bg-red-500/15 text-red-400 border-red-500/30",
  med: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ok:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

type UserInfo = { nome: string; id: string };

export default function EstudoCliente({ materia, user }: { materia: Materia; user: UserInfo }) {
  const [topicoAtivo, setTopicoAtivo] = useState<Topico | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"conteudo" | "quiz" | "flashcards">("conteudo");
  const [blocoAbertoId, setBlocoAbertoId] = useState<string | null>(null);
  const [blocosConcluidos, setBlocosConcluidos] = useState<Set<string>>(new Set());

  // Quiz state
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [revelados, setRevelados] = useState<Set<string>>(new Set());

  // Flashcard state
  const [fcIndex, setFcIndex] = useState(0);
  const [fcVirado, setFcVirado] = useState(false);

  // Progress
  const totalTopicos = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes = materia.blocos.reduce(
    (a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0),
    0
  );
  const totalFlashcards = materia.blocos.reduce(
    (a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0),
    0
  );
  const acertos = Object.keys(revelados).length > 0
    ? Object.keys(respostas).filter((qid) => {
        if (!revelados.has(qid)) return false;
        const quiz = materia.blocos
          .flatMap((b) => b.topicos)
          .flatMap((t) => t.quizzes)
          .find((q) => q.id === qid);
        return quiz?.opcoes.find((o) => o.id === respostas[qid])?.correta;
      }).length
    : 0;

  const toggleBloco = (id: string) => {
    setBlocoAbertoId((prev) => (prev === id ? null : id));
  };

  const handleTopico = (topico: Topico) => {
    // Abre o bloco pai e fecha os outros
    const pai = materia.blocos.find((b) => b.topicos.some((t) => t.id === topico.id));
    if (pai) setBlocoAbertoId(pai.id);
    setTopicoAtivo(topico);
    setAbaAtiva("conteudo");
    setRespostas({});
    setRevelados(new Set());
    setFcIndex(0);
    setFcVirado(false);
  };

  const responder = (quizId: string, opcaoId: string) => {
    if (revelados.has(quizId)) return;
    setRespostas((r) => ({ ...r, [quizId]: opcaoId }));
  };

  const revelar = (quizId: string) =>
    setRevelados((r) => new Set([...r, quizId]));

  const marcarBloco = (blocoId: string) =>
    setBlocosConcluidos((prev) => new Set([...prev, blocoId]));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 shrink-0 z-10">
        <Link href="/estudo" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5 shrink-0">
          ← Minhas matérias
        </Link>
        <span className="text-gray-700">|</span>
        <span className="text-sm text-white font-medium truncate flex-1">
          {materia.icone} {materia.nome}
        </span>
        <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 shrink-0">
          <span>📚 {totalTopicos} tópicos</span>
          <span>🧠 {totalQuizzes} questões</span>
          <span>🃏 {totalFlashcards} cards</span>
          {acertos > 0 && (
            <span className="text-emerald-400 font-semibold">✓ {acertos} acerto{acertos !== 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="shrink-0 border-l border-gray-800 pl-3 ml-1">
          <UserMenuWidget nome={user.nome} perfilHref="/estudo/perfil" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto shrink-0">
          <nav className="p-3 space-y-1 flex-1">
            {materia.blocos.map((bloco, bi) => {
              const concluido = blocosConcluidos.has(bloco.id);
              const aberto = blocoAbertoId === bloco.id;
              const numBloco = String(bi + 1).padStart(2, "0");
              return (
                <div key={bloco.id}>
                  <button
                    onClick={() => toggleBloco(bloco.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left group"
                  >
                    {/* Número do bloco */}
                    <span className={`shrink-0 text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded-md ${
                      concluido
                        ? "bg-emerald-500/20 text-emerald-400"
                        : aberto
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
                    }`}>
                      {concluido ? "✓" : numBloco}
                    </span>
                    <span className={`flex-1 text-xs font-semibold uppercase tracking-wider leading-tight ${
                      concluido ? "text-emerald-400" : "text-gray-400 group-hover:text-gray-200"
                    }`}>
                      {bloco.nome}
                    </span>
                    <span className="text-gray-600 text-xs shrink-0">
                      {aberto ? "▾" : "▸"}
                    </span>
                  </button>

                  {aberto && (
                    <div className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-800 pl-3 ml-4">
                      {bloco.topicos.map((topico, ti) => {
                        const ativo = topicoAtivo?.id === topico.id;
                        const numTopico = `${bi + 1}.${ti + 1}`;
                        return (
                          <button
                            key={topico.id}
                            onClick={() => handleTopico(topico)}
                            className={`w-full text-left px-2 py-2 rounded-lg text-xs transition-all flex items-start gap-2 ${
                              ativo
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {/* Número do tópico */}
                            <span className={`shrink-0 text-[10px] font-mono mt-0.5 ${
                              ativo ? "text-emerald-500" : "text-gray-600"
                            }`}>
                              {numTopico}
                            </span>
                            <div className="min-w-0">
                              <div className="font-medium leading-tight">{topico.titulo}</div>
                              <div className="flex gap-2 mt-0.5 opacity-70">
                                {topico.quizzes.length > 0 && (
                                  <span>{topico.quizzes.length} quiz</span>
                                )}
                                {topico.flashcards.length > 0 && (
                                  <span>{topico.flashcards.length} cards</span>
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
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {!topicoAtivo ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
              <span className="text-4xl">👈</span>
              <p className="text-sm">Selecione um tópico na barra lateral</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-8">
              {/* Breadcrumb do bloco */}
              {(() => {
                const bloco = materia.blocos.find((b) =>
                  b.topicos.some((t) => t.id === topicoAtivo.id)
                );
                return bloco ? (
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-xs text-gray-600">{bloco.nome}</span>
                    <span className="text-gray-700">›</span>
                    <span className="text-xs text-gray-400">{topicoAtivo.titulo}</span>
                    {!blocosConcluidos.has(bloco.id) && (
                      <button
                        onClick={() => marcarBloco(bloco.id)}
                        className="ml-auto text-xs text-gray-600 hover:text-emerald-400 border border-gray-800 hover:border-emerald-500/50 rounded-full px-3 py-1 transition-all"
                      >
                        ✓ Marcar bloco como concluído
                      </button>
                    )}
                    {blocosConcluidos.has(bloco.id) && (
                      <span className="ml-auto text-xs text-emerald-400">✓ Bloco concluído</span>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Tabs */}
              <div className="flex gap-1 mb-7 bg-gray-900 rounded-xl p-1 w-fit border border-gray-800">
                {(["conteudo", "quiz", "flashcards"] as const).map((aba) => (
                  <button
                    key={aba}
                    onClick={() => {
                      setAbaAtiva(aba);
                      setFcVirado(false);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      abaAtiva === aba
                        ? "bg-emerald-500 text-white shadow"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {aba === "conteudo" && "📖 Conteúdo"}
                    {aba === "quiz" && `🧠 Quiz (${topicoAtivo.quizzes.length})`}
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
                    const todosTopicos = materia.blocos.flatMap((b) => b.topicos);
                    const idx = todosTopicos.findIndex((t) => t.id === topicoAtivo.id);
                    const prev = idx > 0 ? todosTopicos[idx - 1] : null;
                    const next = idx < todosTopicos.length - 1 ? todosTopicos[idx + 1] : null;
                    return (
                      <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
                        {prev ? (
                          <button
                            onClick={() => handleTopico(prev)}
                            className="text-xs text-gray-500 hover:text-emerald-400 transition-colors text-left max-w-xs"
                          >
                            ← {prev.titulo}
                          </button>
                        ) : <div />}
                        {next ? (
                          <button
                            onClick={() => handleTopico(next)}
                            className="text-xs text-gray-500 hover:text-emerald-400 transition-colors text-right max-w-xs"
                          >
                            {next.titulo} →
                          </button>
                        ) : <div />}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── QUIZ ── */}
              {abaAtiva === "quiz" && (
                <div className="space-y-6">
                  {topicoAtivo.quizzes.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="text-3xl mb-3">🧠</div>
                      <p className="text-sm">Nenhuma questão cadastrada para este tópico.</p>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const total = topicoAtivo.quizzes.length;
                        const respondidas = topicoAtivo.quizzes.filter((q) => revelados.has(q.id)).length;
                        const certas = topicoAtivo.quizzes.filter((q) => {
                          if (!revelados.has(q.id)) return false;
                          return q.opcoes.find((o) => o.id === respostas[q.id])?.correta;
                        }).length;
                        return respondidas > 0 ? (
                          <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 flex items-center gap-4 text-sm">
                            <span className="text-gray-400">{respondidas}/{total} respondidas</span>
                            <span className="text-emerald-400 font-semibold">{certas} corretas</span>
                            {certas > 0 && (
                              <span className="text-gray-500">
                                {Math.round((certas / respondidas) * 100)}% de aproveitamento
                              </span>
                            )}
                          </div>
                        ) : null;
                      })()}

                      {topicoAtivo.quizzes.map((quiz, qi) => {
                        const respostaId = respostas[quiz.id];
                        const isRevelado = revelados.has(quiz.id);
                        return (
                          <div key={quiz.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-white font-semibold mb-5 leading-relaxed">
                              <span className="text-emerald-400 text-sm mr-2 font-normal">
                                Questão {qi + 1}
                              </span>
                              {quiz.pergunta}
                            </p>
                            <div className="space-y-2.5">
                              {quiz.opcoes.map((opcao) => {
                                let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
                                if (!respostaId) {
                                  cls += "border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-gray-300 hover:text-white cursor-pointer";
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
                                  <button
                                    key={opcao.id}
                                    className={cls}
                                    onClick={() => responder(quiz.id, opcao.id)}
                                    disabled={isRevelado}
                                  >
                                    {isRevelado && opcao.correta && <span className="mr-2">✓</span>}
                                    {isRevelado && opcao.id === respostaId && !opcao.correta && <span className="mr-2">✗</span>}
                                    {opcao.texto}
                                  </button>
                                );
                              })}
                            </div>

                            {respostaId && !isRevelado && (
                              <button
                                onClick={() => revelar(quiz.id)}
                                className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
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
                      {/* Card com flip */}
                      <div
                        className="cursor-pointer select-none"
                        style={{ perspective: "1000px" }}
                        onClick={() => setFcVirado((v) => !v)}
                      >
                        <div
                          className="relative min-h-52 transition-transform duration-500"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: fcVirado ? "rotateY(180deg)" : "rotateY(0deg)",
                          }}
                        >
                          {/* Frente */}
                          <div
                            className="absolute inset-0 bg-gray-900 border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <div className="text-xs text-gray-600 uppercase tracking-widest mb-4">
                              Clique para revelar
                            </div>
                            <p className="text-white text-lg font-semibold leading-relaxed">
                              {topicoAtivo.flashcards[fcIndex].frente}
                            </p>
                            {topicoAtivo.flashcards[fcIndex].dica && (
                              <p className="text-xs text-gray-600 mt-4">
                                💡 {topicoAtivo.flashcards[fcIndex].dica}
                              </p>
                            )}
                          </div>
                          {/* Verso */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            <div className="text-xs text-emerald-600 uppercase tracking-widest mb-4">
                              Resposta
                            </div>
                            <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
                              {topicoAtivo.flashcards[fcIndex].verso}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Navegação */}
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => { setFcIndex((i) => i - 1); setFcVirado(false); }}
                          disabled={fcIndex === 0}
                          className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          ← Anterior
                        </button>
                        <div className="text-center">
                          <span className="text-sm text-gray-400">
                            {fcIndex + 1} / {topicoAtivo.flashcards.length}
                          </span>
                          <div className="flex gap-1 justify-center mt-2">
                            {topicoAtivo.flashcards.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => { setFcIndex(i); setFcVirado(false); }}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  i === fcIndex ? "bg-emerald-400" : "bg-gray-700 hover:bg-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => { setFcIndex((i) => i + 1); setFcVirado(false); }}
                          disabled={fcIndex === topicoAtivo.flashcards.length - 1}
                          className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
