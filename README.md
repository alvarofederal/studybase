# StudyBase

Plataforma de estudo para concursos públicos: matérias → blocos → tópicos, com quizzes, flashcards,
**revisão espaçada**, **caderno de erros**, **simulados cronometrados**, meta diária, sequência de estudo e
contagem regressiva para a prova. Painel de admin para montar e importar conteúdo (CSV/JSON).

Stack: Next.js 16 (App Router) · React 19 · Prisma 7 + MariaDB/MySQL · Tailwind 4 · JWT (jose) · Resend · Vercel.
Detalhes de schema, rotas e páginas em [`CONTEXT.md`](CONTEXT.md) (e `GET /api/context` para o snapshot dinâmico).

## Rodando localmente

```bash
cp .env.example .env     # preencha DATABASE_URL, JWT_*_SECRET, RESEND_API_KEY
npm install
npm run db:push          # cria/atualiza as tabelas
npm run db:create-admin  # cria o usuário administrador
npm run dev
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` / `build` / `start` | desenvolvimento / build de produção / servidor |
| `npm test` | testes unitários (repetição espaçada, streak, correção de simulado) |
| `npm run typecheck` · `npm run lint` | TypeScript e ESLint |
| `npm run db:push` | aplica o schema (**sem** `--accept-data-loss`: mudanças destrutivas pedem confirmação) |
| `npm run db:seed:*` | seeds de conteúdo por matéria (kb, da, mf, rl, **lp** = Língua Portuguesa; `node prisma/seed-lingua-portuguesa.mjs --dry` só valida) |
| `node prisma/import-*.mjs` | importa os CSVs de `dados/` |

## Segurança

- `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` são **obrigatórios em produção** (a aplicação não sobe sem eles).
- O servidor sempre corrige as respostas (gabarito nunca vem do navegador) e checa o acesso à matéria.
- Login, cadastro e recuperação de senha têm limite de tentativas (em memória, por instância).

## Estrutura

```
app/estudo/        área do aluno (início, matéria, revisão, erros, simulado, perfil)
app/admin/         painel administrativo
app/api/           rotas de API
lib/study/         regras de estudo puras e testadas (sm2, streak, simulado) + consultas do painel
lib/auth/          JWT, sessão, hash
dados/             PDFs/CSVs/backups de conteúdo (fonte para os imports)
```
