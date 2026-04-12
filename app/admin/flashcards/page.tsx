import Link from "next/link";
import { getAllMateriasData } from "@/lib/getMateriaData";

export const dynamic = "force-dynamic";

export default async function AdminFlashcardsIndexPage() {
  const materias = await getAllMateriasData();

  const stats = materias.map((m) => {
    const totalFlashcards = m.blocos.reduce(
      (a, b) => a + b.topicos.reduce((c, t) => c + (t.flashcards?.length ?? 0), 0),
      0
    );
    const totalTopicos = m.blocos.reduce((a, b) => a + b.topicos.length, 0);
    return { materia: m, totalFlashcards, totalTopicos };
  });

  const totalGeral = stats.reduce((a, s) => a + s.totalFlashcards, 0);

  return (
    <div className="p-8 text-white">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>
            <span>›</span>
            <span className="text-gray-400">Flashcards</span>
          </div>
          <h1 className="text-3xl font-black text-white">Flashcards</h1>
          <p className="text-sm text-gray-500 mt-1">
            Selecione uma matéria para gerenciar os flashcards
          </p>
        </div>

        {/* Stat total */}
        <div className="shrink-0 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 text-center">
          <div className="text-3xl font-black text-emerald-400">{totalGeral}</div>
          <div className="text-xs text-gray-500 mt-0.5">flashcards no total</div>
        </div>
      </div>

      {/* Cards de matérias */}
      {stats.length === 0 ? (
        <div className="text-center py-20 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-4xl mb-4">🃏</div>
          <p className="font-medium">Nenhuma matéria cadastrada.</p>
          <Link
            href="/admin/materias"
            className="text-emerald-400 text-sm mt-3 inline-block hover:underline"
          >
            Cadastrar matéria →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {stats.map(({ materia: m, totalFlashcards, totalTopicos }) => (
            <Link
              key={m.id}
              href={`/admin/flashcards/${m.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-900/10"
            >
              {/* Cabeçalho do card */}
              <div className="flex items-start gap-4 p-5">
                <div className="text-3xl shrink-0">{m.icone ?? "📚"}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors leading-tight">
                    {m.nome}
                  </h2>
                  <p className="text-[11px] text-gray-600 font-mono mt-0.5 truncate">
                    /estudo/{m.slug}
                  </p>
                </div>
                <span className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all text-lg shrink-0">
                  →
                </span>
              </div>

              {/* Stats em grid */}
              <div className="grid grid-cols-3 divide-x divide-gray-800 border-t border-gray-800">
                <div className="text-center py-3">
                  <div className="text-xl font-black text-emerald-400">{totalFlashcards}</div>
                  <div className="text-[10px] text-gray-600">flashcards</div>
                </div>
                <div className="text-center py-3">
                  <div className="text-xl font-black text-gray-400">{m.blocos.length}</div>
                  <div className="text-[10px] text-gray-600">blocos</div>
                </div>
                <div className="text-center py-3">
                  <div className="text-xl font-black text-gray-400">{totalTopicos}</div>
                  <div className="text-[10px] text-gray-600">tópicos</div>
                </div>
              </div>

              {/* Aviso sem flashcards */}
              {totalFlashcards === 0 && (
                <div className="mx-4 mb-4 text-xs text-amber-500/70 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  Nenhum flashcard ainda — clique para adicionar
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
