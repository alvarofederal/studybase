"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";
type Bloco   = { id: string; nome: string; slug: string };
type Topico  = { id: string; titulo: string; slug: string; blocoId: string };
type Materia = { id: string; nome: string; slug: string; icone: string | null; blocos: (Bloco & { topicos: Topico[] })[] };

type QuestaoRow = {
  bloco: string; topico: string;
  pergunta: string; opcaoA: string; opcaoB: string; opcaoC: string; opcaoD: string;
  correta: string; explicacao: string; dificuldade: string; tags: string;
  _erro?: string;
};
type FlashRow = {
  bloco: string; topico: string;
  frente: string; verso: string; dica: string;
  _erro?: string;
};

type Step   = 1 | 2 | 3 | 4;
type Formato = "csv" | "json";

// ── Tipo do JSON de backup ────────────────────────────────────────────────────
interface BackupOpcao    { texto: string; correta: boolean; ordem: number }
interface BackupQuiz     { pergunta: string; explicacao: string | null; dificuldade: string; tags: string | null; opcoes: BackupOpcao[] }
interface BackupFlash    { frente: string; verso: string; dica: string | null }
interface BackupTopico   { titulo: string; quizzes: BackupQuiz[]; flashcards: BackupFlash[] }
interface BackupBloco    { nome: string; topicos: BackupTopico[] }
interface BackupMateria  { blocos: BackupBloco[] }
interface BackupRoot     { _meta?: object; materia: BackupMateria }

const LETRAS = ["A", "B", "C", "D"] as const;

// ── Validação de linha contra matéria ─────────────────────────────────────────
function validaLinha(bloco: string, topico: string, materia: Materia): string | undefined {
  const bSet = new Set(materia.blocos.map((b) => b.nome.toLowerCase()));
  const tSet = new Set(
    materia.blocos.flatMap((b) => b.topicos.map((t) => `${b.nome.toLowerCase()}|||${t.titulo.toLowerCase()}`))
  );
  if (!bloco || !bSet.has(bloco.toLowerCase()))
    return `Bloco "${bloco}" não existe na matéria`;
  if (!topico || !tSet.has(`${bloco.toLowerCase()}|||${topico.toLowerCase()}`))
    return `Tópico "${topico}" não encontrado no bloco "${bloco}"`;
}

// ── Parser CSV ────────────────────────────────────────────────────────────────
function parseCSVLine(line: string): string[] {
  const cols: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) { cols.push(cur); cur = ""; }
    else cur += c;
  }
  cols.push(cur);
  return cols.map((s) => s.trim());
}

function parseQuestoesCSV(text: string, materia: Materia): QuestaoRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const col = (name: string) => headers.indexOf(name);
  return lines.slice(1).map((line, idx) => {
    const f = parseCSVLine(line);
    const g = (name: string) => (col(name) >= 0 ? f[col(name)] ?? "" : "");
    const bloco  = g("bloco");
    const topico = g("topico");
    const correta = g("correta").toUpperCase();
    const _erro = validaLinha(bloco, topico, materia)
      ?? (!["A","B","C","D"].includes(correta) ? `"correta" deve ser A, B, C ou D (linha ${idx + 2})` : undefined);
    return {
      bloco, topico,
      pergunta: g("pergunta"),
      opcaoA: g("opcaoa") || g("opcao_a"), opcaoB: g("opcaob") || g("opcao_b"),
      opcaoC: g("opcaoc") || g("opcao_c"), opcaoD: g("opcaod") || g("opcao_d"),
      correta, explicacao: g("explicacao"), dificuldade: g("dificuldade"), tags: g("tags"),
      _erro,
    } as QuestaoRow;
  });
}

function parseFlashCSV(text: string, materia: Materia): FlashRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const col = (name: string) => headers.indexOf(name);
  return lines.slice(1).map((line, idx) => {
    const f = parseCSVLine(line);
    const g = (name: string) => (col(name) >= 0 ? f[col(name)] ?? "" : "");
    const bloco  = g("bloco");
    const topico = g("topico");
    const _erro = validaLinha(bloco, topico, materia)
      ?? (!g("frente") ? `"frente" vazia (linha ${idx + 2})` : undefined);
    return { bloco, topico, frente: g("frente"), verso: g("verso"), dica: g("dica"), _erro } as FlashRow;
  });
}

// ── Parser JSON (backup) ──────────────────────────────────────────────────────
function parseJSON(text: string, materia: Materia): { questoes: QuestaoRow[]; flashcards: FlashRow[]; erroGlobal?: string } {
  let root: BackupRoot;
  try {
    root = JSON.parse(text);
  } catch {
    return { questoes: [], flashcards: [], erroGlobal: "JSON inválido — verifique a sintaxe do arquivo." };
  }

  if (!root?.materia?.blocos) {
    return { questoes: [], flashcards: [], erroGlobal: 'Estrutura inválida: o JSON deve ter { "materia": { "blocos": [...] } }' };
  }

  const questoes: QuestaoRow[] = [];
  const flashcards: FlashRow[] = [];

  for (const bloco of root.materia.blocos) {
    for (const topico of bloco.topicos ?? []) {
      const blocoNome  = bloco.nome  ?? "";
      const topicoNome = topico.titulo ?? "";
      const _erroBase  = validaLinha(blocoNome, topicoNome, materia);

      // Questões
      for (const q of topico.quizzes ?? []) {
        const opcoes  = [...(q.opcoes ?? [])].sort((a, b) => a.ordem - b.ordem);
        const idxCert = opcoes.findIndex((o) => o.correta);
        const correta = idxCert >= 0 ? LETRAS[idxCert] : "";
        const _erro   = _erroBase
          ?? (!correta ? `Questão sem opção correta marcada em "${topicoNome}"` : undefined);
        questoes.push({
          bloco: blocoNome, topico: topicoNome,
          pergunta:    q.pergunta ?? "",
          opcaoA:      opcoes[0]?.texto ?? "",
          opcaoB:      opcoes[1]?.texto ?? "",
          opcaoC:      opcoes[2]?.texto ?? "",
          opcaoD:      opcoes[3]?.texto ?? "",
          correta,
          explicacao:  q.explicacao  ?? "",
          dificuldade: q.dificuldade ?? "MEDIO",
          tags:        q.tags        ?? "",
          _erro,
        });
      }

      // Flashcards
      for (const f of topico.flashcards ?? []) {
        const _erro = _erroBase ?? (!f.frente ? `Flashcard sem frente em "${topicoNome}"` : undefined);
        flashcards.push({
          bloco: blocoNome, topico: topicoNome,
          frente: f.frente ?? "", verso: f.verso ?? "", dica: f.dica ?? "",
          _erro,
        });
      }
    }
  }

  return { questoes, flashcards };
}

// ── Componente textarea ───────────────────────────────────────────────────────
function TextArea({
  label, value, onChange, placeholder, valid, invalid, hint, rows = 8,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; valid: number; invalid: number; hint?: string; rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-white">{label}</span>
        {valid   > 0 && <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg">{valid} ok</span>}
        {invalid > 0 && <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-lg">{invalid} erro{invalid > 1 ? "s" : ""}</span>}
      </div>
      {hint && <p className="text-xs text-gray-600 font-mono leading-relaxed">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono focus:outline-none focus:border-emerald-500 resize-y placeholder:text-gray-700"
      />
    </div>
  );
}

// ── Tabela de prévia ──────────────────────────────────────────────────────────
function PreviewTable({ rows, tipo }: { rows: (QuestaoRow | FlashRow)[]; tipo: "quiz" | "flash" }) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 max-h-56">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-gray-800/80">
            <th className="px-3 py-2 text-left text-gray-500 font-bold">#</th>
            <th className="px-3 py-2 text-left text-gray-500 font-bold">Bloco</th>
            <th className="px-3 py-2 text-left text-gray-500 font-bold">Tópico</th>
            <th className="px-3 py-2 text-left text-gray-500 font-bold">{tipo === "quiz" ? "Pergunta" : "Frente"}</th>
            {tipo === "quiz" && <th className="px-3 py-2 text-left text-gray-500 font-bold">Correta</th>}
            <th className="px-3 py-2 text-left text-gray-500 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t border-gray-800/60 ${r._erro ? "bg-red-500/5" : ""}`}>
              <td className="px-3 py-1.5 text-gray-600">{i + 1}</td>
              <td className="px-3 py-1.5 text-gray-400 max-w-[90px] truncate">{r.bloco}</td>
              <td className="px-3 py-1.5 text-gray-400 max-w-[90px] truncate">{r.topico}</td>
              <td className="px-3 py-1.5 text-gray-300 max-w-[200px] truncate">
                {tipo === "quiz" ? (r as QuestaoRow).pergunta : (r as FlashRow).frente}
              </td>
              {tipo === "quiz" && (
                <td className="px-3 py-1.5 text-emerald-400 font-bold">{(r as QuestaoRow).correta}</td>
              )}
              <td className="px-3 py-1.5">
                {r._erro
                  ? <span className="text-red-400 text-[10px]">⚠ {r._erro}</span>
                  : <span className="text-emerald-500 text-[10px]">✓</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ImportarPage() {
  const { slug } = useParams<{ slug: string }>();
  const [materia,  setMateria]  = useState<Materia | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [step,     setStep]     = useState<Step>(1);
  const [formato,  setFormato]  = useState<Formato>("csv");

  // Passo 1 — backup
  const [backupConfirmado, setBackupConfirmado] = useState(false);
  const [baixandoBackup,   setBaixandoBackup]   = useState(false);
  const [backupBaixado,    setBackupBaixado]     = useState(false);

  // Passo 2 — entradas
  const [csvQ,     setCsvQ]     = useState("");
  const [csvF,     setCsvF]     = useState("");
  const [jsonText, setJsonText] = useState("");
  const [jsonErro, setJsonErro] = useState<string | undefined>();

  // Itens parseados
  const [questoes,   setQuestoes]   = useState<QuestaoRow[]>([]);
  const [flashcards, setFlashcards] = useState<FlashRow[]>([]);

  // Passo 3 — confirmar
  const [substituir, setSubstituir] = useState(false);
  const [confirmSub, setConfirmSub] = useState(false);
  const [importando, setImportando] = useState(false);
  const [resultado,  setResultado]  = useState<{
    criadasQ: number; criadasF: number;
    apagadasQuizzes: number; apagadasFlashcards: number;
    errosQ: string[]; errosF: string[];
  } | null>(null);

  // ── Carrega matéria ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/materias/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d?.id) setMateria(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  // ── Re-parse CSV ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!materia || formato !== "csv") return;
    setQuestoes(csvQ.trim() ? parseQuestoesCSV(csvQ, materia) : []);
  }, [csvQ, materia, formato]);

  useEffect(() => {
    if (!materia || formato !== "csv") return;
    setFlashcards(csvF.trim() ? parseFlashCSV(csvF, materia) : []);
  }, [csvF, materia, formato]);

  // ── Re-parse JSON ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!materia || formato !== "json") return;
    if (!jsonText.trim()) { setQuestoes([]); setFlashcards([]); setJsonErro(undefined); return; }
    const result = parseJSON(jsonText, materia);
    setJsonErro(result.erroGlobal);
    setQuestoes(result.questoes);
    setFlashcards(result.flashcards);
  }, [jsonText, materia, formato]);

  // ── Trocar formato limpa as entradas ─────────────────────────────────────
  function trocarFormato(f: Formato) {
    setFormato(f);
    setQuestoes([]);
    setFlashcards([]);
    setJsonErro(undefined);
  }

  // ── Baixar backup ─────────────────────────────────────────────────────────
  async function baixarBackup() {
    if (!materia) return;
    setBaixandoBackup(true);
    try {
      const res  = await fetch(`/api/admin/materias/${slug}/export`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `backup-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupBaixado(true);
    } finally {
      setBaixandoBackup(false);
    }
  }

  // ── Importar ──────────────────────────────────────────────────────────────
  async function importar() {
    if (!materia) return;
    setImportando(true);
    try {
      const res  = await fetch(`/api/admin/materias/${slug}/import-bulk`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          questoes:   questoes.filter((q) => !q._erro),
          flashcards: flashcards.filter((f) => !f._erro),
          substituir,
        }),
      });
      const data = await res.json();
      setResultado(data);
      setStep(4);
    } finally {
      setImportando(false);
    }
  }

  // ── Derivados ─────────────────────────────────────────────────────────────
  const qValidas   = questoes.filter((q) => !q._erro).length;
  const qInvalidas = questoes.filter((q) =>  q._erro).length;
  const fValidas   = flashcards.filter((f) => !f._erro).length;
  const fInvalidas = flashcards.filter((f) =>  f._erro).length;
  const temItens   = qValidas + fValidas > 0;

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-500 text-sm">Carregando…</div>
  );
  if (!materia) return (
    <div className="p-8 text-gray-400 text-sm">
      Matéria não encontrada.{" "}
      <Link href="/admin/materias" className="text-emerald-400 underline">Voltar</Link>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-gray-950 text-white">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href={`/admin/materias/${slug}`}
          className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors">
          ← Editor
        </Link>
        <span className="text-gray-700">|</span>
        <span className="text-xl">{materia.icone ?? "📚"}</span>
        <div>
          <h1 className="text-sm font-bold text-white leading-none">
            Importação em Lote — {materia.nome}
          </h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Suporta CSV e JSON</p>
        </div>
        <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg uppercase tracking-widest">
          🔐 ADMIN
        </span>
      </div>

      {/* ── Indicador de passos ── */}
      <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/40">
        <div className="flex items-center gap-0 max-w-2xl">
          {[
            { n: 1, label: "Backup" },
            { n: 2, label: "Arquivo" },
            { n: 3, label: "Confirmar" },
            { n: 4, label: "Resultado" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${n <= step ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                  n < step   ? "bg-emerald-500 border-emerald-500 text-gray-950"
                  : n === step ? "bg-gray-800 border-emerald-400 text-emerald-400"
                  :              "bg-gray-800 border-gray-700 text-gray-600"
                }`}>
                  {n < step ? "✓" : n}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${n === step ? "text-white" : "text-gray-500"}`}>{label}</span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-px mx-3 transition-colors ${n < step ? "bg-emerald-500/50" : "bg-gray-800"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* ════════════ PASSO 1 — BACKUP ════════════ */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-amber-500/8 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
              <span className="text-3xl shrink-0">⚠️</span>
              <div>
                <h2 className="text-base font-bold text-amber-300 mb-2">Faça o backup antes de continuar</h2>
                <p className="text-sm text-amber-200/70 leading-relaxed">
                  O modo <strong>"Substituir tudo"</strong> apaga permanentemente todos os dados da matéria.
                  Baixe o backup agora — você poderá usá-lo para <strong>restaurar via upload de JSON</strong> caso algo dê errado.
                </p>
              </div>
            </div>

            {/* Nomes exatos para referência */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                📋 Nomes exatos de Blocos e Tópicos (use no CSV / deve coincidir no JSON)
              </h3>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {materia.blocos.map((b) => (
                  <div key={b.id}>
                    <p className="text-xs font-bold text-teal-400 mb-1 font-mono">{b.nome}</p>
                    <div className="ml-4 space-y-0.5">
                      {b.topicos.map((t) => (
                        <p key={t.id} className="text-xs text-gray-500 font-mono">└ {t.titulo}</p>
                      ))}
                      {b.topicos.length === 0 && <p className="text-xs text-gray-700 italic">Nenhum tópico</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão backup */}
            <button
              onClick={baixarBackup}
              disabled={baixandoBackup}
              className="flex items-center justify-center gap-3 w-full py-4 bg-amber-600/20 hover:bg-amber-600/30 border-2 border-amber-500/50 hover:border-amber-400/70 text-amber-300 font-bold rounded-2xl transition-all text-base disabled:opacity-50"
            >
              {baixandoBackup ? <><span className="animate-spin">⟳</span> Gerando…</>
                : backupBaixado ? <>✅ Backup baixado — pode baixar novamente</>
                : <>📥 Baixar Backup Completo (JSON)</>}
            </button>

            {backupBaixado && (
              <label className="flex items-start gap-3 cursor-pointer bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4">
                <input type="checkbox" checked={backupConfirmado}
                  onChange={(e) => setBackupConfirmado(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0" />
                <span className="text-sm text-emerald-300">
                  Confirmo que baixei o backup e o salvei em local seguro. Estou ciente de que
                  &ldquo;Substituir tudo&rdquo; é irreversível.
                </span>
              </label>
            )}

            <button onClick={() => setStep(2)} disabled={!backupConfirmado}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-2xl transition-all text-sm">
              Continuar para upload →
            </button>
          </div>
        )}

        {/* ════════════ PASSO 2 — ARQUIVO ════════════ */}
        {step === 2 && (
          <div className="space-y-6">

            {/* Seletor de formato */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Formato do arquivo</h3>
              <div className="grid grid-cols-2 gap-3">

                <button onClick={() => trocarFormato("csv")}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    formato === "csv"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 bg-gray-800/40 hover:border-gray-600"}`}>
                  <div className="text-lg mb-1">📄</div>
                  <div className="text-sm font-bold text-white mb-1">CSV</div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    Dois arquivos separados: um para questões, outro para flashcards.
                    Ideal para <strong>criar conteúdo novo</strong>.
                  </div>
                </button>

                <button onClick={() => trocarFormato("json")}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    formato === "json"
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-gray-700 bg-gray-800/40 hover:border-gray-600"}`}>
                  <div className="text-lg mb-1">🗂️</div>
                  <div className="text-sm font-bold text-white mb-1">JSON (Backup)</div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    Um único arquivo no formato gerado pelo botão de backup.
                    Ideal para <strong>restaurar dados</strong>.
                  </div>
                </button>

              </div>
            </div>

            {/* ── MODO CSV ── */}
            {formato === "csv" && (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 mb-2">🧠 Cabeçalho para Questões</p>
                      <pre className="text-[10px] text-gray-500 bg-gray-800/60 rounded-lg p-3 overflow-x-auto leading-relaxed">
{`bloco,topico,pergunta,
opcaoA,opcaoB,opcaoC,opcaoD,
correta,explicacao,dificuldade,tags`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 mb-2">🃏 Cabeçalho para Flashcards</p>
                      <pre className="text-[10px] text-gray-500 bg-gray-800/60 rounded-lg p-3 overflow-x-auto leading-relaxed">
{`bloco,topico,frente,verso,dica`}
                      </pre>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Campos com vírgula devem estar entre aspas duplas. Aspas dentro do texto devem ser duplicadas (&ldquo;&rdquo; → &ldquo;&ldquo;&rdquo;&rdquo;).
                  </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                  <TextArea label="🧠 CSV de Questões" value={csvQ} onChange={setCsvQ}
                    placeholder={"bloco,topico,pergunta,opcaoA,opcaoB,opcaoC,opcaoD,correta,explicacao,dificuldade,tags\n\"Nome do Bloco\",\"Nome do Tópico\",\"Pergunta?\",\"A\",\"B\",\"C\",\"D\",\"A\",\"Explicação\",\"MEDIO\",\"tag1\""}
                    valid={qValidas} invalid={qInvalidas}
                    hint="Cole o conteúdo do arquivo .csv de questões aqui." />
                  <PreviewTable rows={questoes} tipo="quiz" />
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                  <TextArea label="🃏 CSV de Flashcards" value={csvF} onChange={setCsvF}
                    placeholder={"bloco,topico,frente,verso,dica\n\"Nome do Bloco\",\"Nome do Tópico\",\"Frente do card\",\"Verso do card\",\"Dica opcional\""}
                    valid={fValidas} invalid={fInvalidas}
                    hint="Opcional. Deixe em branco para importar só questões." />
                  <PreviewTable rows={flashcards} tipo="flash" />
                </div>
              </>
            )}

            {/* ── MODO JSON ── */}
            {formato === "json" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-300">Estrutura esperada:</strong> o JSON gerado pelo botão
                  &ldquo;Baixar Backup&rdquo; já está no formato correto. Pode colar o conteúdo abaixo ou
                  usar <strong>Ctrl+A → Ctrl+C</strong> no arquivo aberto no bloco de notas.
                  <pre className="mt-2 text-[10px] text-amber-200/50 bg-black/20 rounded-lg p-2 overflow-x-auto">{`{ "_meta": {...}, "materia": { "blocos": [ { "nome": "...", "topicos": [ { "titulo": "...", "quizzes": [...], "flashcards": [...] } ] } ] } }`}</pre>
                </div>

                {jsonErro && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400 font-mono">
                    ⚠ {jsonErro}
                  </div>
                )}

                <TextArea
                  label="🗂️ Conteúdo do arquivo JSON"
                  value={jsonText}
                  onChange={setJsonText}
                  placeholder={'{\n  "_meta": { ... },\n  "materia": {\n    "blocos": [ ... ]\n  }\n}'}
                  valid={qValidas + fValidas}
                  invalid={qInvalidas + fInvalidas}
                  hint="Cole aqui o conteúdo completo do arquivo .json de backup."
                  rows={14}
                />

                {(questoes.length > 0 || flashcards.length > 0) && !jsonErro && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-emerald-400">{qValidas}</div>
                      <div className="text-xs text-gray-500">questão{qValidas !== 1 ? "ões" : ""} detectada{qValidas !== 1 ? "s" : ""}</div>
                      {qInvalidas > 0 && <div className="text-[11px] text-red-400 mt-0.5">{qInvalidas} com erro</div>}
                    </div>
                    <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-blue-400">{fValidas}</div>
                      <div className="text-xs text-gray-500">flashcard{fValidas !== 1 ? "s" : ""} detectado{fValidas !== 1 ? "s" : ""}</div>
                      {fInvalidas > 0 && <div className="text-[11px] text-red-400 mt-0.5">{fInvalidas} com erro</div>}
                    </div>
                  </div>
                )}

                {questoes.length > 0 && <PreviewTable rows={questoes.slice(0, 50)} tipo="quiz" />}
                {flashcards.length > 0 && <PreviewTable rows={flashcards.slice(0, 50)} tipo="flash" />}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-2xl text-sm transition-colors">
                ← Voltar
              </button>
              <button onClick={() => setStep(3)} disabled={!temItens}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-2xl transition-all text-sm">
                {temItens
                  ? `Revisar (${qValidas} questão${qValidas !== 1 ? "ões" : ""} + ${fValidas} flashcard${fValidas !== 1 ? "s" : ""}) →`
                  : "Cole pelo menos um arquivo para continuar"}
              </button>
            </div>
          </div>
        )}

        {/* ════════════ PASSO 3 — CONFIRMAR ════════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-bold text-white">Resumo da importação</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  formato === "json"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                }`}>
                  via {formato.toUpperCase()}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-2xl font-black text-emerald-400">{qValidas}</div>
                  <div className="text-xs text-gray-400">questão{qValidas !== 1 ? "ões" : ""} a importar</div>
                  {qInvalidas > 0 && <div className="text-xs text-red-400 mt-1">{qInvalidas} com erro (ignoradas)</div>}
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-2xl font-black text-blue-400">{fValidas}</div>
                  <div className="text-xs text-gray-400">flashcard{fValidas !== 1 ? "s" : ""} a importar</div>
                  {fInvalidas > 0 && <div className="text-xs text-red-400 mt-1">{fInvalidas} com erro (ignorados)</div>}
                </div>
              </div>

              {/* Distribuição */}
              {(() => {
                const grupos: Record<string, { q: number; f: number }> = {};
                questoes.filter((q) => !q._erro).forEach((q) => {
                  const k = `${q.bloco} › ${q.topico}`;
                  grupos[k] = { q: (grupos[k]?.q ?? 0) + 1, f: grupos[k]?.f ?? 0 };
                });
                flashcards.filter((f) => !f._erro).forEach((f) => {
                  const k = `${f.bloco} › ${f.topico}`;
                  grupos[k] = { q: grupos[k]?.q ?? 0, f: (grupos[k]?.f ?? 0) + 1 };
                });
                const keys = Object.keys(grupos);
                if (!keys.length) return null;
                return (
                  <div className="border-t border-gray-700 pt-4 max-h-48 overflow-y-auto space-y-1.5">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-2">Distribuição por tópico</p>
                    {keys.map((k) => (
                      <div key={k} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-gray-400 truncate flex-1">{k}</span>
                        <div className="flex gap-3 shrink-0 ml-3">
                          {grupos[k].q > 0 && <span className="text-emerald-400">🧠 {grupos[k].q}</span>}
                          {grupos[k].f > 0 && <span className="text-blue-400">🃏 {grupos[k].f}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modo */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white">Modo de importação</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => { setSubstituir(false); setConfirmSub(false); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    !substituir ? "border-emerald-500 bg-emerald-500/10" : "border-gray-700 bg-gray-800/40 hover:border-gray-600"}`}>
                  <div className="text-sm font-bold text-white mb-1">➕ Adicionar</div>
                  <div className="text-xs text-gray-400 leading-relaxed">Insere sem apagar o que já existe.</div>
                </button>
                <button onClick={() => setSubstituir(true)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    substituir ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800/40 hover:border-gray-600"}`}>
                  <div className="text-sm font-bold text-red-300 mb-1">🔄 Substituir tudo</div>
                  <div className="text-xs text-gray-400 leading-relaxed">Apaga tudo da matéria antes de inserir.</div>
                </button>
              </div>

              {substituir && (
                <div className="bg-red-500/8 border border-red-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-red-300 font-semibold">⚠️ Ação irreversível</p>
                  <p className="text-xs text-red-300/70 leading-relaxed">
                    Todas as questões e flashcards de <strong>{materia.nome}</strong> serão permanentemente apagados.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={confirmSub}
                      onChange={(e) => setConfirmSub(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-red-500 shrink-0" />
                    <span className="text-xs text-red-300">
                      Entendo que os dados atuais serão apagados. O backup já foi salvo.
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-2xl text-sm transition-colors">
                ← Voltar
              </button>
              <button onClick={importar}
                disabled={importando || (substituir && !confirmSub) || !temItens}
                className={`flex-1 py-3 font-bold rounded-2xl text-sm transition-all ${
                  substituir
                    ? "bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 text-white"
                }`}>
                {importando ? "⟳ Importando…"
                  : substituir ? `🔄 Substituir e importar ${qValidas + fValidas} itens`
                  : `✅ Importar ${qValidas + fValidas} itens`}
              </button>
            </div>
          </div>
        )}

        {/* ════════════ PASSO 4 — RESULTADO ════════════ */}
        {step === 4 && resultado && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">
                  {resultado.errosQ.length + resultado.errosF.length === 0 ? "✅" : "⚠️"}
                </div>
                <h2 className="text-lg font-black text-white">
                  {resultado.errosQ.length + resultado.errosF.length === 0
                    ? "Importação concluída com sucesso!"
                    : "Importação concluída com avisos"}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-emerald-400">{resultado.criadasQ}</div>
                  <div className="text-xs text-gray-400">questão{resultado.criadasQ !== 1 ? "ões" : ""} criada{resultado.criadasQ !== 1 ? "s" : ""}</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-blue-400">{resultado.criadasF}</div>
                  <div className="text-xs text-gray-400">flashcard{resultado.criadasF !== 1 ? "s" : ""} criado{resultado.criadasF !== 1 ? "s" : ""}</div>
                </div>
              </div>

              {(resultado.apagadasQuizzes > 0 || resultado.apagadasFlashcards > 0) && (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-4">
                  <p className="text-xs text-amber-400">
                    {resultado.apagadasQuizzes} questão{resultado.apagadasQuizzes !== 1 ? "ões" : ""} e{" "}
                    {resultado.apagadasFlashcards} flashcard{resultado.apagadasFlashcards !== 1 ? "s" : ""} removidos antes da importação.
                  </p>
                </div>
              )}

              {(resultado.errosQ.length > 0 || resultado.errosF.length > 0) && (
                <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-red-400 font-semibold mb-2">Linhas não importadas:</p>
                  {[...resultado.errosQ, ...resultado.errosF].map((e, i) => (
                    <p key={i} className="text-xs text-red-300/70 font-mono">{e}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep(2); setResultado(null); setCsvQ(""); setCsvF(""); setJsonText(""); setQuestoes([]); setFlashcards([]); }}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-2xl text-sm transition-colors">
                Nova importação
              </button>
              <Link href={`/admin/materias/${slug}`}
                className="flex-1 py-3 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-colors">
                ← Voltar ao editor
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
