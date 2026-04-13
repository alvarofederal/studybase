# StudyBase — Contexto do Projeto

> Este arquivo é um snapshot estático de referência rápida.
> Para o snapshot dinâmico com o conteúdo real do banco, acesse: **GET /api/context**

---

## Stack

- **Next.js 16.2.2** — App Router, TypeScript (`params` é `Promise<>` — sempre `await`)
- **React 19.2.4**
- **Prisma 7** com `@prisma/adapter-mariadb` (MySQL/MariaDB — Hostinger)
- **Tailwind CSS v4** com `@tailwindcss/postcss`
- **JWT** access 5min + refresh 7 dias via httpOnly cookie
- **bcryptjs** para senhas | **Resend** para e-mails transacionais
- **Vercel** para deploy

---

## Schema Prisma (resumo)

```
Materia      id, nome, slug, descricao, icone, cor, ativa, ordem
  └─ Bloco   id, nome, slug, descricao, ordem, materiaId
      └─ Topico    id, titulo, slug, conteudo(LongText), resumo, ordem, publicado(bool @default true), blocoId
          ├─ Quiz         id, pergunta, explicacao, dificuldade(FACIL|MEDIO|DIFICIL @default MEDIO), tags(String CSV), ordem, topicoId
          │   └─ OpcaoQuiz  id, texto, correta(bool), ordem, quizId
          └─ Flashcard    id, frente, verso(LongText), dica, ordem, topicoId

User   id, nome, email, senha(bcrypt), role(ADMIN|USER), ativo
  ├─ RefreshToken        id, tokenHash(SHA-256), userId, expiresAt
  ├─ PasswordResetToken  id, tokenHash, userId, expiresAt, usado
  ├─ UserMateria         id, userId, materiaId, expiresAt(nullable)  @@unique([userId,materiaId])
  ├─ SolicitacaoMateria  id, userId, materiaId, status(PENDENTE|APROVADA|REJEITADA)  @@unique([userId,materiaId])
  ├─ RespostaQuiz          id, userId, quizId, opcaoId, correta(bool), topicoId  @@unique([userId,quizId])
  ├─ HistoricoRespostaQuiz id, userId, quizId, opcaoId, correta(bool), topicoId, tentativa(Int)
  └─ RevisaoFlashcard      id, userId, flashcardId, acertou(bool), topicoId     @@unique([userId,flashcardId])
```

---

## API Routes

### Auth
```
POST   /api/auth/login              { email, senha } → { accessToken } + cookies
POST   /api/auth/logout             limpa cookies
POST   /api/auth/refresh            renova access_token via refresh_token cookie
POST   /api/auth/register           { nome, email, senha }
POST   /api/auth/recuperar-senha    { email } → envia link por e-mail
POST   /api/auth/redefinir-senha    { token, novaSenha }
POST   /api/auth/alterar-senha      { senhaAtual, novaSenha } (autenticado)
GET    /api/auth/me                 retorna user autenticado
```

### Estudo (usuário autenticado)
```
POST   /api/estudo/solicitar         { materiaId }
DELETE /api/estudo/revogar           { materiaId }
POST   /api/estudo/responder-quiz    { quizId, opcaoId, correta, topicoId } — upsert + grava histórico
DELETE /api/estudo/responder-quiz    { quizId } — remove última resposta para nova tentativa (histórico preservado)
POST   /api/estudo/revisar-flashcard { flashcardId, acertou, topicoId }
DELETE /api/estudo/reset-topico      { topicoId, tipo:'quiz'|'flashcard' } — reset em lote
```

### Admin
```
GET    /api/admin/solicitacoes?status=PENDENTE|APROVADA|REJEITADA
PUT    /api/admin/solicitacoes/[id]  { acao:'aprovar'|'rejeitar'|'renovar' }
GET    /api/admin/solicitacoes/pendentes
GET    /api/admin/usuarios
GET    /api/admin/usuarios/[id]
PUT    /api/admin/usuarios/[id]      { ativo, role }
GET    /api/admin/stats              dashboard de desempenho (QuestaoStat, TopicoStat, MateriaStat, StatsOverview)
POST   /api/admin/quiz/import        importação em lote { topicoId, questoes[{pergunta,opcaoA-D,correta,explicacao?,dificuldade?,tags?}] }
```

### Conteúdo (CRUD completo)
```
GET/POST   /api/materias              lista/cria matérias
GET        /api/materias/[slug]       detalhe
PATCH      /api/materias/[slug]       atualiza nome, slug, icone, cor, descricao
DELETE     /api/materias/[slug]       remove (cascade)

GET/POST   /api/blocos                lista/cria blocos
GET/PATCH/DELETE /api/blocos/[id]     detalhe, atualiza nome/slug/descricao, remove (cascade)

GET/POST   /api/topicos               lista/cria tópicos
GET/PATCH/DELETE /api/topicos/[id]    detalhe, atualiza titulo/slug/resumo/conteudo/publicado, remove (cascade)

GET/POST   /api/quiz                  lista/cria questões  (filtros GET: topicoId, dificuldade)
GET        /api/quiz/[id]             detalhe com opcoes
PATCH      /api/quiz/[id]             atualiza pergunta/explicacao/dificuldade/tags; opcoes[] → deleteMany+createMany
DELETE     /api/quiz/[id]             remove (cascade OpcaoQuiz)

GET/POST   /api/flashcards            lista/cria flashcards
GET/PATCH/DELETE /api/flashcards/[id] detalhe, atualiza frente/verso/dica, remove

GET        /api/context               snapshot Markdown do sistema (dinâmico)
```

---

## Páginas

### Públicas / Auth
```
/login                login
/cadastro             registro
/recuperar-senha      solicita link de reset
/redefinir-senha      formulário com token
```

### Área do Aluno
```
/estudo               dashboard: matérias com acesso + solicitar novas
/estudo/perfil        perfil: matérias ativas/expiradas + revogar + alterar senha
/estudo/[slug]        estudo interativo (blocos/tópicos/quiz/flashcards, progresso persistido)
```

### Admin (layout compartilhado: AdminSidebar + AdminTopbar)
```
/admin                          dashboard
/admin/materias                 lista de matérias (cards)
/admin/materias/[slug]          editor 3 colunas: blocos | tópicos | quiz+flashcards
                                └─ edit inline de blocos, tópicos, matéria e conteúdo Markdown
/admin/quiz/[materiaSlug]       CRUD questões por matéria (edit/delete inline)
/admin/flashcards/[materiaSlug] CRUD flashcards por matéria (edit/delete inline)
/admin/usuarios                 lista de usuários
/admin/usuarios/[id]            perfil + seletor manual de matérias
/admin/solicitacoes             aprovações (Pendentes / Aprovadas / Rejeitadas)
/admin/stats                    dashboard de estatísticas de desempenho (questões, flashcards, por matéria)
/admin/context                  gera snapshot /api/context
```

---

## Padrões críticos

```
params async         const { id } = await params  (Next.js 15+)
cookies async        const store = await cookies()
force-dynamic        obrigatório em toda page/layout com query ao banco
compound unique      @@unique([a, b]) → chave a_b no where do upsert
opcoes quiz          relação OpcaoQuiz[], não JSON — usar nested create
quiz PATCH           deleteMany opcoes + createMany (abordagem mais simples)
slug change          window.location.href = novo slug (redirect obrigatório)
postinstall          "prisma generate" no package.json (Vercel)
prisma db push       rodar localmente — requer binários de rede
```

---

## Regras de negócio

- Usuário pode ter no máximo **3 matérias ativas** simultaneamente
- Acesso expira em **30 dias** após aprovação; `expiresAt: null` = legado (perpétuo)
- Badge verde >7 dias restantes; vermelho ≤7 dias ou expirado
- **Bloqueio progressivo:** para acessar Bloco N, todos os tópicos do Bloco N-1 precisam de ≥90% em Quiz **e** ≥90% em Flashcards
- Tópico sem quiz/flashcard é auto-concluído
- Progresso (RespostaQuiz + RevisaoFlashcard) é persistido no banco, upsert por usuário+item
