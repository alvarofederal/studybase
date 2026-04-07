import Link from "next/link";
import { getAllMateriasData } from "@/lib/getMateriaData";

export const dynamic = "force-dynamic";

async function checkDb(): Promise<boolean> {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const [dbOk, materias] = await Promise.all([checkDb(), getAllMateriasData()]);

  const totalBlocos     = materias.reduce((a, m) => a + m.blocos.length, 0);
  const totalTopicos    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.length, 0), 0);
  const totalQuizzes    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0), 0);
  const totalFlashcards = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0), 0);

  return (
    <div className="p-8 text-white">

      {/* Topo */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral da plataforma</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status DB */}
          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
            dbOk
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dbOk ? "bg-emerald-400" : "bg-amber-400"}`} />
            {dbOk ? "Banco conectado" : "Modo estático"}
          </div>

          <Link
            href="/admin/materias"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-1.5 rounded-xl transition-colors"
          >
            + Nova Matéria
          </Link>
        </div>
      </div>

      {/* Aviso sem banco */}
      {!dbOk && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 text-sm text-amber-200">
          <p className="font-semibold mb-1">⚠️ Banco de dados não configurado</p>
          <p className="text-amber-300/80">Configure o banco e rode:</p>
          <code className="block mt-2 bg-gray-900 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono">
            npx prisma db push &amp;&amp; npm run db:seed
          </code>
        </div>
      )}

      {/* Stats globais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { num: materias.length, label: "Matérias",   icon: "📚", color: "text-teal-400" },
          { num: totalBlocos,     label: "Blocos",      icon: "📦", color: "text-blue-400" },
          { num: totalTopicos,    label: "Tópicos",     icon: "📝", color: "text-violet-400" },
          { num: totalQuizzes,    label: "Questões",    icon: "🧠", color: "text-emerald-400" },
          { num: totalFlashcards, label: "Flashcards",  icon: "🃏", color: "text-emerald-400" },
        ].map(({ num, label, icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`text-3xl font-black ${color}`}>{num}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Matérias — hub principal */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Matérias cadastradas</h2>
        <Link href="/admin/materias" className="text-xs text-gray-500 hover:text-gray-300">
          Ver todas →
        </Link>
      </div>

      {materias.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-400 font-medium mb-2">Nenhuma matéria cadastrada</p>
          <p className="text-sm text-gray-600 mb-6">Comece criando a primeira matéria</p>
          <Link
            href="/admin/materias"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            + Criar matéria
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {materias.map((m) => {
            const totalTop  = m.blocos.reduce((a, b) => a + b.topicos.length, 0);
            const totalQ    = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
            const totalFc   = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);

            return (
              <div
                key={m.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors group"
              >
                {/* Cabeçalho */}
                <Link
                  href={`/admin/materias/${m.slug}`}
                  className="flex items-start gap-4 p-5 pb-4 hover:bg-gray-800/40 transition-colors"
                >
                  <span className="text-3xl shrink-0">{m.icone ?? "📚"}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">
                      {m.nome}
                    </h3>
                    <p className="text-xs text-gray-600 font-mono mt-0.5 truncate">/estudo/{m.slug}</p>
                  </div>
                  <span className="text-gray-700 group-hover:text-emerald-500 transition-colors text-lg shrink-0">→</span>
                </Link>

                {/* Mini stats */}
                <div className="grid grid-cols-4 divide-x divide-gray-800 border-t border-gray-800">
                  {[
                    { n: m.blocos.length, l: "blocos" },
                    { n: totalTop,        l: "tópicos" },
                    { n: totalQ,          l: "questões" },
                    { n: totalFc,         l: "cards" },
                  ].map(({ n, l }) => (
                    <div key={l} className="text-center py-2.5">
                      <div className="text-sm font-bold text-gray-300">{n}</div>
                      <div className="text-[10px] text-gray-600">{l}</div>
                    </div>
                  ))}
                </div>

                {/* Ações rápidas */}
                <div className="flex gap-2 px-4 py-3 border-t border-gray-800 bg-gray-900/50">
                  <Link
                    href={`/admin/materias/${m.slug}`}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                  >
                    ✏️ Editar conteúdo
                  </Link>
                  <Link
                    href={`/admin/quiz/${m.slug}`}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-violet-200 transition-colors"
                  >
                    🧠 Quiz
                  </Link>
                  <Link
                    href={`/admin/flashcards/${m.slug}`}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    🃏 Flashcards
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
