"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Questao {
  id: string;
  pergunta: string;
  dificuldade: string;
  topico: string;
  materia: string;
  opcoes: { id: string; texto: string }[];
}
interface ItemResultado {
  quizId: string;
  pergunta: string;
  topico: string;
  explicacao: string | null;
  opcoes: { id: string; texto: string }[];
  opcaoEscolhida: string | null;
  opcaoCorreta: string | null;
  correta: boolean;
  emBranco: boolean;
}
interface Resultado {
  total: number;
  acertos: number;
  erros: number;
  emBranco: number;
  percentual: number;
  itens: ItemResultado[];
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function SimuladoCliente({
  materias,
  modoInicial,
}: {
  materias: { slug: string; nome: string }[];
  modoInicial: "aleatorio" | "erros";
}) {
  const [fase, setFase] = useState<"config" | "prova" | "resultado">("config");
  const [materia, setMateria] = useState("todas");
  const [modo, setModo] = useState(modoInicial);
  const [n, setN] = useState(20);
  const [minutos, setMinutos] = useState(30);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [atual, setAtual] = useState(0);
  const [restante, setRestante] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const enviado = useRef(false);

  async function iniciar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/estudo/simulado?materia=${materia}&n=${n}&modo=${modo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao carregar.");
      if (!data.questoes.length) {
        setErro(modo === "erros" ? "Você não tem erros em aberto nessa seleção. 👏" : "Nenhuma questão disponível.");
        return;
      }
      enviado.current = false;
      setQuestoes(data.questoes);
      setRespostas({});
      setAtual(0);
      setRestante(minutos * 60);
      setFase("prova");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar.");
    } finally {
      setCarregando(false);
    }
  }

  const finalizar = useCallback(async () => {
    if (enviado.current) return;
    enviado.current = true;
    setCarregando(true);
    try {
      const res = await fetch("/api/estudo/simulado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respostas: questoes.map((q) => ({ quizId: q.id, opcaoId: respostas[q.id] ?? null })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao corrigir.");
      setResultado(data);
      setFase("resultado");
    } catch (e) {
      enviado.current = false;
      setErro(e instanceof Error ? e.message : "Erro ao corrigir.");
    } finally {
      setCarregando(false);
    }
  }, [questoes, respostas]);

  useEffect(() => {
    if (fase !== "prova") return;
    const t = setInterval(() => setRestante((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [fase]);

  useEffect(() => {
    if (fase === "prova" && restante <= 0) finalizar();
  }, [fase, restante, finalizar]);

  /* ── configuração ───────────────────────────────────── */
  if (fase === "config") {
    const campo = "mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white";
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">Monte seu simulado</h2>
        <label className="block text-xs text-gray-400">
          Matéria
          <select value={materia} onChange={(e) => setMateria(e.target.value)} className={campo}>
            <option value="todas">Todas as minhas matérias</option>
            {materias.map((m) => (
              <option key={m.slug} value={m.slug}>{m.nome}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-gray-400">
          Tipo
          <select value={modo} onChange={(e) => setModo(e.target.value as "aleatorio" | "erros")} className={campo}>
            <option value="aleatorio">Questões aleatórias</option>
            <option value="erros">Só as que errei (caderno de erros)</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-gray-400">
            Nº de questões
            <input type="number" min={1} max={100} value={n} onChange={(e) => setN(Number(e.target.value))} className={campo} />
          </label>
          <label className="block text-xs text-gray-400">
            Tempo (min)
            <input type="number" min={1} max={300} value={minutos} onChange={(e) => setMinutos(Number(e.target.value))} className={campo} />
          </label>
        </div>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <button
          onClick={iniciar}
          disabled={carregando || !materias.length}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-sm disabled:opacity-50"
        >
          {carregando ? "Carregando…" : "Iniciar simulado"}
        </button>
        {!materias.length && <p className="text-xs text-gray-500">Você ainda não tem matérias liberadas.</p>}
      </div>
    );
  }

  /* ── prova ──────────────────────────────────────────── */
  if (fase === "prova") {
    const q = questoes[atual];
    const respondidas = Object.keys(respostas).length;
    return (
      <div>
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-400">
            Questão {atual + 1}/{questoes.length} · {respondidas} respondida{respondidas !== 1 ? "s" : ""}
          </span>
          <span className={`font-mono font-bold ${restante <= 60 ? "text-red-400 animate-pulse" : "text-white"}`}>
            ⏱ {fmt(Math.max(0, restante))}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {questoes.map((x, idx) => (
            <button
              key={x.id}
              onClick={() => setAtual(idx)}
              className={`w-7 h-7 rounded-md text-[11px] font-semibold border ${
                idx === atual
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : respostas[x.id]
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-gray-700 text-gray-500"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-[11px] text-gray-500 mb-2">{q.materia} · {q.topico}</p>
          <p className="text-sm font-medium leading-relaxed">{q.pergunta}</p>
          <div className="mt-4 space-y-2">
            {q.opcoes.map((o) => {
              const marcada = respostas[q.id] === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setRespostas((r) => ({ ...r, [q.id]: o.id }))}
                  className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-colors ${
                    marcada
                      ? "border-violet-400 bg-violet-500/15 text-white"
                      : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  {o.texto}
                </button>
              );
            })}
          </div>
          {respostas[q.id] && (
            <button
              onClick={() =>
                setRespostas((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== q.id)))
              }
              className="mt-3 text-xs text-gray-500 hover:text-gray-300"
            >
              limpar resposta (deixar em branco)
            </button>
          )}
        </div>

        {erro && <p className="text-sm text-red-400 mt-3">{erro}</p>}

        <div className="flex gap-3 mt-4">
          <button
            disabled={atual === 0}
            onClick={() => setAtual((a) => a - 1)}
            className="flex-1 py-3 rounded-xl bg-gray-800 text-sm font-semibold disabled:opacity-40"
          >
            ← Anterior
          </button>
          {atual < questoes.length - 1 ? (
            <button onClick={() => setAtual((a) => a + 1)} className="flex-1 py-3 rounded-xl bg-gray-800 text-sm font-semibold">
              Próxima →
            </button>
          ) : (
            <button
              disabled={carregando}
              onClick={() => {
                const brancos = questoes.length - respondidas;
                if (brancos === 0 || confirm(`${brancos} questão(ões) em branco. Finalizar mesmo assim?`)) finalizar();
              }}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold disabled:opacity-50"
            >
              {carregando ? "Corrigindo…" : "Finalizar"}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── resultado ──────────────────────────────────────── */
  const r = resultado!;
  return (
    <div className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
        <div className="text-5xl font-black text-white">{r.percentual}%</div>
        <p className="text-sm text-gray-400 mt-1">
          {r.acertos} acerto{r.acertos !== 1 ? "s" : ""} · {r.erros} erro{r.erros !== 1 ? "s" : ""} · {r.emBranco} em branco
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button onClick={() => { setFase("config"); setResultado(null); }} className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold">
            Novo simulado
          </button>
          <Link href="/estudo/erros" className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-semibold">Caderno de erros</Link>
        </div>
      </div>

      {r.itens.map((it, idx) => (
        <article
          key={it.quizId}
          className={`bg-gray-900 border rounded-2xl p-4 sm:p-5 ${it.correta ? "border-emerald-500/30" : it.emBranco ? "border-gray-700" : "border-red-500/30"}`}
        >
          <p className="text-[11px] text-gray-500 mb-1">
            {idx + 1} · {it.topico} · {it.correta ? "✓ acertou" : it.emBranco ? "em branco" : "✗ errou"}
          </p>
          <p className="text-sm font-medium leading-relaxed">{it.pergunta}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {it.opcoes.map((o) => {
              const certa = o.id === it.opcaoCorreta;
              const marcada = o.id === it.opcaoEscolhida;
              return (
                <li
                  key={o.id}
                  className={`px-3 py-2 rounded-lg border ${
                    certa
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : marcada
                        ? "border-red-500/40 bg-red-500/10 text-red-300"
                        : "border-gray-800 text-gray-500"
                  }`}
                >
                  {certa ? "✓ " : marcada ? "✗ " : ""}
                  {o.texto}
                </li>
              );
            })}
          </ul>
          {it.explicacao && <p className="text-xs text-gray-400 leading-relaxed mt-3">{it.explicacao}</p>}
        </article>
      ))}
    </div>
  );
}
