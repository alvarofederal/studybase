import Link from "next/link";
import { cookies } from "next/headers";
import { getAllMateriasData } from "@/lib/getMateriaData";
import { verifyAccessToken } from "@/lib/auth/jwt";
import LandingUserButtons from "@/components/LandingUserButtons";
import LandingGuestButtons from "@/components/LandingGuestButtons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const materias = await getAllMateriasData();

  // Verificar sessão para botões contextuais na navbar
  let sessao: { sub: string; role: string } | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) {
      sessao = await verifyAccessToken(token) as { sub: string; role: string };
    }
  } catch {
    sessao = null;
  }

  const totalBlocos     = materias.reduce((a, m) => a + m.blocos.length, 0);
  const totalTopicos    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.length, 0), 0);
  const totalQuizzes    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0), 0);
  const totalFlashcards = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0), 0);

  return (
    <div className="sh-landing min-h-screen overflow-x-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#e3e3e2] bg-[#f2f0eb]/75 backdrop-blur-[12px]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <span className="text-[15px] font-semibold uppercase tracking-[0.14em] text-[#292827]">
            StudyBase
          </span>
          <div className="flex items-center gap-6">
            <a href="#materias" className="hidden text-sm text-[#292827] hover:underline sm:block">Matérias</a>
            <a href="#como-funciona" className="hidden text-sm text-[#292827] hover:underline sm:block">Como funciona</a>
            {sessao ? (
              <LandingUserButtons role={sessao.role as "ADMIN" | "USER"} />
            ) : (
              <LandingGuestButtons />
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO — céu animado + cards de vidro flutuantes ═══════════ */}
      <section className="relative isolate min-h-[720px] pt-16 text-white">
        <div className="ceu-hero" aria-hidden="true">
          <span /><span /><span /><span />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 pb-28 pt-24 text-center">
          <h1 className="mx-auto max-w-3xl text-5xl leading-[1.02] tracking-[-0.03em] md:text-7xl">
            Estude melhor.<br />Passe mais rápido.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/90 md:text-xl">
            Conteúdo em blocos, questões Certo/Errado no padrão CEBRASPE, flashcards e revisão espaçada — num só lugar.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#materias"
              className="inline-flex min-h-12 items-center gap-3 rounded-2xl bg-[#12305e] px-6 font-medium text-white transition-colors hover:bg-[#1d4585]"
            >
              Começar a estudar
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#4fa3f0] to-[#2f6fbd]">→</span>
            </a>
            <a href="#como-funciona" className="glass-ceu px-6 py-3 text-sm font-medium transition-colors hover:bg-white/20">
              Como funciona
            </a>
          </div>

          {/* Cards flutuantes (desktop) */}
          <div className="relative mx-auto mt-16 hidden h-[330px] max-w-[1100px] text-left md:block">
            {/* Questão CEBRASPE */}
            <div className="glass-ceu flutuar-lento absolute left-0 top-4 w-[330px] p-5" style={{ "--d": "0s" } as React.CSSProperties}>
              <p className="text-[11px] uppercase tracking-widest text-white/70">Questão · Certo/Errado</p>
              <p className="mt-2 text-[15px] leading-snug">
                A LGPD aplica-se ao tratamento de dados de pessoa jurídica de direito privado.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-lg bg-white/25 px-4 py-1.5 text-sm">Certo</span>
                <span className="rounded-lg bg-white/10 px-4 py-1.5 text-sm">Errado</span>
              </div>
            </div>

            {/* Dock */}
            <div className="glass-ceu flutuar-lento absolute left-[48%] top-0 flex w-12 flex-col items-center gap-4 py-4 text-lg" style={{ "--d": "-2s" } as React.CSSProperties}>
              <span>📖</span><span>🧠</span><span>🃏</span><span>🗺️</span>
            </div>

            {/* Chip */}
            <div className="glass-ceu flutuar-lento absolute right-4 top-0 px-4 py-2 text-sm" style={{ "--d": "-3s" } as React.CSSProperties}>
              🔥 7 dias de sequência
            </div>

            {/* Flashcard */}
            <div className="glass-ceu flutuar-lento absolute right-0 top-16 w-[320px] p-5" style={{ "--d": "-4s" } as React.CSSProperties}>
              <p className="text-[11px] uppercase tracking-widest text-white/70">Flashcard · revisão espaçada</p>
              <p className="mt-2 text-[15px] font-medium">Prazo da LAI para resposta ao pedido?</p>
              <p className="mt-2 text-sm text-white/85">20 dias, prorrogáveis por mais 10 (art. 11).</p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-lg bg-white/25 px-3 py-1">Errei</span>
                <span className="rounded-lg bg-white/25 px-3 py-1">Acertei</span>
              </div>
            </div>

            {/* Lista */}
            <div className="glass-ceu flutuar-lento absolute bottom-0 left-[8%] w-[460px] p-4 text-sm" style={{ "--d": "-1s" } as React.CSSProperties}>
              <div className="mb-2 flex gap-4 text-white/80">
                <span>Hoje <b className="font-medium text-white">12</b></span>
                <span>Revisão <b className="font-medium text-white">8</b></span>
                <span>Erros <b className="font-medium text-white">5</b></span>
              </div>
              {["Direito Constitucional — Controle de constitucionalidade", "Raciocínio Lógico — Tabelas-verdade", "LGPD — Princípios (art. 6º)"].map((t) => (
                <div key={t} className="truncate border-t border-white/15 py-1.5">{t}</div>
              ))}
            </div>

            {/* Chip */}
            <div className="glass-ceu flutuar-lento absolute bottom-6 right-[10%] px-4 py-2 text-sm" style={{ "--d": "-5s" } as React.CSSProperties}>
              ✨ Mapa de estudo interativo
            </div>
          </div>
        </div>
      </section>

      {/* ══ NÚMEROS ═════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="glass flex flex-wrap items-center justify-around gap-8 px-8 py-7">
          {[
            { n: materias.length, l: "Matérias" },
            { n: totalBlocos,     l: "Blocos" },
            { n: totalTopicos,    l: "Tópicos" },
            { n: totalQuizzes,    l: "Questões" },
            { n: totalFlashcards, l: "Flashcards" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center">
              <div className="text-4xl tracking-tight text-[#292827]">{n.toLocaleString("pt-BR")}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[#666666]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COMO FUNCIONA ═══════════════════════════════════════════ */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl">Como funciona</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#666666]">
              Três etapas para dominar o conteúdo e chegar preparado na prova.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { step: "01", icon: "📖", title: "Leia o conteúdo", desc: "Blocos e tópicos temáticos, do básico ao específico, com formatação clara." },
              { step: "02", icon: "🧠", title: "Pratique com questões", desc: "Múltipla escolha e Certo/Errado com gabarito comentado, logo após cada tópico." },
              { step: "03", icon: "🃏", title: "Revise com flashcards", desc: "Revisão ativa com repetição espaçada para fixar e não esquecer na prova." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={step} className="glass flutuar-lento relative p-8" style={{ "--d": `${-i * 2}s` } as React.CSSProperties}>
                <div className="absolute right-6 top-5 select-none text-5xl text-[#292827]/10">{step}</div>
                <div className="mb-5 text-4xl">{icon}</div>
                <h3 className="mb-3 text-xl">{title}</h3>
                <p className="text-sm leading-relaxed text-[#666666]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MATÉRIAS ════════════════════════════════════════════════ */}
      <section id="materias" className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl">Matérias disponíveis</h2>
            <p className="mt-2 text-[#666666]">
              {materias.length > 0
                ? `${materias.length} matéria${materias.length > 1 ? "s" : ""} com conteúdo completo`
                : "Em breve"}
            </p>
          </div>

          {materias.length === 0 ? (
            <div className="glass py-24 text-center">
              <div className="mb-5 text-5xl">📚</div>
              <p className="text-lg">Conteúdo em preparação</p>
              <p className="mt-2 text-sm text-[#666666]">As matérias serão disponibilizadas em breve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {materias.map((m) => {
                const totalTop = m.blocos.reduce((a, b) => a + b.topicos.length, 0);
                const totalQ   = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0);
                const totalFc  = m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0);

                return (
                  <Link
                    key={m.slug}
                    href={`/estudo/${m.slug}`}
                    className="glass glass-hover group flex flex-col p-7"
                  >
                    <div className="mb-5 flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/70 text-2xl">
                        {m.icone ?? "📚"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg leading-tight">{m.nome}</h3>
                        {m.descricao && (
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#666666]">{m.descricao}</p>
                        )}
                      </div>
                    </div>
                    <div className="mb-5 grid grid-cols-4 gap-2">
                      {[
                        { n: m.blocos.length, l: "blocos" },
                        { n: totalTop,        l: "tópicos" },
                        { n: totalQ,          l: "questões" },
                        { n: totalFc,         l: "cards" },
                      ].map(({ n, l }) => (
                        <div key={l} className="rounded-xl bg-white/55 p-2 text-center">
                          <div className="text-sm font-semibold text-[#292827]">{n}</div>
                          <div className="text-[10px] text-[#666666]">{l}</div>
                        </div>
                      ))}
                    </div>
                    <span className="mt-auto text-sm text-[#2f6fbd] group-hover:underline">Estudar agora →</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[24px] bg-[#0f3a66] px-8 py-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl">Pronto para começar?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80">
              Escolha uma matéria e comece agora mesmo.
            </p>
            <a
              href="#materias"
              className="mt-8 inline-flex min-h-12 items-center rounded-2xl bg-[#12305e] px-7 font-medium text-white transition-colors hover:bg-[#1d4585]"
            >
              Ver matérias disponíveis →
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="bg-[#12305e] py-10 text-white/85">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-sm uppercase tracking-[0.14em]">StudyBase <span className="normal-case tracking-normal text-white/60">— estudos de base para concursos</span></span>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <a href="#materias" className="hover:text-white hover:underline">Matérias</a>
            <a href="#como-funciona" className="hover:text-white hover:underline">Como funciona</a>
            <Link href="/login" className="hover:text-white hover:underline">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
