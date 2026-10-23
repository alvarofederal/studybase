import MarkdownRenderer from "@/components/MarkdownRenderer";

/**
 * Comentário gerado por IA, exibido depois que o aluno responde (RF-IA-04).
 * A identificação deixa claro a origem do texto e se a equipe já revisou.
 */
export default function ComentarioIa({ texto, revisado }: { texto: string; revisado: boolean }) {
  return (
    <details className="group rounded-xl border border-sky-800/40 bg-sky-950/20" open>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-xs font-semibold text-sky-300">
        <span aria-hidden>🤖</span>
        Comentário gerado por IA
        <span className="font-normal text-sky-400/70">
          {revisado ? "· revisado pela equipe" : "· pode conter imprecisões"}
        </span>
        <span className="ml-auto text-sky-500/60 transition group-open:rotate-180">▼</span>
      </summary>
      <div className="border-t border-sky-800/30 px-4 py-3 text-sm">
        <MarkdownRenderer content={texto} />
      </div>
    </details>
  );
}
