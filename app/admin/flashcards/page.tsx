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

  return (
    <div className="text-white p-8">
      <div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/admin" className="hover:text-gray-300">Admin</Link>
            <span>›</span>
            <span>Flashcards</span>
          </div>
          <h1 className="text-2xl font-black text-white">Flashcards</h1>
          <p className="text-sm text-gray-500 mt-1">Selecione uma matéria para gerenciar os flashcards</p>
        </div>

        {/* Cards de matérias */}
        {stats.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-4xl mb-4">🃏</div>
            <p>Nenhuma matéria cadastrada.</p>
            <Link href="/admin/materias" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">
              Cadastrar matéria →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map(({ materia: m, totalFlashcards, totalTopicos }) => (
              <Link
                key={m.id}
                href={`/admin/flashcards/${m.slug}`}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-gray-900/80 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{m.icone ?? "📚"}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors leading-tight">
                      {m.nome}
                    </h2>
                    <div className="flex gap-4 mt-3 flex-wrap">
                      <div className="text-center">
                        <div className="text-xl font-black text-emerald-400">{totalFlashcards}</div>
                        <div className="text-xs text-gray-600">flashcards</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-gray-400">{m.blocos.length}</div>
                        <div className="text-xs text-gray-600">blocos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-gray-400">{totalTopicos}</div>
                        <div className="text-xs text-gray-600">tópicos</div>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all text-lg shrink-0">→</span>
                </div>

                {totalFlashcards === 0 && (
                  <div className="mt-4 text-xs text-amber-500/70 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                    Nenhum flashcard ainda — clique para adicionar
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
