import { NextResponse } from "next/server";
import { getAllMateriasData } from "@/lib/getMateriaData";

/**
 * GET /api/context
 * Gera snapshot Markdown do banco para reuso em chats de IA.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const materias = await getAllMateriasData();

  const lines: string[] = [];

  lines.push("# StudyBase — Snapshot do Banco de Dados");
  lines.push(`> Gerado em: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`);
  lines.push("");

  // ── Resumo geral ──
  const totalBlocos = materias.reduce((a, m) => a + m.blocos.length, 0);
  const totalTopicos = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.length, 0), 0);
  const totalQuizzes = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0), 0);
  const totalFlashcards = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0), 0);

  lines.push("## Resumo");
  lines.push(`- **Matérias:** ${materias.length}`);
  lines.push(`- **Blocos:** ${totalBlocos}`);
  lines.push(`- **Tópicos:** ${totalTopicos}`);
  lines.push(`- **Questões de Quiz:** ${totalQuizzes}`);
  lines.push(`- **Flashcards:** ${totalFlashcards}`);
  lines.push("");

  // ── Estrutura do schema ──
  lines.push("## Schema Prisma (resumo)");
  lines.push("```");
  lines.push("Materia  →  Bloco[]  →  Topico[]  →  Quiz[]  →  OpcaoQuiz[]");
  lines.push("                                    →  Flashcard[]");
  lines.push("");
  lines.push("Materia:   id, nome, slug, descricao, icone, cor, ativa, ordem");
  lines.push("Bloco:     id, nome, slug, descricao, ordem, materiaId");
  lines.push("Topico:    id, titulo, slug, conteudo (LongText), resumo, ordem, blocoId");
  lines.push("Quiz:      id, pergunta, explicacao, ordem, topicoId");
  lines.push("OpcaoQuiz: id, texto, correta (bool), ordem, quizId");
  lines.push("Flashcard: id, frente, verso (LongText), dica, ordem, topicoId");
  lines.push("```");
  lines.push("");

  // ── Stack e rotas ──
  lines.push("## Stack");
  lines.push("- Next.js 16 App Router + TypeScript");
  lines.push("- Prisma 7 + @prisma/adapter-mariadb + MySQL (Hostinger)");
  lines.push("- Tailwind CSS, dark theme (gray-950), gradiente emerald/teal");
  lines.push("");
  lines.push("## Rotas principais");
  lines.push("| Rota | Descrição |");
  lines.push("|------|-----------|");
  lines.push("| `/` | Home — lista matérias |");
  lines.push("| `/estudo/[slug]` | Página de estudo interativa |");
  lines.push("| `/admin` | Dashboard admin |");
  lines.push("| `/admin/materias` | CRUD de matérias |");
  lines.push("| `/admin/quiz` | Lista de questões |");
  lines.push("| `/admin/flashcards` | Lista de flashcards |");
  lines.push("| `/admin/context` | Esta página |");
  lines.push("");
  lines.push("## APIs REST");
  lines.push("| Endpoint | Métodos |");
  lines.push("|----------|---------|");
  lines.push("| `/api/materias` | GET, POST |");
  lines.push("| `/api/materias/[slug]` | GET |");
  lines.push("| `/api/blocos` | GET, POST |");
  lines.push("| `/api/topicos` | GET, POST |");
  lines.push("| `/api/quiz` | GET, POST |");
  lines.push("| `/api/flashcards` | GET, POST |");
  lines.push("| `/api/context` | GET (este endpoint) |");
  lines.push("");

  // ── Conteúdo detalhado ──
  lines.push("## Conteúdo cadastrado no banco");
  lines.push("");

  for (const materia of materias) {
    lines.push(`### 📚 Matéria: ${materia.nome}`);
    lines.push(`- **Slug:** \`${materia.slug}\``);
    if (materia.descricao) lines.push(`- **Descrição:** ${materia.descricao}`);
    lines.push(`- **Blocos:** ${materia.blocos.length}`);
    lines.push("");

    for (const bloco of materia.blocos) {
      lines.push(`#### 📦 Bloco ${bloco.ordem}: ${bloco.nome}`);
      lines.push(`- Slug: \`${bloco.slug}\``);
      if (bloco.descricao) lines.push(`- ${bloco.descricao}`);
      lines.push("");

      for (const topico of bloco.topicos) {
        lines.push(`##### 📝 Tópico ${topico.ordem}: ${topico.titulo}`);
        lines.push(`- Slug: \`${topico.slug}\``);
        if (topico.resumo) lines.push(`- Resumo: ${topico.resumo}`);
        lines.push(`- Quizzes: ${topico.quizzes.length} | Flashcards: ${topico.flashcards.length}`);

        if (topico.quizzes.length > 0) {
          lines.push("- **Quiz:**");
          for (const q of topico.quizzes) {
            const correta = q.opcoes.find((o) => o.correta)?.texto ?? "?";
            lines.push(`  - P: ${q.pergunta}`);
            lines.push(`    R: ${correta}`);
          }
        }

        if (topico.flashcards.length > 0) {
          lines.push("- **Flashcards:**");
          for (const f of topico.flashcards) {
            lines.push(`  - F: ${f.frente}`);
            lines.push(`    V: ${f.verso.slice(0, 120)}${f.verso.length > 120 ? "..." : ""}`);
          }
        }

        lines.push("");
      }
    }
  }

  const markdown = lines.join("\n");

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
