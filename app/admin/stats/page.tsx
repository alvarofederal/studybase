"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { StatsPayload, QuestaoStat, TopicoStat, MateriaStat } from "@/app/api/admin/stats/route";

export const dynamic = "force-dynamic";

/* ── Helpers visuais ──────────────────────────────────────────────────────── */
type Aba = "questoes" | "topicos" | "materias";
type QSort = "respondidas" | "acerto_asc" | "acerto_desc" | "tentativas";

function PctBar({ pct, size = "md" }: { pct: number; size?: "sm" | "md" }) {
  const color =
    pct >= 80 ? "bg-emerald-500" :
    pct >= 60 ? "bg-teal-500" :
    pct >= 40 ? "bg-amber-500" :
    "bg-red-500";
  const h = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div className={`w-full bg-gray-800 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} ${color} rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function PctBadge({ pct }: { pct: number }) {
  const cls =
    pct >= 80 ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" :
    pct >= 60 ? "text-teal-400   bg-teal-500/15   border-teal-500/30" :
    pct >= 40 ? "text-amber-400  bg-amber-500/15  border-amber-500/30" :
    "text-red-400   bg-red-500/15   border-red-500/30";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {pct}%
    </span>
  );
}

function DifBadge({ d }: { d: string }) {
  const meta: Record<string, string> = {
    FACIL:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    MEDIO:   "bg-amber-500/15   text-amber-400   border-amber-500/30",
    DIFICIL: "bg-red-500/15     text-red-400     border-red-500/30",
  };
  const labels: Record<string, string> = { FACIL: "Fácil", MEDIO: "Médio", DIFICIL: "Difícil" };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${meta[d] ?? meta.MEDIO}`}>
      {labels[d] ?? d}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = "emerald" }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400",
    teal:    "text-teal-400",
    amber:   "text-amber-400",
    red:     "text-red-400",
    violet:  "text-violet-400",
    blue:    "text-blue-400",
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-1">
      <span className="text-2xl">{icon}</span>
      <span className={`text-3xl font-black mt-1 ${colors[color] ?? colors.emerald}`}>{value}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      {sub && <span className="text-[11px] text-gray-600">{sub}</span>}
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */
export default function StatsPage() {
  const [data, setData]     = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]     = useState("");
  const [aba, setAba]       = useState<Aba>("questoes");
  const [qSort, setQSort]   = useState<QSort>("respondidas");
  const [qFilter, setQFilter] = useState<string>("");   // matéria slug
  const [qDif, setQDif]     = useState<string>("");     // FACIL|MEDIO|DIFICIL

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setErro("Erro ao carregar estatísticas."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Questões filtradas + ordenadas ── */
  const questoesFiltradas = useMemo<QuestaoStat[]>(() => {
    if (!data) return [];
    let qs = data.questoes;
    if (qFilter) qs = qs.filter((q) => q.materiaSlug === qFilter);
    if (qDif)    qs = qs.filter((q) => q.dificuldade === qDif);
    switch (qSort) {
      case "respondidas":   return [...qs].sort((a, b) => b.totalUsuarios - a.totalUsuarios);
      case "acerto_asc":    return [...qs].sort((a, b) => a.acertoPct - b.acertoPct);
      case "acerto_desc":   return [...qs].sort((a, b) => b.acertoPct - a.acertoPct);
      case "tentativas":    return [...qs].sort((a, b) => b.totalTentativas - a.totalTentativas);
      default:              return qs;
    }
  }, [data, qSort, qFilter, qDif]);

  /* ── Tópicos ordenados ── */
  const topicosOrdenados = useMemo<TopicoStat[]>(() => {
    if (!data) return [];
    return [...data.topicos]
      .filter((t) => t.totalRevisoes > 0)
      .sort((a, b) => b.totalRevisoes - a.totalRevisoes);
  }, [data]);

  /* ── Matérias únicas para filtro ── */
  const materiasUnicas = useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    return data.questoes
      .filter((q) => { if (seen.has(q.materiaSlug)) return false; seen.add(q.materiaSlug); return true; })
      .map((q) => ({ slug: q.materiaSlug, nome: q.materiaNome, icone: q.materiaIcone }));
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-600 animate-pulse p-8">
      Carregando estatísticas…
    </div>
  );

  if (erro || !data) return (
    <div className="flex items-center justify-center h-full text-red-400 p-8">
      {erro || "Sem dados."}
    </div>
  );

  const { overview, materias } = data;

  /* ── Destaques ── */
  const pioresQuestoes = [...data.questoes]
    .filter((q) => q.totalUsuarios > 0)
    .sort((a, b) => a.acertoPct - b.acertoPct)
    .slice(0, 5);

  const maisRespondidas = [...data.questoes]
    .filter((q) => q.totalUsuarios > 0)
    .sort((a, b) => b.totalUsuarios - a.totalUsuarios)
    .slice(0, 5);

  return (
    <div className="text-white p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <span>›</span>
          <span className="text-gray-400">Estatísticas</span>
        </div>
        <h1 className="text-3xl font-black text-white">Estatísticas de Desempenho</h1>
        <p className="text-sm text-gray-500 mt-1">Análise de acertos, tentativas e atividade dos alunos</p>
      </div>

      {/* ── Overview cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon="📊" label="Respostas únicas"  value={overview.totalRespostas}      sub="última por aluno/questão" color="emerald" />
        <StatCard icon="🎯" label="Acerto geral"      value={`${overview.acertoPctGeral}%`} sub="nas últimas respostas"   color={overview.acertoPctGeral >= 70 ? "emerald" : overview.acertoPctGeral >= 50 ? "amber" : "red"} />
        <StatCard icon="👥" label="Alunos ativos"     value={overview.totalAlunosAtivos}    sub="com acesso vigente"      color="teal" />
        <StatCard icon="🔁" label="Total tentativas"  value={overview.totalTentativas}      sub="incluindo novas tentativas" color="violet" />
        <StatCard icon="✅" label="Questões respondidas" value={overview.questoesRespondidas} sub={`de ${data.questoes.length} total`} color="blue" />
        <StatCard icon="⚠️" label="Sem resposta"      value={overview.questoesSemResposta}  sub="nunca respondidas"       color={overview.questoesSemResposta > 0 ? "amber" : "emerald"} />
      </div>

      {/* ── Destaques rápidos ── */}
      {(pioresQuestoes.length > 0 || maisRespondidas.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Questões mais difíceis */}
          {pioresQuestoes.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                🔴 Questões com menor acerto
                <span className="text-[10px] text-gray-600 font-normal">— onde os alunos mais erram</span>
              </h2>
              <div className="space-y-3">
                {pioresQuestoes.map((q) => (
                  <div key={q.quizId} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-gray-300 leading-snug line-clamp-2 flex-1">{q.pergunta}</p>
                      <PctBadge pct={q.acertoPct} />
                    </div>
                    <div className="flex items-center gap-2">
                      <PctBar pct={q.acertoPct} size="sm" />
                      <span className="text-[10px] text-gray-600 shrink-0">{q.totalUsuarios} alunos</span>
                    </div>
                    <div className="text-[10px] text-gray-600">
                      {q.materiaIcone} {q.materiaNome} · {q.blocoNome} · {q.topicoTitulo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mais respondidas */}
          {maisRespondidas.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                🏆 Questões mais respondidas
                <span className="text-[10px] text-gray-600 font-normal">— maior engajamento</span>
              </h2>
              <div className="space-y-3">
                {maisRespondidas.map((q, i) => (
                  <div key={q.quizId} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-gray-600 w-5 shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 leading-snug truncate">{q.pergunta}</p>
                      <p className="text-[10px] text-gray-600 truncate">{q.materiaNome} · {q.topicoTitulo}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-white">{q.totalUsuarios}</div>
                      <PctBadge pct={q.acertoPct} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tabs de detalhe ── */}
      <div>
        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mb-6">
          {([
            { key: "questoes", label: "Questões", icon: "🧠" },
            { key: "topicos",  label: "Flashcards por tópico", icon: "🃏" },
            { key: "materias", label: "Por matéria", icon: "📚" },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => setAba(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === key ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}>
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── ABA: QUESTÕES ── */}
        {aba === "questoes" && (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Ordenar por:</span>
              {([
                { key: "respondidas",  label: "Mais respondidas" },
                { key: "acerto_asc",   label: "Pior acerto primeiro" },
                { key: "acerto_desc",  label: "Melhor acerto primeiro" },
                { key: "tentativas",   label: "Mais tentativas" },
              ] as const).map(({ key, label }) => (
                <button key={key} onClick={() => setQSort(key)}
                  className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                    qSort === key
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600"
                  }`}>
                  {label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                {/* Filtro matéria */}
                <select value={qFilter} onChange={(e) => setQFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
                  <option value="">Todas as matérias</option>
                  {materiasUnicas.map((m) => (
                    <option key={m.slug} value={m.slug}>{m.icone} {m.nome}</option>
                  ))}
                </select>
                {/* Filtro dificuldade */}
                <select value={qDif} onChange={(e) => setQDif(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
                  <option value="">Todas dificuldades</option>
                  <option value="FACIL">Fácil</option>
                  <option value="MEDIO">Médio</option>
                  <option value="DIFICIL">Difícil</option>
                </select>
                {(qFilter || qDif) && (
                  <button onClick={() => { setQFilter(""); setQDif(""); }}
                    className="text-xs text-gray-500 hover:text-white">✕</button>
                )}
              </div>
            </div>

            {questoesFiltradas.length === 0 ? (
              <div className="text-center py-12 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
                Nenhuma questão respondida ainda.
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {/* Cabeçalho da tabela */}
                <div className="grid grid-cols-[1fr_120px_80px_80px_80px] gap-4 px-5 py-3 border-b border-gray-800 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <span>Questão</span>
                  <span className="text-center">Acerto</span>
                  <span className="text-center">Alunos</span>
                  <span className="text-center">Tentativas</span>
                  <span className="text-center">Dif.</span>
                </div>

                {/* Linhas */}
                <div className="divide-y divide-gray-800/60">
                  {questoesFiltradas.map((q) => (
                    <div key={q.quizId}
                      className="grid grid-cols-[1fr_120px_80px_80px_80px] gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-colors items-start">

                      {/* Pergunta + contexto */}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-200 leading-snug line-clamp-2">{q.pergunta}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-gray-600">{q.materiaIcone} {q.materiaNome}</span>
                          <span className="text-gray-700">·</span>
                          <span className="text-[10px] text-gray-600">{q.topicoTitulo}</span>
                          {q.tags && q.tags.split(",").slice(0, 2).map((t) => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-gray-500">#{t.trim()}</span>
                          ))}
                        </div>
                      </div>

                      {/* Barra de acerto */}
                      <div className="pt-0.5 space-y-1">
                        {q.totalUsuarios > 0 ? (
                          <>
                            <PctBar pct={q.acertoPct} />
                            <div className="flex justify-between">
                              <PctBadge pct={q.acertoPct} />
                              <span className="text-[10px] text-gray-600">{q.acertos}/{q.totalUsuarios}</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-gray-700">—</span>
                        )}
                      </div>

                      {/* Alunos únicos */}
                      <div className="text-center">
                        <span className="text-sm font-bold text-white">{q.totalUsuarios}</span>
                      </div>

                      {/* Tentativas históricas */}
                      <div className="text-center">
                        {q.totalTentativas > 0 ? (
                          <span className="text-sm font-bold text-violet-400">{q.totalTentativas}</span>
                        ) : (
                          <span className="text-xs text-gray-700">—</span>
                        )}
                      </div>

                      {/* Dificuldade */}
                      <div className="flex justify-center items-start pt-0.5">
                        <DifBadge d={q.dificuldade} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-2 border-t border-gray-800 text-[11px] text-gray-600">
                  {questoesFiltradas.length} questão{questoesFiltradas.length !== 1 ? "s" : ""} exibida{questoesFiltradas.length !== 1 ? "s" : ""}
                  {(qFilter || qDif) && ` (filtrado)`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ABA: FLASHCARDS POR TÓPICO ── */}
        {aba === "topicos" && (
          <div>
            {topicosOrdenados.length === 0 ? (
              <div className="text-center py-12 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
                Nenhum flashcard revisado ainda.
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_140px_80px_80px] gap-4 px-5 py-3 border-b border-gray-800 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <span>Tópico</span>
                  <span className="text-center">Taxa de acerto</span>
                  <span className="text-center">Revisões</span>
                  <span className="text-center">Alunos</span>
                </div>
                <div className="divide-y divide-gray-800/60">
                  {topicosOrdenados.map((t, i) => (
                    <div key={t.topicoId}
                      className="grid grid-cols-[1fr_140px_80px_80px] gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-colors items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-600 w-5">#{i + 1}</span>
                          <p className="text-xs text-gray-200 font-medium">{t.topicoTitulo}</p>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-0.5 ml-7">
                          {t.materiaIcone} {t.materiaNome} · {t.blocoNome}
                        </p>
                        <div className="flex gap-2 mt-1 ml-7">
                          <span className="text-[9px] text-gray-600">{t.totalQuizzes} questões</span>
                          <span className="text-gray-700">·</span>
                          <span className="text-[9px] text-gray-600">{t.totalFlashcards} flashcards</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <PctBar pct={t.acertoPct} />
                        <div className="flex justify-between">
                          <PctBadge pct={t.acertoPct} />
                          <span className="text-[10px] text-gray-600">{t.acertos}/{t.totalRevisoes}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-white">{t.totalRevisoes}</span>
                        <div className="text-[10px] text-gray-600">revisões</div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-teal-400">{t.totalUsuarios}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-2 border-t border-gray-800 text-[11px] text-gray-600">
                  {topicosOrdenados.length} tópico{topicosOrdenados.length !== 1 ? "s" : ""} com atividade de flashcard
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ABA: POR MATÉRIA ── */}
        {aba === "materias" && (
          <div>
            {materias.length === 0 ? (
              <div className="text-center py-12 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
                Nenhuma atividade registrada.
              </div>
            ) : (
              <div className="space-y-4">
                {([...materias] as MateriaStat[])
                  .sort((a, b) => (b.totalRespostas + b.totalRevisoes) - (a.totalRespostas + a.totalRevisoes))
                  .map((m) => (
                    <div key={m.materiaId} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{m.materiaIcone ?? "📚"}</span>
                          <div>
                            <h3 className="text-base font-bold text-white">{m.materiaNome}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {m.totalTopicos} tópicos · {m.totalQuestoes} questões · {m.totalFlashcards} flashcards
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-center">
                            <div className="text-lg font-black text-teal-400">{m.totalAlunos}</div>
                            <div className="text-[10px] text-gray-600">alunos</div>
                          </div>
                          <Link href={`/admin/quiz/${m.materiaSlug}`}
                            className="text-xs text-gray-500 hover:text-emerald-400 border border-gray-700 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-colors">
                            Ver questões →
                          </Link>
                        </div>
                      </div>

                      {/* Stats em grid 2x2 */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Quiz */}
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-medium">🧠 Questões</span>
                            {m.totalRespostas > 0 && <PctBadge pct={m.acertoPct} />}
                          </div>
                          {m.totalRespostas > 0 ? (
                            <>
                              <PctBar pct={m.acertoPct} />
                              <p className="text-[11px] text-gray-500 mt-2">
                                {m.totalRespostas} respostas registradas
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-700">Nenhuma resposta ainda</p>
                          )}
                        </div>
                        {/* Flashcards */}
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-medium">🃏 Flashcards</span>
                            {m.totalRevisoes > 0 && <PctBadge pct={m.acertoPctFc} />}
                          </div>
                          {m.totalRevisoes > 0 ? (
                            <>
                              <PctBar pct={m.acertoPctFc} />
                              <p className="text-[11px] text-gray-500 mt-2">
                                {m.totalRevisoes} revisões registradas
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-700">Nenhuma revisão ainda</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
