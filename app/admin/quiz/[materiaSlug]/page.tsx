"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Opcao   = { id: string; texto: string; correta: boolean; ordem: number };
type Quiz    = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[]; topicoTitulo?: string; blocoNome?: string };
type Topico  = { id: string; titulo: string; slug: string };
type Bloco   = { id: string; nome: string; topicos: Topico[] };
type Materia = { id: string; nome: string; slug: string; icone: string | null; blocos: Bloco[] };

const LETRAS  = ["A", "B", "C", "D"];
const novaOpcao = () => ({ texto: "", correta: false });

export default function AdminQuizMateriaPage() {
  const { materiaSlug } = useParams<{ materiaSlug: string }>();

  const [materia, setMateria]   = useState<Materia | null>(null);
  const [quizzes, setQuizzes]   = useState<Quiz[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]         = useState("");
  const [sucesso, setSucesso]   = useState("");

  // Seletores cascata (bloco → tópico)
  const [blocoId, setBlocoId]   = useState("");
  const [topicoId, setTopicoId] = useState("");

  // Campos
  const [pergunta, setPergunta]     = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [opcoes, setOpcoes]         = useState([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);

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
  const topicos = materia?.blocos.find((b) => b.id === blocoId)?.topicos ?? [];

  const resetForm = () => {
    setBlocoId(""); setTopicoId("");
    setPergunta(""); setExplicacao("");
    setOpcoes([novaOpcao(), novaOpcao(), novaOpcao(), novaOpcao()]);
    setErro("");
  };

  const setTextoOpcao  = (i: number, texto: string) =>
    setOpcoes((p) => p.map((o, idx) => (idx === i ? { ...o, texto } : o)));
  const marcarCorreta  = (i: number) =>
    setOpcoes((p) => p.map((o, idx) => ({ ...o, correta: idx === i })));

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); setSucesso("");

    if (!topicoId)           return setErro("Selecione um tópico.");
    if (!pergunta.trim())    return setErro("Digite a pergunta.");
    const validas = opcoes.filter((o) => o.texto.trim());
    if (validas.length < 2)  return setErro("Preencha pelo menos 2 opções.");
    if (!validas.some((o) => o.correta)) return setErro("Marque a resposta correta.");

    setSalvando(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: pergunta.trim(),
          explicacao: explicacao.trim() || null,
          topicoId,
          opcoes: validas.map((o, i) => ({ texto: o.texto.trim(), correta: o.correta, ordem: i })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao salvar.");

      // Recarrega tópico
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
          qs: quizzes.filter((q) => q.topicoTitulo === t.titulo && q.blocoNome === b.nome),
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

  return (
    <div className="text-white p-8">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300">Admin</Link>
              <span>›</span>
              <Link href="/admin/quiz" className="hover:text-gray-300">Quiz</Link>
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
          <button
            onClick={() => { setShowForm((v) => !v); setErro(""); }}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all shrink-0 ${
              showForm ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {showForm ? "✕ Cancelar" : "+ Nova questão"}
          </button>
        </div>

        {/* Feedback */}
        {sucesso && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-300">
            ✓ {sucesso}
          </div>
        )}

        {/* ── Formulário ── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-5">
            <h2 className="text-base font-bold text-white">Nova questão — {materia.nome}</h2>

            {/* Bloco → Tópico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bloco</label>
                <select
                  value={blocoId}
                  onChange={(e) => { setBlocoId(e.target.value); setTopicoId(""); }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Selecione…</option>
                  {materia.blocos.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tópico</label>
                <select
                  value={topicoId}
                  onChange={(e) => setTopicoId(e.target.value)}
                  disabled={!blocoId}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                >
                  <option value="">Selecione…</option>
                  {topicos.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              </div>
            </div>

            {/* Pergunta */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Pergunta <span className="text-red-400">*</span></label>
              <textarea
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                rows={3}
                placeholder="Digite a pergunta…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
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
                    <button
                      type="button"
                      onClick={() => marcarCorreta(i)}
                      className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        opcao.correta
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-600 text-gray-500 hover:border-emerald-500/60 hover:text-gray-300"
                      }`}
                    >
                      {LETRAS[i]}
                    </button>
                    <input
                      type="text"
                      value={opcao.texto}
                      onChange={(e) => setTextoOpcao(i, e.target.value)}
                      placeholder={`Opção ${LETRAS[i]}…`}
                      className={`flex-1 bg-gray-800 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                        opcao.correta ? "border-emerald-500/50 focus:border-emerald-500" : "border-gray-700 focus:border-gray-500"
                      }`}
                    />
                    {opcao.correta && <span className="text-xs text-emerald-400 shrink-0 font-medium">✓ correta</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Explicação */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Explicação <span className="text-gray-600">(opcional)</span></label>
              <textarea
                value={explicacao}
                onChange={(e) => setExplicacao(e.target.value)}
                rows={2}
                placeholder="Explique o porquê da resposta correta…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">⚠ {erro}</p>
            )}

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

        {/* ── Lista hierárquica ── */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-4xl mb-4">🧠</div>
            <p>Nenhuma questão cadastrada para esta matéria.</p>
            <p className="text-xs mt-2 text-gray-700">Use o botão acima para criar a primeira questão.</p>
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
                          <div key={quiz.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <p className="text-sm font-medium text-white leading-relaxed mb-4">
                              <span className="text-emerald-400 mr-2 text-xs font-mono">{qi + 1}.</span>
                              {quiz.pergunta}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {quiz.opcoes.map((o) => (
                                <div key={o.id}
                                  className={`px-3 py-2 rounded-lg text-xs border ${
                                    o.correta
                                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                      : "border-gray-800 text-gray-500"
                                  }`}
                                >
                                  {o.correta && <span className="mr-1.5">✓</span>}
                                  {o.texto}
                                </div>
                              ))}
                            </div>
                            {quiz.explicacao && (
                              <p className="text-xs text-gray-500 mt-3 italic border-t border-gray-800 pt-3">
                                💡 {quiz.explicacao}
                              </p>
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
