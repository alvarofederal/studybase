"use client";

import { useState } from "react";
import Link from "next/link";
import ComentarioIa from "@/components/estudo/ComentarioIa";
import ComentariosQuestao from "@/components/estudo/ComentariosQuestao";

export interface QuestaoBanco {
  id: string;
  pergunta: string;
  tipo: "MULTIPLA" | "CERTO_ERRADO";
  dificuldade: "FACIL" | "MEDIO" | "DIFICIL";
  explicacao: string | null;
  opcoes: { id: string; texto: string; correta: boolean }[];
  comentarioIa: { texto: string; revisado: boolean } | null;
  minhaResposta: { opcaoId: string; correta: boolean } | null;
  topico: { id: string; titulo: string };
  bloco: string;
  materia: { nome: string; slug: string; icone: string | null };
}

const LETRAS = "ABCDEFGH";
const DIFICULDADE: Record<QuestaoBanco["dificuldade"], { rotulo: string; cor: string }> = {
  FACIL: { rotulo: "Fácil", cor: "text-emerald-400 border-emerald-700/40" },
  MEDIO: { rotulo: "Média", cor: "text-amber-400 border-amber-700/40" },
  DIFICIL: { rotulo: "Difícil", cor: "text-red-400 border-red-700/40" },
};

/**
 * Uma questão do banco (RF-BQ-03..06): escolher, responder (correção no servidor — ADR-06),
 * ver resultado, explicação, comentário de IA e a discussão dos alunos.
 */
export default function CartaoQuestao({ questao, numero }: { questao: QuestaoBanco; numero: number }) {
  const [escolhida, setEscolhida] = useState<string | null>(questao.minhaResposta?.opcaoId ?? null);
  const [resultado, setResultado] = useState(questao.minhaResposta);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const ce = questao.tipo === "CERTO_ERRADO";
  const dif = DIFICULDADE[questao.dificuldade];

  async function responder() {
    if (!escolhida || resultado) return;
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/estudo/responder-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: questao.id, opcaoId: escolhida }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(d.error ?? "Não foi possível registrar a resposta.");
        return;
      }
      setResultado({ opcaoId: escolhida, correta: Boolean(d.correta) });
    } catch {
      setErro("Sem conexão. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  async function novaTentativa() {
    setResultado(null);
    setEscolhida(null);
    // Remove só a última resposta; o histórico de tentativas é preservado
    await fetch("/api/estudo/responder-quiz", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: questao.id }),
    }).catch(() => {});
  }

  return (
    <article className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
      {/* Origem — RF-BQ-06 */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
        <span className="font-mono text-gray-400">#{numero}</span>
        <span>{questao.materia.icone ?? "📖"} {questao.materia.nome}</span>
        <span>›</span>
        <span>{questao.bloco}</span>
        <span>›</span>
        <Link href={`/estudo/${questao.materia.slug}?topico=${questao.topico.id}`} className="text-gray-400 underline-offset-2 hover:text-white hover:underline">
          {questao.topico.titulo}
        </Link>
        <span className={`ml-auto rounded border px-1.5 py-0.5 ${dif.cor}`}>{dif.rotulo}</span>
        <span className="rounded border border-gray-700 px-1.5 py-0.5 text-gray-400">{ce ? "Certo/Errado" : "Múltipla escolha"}</span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">{questao.pergunta}</p>

      <div className={`mt-4 ${ce ? "grid grid-cols-2 gap-2" : "space-y-2"}`}>
        {questao.opcoes.map((o, i) => {
          let cls = "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
          if (resultado) {
            if (o.correta) cls += "border-emerald-500 bg-emerald-500/15 font-medium text-emerald-300";
            else if (o.id === resultado.opcaoId) cls += "border-red-500 bg-red-500/15 text-red-300";
            else cls += "border-gray-800 text-gray-600";
          } else if (o.id === escolhida) {
            cls += "border-emerald-500/60 bg-emerald-500/10 text-white";
          } else {
            cls += "cursor-pointer border-gray-700 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/5";
          }
          return (
            <button key={o.id} className={cls} disabled={!!resultado || enviando} onClick={() => setEscolhida(o.id)}>
              {!ce && <span className="mr-2 font-mono text-xs text-gray-500">{LETRAS[i]})</span>}
              {resultado && o.correta && <span className="mr-1">✓</span>}
              {resultado && o.id === resultado.opcaoId && !o.correta && <span className="mr-1">✗</span>}
              {o.texto}
            </button>
          );
        })}
      </div>

      {erro && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{erro}</p>}

      {!resultado && (
        <button
          onClick={responder}
          disabled={!escolhida || enviando}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-40"
        >
          {enviando ? "Enviando…" : "Responder"}
        </button>
      )}

      {resultado && (
        <div className="mt-4 space-y-3">
          <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${resultado.correta ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}`}>
            <p className={`text-sm font-semibold ${resultado.correta ? "text-emerald-300" : "text-red-300"}`}>
              {resultado.correta ? "✅ Resposta correta" : "❌ Resposta incorreta"}
            </p>
            <button onClick={novaTentativa} className="text-xs text-gray-400 hover:text-white">Nova tentativa</button>
          </div>
          {questao.explicacao && (
            <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-4 text-sm leading-relaxed text-gray-300">
              💡 {questao.explicacao}
            </div>
          )}
          {questao.comentarioIa && <ComentarioIa {...questao.comentarioIa} />}
          <ComentariosQuestao quizId={questao.id} />
        </div>
      )}
    </article>
  );
}
