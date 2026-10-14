"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Questao {
  id: string;
  pergunta: string;
  tipo: "MULTIPLA" | "CERTO_ERRADO";
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
interface Cebraspe {
  total: number;
  acertos: number;
  erros: number;
  emBranco: number;
  saldo: number;
  maximo: number;
  caçadas: number;
  caçadasCorretas: number;
  pureza: number | null;
  taxaCaca: number;
  termometro: "ok" | "severo" | "superficial";
  veredito: "confiavel" | "apertar" | "prejudicando" | null;
}
interface Resultado {
  cebraspe: Cebraspe | null;
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
  const [tipo, setTipo] = useState<"ce" | "multipla" | "todos">(modoInicial === "erros" ? "todos" : "ce");
  const [valorItem, setValorItem] = useState(1);
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
      const res = await fetch(`/api/estudo/simulado?materia=${materia}&n=${n}&modo=${modo}&tipo=${tipo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao carregar.");
      if (!data.questoes.length) {
        setErro(
          modo === "erros"
            ? "Você não tem erros em aberto nessa seleção. 👏"
            : tipo === "ce"
              ? "Ainda não há itens Certo/Errado nessa matéria. Importe pelo admin (tipo = CE) ou escolha outro estilo."
              : "Nenhuma questão disponível.",
        );
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
          valorItem,
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

  // Atalhos: C = Certo · E = Errado · B/Backspace = branco · setas = navegar
  useEffect(() => {
    if (fase !== "prova") return;
    function onKey(ev: KeyboardEvent) {
      const alvo = ev.target as HTMLElement;
      if (alvo?.tagName === "INPUT" || alvo?.tagName === "SELECT" || alvo?.tagName === "TEXTAREA") return;
      const q = questoes[atual];
      if (!q) return;
      const k = ev.key.toLowerCase();
      if (q.tipo === "CERTO_ERRADO" && (k === "c" || k === "e")) {
        const o = q.opcoes[k === "c" ? 0 : 1];
        if (o) setRespostas((x) => ({ ...x, [q.id]: o.id }));
      } else if (k === "b" || k === "backspace") {
        setRespostas((x) => Object.fromEntries(Object.entries(x).filter(([id]) => id !== q.id)));
      } else if (k === "arrowright") setAtual((a) => Math.min(a + 1, questoes.length - 1));
      else if (k === "arrowleft") setAtual((a) => Math.max(a - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fase, questoes, atual]);

  useEffect(() => {
    if (fase === "prova" && restante <= 0) finalizar();
  }, [fase, restante, finalizar]);

  /* ── configuração ───────────────────────────────────── */
  if (fase === "config") {
    const campo = "mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white";
    return (
      <div className="glass p-5 space-y-4">
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
          Estilo
          <select value={tipo} onChange={(e) => setTipo(e.target.value as "ce" | "multipla" | "todos")} className={campo}>
            <option value="ce">⚖️ CEBRASPE — Certo/Errado (erro anula acerto)</option>
            <option value="multipla">Múltipla escolha</option>
            <option value="todos">Misto</option>
          </select>
        </label>
        <label className="block text-xs text-gray-400">
          Seleção
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
          {tipo !== "multipla" && (
            <label className="block text-xs text-gray-400 col-span-2">
              Valor de cada item Certo/Errado (CGU P3 = 2)
              <input type="number" min={0.5} max={10} step={0.5} value={valorItem} onChange={(e) => setValorItem(Number(e.target.value))} className={campo} />
            </label>
          )}
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

        <div className="glass p-5">
          <p className="text-[11px] text-gray-500 mb-2">{q.materia} · {q.topico}</p>
          <p className="text-sm font-medium leading-relaxed">{q.pergunta}</p>
          {q.tipo === "CERTO_ERRADO" ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {q.opcoes.map((o, i) => {
                const marcada = respostas[q.id] === o.id;
                const certo = i === 0;
                return (
                  <button
                    key={o.id}
                    onClick={() => setRespostas((x) => ({ ...x, [q.id]: o.id }))}
                    className={`py-4 rounded-xl border-2 text-base font-black transition-colors ${
                      marcada
                        ? certo
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                          : "border-red-400 bg-red-500/20 text-red-200"
                        : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {o.texto} <span className="text-[10px] font-mono opacity-60">({certo ? "C" : "E"})</span>
                  </button>
                );
              })}
            </div>
          ) : (
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
          )}
          {q.tipo === "CERTO_ERRADO" && (
            <p className="mt-3 text-[11px] text-gray-600">
              Atalhos: <kbd>C</kbd> certo · <kbd>E</kbd> errado · <kbd>B</kbd> branco · ← → navegar. Cada erro anula um acerto.
            </p>
          )}
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
      <div className="glass p-5 text-center">
        {r.cebraspe ? (
          <>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Saldo CEBRASPE</p>
            <div className={`text-5xl font-black ${r.cebraspe.saldo < 0 ? "text-red-400" : "text-white"}`}>
              {r.cebraspe.saldo}
              <span className="text-lg text-gray-500 font-semibold"> / {r.cebraspe.maximo}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {r.cebraspe.acertos} acerto{r.cebraspe.acertos !== 1 ? "s" : ""} − {r.cebraspe.erros} erro
              {r.cebraspe.erros !== 1 ? "s" : ""} · {r.cebraspe.emBranco} em branco
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4 text-left">
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase">Pureza da caça</p>
                <p className="text-lg font-black text-white">{r.cebraspe.pureza === null ? "—" : `${r.cebraspe.pureza}%`}</p>
                <p className="text-[10px] text-gray-500">
                  {r.cebraspe.caçadasCorretas}/{r.cebraspe.caçadas} “Errado” corretos
                </p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase">Taxa de caça</p>
                <p className="text-lg font-black text-white">{r.cebraspe.taxaCaca}%</p>
                <p className={`text-[10px] ${r.cebraspe.termometro === "ok" ? "text-emerald-400" : "text-amber-400"}`}>
                  {r.cebraspe.termometro === "ok"
                    ? "dentro do esperado (20–40%)"
                    : r.cebraspe.termometro === "severo"
                      ? "acima de 40%: severo demais, revise"
                      : "abaixo de 20%: leitura superficial"}
                </p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase">Veredito</p>
                <p
                  className={`text-sm font-black ${
                    r.cebraspe.veredito === "confiavel"
                      ? "text-emerald-400"
                      : r.cebraspe.veredito === "apertar"
                        ? "text-amber-400"
                        : r.cebraspe.veredito === "prejudicando"
                          ? "text-red-400"
                          : "text-gray-500"
                  }`}
                >
                  {r.cebraspe.veredito === "confiavel"
                    ? "Confiável (≥95%)"
                    : r.cebraspe.veredito === "apertar"
                      ? "Apertar o critério (85–94%)"
                      : r.cebraspe.veredito === "prejudicando"
                        ? "Caça prejudicando (<85%)"
                        : "Sem caça no simulado"}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mt-3 text-left">
              Lembrete: incompleto não é errado — só é Errado o item que contradiz a norma.
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl font-black text-white">{r.percentual}%</div>
            <p className="text-sm text-gray-400 mt-1">
              {r.acertos} acerto{r.acertos !== 1 ? "s" : ""} · {r.erros} erro{r.erros !== 1 ? "s" : ""} · {r.emBranco} em branco
            </p>
          </>
        )}
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
