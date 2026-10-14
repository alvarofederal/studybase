import Link from "next/link";
import prisma from "@/lib/prisma";
import { exigirAluno } from "@/lib/auth/pagina";
import { materiasAtivasIds } from "@/lib/study/painel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Caderno de erros | StudyBase" };

export default async function ErrosPage() {
  const { sub: userId } = await exigirAluno();
  const ids = await materiasAtivasIds(userId);

  const erros = await prisma.respostaQuiz.findMany({
    where: { userId, correta: false, quiz: { topico: { bloco: { materiaId: { in: ids } } } } },
    orderBy: { updatedAt: "desc" },
    select: {
      opcaoId: true,
      quiz: {
        select: {
          id: true,
          pergunta: true,
          explicacao: true,
          opcoes: { orderBy: { ordem: "asc" }, select: { id: true, texto: true, correta: true } },
          topico: {
            select: {
              id: true,
              titulo: true,
              bloco: { select: { materia: { select: { slug: true, nome: true } } } },
            },
          },
        },
      },
    },
  });

  // Tópicos com mais erros = onde reforçar
  const porTopico = new Map<string, { titulo: string; materia: string; slug: string; n: number }>();
  for (const e of erros) {
    const t = e.quiz.topico;
    const m = t.bloco.materia;
    const atual = porTopico.get(t.id) ?? { titulo: t.titulo, materia: m.nome, slug: m.slug, n: 0 };
    atual.n++;
    porTopico.set(t.id, atual);
  }
  const fracos = [...porTopico.values()].sort((a, b) => b.n - a.n).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3">
        <Link href="/estudo" className="text-gray-400 hover:text-white text-sm">← Início</Link>
        <h1 className="font-bold text-sm flex-1">Caderno de erros</h1>
        {erros.length > 0 && (
          <Link
            href="/estudo/simulado?modo=erros"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25"
          >
            Refazer erros ({erros.length})
          </Link>
        )}
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {erros.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-lg font-bold">Nenhum erro em aberto</h2>
            <p className="text-gray-500 text-sm mt-2">Questões que você errar aparecem aqui até acertar de novo.</p>
          </div>
        ) : (
          <>
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Onde reforçar
              </h2>
              <ul className="space-y-2">
                {fracos.map((t) => (
                  <li key={t.titulo} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/estudo/${t.slug}`} className="truncate hover:text-emerald-400">
                      {t.titulo} <span className="text-gray-600">· {t.materia}</span>
                    </Link>
                    <span className="text-xs font-bold text-red-400 shrink-0">{t.n} erro{t.n !== 1 ? "s" : ""}</span>
                  </li>
                ))}
              </ul>
            </section>

            {erros.map((e) => {
              const q = e.quiz;
              const certa = q.opcoes.find((o) => o.correta);
              const marcada = q.opcoes.find((o) => o.id === e.opcaoId);
              return (
                <article key={q.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5">
                  <p className="text-[11px] text-gray-500 mb-2">
                    {q.topico.bloco.materia.nome} · {q.topico.titulo}
                  </p>
                  <p className="text-sm font-medium leading-relaxed">{q.pergunta}</p>
                  <div className="mt-3 space-y-1.5 text-sm">
                    {marcada && (
                      <p className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-300">
                        ✗ Você marcou: {marcada.texto}
                      </p>
                    )}
                    {certa && (
                      <p className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-emerald-300">
                        ✓ Correta: {certa.texto}
                      </p>
                    )}
                    {q.explicacao && <p className="text-gray-400 text-xs leading-relaxed pt-1">{q.explicacao}</p>}
                  </div>
                </article>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}
