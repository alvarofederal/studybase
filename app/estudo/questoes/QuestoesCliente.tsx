"use client";

import { useEffect, useMemo, useState } from "react";
import CartaoQuestao, { type QuestaoBanco } from "@/components/estudo/CartaoQuestao";
import { situacaoEhFila, type Situacao } from "@/lib/study/filtro-questoes";

interface MateriaOpcao {
  slug: string;
  nome: string;
  icone: string | null;
  blocos: { id: string; nome: string }[];
}

interface Filtros {
  materia: string;
  bloco: string;
  dificuldade: string;
  tipo: string;
  situacao: string;
}

interface Resposta {
  total: number;
  pagina: number;
  porPagina: number;
  questoes: QuestaoBanco[];
}

const SITUACOES: { valor: Situacao; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "nao-respondidas", rotulo: "Não respondidas" },
  { valor: "erradas", rotulo: "Que errei" },
  { valor: "certas", rotulo: "Que acertei" },
];

const campo =
  "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50";

/** Banco de questões (RF-BQ-01..07): filtros, lista paginada e resposta em cada cartão. */
export default function QuestoesCliente({ materias, inicial }: { materias: MateriaOpcao[]; inicial: Record<string, string> }) {
  const [filtros, setFiltros] = useState<Filtros>({
    materia: materias.some((m) => m.slug === inicial.materia) ? inicial.materia : "",
    bloco: inicial.bloco ?? "",
    dificuldade: inicial.dificuldade ?? "",
    tipo: inicial.tipo ?? "",
    situacao: SITUACOES.some((s) => s.valor === inicial.situacao) ? inicial.situacao : "todas",
  });
  const [pagina, setPagina] = useState(1);
  const [recarga, setRecarga] = useState(0);
  const [dados, setDados] = useState<Resposta | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const blocos = useMemo(() => materias.find((m) => m.slug === filtros.materia)?.blocos ?? [], [materias, filtros.materia]);
  const fila = situacaoEhFila(filtros.situacao as Situacao);

  // Busca a lista sempre que filtros/página mudam; mantém a URL em sincronia (recarregar/compartilhar)
  useEffect(() => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filtros)) if (v && !(k === "situacao" && v === "todas")) qs.set(k, v);
    window.history.replaceState(null, "", qs.toString() ? `?${qs}` : window.location.pathname);
    qs.set("pagina", String(pagina));

    const ctrl = new AbortController();
    fetch(`/api/estudo/questoes?${qs}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        setDados((await r.json()) as Resposta);
        setErro(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((e: unknown) => {
        if ((e as Error)?.name !== "AbortError") setErro("Não foi possível carregar as questões.");
      });
    return () => ctrl.abort();
  }, [filtros, pagina, recarga]);

  function mudar(campoNome: keyof Filtros, valor: string) {
    setFiltros((f) => ({ ...f, [campoNome]: valor, ...(campoNome === "materia" ? { bloco: "" } : {}) }));
    setPagina(1);
    setDados(null);
  }

  const totalPaginas = dados ? Math.max(1, Math.ceil(dados.total / dados.porPagina)) : 1;
  const filtrosAtivos = Object.entries(filtros).some(([k, v]) => v && !(k === "situacao" && v === "todas"));

  return (
    <div className="space-y-5">
      {/* Filtros — RF-BQ-02 */}
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-gray-400">
            Matéria
            <select value={filtros.materia} onChange={(e) => mudar("materia", e.target.value)} className={`${campo} mt-1`}>
              <option value="">Todas as minhas matérias</option>
              {materias.map((m) => (
                <option key={m.slug} value={m.slug}>{m.icone ?? ""} {m.nome}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-gray-400">
            Bloco
            <select value={filtros.bloco} onChange={(e) => mudar("bloco", e.target.value)} disabled={!filtros.materia} className={`${campo} mt-1`}>
              <option value="">{filtros.materia ? "Todos os blocos" : "Escolha a matéria"}</option>
              {blocos.map((b) => (
                <option key={b.id} value={b.id}>{b.nome}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-gray-400">
            Dificuldade
            <select value={filtros.dificuldade} onChange={(e) => mudar("dificuldade", e.target.value)} className={`${campo} mt-1`}>
              <option value="">Todas</option>
              <option value="FACIL">Fácil</option>
              <option value="MEDIO">Média</option>
              <option value="DIFICIL">Difícil</option>
            </select>
          </label>
          <label className="text-xs text-gray-400">
            Tipo
            <select value={filtros.tipo} onChange={(e) => mudar("tipo", e.target.value)} className={`${campo} mt-1`}>
              <option value="">Todos</option>
              <option value="MULTIPLA">Múltipla escolha</option>
              <option value="CERTO_ERRADO">Certo/Errado</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {SITUACOES.map((s) => (
            <button
              key={s.valor}
              onClick={() => mudar("situacao", s.valor)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filtros.situacao === s.valor ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {s.rotulo}
            </button>
          ))}
          {filtrosAtivos && (
            <button
              onClick={() => { setFiltros({ materia: "", bloco: "", dificuldade: "", tipo: "", situacao: "todas" }); setPagina(1); setDados(null); }}
              className="ml-auto text-xs text-gray-500 hover:text-white"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {erro && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{erro}</p>}

      {!dados ? (
        <p className="py-12 text-center text-sm text-gray-500">Carregando questões…</p>
      ) : dados.total === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center text-sm text-gray-400">
          {filtros.situacao === "nao-respondidas"
            ? "Você já respondeu todas as questões deste filtro."
            : filtros.situacao === "erradas"
              ? "Nenhuma questão errada neste filtro."
              : "Nenhuma questão encontrada com esses filtros."}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500">
            {dados.total.toLocaleString("pt-BR")} questão(ões)
            {fila ? " · ao responder, a questão sai deste filtro" : ` · página ${dados.pagina} de ${totalPaginas}`}
          </p>
          <div className="space-y-4">
            {dados.questoes.map((q, i) => (
              <CartaoQuestao key={q.id} questao={q} numero={(dados.pagina - 1) * dados.porPagina + i + 1} />
            ))}
          </div>

          {fila ? (
            // Modo fila: recarrega do início — as respondidas saem e as demais sobem (não pula nenhuma)
            <div className="flex justify-center">
              <button
                onClick={() => { setDados(null); setPagina(1); setRecarga((n) => n + 1); }}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Próximas questões →
              </button>
            </div>
          ) : (
            totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3 text-sm">
                <button onClick={() => { setDados(null); setPagina((p) => Math.max(1, p - 1)); }} disabled={dados.pagina === 1} className="rounded-lg border border-gray-700 px-3 py-1.5 text-gray-300 disabled:opacity-40">
                  ← Anterior
                </button>
                <span className="text-gray-500">Página {dados.pagina} de {totalPaginas}</span>
                <button onClick={() => { setDados(null); setPagina((p) => Math.min(totalPaginas, p + 1)); }} disabled={dados.pagina >= totalPaginas} className="rounded-lg border border-gray-700 px-3 py-1.5 text-gray-300 disabled:opacity-40">
                  Próxima →
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
