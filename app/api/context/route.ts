import { NextResponse } from "next/server";
import { getAllMateriasData } from "@/lib/getMateriaData";

/**
 * GET /api/context
 * Gera snapshot Markdown completo do sistema para reuso em chats de IA.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const materias = await getAllMateriasData();

  const lines: string[] = [];

  lines.push("# StudyBase — Snapshot do Sistema");
  lines.push(`> Gerado em: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`);
  lines.push("");

  // ── Resumo geral ──
  const totalBlocos     = materias.reduce((a, m) => a + m.blocos.length, 0);
  const totalTopicos    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.length, 0), 0);
  const totalQuizzes    = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.quizzes.length, 0), 0), 0);
  const totalFlashcards = materias.reduce((a, m) => a + m.blocos.reduce((b, bl) => b + bl.topicos.reduce((c, t) => c + t.flashcards.length, 0), 0), 0);

  lines.push("## Resumo do conteúdo");
  lines.push(`- **Matérias:** ${materias.length}`);
  lines.push(`- **Blocos:** ${totalBlocos}`);
  lines.push(`- **Tópicos:** ${totalTopicos}`);
  lines.push(`- **Questões de Quiz:** ${totalQuizzes}`);
  lines.push(`- **Flashcards:** ${totalFlashcards}`);
  lines.push("");

  // ── Stack ──
  lines.push("## Stack");
  lines.push("- Next.js 16.2.2 App Router + TypeScript");
  lines.push("- Prisma 7 + MySQL/MariaDB (Hostinger)");
  lines.push("- Tailwind CSS v4, dark theme (gray-950), gradiente emerald/teal");
  lines.push("- JWT (access 5min + refresh 7 dias via httpOnly cookie)");
  lines.push("- bcryptjs para senhas, Resend para e-mail");
  lines.push("- Vercel (deploy)");
  lines.push("");

  // ── Schema Prisma ──
  lines.push("## Schema Prisma (completo)");
  lines.push("```");
  lines.push("Materia      id, nome, slug, descricao, icone, cor, ativa, ordem");
  lines.push("  └─ Bloco   id, nome, slug, descricao, ordem, materiaId");
  lines.push("      └─ Topico    id, titulo, slug, conteudo(LongText), resumo, ordem, publicado(bool @default true), blocoId");
  lines.push("          ├─ Quiz         id, pergunta, explicacao, dificuldade(FACIL|MEDIO|DIFICIL), tags(CSV), ordem, topicoId");
  lines.push("          │   └─ OpcaoQuiz  id, texto, correta(bool), ordem, quizId");
  lines.push("          └─ Flashcard    id, frente, verso(LongText), dica, ordem, topicoId");
  lines.push("");
  lines.push("User   id, nome, email, senha(bcrypt), role(ADMIN|USER), ativo");
  lines.push("  ├─ RefreshToken        id, tokenHash(SHA-256), userId, expiresAt");
  lines.push("  ├─ PasswordResetToken  id, tokenHash, userId, expiresAt, usado");
  lines.push("  ├─ UserMateria         id, userId, materiaId, expiresAt(nullable)  @@unique([userId,materiaId])");
  lines.push("  │     └─ expiresAt: null = legado sem expiração; novo padrão = +30 dias desde aprovação");
  lines.push("  ├─ SolicitacaoMateria  id, userId, materiaId, status(PENDENTE|APROVADA|REJEITADA)  @@unique([userId,materiaId])");
  lines.push("  ├─ RespostaQuiz          id, userId, quizId, opcaoId, correta(bool), topicoId  @@unique([userId,quizId])");
  lines.push("  ├─ HistoricoRespostaQuiz id, userId, quizId, opcaoId, correta(bool), topicoId, tentativa(Int)");
  lines.push("  └─ RevisaoFlashcard      id, userId, flashcardId, acertou(bool), topicoId     @@unique([userId,flashcardId])");
  lines.push("```");
  lines.push("");

  // ── Regras de negócio ──
  lines.push("## Regras de negócio");
  lines.push("- Usuário pode ter no máximo **3 matérias ativas** simultaneamente");
  lines.push("- Acesso a uma matéria expira em **30 dias** após aprovação pelo admin");
  lines.push("- expiresAt null = registro legado (acesso perpétuo)");
  lines.push("- Usuário pode revogar próprio acesso (fica PENDENTE novamente para re-solicitar)");
  lines.push("- Admin pode renovar +30 dias no painel de aprovações");
  lines.push("- Badge verde quando >7 dias restantes; vermelho quando ≤7 dias ou expirado");
  lines.push("- **Bloqueio progressivo**: para acessar Bloco N, todos os tópicos do Bloco N-1");
  lines.push("  devem ter ≥90% em Quiz E ≥90% em Flashcards (MINIMO_APROVACAO = 90)");
  lines.push("- Progresso (respostas de quiz + revisões de flashcard) é persistido no banco");
  lines.push("- Tópico sem quiz/flashcard é auto-concluído");
  lines.push("");

  // ── API Routes ──
  lines.push("## API Routes");
  lines.push("```");
  lines.push("# Auth");
  lines.push("POST   /api/auth/login              { email, senha } → { accessToken } + cookies");
  lines.push("POST   /api/auth/logout             limpa cookies");
  lines.push("POST   /api/auth/refresh            renova access_token via refresh_token cookie");
  lines.push("POST   /api/auth/register           { nome, email, senha }");
  lines.push("POST   /api/auth/recuperar-senha    { email } → envia link por e-mail (Resend)");
  lines.push("POST   /api/auth/redefinir-senha    { token, novaSenha }");
  lines.push("POST   /api/auth/alterar-senha      { senhaAtual, novaSenha } (autenticado)");
  lines.push("GET    /api/auth/me                 retorna user autenticado");
  lines.push("");
  lines.push("# Estudo (usuário autenticado)");
  lines.push("POST   /api/estudo/solicitar        { materiaId } — cria/reativa solicitação");
  lines.push("DELETE /api/estudo/revogar          { materiaId } — remove acesso próprio");
  lines.push("POST   /api/estudo/responder-quiz   { quizId, opcaoId, correta, topicoId } — upsert RespostaQuiz + cria HistoricoRespostaQuiz");
  lines.push("DELETE /api/estudo/responder-quiz   { quizId } — remove RespostaQuiz para nova tentativa (histórico preservado)");
  lines.push("POST   /api/estudo/revisar-flashcard{ flashcardId, acertou, topicoId } — upsert");
  lines.push("DELETE /api/estudo/reset-topico     { topicoId, tipo:'quiz'|'flashcard' } — apaga para retry em lote");
  lines.push("");
  lines.push("# Admin");
  lines.push("GET    /api/admin/solicitacoes?status=PENDENTE|APROVADA|REJEITADA");
  lines.push("PUT    /api/admin/solicitacoes/[id] { acao:'aprovar'|'rejeitar'|'renovar' }");
  lines.push("GET    /api/admin/solicitacoes/pendentes  (contagem para badge)");
  lines.push("GET    /api/admin/usuarios");
  lines.push("GET    /api/admin/usuarios/[id]");
  lines.push("PUT    /api/admin/usuarios/[id]     { ativo, role }");
  lines.push("GET    /api/admin/stats             dashboard: QuestaoStat[], TopicoStat[], MateriaStat[], StatsOverview");
  lines.push("GET/POST /api/materias              lista/cria matérias");
  lines.push("GET    /api/materias/[slug]         detalhe");
  lines.push("PATCH  /api/materias/[slug]         atualiza nome, slug, icone, cor, descricao");
  lines.push("DELETE /api/materias/[slug]         remove matéria (cascade blocos→tópicos→quiz/flashcards)");
  lines.push("GET/POST /api/blocos               lista/cria blocos");
  lines.push("GET    /api/blocos/[id]             detalhe do bloco");
  lines.push("PATCH  /api/blocos/[id]             atualiza nome, slug, descricao");
  lines.push("DELETE /api/blocos/[id]             remove bloco (cascade tópicos→quiz/flashcards)");
  lines.push("GET/POST /api/topicos              lista/cria tópicos");
  lines.push("GET    /api/topicos/[id]            detalhe do tópico");
  lines.push("PATCH  /api/topicos/[id]            atualiza titulo, slug, resumo, conteudo, publicado");
  lines.push("POST   /api/admin/quiz/import       importação em lote { topicoId, questoes[{pergunta,opcaoA-D,correta,explicacao?,dificuldade?,tags?}] }");
  lines.push("DELETE /api/topicos/[id]            remove tópico (cascade quiz/flashcards)");
  lines.push("GET/POST /api/quiz                 lista/cria questões  (filtros: topicoId, dificuldade)");
  lines.push("GET    /api/quiz/[id]               detalhe com opcoes incluídas");
  lines.push("PATCH  /api/quiz/[id]               atualiza pergunta/explicacao/dificuldade/tags; opcoes[] → deleteMany+createMany");
  lines.push("DELETE /api/quiz/[id]               remove questão (cascade OpcaoQuiz)");
  lines.push("GET/POST /api/flashcards           lista/cria flashcards");
  lines.push("GET    /api/flashcards/[id]         detalhe do flashcard");
  lines.push("PATCH  /api/flashcards/[id]         atualiza frente, verso, dica");
  lines.push("DELETE /api/flashcards/[id]         remove flashcard");
  lines.push("GET    /api/context                este endpoint");
  lines.push("```");
  lines.push("");

  // ── Páginas ──
  lines.push("## Páginas");
  lines.push("```");
  lines.push("/ (redirect → /estudo se autenticado, senão /login)");
  lines.push("/login                login");
  lines.push("/registro             registro");
  lines.push("/recuperar-senha      solicita link de reset");
  lines.push("/redefinir-senha      formulário com token");
  lines.push("");
  lines.push("/estudo               dashboard: matérias com acesso + solicitar");
  lines.push("/estudo/perfil        perfil: matérias ativas/expiradas + revogar + alterar senha");
  lines.push("/estudo/[slug]        página de estudo (blocos/tópicos/quiz/flashcards)");
  lines.push("");
  lines.push("/admin                              dashboard admin");
  lines.push("/admin/materias                     lista de matérias (cards)");
  lines.push("/admin/materias/[slug]              editor 3 colunas: blocos | tópicos | quiz+flashcards");
  lines.push("                                    └─ edit inline blocos (PATCH/DELETE)");
  lines.push("                                    └─ edit inline tópicos (DELETE; edit via coluna 3)");
  lines.push("                                    └─ edit conteúdo Markdown do tópico selecionado (PATCH)");
  lines.push("                                    └─ edit matéria (nome/slug/cor/icone/descrição) acima");
  lines.push("/admin/quiz/[materiaSlug]           CRUD questões por matéria (edit/delete inline)");
  lines.push("                                    └─ edit matéria acima da lista de questões");
  lines.push("/admin/flashcards/[materiaSlug]     CRUD flashcards por matéria (edit/delete inline)");
  lines.push("                                    └─ edit matéria acima da lista de flashcards");
  lines.push("/admin/usuarios                     lista de usuários");
  lines.push("/admin/usuarios/[id]                detalhe do usuário");
  lines.push("/admin/solicitacoes                 aprovações de acesso (Pendentes/Aprovadas/Rejeitadas)");
  lines.push("/admin/stats                        dashboard de estatísticas de desempenho (questões, flashcards, por matéria)");
  lines.push("/admin/context                      gera este snapshot");
  lines.push("```");
  lines.push("");

  // ── Padrões técnicos importantes ──
  lines.push("## Padrões críticos (Next.js 16.2.2 / Prisma 7)");
  lines.push("- `params` e `cookies()` são `Promise<>` — sempre `await`");
  lines.push("- Todas as páginas que acessam DB têm `export const dynamic = 'force-dynamic'`");
  lines.push("- `@@unique` com dois campos → upsert com `where: { userId_quizId: { ... } }`");
  lines.push("- Tailwind v4: sidebar desktop `hidden md:flex`, drawer mobile `fixed md:hidden`");
  lines.push("- SidebarNav definido fora do componente principal (evita 'created during render')");
  lines.push("- Progresso fire-and-forget: `fetch(...).catch(() => {})` sem bloquear UI");
  lines.push("- Estado global de respostas/revisões: keyed por ID, não reseta ao trocar tópico");
  lines.push("- Prisma db push requer rede para binários — rodar localmente, não no sandbox");
  lines.push("- Admin layout (`app/admin/layout.tsx`) já inclui AdminSidebar+AdminTopbar — não duplicar por página");
  lines.push("- CRUD inline admin: estado `editingId` + form toggle por item, PATCH/DELETE fetch → atualiza estado local");
  lines.push("- Quiz PATCH: `deleteMany({ where: { quizId } })` + `createMany` — abordagem mais simples para reeditar opções");
  lines.push("- Slug change em matéria → `window.location.href` para novo slug (redirect obrigatório)");
  lines.push("- Delete com cascade: avisar escopo completo no `confirm()` antes de executar");
  lines.push("- Tipos de cor no admin: amber para edit-matéria, teal para edit-tópico, gray para blocos");
  lines.push("");

  // ── Conteúdo detalhado ──
  lines.push("## Conteúdo cadastrado no banco");
  lines.push("");

  for (const materia of materias) {
    lines.push(`### 📚 ${materia.nome}`);
    lines.push(`- **Slug:** \`${materia.slug}\``);
    if (materia.descricao) lines.push(`- **Descrição:** ${materia.descricao}`);
    lines.push(`- **Blocos:** ${materia.blocos.length} | **Tópicos:** ${materia.blocos.reduce((a, b) => a + b.topicos.length, 0)}`);
    lines.push("");

    for (const bloco of materia.blocos) {
      lines.push(`#### 📦 Bloco ${bloco.ordem}: ${bloco.nome}`);
      if (bloco.descricao) lines.push(`  ${bloco.descricao}`);

      for (const topico of bloco.topicos) {
        lines.push(`  - **${topico.titulo}** — Q:${topico.quizzes.length} FC:${topico.flashcards.length}`);
        if (topico.resumo) lines.push(`    > ${topico.resumo.slice(0, 100)}${topico.resumo.length > 100 ? "..." : ""}`);

        if (topico.quizzes.length > 0) {
          for (const q of topico.quizzes) {
            const correta = q.opcoes.find((o) => o.correta)?.texto ?? "?";
            lines.push(`    - Q: ${q.pergunta.slice(0, 80)}${q.pergunta.length > 80 ? "..." : ""}`);
            lines.push(`      R: ${correta.slice(0, 80)}${correta.length > 80 ? "..." : ""}`);
          }
        }

        if (topico.flashcards.length > 0) {
          for (const f of topico.flashcards) {
            lines.push(`    - FC: ${f.frente.slice(0, 80)}${f.frente.length > 80 ? "..." : ""}`);
          }
        }
      }
      lines.push("");
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
