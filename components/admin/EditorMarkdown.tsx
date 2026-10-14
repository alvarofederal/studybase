"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Chave para guardar rascunho local (ex.: "topico:<id>"). Sem chave, não há rascunho automático. */
  rascunhoKey?: string;
  /** Ctrl/Cmd+S */
  onSalvar?: () => void;
  minRows?: number;
  /** Último conteúdo salvo no servidor (base para "alterações não salvas"). Padrão: valor ao montar. */
  salvo?: string;
}

type Modo = "escrever" | "dividido" | "visualizar";

/** Trecho que a barra de ferramentas insere. `sel` é o texto selecionado (ou um exemplo). */
interface Acao {
  rotulo: string;
  titulo: string;
  aplicar: (sel: string) => { texto: string; selIni?: number; selFim?: number };
  /** true = a ação opera nas linhas inteiras (prefixos) */
  linhas?: boolean;
}

const prefixar = (prefixo: string) => (sel: string) => ({
  texto: sel
    .split("\n")
    .map((l) => (l.startsWith(prefixo) ? l : prefixo + l))
    .join("\n"),
});

const envolver = (marca: string, exemplo: string) => (sel: string) => {
  const t = sel || exemplo;
  return { texto: `${marca}${t}${marca}`, selIni: marca.length, selFim: marca.length + t.length };
};

const ACOES: Acao[] = [
  { rotulo: "H2", titulo: "Título de seção (##)", linhas: true, aplicar: prefixar("## ") },
  { rotulo: "H3", titulo: "Subtítulo (###)", linhas: true, aplicar: prefixar("### ") },
  { rotulo: "B", titulo: "Negrito (Ctrl+B)", aplicar: envolver("**", "texto") },
  { rotulo: "I", titulo: "Itálico (Ctrl+I)", aplicar: envolver("*", "texto") },
  { rotulo: "S̶", titulo: "Tachado", aplicar: envolver("~~", "texto") },
  { rotulo: "</>", titulo: "Código inline", aplicar: envolver("`", "código") },
  {
    rotulo: "• Lista",
    titulo: "Lista com marcadores",
    linhas: true,
    aplicar: (sel) => ({
      texto: (sel || "item")
        .split("\n")
        .map((l) => (/^\s*[-*] /.test(l) ? l : `- ${l}`))
        .join("\n"),
    }),
  },
  {
    rotulo: "1. Lista",
    titulo: "Lista numerada",
    linhas: true,
    aplicar: (sel) => ({
      texto: (sel || "item")
        .split("\n")
        .map((l, i) => (/^\s*\d+\. /.test(l) ? l : `${i + 1}. ${l}`))
        .join("\n"),
    }),
  },
  { rotulo: "❝", titulo: "Citação", linhas: true, aplicar: prefixar("> ") },
  {
    rotulo: "💡 Dica",
    titulo: "Caixa de ponto-chave",
    linhas: true,
    aplicar: (sel) => ({ texto: `> 💡 ${sel || "Ponto-chave: escreva aqui."}` }),
  },
  {
    rotulo: "⚠️ Atenção",
    titulo: "Caixa de atenção (pegadinha de prova)",
    linhas: true,
    aplicar: (sel) => ({ texto: `> ⚠️ ${sel || "Cuidado: escreva aqui."}` }),
  },
  {
    rotulo: "▦ Tabela",
    titulo: "Inserir tabela",
    aplicar: () => ({
      texto: "| Coluna 1 | Coluna 2 |\n| --- | --- |\n| Dado | Dado |\n| Dado | Dado |",
    }),
  },
  { rotulo: "—", titulo: "Linha divisória", aplicar: () => ({ texto: "\n---\n" }) },
];

export default function EditorMarkdown({ value, onChange, rascunhoKey, onSalvar, minRows = 18, salvo }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [modo, setModo] = useState<Modo>("dividido");
  const [rascunho, setRascunho] = useState<string | null>(null);
  const valorInicial = useRef(value);
  const base = salvo ?? valorInicial.current;

  const chave = rascunhoKey ? `sb-rascunho:${rascunhoKey}` : null;

  // Recupera rascunho local diferente do valor salvo (ex.: aba fechada sem salvar)
  useEffect(() => {
    if (!chave) return;
    try {
      const salvo = localStorage.getItem(chave);
      if (salvo && salvo !== base) setRascunho(salvo);
    } catch { /* storage indisponível */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  // Autosave local (debounce) — rede de segurança; o salvamento real continua sendo o botão
  useEffect(() => {
    if (!chave) return;
    const id = window.setTimeout(() => {
      try {
        if (value === base) localStorage.removeItem(chave);
        else localStorage.setItem(chave, value);
      } catch { /* ignora */ }
    }, 800);
    return () => window.clearTimeout(id);
  }, [value, chave, base]);

  const sujo = value !== base;
  useEffect(() => {
    if (!sujo) return;
    const aoSair = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", aoSair);
    return () => window.removeEventListener("beforeunload", aoSair);
  }, [sujo]);

  function aplicar(a: Acao) {
    const ta = taRef.current;
    if (!ta) return;
    let ini = ta.selectionStart;
    let fim = ta.selectionEnd;
    // ações de linha pegam as linhas inteiras tocadas pela seleção
    if (a.linhas) {
      ini = value.lastIndexOf("\n", ini - 1) + 1;
      const prox = value.indexOf("\n", fim);
      fim = prox === -1 ? value.length : prox;
    }
    const sel = value.slice(ini, fim);
    const r = a.aplicar(sel);
    const novo = value.slice(0, ini) + r.texto + value.slice(fim);
    onChange(novo);
    requestAnimationFrame(() => {
      ta.focus();
      const base = ini;
      if (r.selIni !== undefined && r.selFim !== undefined) ta.setSelectionRange(base + r.selIni, base + r.selFim);
      else ta.setSelectionRange(base + r.texto.length, base + r.texto.length);
    });
  }

  function aoTeclar(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); aplicar(ACOES.find((a) => a.rotulo === "B")!); }
    else if (mod && e.key.toLowerCase() === "i") { e.preventDefault(); aplicar(ACOES.find((a) => a.rotulo === "I")!); }
    else if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); onSalvar?.(); }
    else if (e.key === "Tab") {
      // Tab insere dois espaços (útil em listas aninhadas) em vez de sair do campo
      e.preventDefault();
      const ta = e.currentTarget;
      const ini = ta.selectionStart;
      onChange(value.slice(0, ini) + "  " + value.slice(ta.selectionEnd));
      requestAnimationFrame(() => ta.setSelectionRange(ini + 2, ini + 2));
    }
  }

  const palavras = useMemo(() => (value.trim() ? value.trim().split(/\s+/).length : 0), [value]);
  const minutos = Math.max(1, Math.round(palavras / 200));

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-700 bg-gray-800/60 px-2 py-1.5">
        {ACOES.map((a) => (
          <button
            key={a.rotulo}
            type="button"
            title={a.titulo}
            onClick={() => aplicar(a)}
            className="rounded-md px-2 py-1 text-xs font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            {a.rotulo}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-gray-900 p-0.5">
          {(["escrever", "dividido", "visualizar"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition ${
                modo === m ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {rascunho && (
        <div className="flex flex-wrap items-center gap-3 border-b border-amber-700/40 bg-amber-900/20 px-3 py-2 text-xs text-amber-300">
          <span>Há um rascunho não salvo deste conteúdo neste navegador.</span>
          <button
            type="button"
            onClick={() => { onChange(rascunho); setRascunho(null); }}
            className="rounded bg-amber-700/40 px-2 py-0.5 font-medium hover:bg-amber-700/60"
          >
            Restaurar
          </button>
          <button
            type="button"
            onClick={() => {
              setRascunho(null);
              try { if (chave) localStorage.removeItem(chave); } catch { /* ignora */ }
            }}
            className="rounded px-2 py-0.5 hover:bg-amber-700/30"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Área de edição */}
      <div className={modo === "dividido" ? "grid grid-cols-1 lg:grid-cols-2" : ""}>
        {modo !== "visualizar" && (
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={aoTeclar}
            rows={minRows}
            spellCheck
            lang="pt-BR"
            placeholder="Escreva em Markdown… (## título, **negrito**, - lista, > 💡 dica, tabelas com |)"
            className="min-h-[320px] w-full resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-gray-100 outline-none placeholder:text-gray-600 lg:border-r lg:border-gray-800"
          />
        )}
        {modo !== "escrever" && (
          <div className="max-h-[70vh] min-h-[320px] overflow-y-auto px-5 py-4">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-sm text-gray-600">A pré-visualização aparece aqui.</p>
            )}
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-800 px-3 py-1.5 text-[11px] text-gray-500">
        <span>{palavras} palavras · ~{minutos} min de leitura</span>
        <span className={sujo ? "text-amber-400" : "text-emerald-500"}>{sujo ? "● alterações não salvas" : "✓ salvo"}</span>
        <span className="ml-auto hidden sm:inline">Ctrl+S salva · Ctrl+B negrito · Ctrl+I itálico</span>
      </div>
    </div>
  );
}
