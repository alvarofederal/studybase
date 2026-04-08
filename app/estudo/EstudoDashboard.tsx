"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MateriasCliente from "./MateriasCliente";

/* ── tipos ──────────────────────────────────────────────── */
interface Topico {
  _count: { quizzes: number; flashcards: number };
}
interface Bloco {
  id: string;
  nome: string;
  topicos: Topico[];
}
interface Materia {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  blocos: Bloco[];
}
interface User {
  id: string;
  nome: string;
  email: string;
  createdAt: Date;
}

/* ── props da sidebar ────────────────────────────────────── */
interface SidebarProps {
  user: User;
  inicial: string;
  materiasComAcesso: Materia[];
  totalMaterias: number;
  totalTopicos: number;
  totalQuizzes: number;
  totalFlashcards: number;
  onClose?: () => void;
  onLogout: () => void;
}

/* ── sidebar (componente externo ao dashboard) ───────────── */
function SidebarContent({
  user,
  inicial,
  materiasComAcesso,
  totalMaterias,
  totalTopicos,
  totalQuizzes,
  totalFlashcards,
  onClose,
  onLogout,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            StudyBase
          </span>
          <span className="text-[9px] text-gray-600 font-mono bg-gray-800/80 border border-gray-700 px-1.5 py-0.5 rounded">
            CONCURSOS
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-800 active:bg-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Card do usuário */}
      <Link
        href="/estudo/perfil"
        onClick={onClose}
        className="mx-3 mt-4 flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/40 active:border-emerald-500/40 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0 group-hover:border-emerald-400/60 transition-colors">
          {inicial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user.nome}</p>
          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
        </div>
        <span className="text-gray-600 text-xs group-hover:text-emerald-500 transition-colors shrink-0">→</span>
      </Link>

      {/* Stats */}
      <div className="mx-3 mt-4 grid grid-cols-2 gap-2">
        {[
          { label: "Matérias",   value: materiasComAcesso.length, icon: "📚", sub: `de ${totalMaterias}` },
          { label: "Tópicos",    value: totalTopicos,              icon: "📝", sub: "disponíveis"        },
          { label: "Questões",   value: totalQuizzes,              icon: "🧠", sub: "de quiz"            },
          { label: "Flashcards", value: totalFlashcards,           icon: "🃏", sub: "para revisar"       },
        ].map(({ label, value, icon, sub }) => (
          <div key={label} className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-3 text-center">
            <div className="text-lg mb-0.5">{icon}</div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-[10px] font-semibold text-gray-400">{label}</div>
            <div className="text-[9px] text-gray-600">{sub}</div>
          </div>
        ))}
      </div>

      {/* Progresso */}
      {totalMaterias > 0 && (
        <div className="mx-3 mt-4 p-3 bg-gray-800/40 border border-gray-700/40 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Progresso</span>
            <span className="text-[11px] text-emerald-400 font-bold">
              {materiasComAcesso.length}/{totalMaterias}
            </span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
              style={{ width: `${Math.round((materiasComAcesso.length / totalMaterias) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-1.5">
            {totalMaterias - materiasComAcesso.length} matéria{totalMaterias - materiasComAcesso.length !== 1 ? "s" : ""} aguardando liberação
          </p>
        </div>
      )}

      {/* Acesso rápido */}
      {materiasComAcesso.length > 0 && (
        <div className="mx-3 mt-4 flex-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1 mb-2">
            Acesso rápido
          </p>
          <div className="space-y-0.5">
            {materiasComAcesso.map((m) => (
              <Link
                key={m.id}
                href={`/estudo/${m.slug}`}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 active:bg-gray-800 transition-colors group"
              >
                <span className="text-base shrink-0">{m.icone ?? "📖"}</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors truncate flex-1">
                  {m.nome}
                </span>
                <span className="text-gray-700 text-xs group-hover:text-emerald-500 transition-colors shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div className="mx-3 mb-4 mt-4 pt-4 border-t border-gray-800 space-y-1 shrink-0">
        <Link
          href="/estudo/perfil"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span>👤</span> Meu perfil
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/10 transition-colors text-left"
        >
          <span>↗</span> Sair
        </button>
      </div>
    </div>
  );
}

/* ── helpers ─────────────────────────────────────────────── */
function soma(materias: Materia[], fn: (t: Topico) => number) {
  return materias.reduce(
    (a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + fn(t), 0), 0),
    0
  );
}

/* ── dashboard principal ─────────────────────────────────── */
interface Props {
  user: User;
  materiasComAcesso: Materia[];
  materiasParaSolicitar: Materia[];
  statusSolicitacao: Record<string, string>;
  acessoNegado: boolean;
}

export default function EstudoDashboard({
  user,
  materiasComAcesso,
  materiasParaSolicitar,
  statusSolicitacao,
  acessoNegado,
}: Props) {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const router = useRouter();

  const inicial      = user.nome.charAt(0).toUpperCase();
  const primeiroNome = user.nome.split(" ")[0];

  const totalTopicos    = soma(materiasComAcesso, () => 1);
  const totalQuizzes    = soma(materiasComAcesso, (t) => t._count.quizzes);
  const totalFlashcards = soma(materiasComAcesso, (t) => t._count.flashcards);
  const totalMaterias   = materiasComAcesso.length + materiasParaSolicitar.length;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebarProps: SidebarProps = {
    user,
    inicial,
    materiasComAcesso,
    totalMaterias,
    totalTopicos,
    totalQuizzes,
    totalFlashcards,
    onLogout: handleLogout,
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ── Top bar mobile ──────────────────────────────────── */}
      <header className="lg:hidden h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 shrink-0 z-20">
        <button
          onClick={() => setSidebarAberta(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-800 active:bg-gray-700 text-gray-400 shrink-0"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex-1">
          StudyBase
        </span>
        <Link
          href="/estudo/perfil"
          className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400"
        >
          {inicial}
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ══ SIDEBAR DESKTOP (sempre visível em lg+) ══════════ */}
        <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 shrink-0 bg-gray-900 border-r border-gray-800 overflow-hidden">
          <SidebarContent {...sidebarProps} />
        </aside>

        {/* ══ DRAWER MOBILE ════════════════════════════════════ */}
        {sidebarAberta && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarAberta(false)}
          />
        )}
        <div
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800",
            "flex flex-col lg:hidden",
            "transform transition-transform duration-300 ease-in-out",
            sidebarAberta ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <SidebarContent {...sidebarProps} onClose={() => setSidebarAberta(false)} />
        </div>

        {/* ══ CONTEÚDO PRINCIPAL ════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto">

          {acessoNegado && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3 flex items-center gap-3">
              <span className="text-red-400">🔒</span>
              <p className="text-red-400 text-sm">
                Você não tem acesso a essa matéria. Solicite abaixo ou aguarde aprovação.
              </p>
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">

            {/* Saudação + mini-stats (desktop) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Olá, {primeiroNome}! 👋
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {materiasComAcesso.length > 0
                    ? `${materiasComAcesso.length} matéria${materiasComAcesso.length !== 1 ? "s" : ""} liberada${materiasComAcesso.length !== 1 ? "s" : ""} — bons estudos!`
                    : "Solicite acesso às matérias para começar a estudar."}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {[
                  { v: materiasComAcesso.length, l: "Matérias",   color: "text-emerald-400" },
                  { v: totalQuizzes,             l: "Questões",   color: "text-violet-400"  },
                  { v: totalFlashcards,          l: "Flashcards", color: "text-teal-400"    },
                ].map(({ v, l, color }) => (
                  <div key={l} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
                    <div className={`text-xl font-black ${color}`}>{v}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats rápidas (mobile) */}
            <div className="lg:hidden grid grid-cols-4 gap-2 mb-6">
              {[
                { v: materiasComAcesso.length, l: "Matérias", icon: "📚" },
                { v: totalTopicos,             l: "Tópicos",  icon: "📝" },
                { v: totalQuizzes,             l: "Questões", icon: "🧠" },
                { v: totalFlashcards,          l: "Cards",    icon: "🃏" },
              ].map(({ v, l, icon }) => (
                <div key={l} className="bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-center">
                  <div className="text-base">{icon}</div>
                  <div className="text-lg font-bold text-white">{v}</div>
                  <div className="text-[9px] text-gray-500">{l}</div>
                </div>
              ))}
            </div>

            {/* Matérias com acesso */}
            {materiasComAcesso.length > 0 ? (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Suas matérias</h2>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {materiasComAcesso.length} liberada{materiasComAcesso.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {materiasComAcesso.map((m) => (
                    <MateriaCard key={m.id} materia={m} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl mb-10">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-white font-semibold mb-2">Nenhuma matéria liberada ainda</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Solicite acesso às matérias abaixo ou entre em contato com o administrador.
                </p>
              </div>
            )}

            {/* Solicitar acesso */}
            {materiasParaSolicitar.length > 0 && (
              <section>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-white">Solicitar acesso</h2>
                  <p className="text-gray-600 text-xs mt-0.5">
                    Clique em uma matéria para solicitar — o administrador será notificado.
                  </p>
                </div>
                <MateriasCliente
                  materias={materiasParaSolicitar.map((m) => ({
                    id: m.id,
                    slug: m.slug,
                    nome: m.nome,
                    descricao: m.descricao,
                    icone: m.icone,
                    totalBlocos:     m.blocos.length,
                    totalTopicos:    m.blocos.reduce((a, b) => a + b.topicos.length, 0),
                    totalQuizzes:    m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t._count.quizzes, 0), 0),
                    totalFlashcards: m.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t._count.flashcards, 0), 0),
                    blocos: m.blocos.map((b) => ({ id: b.id, nome: b.nome })),
                  }))}
                  statusInicial={statusSolicitacao}
                />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Card de matéria ─────────────────────────────────────── */
function MateriaCard({ materia }: { materia: Materia }) {
  const totalTopicos    = materia.blocos.reduce((a, b) => a + b.topicos.length, 0);
  const totalQuizzes    = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t._count.quizzes, 0), 0);
  const totalFlashcards = materia.blocos.reduce((a, b) => a + b.topicos.reduce((c, t) => c + t._count.flashcards, 0), 0);

  return (
    <Link
      href={`/estudo/${materia.slug}`}
      className="group flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 active:border-emerald-500/50 transition-all hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.25)]"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

      <div className="flex-1 p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-xl shrink-0 group-hover:border-emerald-500/40 transition-colors">
            {materia.icone ?? "📖"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
              {materia.nome}
            </h3>
            {materia.descricao && (
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {materia.descricao}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { n: totalTopicos,    l: "Tópicos",  icon: "📝" },
            { n: totalQuizzes,    l: "Questões", icon: "🧠" },
            { n: totalFlashcards, l: "Cards",    icon: "🃏" },
          ].map(({ n, l, icon }) => (
            <div key={l} className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-sm">{icon}</div>
              <div className="text-sm font-bold text-white">{n}</div>
              <div className="text-[9px] text-gray-500">{l}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {materia.blocos.slice(0, 3).map((b) => (
            <span key={b.id} className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md truncate max-w-[110px]">
              {b.nome}
            </span>
          ))}
          {materia.blocos.length > 3 && (
            <span className="text-[10px] text-gray-600">+{materia.blocos.length - 3}</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 sm:px-5 py-3 flex items-center justify-between bg-gray-900/30">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-gray-500">Liberado</span>
        </div>
        <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform inline-block">
          Estudar →
        </span>
      </div>
    </Link>
  );
}
