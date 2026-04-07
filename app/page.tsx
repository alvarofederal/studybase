import Link from "next/link";
import { getAllMateriasData } from "@/lib/getMateriaData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const materias = await getAllMateriasData();

  const totalBlocos     = materias.reduce((a, m) => a + m.blocos.length, 0);
  const totalTopicos    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.length, 0), 0);
  const totalQuizzes    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0), 0);
  const totalFlashcards = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              StudyBase
            </span>
            <span className="hidden sm:inline text-[10px] text-gray-600 font-mono bg-gray-800/80 border border-gray-700 px-1.5 py-0.5 rounded">
              CONCURSOS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#materias" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Matérias
            </a>
            <a href="#como-funciona" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Como funciona
            </a>
            <Link
              href="/admin"
              className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
            >
              ⚙ Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Fundo gradiente animado */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[150px]" />
        </div>

        {/* Grade sutil */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Plataforma de Estudos de Base para Concursos
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-black leading-[1.05] mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Estude melhor.
            </span>
            <br />
            <span className="text-white">Passe mais rápido.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Conteúdo estruturado em blocos temáticos, questões de múltipla escolha e flashcards
            para revisão ativa — tudo em um só lugar.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <a
              href="#materias"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-7 py-3.5 rounded-2xl text-sm transition-all hover:scale-105 active:scale-100"
            >
              Começar a estudar →
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-7 py-3.5 rounded-2xl text-sm transition-colors border border-gray-700"
            >
              Como funciona
            </a>
          </div>

          {/* Stats */}
          <div className="inline-flex items-center gap-8 md:gap-12 bg-gray-900/60 border border-gray-800 rounded-2xl px-8 py-4 flex-wrap justify-center">
            {[
              { n: materias.length, l: "Matérias" },
              { n: totalBlocos,     l: "Blocos" },
              { n: totalTopicos,    l: "Tópicos" },
              { n: totalQuizzes,    l: "Questões" },
              { n: totalFlashcards, l: "Flashcards" },
            ].map(({ n, l }, i) => (
              <div key={l} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-gray-700 hidden sm:block" />}
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400">{n}</div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider">{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMO FUNCIONA ═══════════════════════════════════════════ */}
      <section id="como-funciona" className="py-24 border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">Metodologia</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Como funciona</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Três etapas para dominar o conteúdo e chegar preparado na prova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "📖",
                title: "Leia o conteúdo",
                desc: "Conteúdo organizado em blocos e tópicos temáticos, do mais básico ao mais específico. Markdown com formatação clara.",
                color: "emerald",
              },
              {
                step: "02",
                icon: "🧠",
                title: "Pratique com Quiz",
                desc: "Questões de múltipla escolha com gabarito e explicação detalhada. Teste seu entendimento logo após ler cada tópico.",
                color: "violet",
              },
              {
                step: "03",
                icon: "🃏",
                title: "Revise com Flashcards",
                desc: "Revisão ativa com cards frente/verso. A técnica mais eficiente para fixar conceitos e não esquecer na hora da prova.",
                color: "teal",
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div
                key={step}
                className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors group"
              >
                <div className="absolute top-6 right-6 text-5xl font-black text-gray-800 group-hover:text-gray-700 transition-colors select-none">
                  {step}
                </div>
                <div className="text-4xl mb-5">{icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl bg-gradient-to-r ${
                  color === "emerald" ? "from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" :
                  color === "violet"  ? "from-violet-500/0 via-violet-500/60 to-violet-500/0" :
                                        "from-teal-500/0 via-teal-500/60 to-teal-500/0"
                }`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MATÉRIAS ════════════════════════════════════════════════ */}
      <section id="materias" className="py-24 border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">Conteúdo</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">Matérias disponíveis</h2>
              <p className="text-gray-500 mt-2">
                {materias.length > 0
                  ? `${materias.length} matéria${materias.length > 1 ? "s" : ""} com conteúdo completo`
                  : "Em breve"}
              </p>
            </div>
          </div>

          {materias.length === 0 ? (
            <div className="text-center py-24 bg-gray-900 border border-gray-800 rounded-3xl">
              <div className="text-5xl mb-5">📚</div>
              <p className="text-gray-400 text-lg font-medium">Conteúdo em preparação</p>
              <p className="text-gray-600 text-sm mt-2">As matérias serão disponibilizadas em breve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {materias.map((m) => {
                const totalTop = m.blocos.reduce((a, b) => a + b.topicos.length, 0);
                const totalQ   = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
                const totalFc  = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);
                const progresso = totalTop > 0 ? Math.min(100, Math.round(((totalQ + totalFc) / (totalTop * 6)) * 100)) : 0;

                return (
                  <Link
                    key={m.slug}
                    href={`/estudo/${m.slug}`}
                    className="group flex flex-col bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-emerald-500/40 transition-all hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]"
                  >
                    {/* Topo colorido */}
                    <div className="relative h-2 bg-gray-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-r-full transition-all"
                        style={{ width: `${Math.max(progresso, 8)}%` }}
                      />
                    </div>

                    <div className="flex-1 p-7">
                      {/* Ícone + título */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl shrink-0 group-hover:border-emerald-500/40 transition-colors">
                          {m.icone ?? "📚"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">
                            {m.nome}
                          </h3>
                          {m.descricao && (
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                              {m.descricao}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stats da matéria */}
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {[
                          { n: m.blocos.length, l: "blocos",    icon: "📦" },
                          { n: totalTop,        l: "tópicos",   icon: "📝" },
                          { n: totalQ,          l: "questões",  icon: "🧠" },
                          { n: totalFc,         l: "cards",     icon: "🃏" },
                        ].map(({ n, l, icon }) => (
                          <div key={l} className="bg-gray-800/60 rounded-xl p-2 text-center">
                            <div className="text-xs mb-0.5">{icon}</div>
                            <div className="text-sm font-bold text-white">{n}</div>
                            <div className="text-[10px] text-gray-600">{l}</div>
                          </div>
                        ))}
                      </div>

                      {/* Blocos preview */}
                      {m.blocos.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.blocos.slice(0, 4).map((b) => (
                            <span
                              key={b.id}
                              className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md truncate max-w-[120px]"
                            >
                              {b.nome}
                            </span>
                          ))}
                          {m.blocos.length > 4 && (
                            <span className="text-[10px] text-gray-600 px-2 py-0.5">
                              +{m.blocos.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer do card */}
                    <div className="border-t border-gray-800 px-7 py-4 flex items-center justify-between bg-gray-900/50">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs text-gray-500">Disponível</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform inline-block">
                        Estudar agora →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════ */}
      <section className="py-20 border-t border-gray-800/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-emerald-900/40 border border-emerald-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Escolha uma matéria acima e comece a estudar agora mesmo. Totalmente gratuito.
            </p>
            <a
              href="#materias"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-3.5 rounded-2xl text-sm transition-all hover:scale-105 active:scale-100"
            >
              Ver matérias disponíveis →
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-800/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              StudyBase
            </span>
            <span className="text-xs text-gray-600">— Plataforma de estudos de base para concursos</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <a href="#materias" className="hover:text-gray-400 transition-colors">Matérias</a>
            <a href="#como-funciona" className="hover:text-gray-400 transition-colors">Como funciona</a>
            <Link href="/admin" className="hover:text-gray-400 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
