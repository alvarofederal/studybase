import Link from "next/link";
import { exigirAluno } from "@/lib/auth/pagina";
import { carregarDesempenho } from "@/lib/study/carregar-desempenho";
import { CORTE_PONTO_FRACO_PCT, MIN_RESPONDIDOS_PONTO_FRACO } from "@/lib/study/desempenho";

export const dynamic = "force-dynamic";
export const metadata = { title: "Desempenho | StudyBase" };

/* ─── Apresentação ────────────────────────────────────────────────────── */

function corTexto(p: number | null) {
  if (p === null) return "text-gray-500";
  if (p >= 70) return "text-emerald-400";
  if (p >= 50) return "text-amber-400";
  return "text-red-400";
}
function corBarra(p: number | null) {
  if (p === null) return "bg-gray-700";
  if (p >= 70) return "bg-emerald-500";
  if (p >= 50) return "bg-amber-500";
  return "bg-red-500";
}
const fmtPct = (p: number | null) => (p === null ? "—" : `${p}%`);
const fmtNum = (n: number) => n.toLocaleString("pt-BR");
const fmtData = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

function Progresso({ feito, total }: { feito: number; total: number }) {
  const p = total > 0 ? Math.round((feito / total) * 100) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${p}%` }} />
      </div>
      <p className="mt-1 text-[10px] text-gray-500">
        {fmtNum(feito)} de {fmtNum(total)} na trilha
      </p>
    </div>
  );
}

/* ─── Página ──────────────────────────────────────────────────────────── */

export default async function DesempenhoPage() {
  const { sub: userId } = await exigirAluno();
  const d = await carregarDesempenho(userId);

  const semDados = d.geral.respondidos === 0 && d.geral.fcRevisados === 0;
  const tentativas8 = d.semanas.reduce((a, s) => a + s.tentativas, 0);
  const maxSemana = Math.max(1, ...d.semanas.map((s) => s.tentativas));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="flex h-14 items-center gap-3 border-b border-gray-800 bg-gray-900 px-4">
        <Link href="/estudo" className="text-sm text-gray-400 hover:text-white">← Início</Link>
        <h1 className="flex-1 text-sm font-bold">Desempenho</h1>
        <Link href="/estudo/questoes" className="text-xs text-gray-400 hover:text-white">Banco de questões →</Link>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
        {!d.temAcesso ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
            <p className="font-medium text-gray-300">Você ainda não tem matérias liberadas.</p>
            <Link href="/estudo" className="mt-3 inline-block text-sm text-emerald-400 hover:underline">
              Solicitar acesso a uma matéria →
            </Link>
          </div>
        ) : semDados ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
            <div className="mb-3 text-4xl">📈</div>
            <p className="font-medium text-gray-300">Ainda não há respostas para analisar.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              Responda questões nos tópicos, no banco de questões ou no simulado. O desempenho por matéria,
              por assunto e a evolução semanal aparecem aqui.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              <Link href="/estudo/questoes" className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500">
                Banco de questões
              </Link>
              <Link href="/estudo/simulado" className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800">
                Simulado
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Números gerais — RF-DES-01 */}
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { rotulo: "Itens respondidos", valor: fmtNum(d.geral.respondidos), cor: "text-white" },
                { rotulo: "Taxa de acerto", valor: fmtPct(d.geral.pct), cor: corTexto(d.geral.pct) },
                { rotulo: "Tentativas em 8 semanas", valor: fmtNum(tentativas8), cor: "text-white" },
                {
                  rotulo: `Flashcards revisados · acerto ${fmtPct(d.geral.fcPct)}`,
                  valor: fmtNum(d.geral.fcRevisados),
                  cor: "text-white",
                },
              ].map((c) => (
                <div key={c.rotulo} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                  <div className={`text-3xl font-black ${c.cor}`}>{c.valor}</div>
                  <div className="mt-1 text-xs text-gray-500">{c.rotulo}</div>
                </div>
              ))}
            </section>

            {/* Evolução semanal — RF-DES-04 */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-white">Evolução semanal</h2>
              <p className="text-xs text-gray-500">Tentativas por semana (segunda a domingo) e taxa de acerto.</p>
              <div className="mt-4 flex h-44 items-end gap-2">
                {d.semanas.map((s) => (
                  <div key={s.inicio} className="flex flex-1 flex-col items-center gap-1" title={`Semana de ${fmtData(s.inicio)}: ${s.tentativas} tentativas, acerto ${fmtPct(s.pct)}`}>
                    <span className={`text-[10px] font-semibold ${corTexto(s.pct)}`}>{fmtPct(s.pct)}</span>
                    <div
                      className={`w-full max-w-[44px] rounded-t ${s.tentativas ? corBarra(s.pct) : "bg-gray-800"}`}
                      style={{ height: `${Math.max(4, (s.tentativas / maxSemana) * 120)}px` }}
                    />
                    <span className="text-[10px] text-gray-500">{fmtData(s.inicio)}</span>
                    <span className="text-[10px] text-gray-600">{s.tentativas}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pontos fracos — RF-DES-05 */}
            <section>
              <h2 className="text-sm font-bold text-white">Onde reforçar</h2>
              <p className="mb-3 text-xs text-gray-500">
                Tópicos com {MIN_RESPONDIDOS_PONTO_FRACO} ou mais itens respondidos e acerto abaixo de {CORTE_PONTO_FRACO_PCT}%.
              </p>
              {d.pontosFracos.length === 0 ? (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">
                  Nenhum tópico abaixo de {CORTE_PONTO_FRACO_PCT}% até agora.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {d.pontosFracos.map((p) => (
                    <Link
                      key={p.topicoId}
                      href={`/estudo/${p.materiaSlug}?topico=${p.topicoId}`}
                      className="group flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition hover:border-red-500/40"
                    >
                      <div className={`w-14 shrink-0 text-center text-2xl font-black ${corTexto(p.pct)}`}>{p.pct}%</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{p.titulo}</p>
                        <p className="truncate text-[11px] text-gray-500">{p.materiaNome} › {p.blocoNome}</p>
                        <p className="text-[11px] text-gray-600">{p.respondidos} itens respondidos</p>
                      </div>
                      <span className="text-xs text-gray-500 transition group-hover:text-white">Revisar →</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Por matéria e assunto — RF-DES-02, RF-DES-03 */}
            <section>
              <h2 className="mb-3 text-sm font-bold text-white">Por matéria e assunto</h2>
              <div className="space-y-3">
                {d.materias.map((m) => (
                  <details key={m.id} className="group rounded-2xl border border-gray-800 bg-gray-900">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-4">
                      <span className="text-2xl">{m.icone ?? "📖"}</span>
                      <div className="min-w-[160px] flex-1">
                        <p className="text-sm font-semibold text-white">{m.nome}</p>
                        <p className="text-[11px] text-gray-500">
                          {fmtNum(m.respondidos)} itens respondidos · flashcards {fmtNum(m.fcRevisados)}/{fmtNum(m.fcTotal)}
                        </p>
                      </div>
                      <Progresso feito={m.trilhaRespondidas} total={m.trilhaTotal} />
                      <div className={`w-16 text-right text-xl font-black ${corTexto(m.pct)}`}>{fmtPct(m.pct)}</div>
                      <span className="text-xs text-gray-600 transition group-open:rotate-180">▼</span>
                    </summary>
                    <div className="border-t border-gray-800 px-4 pb-4">
                      <table className="mt-2 w-full text-sm">
                        <thead>
                          <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500">
                            <th className="py-2 font-medium">Bloco</th>
                            <th className="py-2 text-right font-medium">Respondidos</th>
                            <th className="hidden py-2 pl-4 font-medium sm:table-cell">Trilha</th>
                            <th className="py-2 text-right font-medium">Acerto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {m.blocos.map((b) => (
                            <tr key={b.id} className="border-t border-gray-800/60">
                              <td className="py-2 pr-2 text-gray-300">{b.nome}</td>
                              <td className="py-2 text-right text-gray-400">{fmtNum(b.respondidos)}</td>
                              <td className="hidden py-2 pl-4 sm:table-cell"><Progresso feito={b.trilhaRespondidas} total={b.trilhaTotal} /></td>
                              <td className={`py-2 text-right font-semibold ${corTexto(b.pct)}`}>{fmtPct(b.pct)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <Link href={`/estudo/${m.slug}`} className="mt-3 inline-block text-xs text-emerald-400 hover:underline">
                        Abrir {m.nome} →
                      </Link>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
