# 01 — Desempenho do aluno, comentário com IA e banco de questões

**Versão da spec:** 1.0.0
**Data:** 2026-10-22
**Status:** Implementado (ver §11 e §12 para o que foi executado)

---

## 1. Contexto

O StudyBase já tem trilha por tópicos, revisão espaçada de flashcards, caderno de erros, simulado
CEBRASPE, meta diária e comentários dos alunos nas questões. Três lacunas aparecem quando se compara
com plataformas de questões consolidadas:

1. O aluno não vê **onde está errando**. O painel mostra meta e sequência, mas não a taxa de acerto
   por matéria ou por assunto, nem a evolução ao longo das semanas.
2. A explicação de cada questão é curta e escrita uma vez. Não há um **comentário aprofundado**
   que diga por que cada alternativa está certa ou errada e onde está a pegadinha da banca.
3. Só é possível resolver questões **dentro da ordem dos tópicos** (ou no simulado). Falta resolver
   livremente, filtrando por matéria, bloco, dificuldade e situação ("não respondidas", "que errei").

## 2. Objetivo

Entregar, nesta ordem:

| Fase | Entrega | Valor para o aluno |
|------|---------|--------------------|
| A | Página **Desempenho** | Saber quais assuntos estudar primeiro |
| B | **Comentário com IA** em cada questão | Entender o porquê da resposta, no padrão CEBRASPE |
| C | **Banco de questões** com filtros | Praticar de forma dirigida, fora da trilha |

## 3. Fora de escopo (declarado)

- Pagamento, planos e liberação automática de acesso.
- Geração de questões novas por IA (a IA só comenta questões existentes).
- Chat livre com IA ("tire sua dúvida").
- "Por que errei?" sob demanda por aluno (a IA comenta a questão, não a resposta de cada aluno).
- Ranking entre alunos.

## 4. Personas

| Persona | Necessidade central |
|---------|---------------------|
| **Aluno** | Estudar com foco nos pontos fracos e entender a resposta das questões |
| **Administrador** | Gerar e revisar os comentários de IA com custo previsível |

## 5. User stories

- **US-01** — Como aluno, quero ver minha taxa de acerto por matéria e por assunto, para saber onde reforçar.
- **US-02** — Como aluno, quero ver minha evolução semanal, para saber se estou melhorando.
- **US-03** — Como aluno, quero uma lista dos meus assuntos mais fracos com acesso direto ao conteúdo.
- **US-04** — Como aluno, depois de responder uma questão, quero ler um comentário que explique cada alternativa e a pegadinha.
- **US-05** — Como administrador, quero gerar comentários de IA em lote para uma matéria inteira, pagando menos.
- **US-06** — Como administrador, quero revisar, corrigir, ocultar ou regenerar um comentário de IA.
- **US-07** — Como administrador, quero ser avisado quando a IA suspeitar de erro no gabarito.
- **US-08** — Como aluno, quero resolver questões filtrando por matéria, bloco, dificuldade, tipo e situação.

## 6. Requisitos funcionais

### Fase A — Desempenho (`/estudo/desempenho`)

| ID | Requisito |
|----|-----------|
| RF-DES-01 | Mostrar números gerais: itens respondidos, taxa de acerto, tentativas nas últimas 8 semanas, flashcards revisados e taxa de acerto nos flashcards. |
| RF-DES-02 | Mostrar, por matéria com acesso ativo: taxa de acerto, itens respondidos, progresso na trilha (questões da trilha respondidas / total) e flashcards revisados / total. |
| RF-DES-03 | Detalhar cada matéria por bloco (assunto): taxa de acerto, itens respondidos e progresso na trilha. |
| RF-DES-04 | Mostrar a evolução das últimas 8 semanas (segunda a domingo, horário de Brasília): tentativas e taxa de acerto por semana. |
| RF-DES-05 | Listar até 6 **pontos fracos**: tópicos com pelo menos 3 itens respondidos e acerto abaixo de 70%, do menor acerto para o maior, cada um com link para o tópico. |
| RF-DES-06 | Sem dados, a página explica o que fazer (responder questões) em vez de mostrar zeros. |
| RF-DES-07 | Acesso pelo painel do aluno (atalho "Desempenho"). |

**Definições.** *Item respondido* é a última resposta do aluno a uma questão (tabela `respostas_quiz`),
incluindo itens Certo/Errado do simulado. *Questão da trilha* é a que aparece nos tópicos
(`Quiz.origemId = null`). *Tentativa* é cada resposta registrada no histórico (`historico_respostas_quiz`).

### Fase B — Comentário com IA

| ID | Requisito |
|----|-----------|
| RF-IA-01 | Cada questão da trilha pode ter um comentário de IA, gravado no banco (gerado uma vez, não por aluno). |
| RF-IA-02 | O comentário explica por que a resposta correta está correta, por que as demais estão erradas (ou, em Certo/Errado, o que torna a assertiva certa ou errada) e aponta a pegadinha, se houver. Em português, até ~180 palavras. |
| RF-IA-03 | A IA recebe o gabarito, a explicação existente e o conteúdo do tópico, e **nunca contradiz o gabarito**. Se suspeitar de erro, marca `alertaGabarito` com o motivo. |
| RF-IA-04 | O aluno vê o comentário só depois de responder, identificado como "Comentário gerado por IA". Se revisado pela equipe, a identificação diz isso. |
| RF-IA-05 | Comentário com `alertaGabarito` ainda não revisado **não** aparece para o aluno. Comentário oculto pelo admin também não. |
| RF-IA-06 | Admin gera comentários em **lote** por matéria (Message Batches, 50% do preço) para as questões sem comentário, e acompanha o lote até coletar os resultados. |
| RF-IA-07 | Admin gera ou regenera o comentário de **uma** questão na hora. |
| RF-IA-08 | Admin revisa: edita o texto, marca como revisado, oculta/reexibe, regenera. Filtros: com alerta, não revisados, todos. |
| RF-IA-09 | Painel admin mostra, por matéria: questões da trilha, com comentário, revisados e com alerta. |
| RF-IA-10 | Sem `ANTHROPIC_API_KEY` configurada, a tela de admin avisa e as ações de geração ficam indisponíveis; o restante do sistema funciona normalmente. |

### Fase C — Banco de questões (`/estudo/questoes`)

| ID | Requisito |
|----|-----------|
| RF-BQ-01 | Listar questões da trilha das matérias com acesso ativo, de tópicos publicados, 10 por página. |
| RF-BQ-02 | Filtros: matéria, bloco (da matéria escolhida), dificuldade, tipo (múltipla escolha / Certo-Errado) e situação (todas, não respondidas, que errei, que acertei). |
| RF-BQ-03 | Responder na própria lista. A correção é feita no servidor (mesma rota da trilha) e entra no histórico, no caderno de erros e no desempenho. |
| RF-BQ-04 | Após responder: resultado, explicação, comentário de IA (quando disponível) e a discussão dos alunos. |
| RF-BQ-05 | Questão já respondida mostra a resposta anterior; "Nova tentativa" limpa a última resposta (o histórico é preservado). |
| RF-BQ-06 | Cada questão mostra matéria, bloco e tópico, com link para o tópico. |
| RF-BQ-07 | Acesso pelo painel do aluno (atalho "Banco de questões"). |

## 7. Requisitos não funcionais

| ID | Requisito |
|----|-----------|
| RNF-01 | Toda rota valida sessão e acesso ativo à matéria no servidor; nada depende de filtro feito no navegador. |
| RNF-02 | A chave da API da Anthropic fica só no servidor (variável de ambiente na Vercel), nunca no cliente. |
| RNF-03 | Custo da IA previsível: geração única por questão, em lote com 50% de desconto; regeneração individual sob comando do admin. |
| RNF-04 | Desempenho calculado com agregações no banco (`groupBy`), sem carregar todas as respostas na memória, exceto as tentativas das últimas 8 semanas. |
| RNF-05 | Regras de negócio em funções puras com teste automatizado (vitest): agregação do desempenho, semanas, montagem e validação do comentário de IA, filtro do banco de questões. |
| RNF-06 | Visual consistente com a área do aluno atual (tema escuro/claro existente). |

## 8. Decisões de arquitetura

**ADR-01 — Comentário de IA gerado uma vez por questão, não por aluno.**
*Contexto:* a explicação de uma questão é a mesma para todos; gerar por aluno multiplicaria o custo
e a latência. *Decisão:* gerar uma vez, gravar em `comentarios_ia_quiz`, servir junto com o tópico.
*Consequência:* custo fixo e conhecido; o "por que errei?" personalizado fica para depois.

**ADR-02 — Lote pela Message Batches API, disparado pelo painel admin.**
*Contexto:* ~2.750 questões; a Batches API custa 50% e processa em até 24 h (normalmente < 1 h).
Um script local exigiria a chave no computador do admin. *Decisão:* o admin cria o lote pela tela;
o servidor envia o lote e guarda o id em `lotes_comentario_ia`; um botão "Coletar" lê os resultados
quando o lote termina. *Consequência:* nada roda localmente; a chave fica só na Vercel.

**ADR-03 — Modelo `claude-opus-5-5`, esforço `medium`, configuráveis.**
*Contexto:* o comentário precisa de precisão (artigo de lei, prazo), mas a IA recebe o gabarito e só
precisa justificá-lo. *Decisão:* modelo e esforço por variável de ambiente (`ANTHROPIC_MODEL`,
`ANTHROPIC_EFFORT`), com padrão `claude-opus-5-5` / `medium`. Saída estruturada em JSON
(`output_config.format` com JSON Schema). Na geração individual, `fallbacks: "default"` reprocessa
em outro modelo caso o pedido seja recusado pelos filtros de segurança (a Batches API não aceita esse
parâmetro; recusas no lote ficam marcadas para regenerar individualmente).
*Consequência:* trocar de modelo para baratear é uma decisão do dono do sistema, sem mudar código.

**ADR-04 — Comentário com suspeita de gabarito fica retido até revisão.**
*Contexto:* a IA não pode contradizer o gabarito na frente do aluno, mas pode estar certa ao
desconfiar dele. *Decisão:* `alertaGabarito = true` esconde o comentário do aluno até o admin revisar.

**ADR-05 — Banco de questões ignora o travamento sequencial dos blocos.**
*Contexto:* a trilha destrava blocos em sequência; o simulado já sorteia questões de todos os blocos.
*Decisão:* o banco segue o precedente do simulado e mostra todas as questões das matérias com acesso.
*Consequência:* a trilha continua sendo o caminho guiado; o banco é ferramenta de prática e revisão.

**ADR-06 — Correção sempre no servidor.**
O banco usa `POST /api/estudo/responder-quiz`, que decide se a resposta está correta a partir da
alternativa escolhida. O cliente nunca envia `correta`.

## 9. Modelo de dados (acréscimos)

```
ComentarioIaQuiz  (comentarios_ia_quiz)
  id, quizId @unique → Quiz (cascade)
  texto            Text      — Markdown simples
  alertaGabarito   Boolean   — IA suspeita de erro no gabarito
  motivoAlerta     Text?
  modelo           String    — ex.: claude-opus-5-5
  revisado         Boolean   — revisado pela equipe
  oculto           Boolean   — oculto aos alunos
  geradoEm, updatedAt

LoteComentarioIa  (lotes_comentario_ia)
  id, batchId @unique (id do lote na Anthropic), materiaId → Materia (cascade)
  total, status (ENVIADO | COLETADO | FALHOU), sucesso, falhas
  criadoEm, coletadoEm?
```

## 10. Rotas

| Método | Rota | Quem | Uso |
|--------|------|------|-----|
| GET | `/estudo/desempenho` | aluno | Página de desempenho |
| GET | `/estudo/questoes` | aluno | Banco de questões |
| GET | `/api/estudo/questoes` | aluno | Lista filtrada e paginada |
| GET | `/api/estudo/topico/[id]` | aluno | (alterada) inclui o comentário de IA visível |
| GET | `/api/admin/comentarios-ia` | admin | Resumo por matéria, lotes e lista para revisão |
| POST | `/api/admin/comentarios-ia/gerar` | admin | Gera/regenera o comentário de uma questão |
| PATCH | `/api/admin/comentarios-ia/[id]` | admin | Edita texto, revisado, oculto |
| POST | `/api/admin/comentarios-ia/lotes` | admin | Cria lote de uma matéria |
| POST | `/api/admin/comentarios-ia/lotes/[id]/coletar` | admin | Consulta o lote e grava os resultados |

## 11. Custo estimado da IA

Base: 2.748 questões da trilha. Conteúdo médio de um tópico ≈ 600 tokens; entrada por questão
≈ 1.500 tokens; saída (comentário + raciocínio em esforço `medium`) ≈ 1.200 tokens.
Preços de `claude-opus-5-5`: US$ 4 / 1M tokens de entrada, US$ 20 / 1M de saída.

| Cenário | Entrada | Saída | Total |
|---------|---------|-------|-------|
| Tudo de uma vez, preço normal | ~US$ 16 | ~US$ 66 | ~US$ 83 |
| Tudo pela Batches API (50%) | ~US$ 8 | ~US$ 33 | **~US$ 41** |
| Regenerar uma questão | — | — | ~US$ 0,03 |

A estimativa varia com o tamanho do raciocínio; o valor real aparece no console da Anthropic.
Recomendação: gerar primeiro o lote de uma matéria pequena (ex.: Matemática Financeira, 148 questões,
~US$ 2), revisar uma amostra e só então gerar as demais.

## 12. Tarefas

**Legenda:** `[x]` concluída · `[ ]` pendente

### Fase A — Desempenho

| ID | Tarefa | Requisito | Artefato | Status |
|----|--------|-----------|----------|--------|
| T-01 | Funções puras de agregação (geral, matéria, bloco, pontos fracos) | RF-DES-01..03, RF-DES-05 | `lib/study/desempenho.ts` | `[x]` |
| T-02 | Evolução semanal (segunda a domingo, BRT) | RF-DES-04 | `lib/study/desempenho.ts` | `[x]` |
| T-03 | Carregamento com `groupBy` | RNF-04 | `lib/study/carregar-desempenho.ts` | `[x]` |
| T-04 | Página `/estudo/desempenho` (cards, gráfico, tabela, pontos fracos, estado vazio) | RF-DES-01..06, RNF-06 | `app/estudo/desempenho/page.tsx` | `[x]` |
| T-05 | Atalho no painel | RF-DES-07 | `components/estudo/PainelEstudo.tsx` | `[x]` |
| T-06 | Testes de agregação e semanas | RNF-05 | `lib/study/desempenho.test.ts` | `[x]` |

### Fase B — Comentário com IA

| ID | Tarefa | Requisito | Artefato | Status |
|----|--------|-----------|----------|--------|
| T-07 | Modelos `ComentarioIaQuiz` e `LoteComentarioIa` + `db push` | §9 | `prisma/schema.prisma` | `[x]` |
| T-08 | Prompt, JSON Schema e validação da saída (puros) | RF-IA-02, RF-IA-03 | `lib/ia/comentario-quiz.ts` | `[x]` |
| T-09 | Cliente Anthropic: geração individual (com fallback) e montagem do lote | RF-IA-06, RF-IA-07, ADR-03 | `lib/ia/anthropic.ts` | `[x]` |
| T-10 | Rotas admin: resumo, gerar, editar, criar lote, coletar | RF-IA-06..10 | `app/api/admin/comentarios-ia/**` | `[x]` |
| T-11 | Tela admin "Comentários IA" + menu | RF-IA-06..10 | `app/admin/comentarios-ia/page.tsx`, `AdminSidebar.tsx` | `[x]` |
| T-12 | Comentário visível no tópico (regras de alerta/oculto) | RF-IA-04, RF-IA-05 | `app/api/estudo/topico/[id]/route.ts`, `EstudoCliente.tsx` | `[x]` |
| T-13 | Testes do prompt e da validação | RNF-05 | `lib/ia/comentario-quiz.test.ts` | `[x]` |

### Fase C — Banco de questões

| ID | Tarefa | Requisito | Artefato | Status |
|----|--------|-----------|----------|--------|
| T-14 | Montagem do filtro (pura) | RF-BQ-01, RF-BQ-02 | `lib/study/filtro-questoes.ts` | `[x]` |
| T-15 | Rota `GET /api/estudo/questoes` | RF-BQ-01, RF-BQ-02, RF-BQ-05, RNF-01 | `app/api/estudo/questoes/route.ts` | `[x]` |
| T-16 | Página e cartão de questão (responder, resultado, IA, discussão) | RF-BQ-03..06 | `app/estudo/questoes/*`, `components/estudo/CartaoQuestao.tsx` | `[x]` |
| T-17 | Atalho no painel | RF-BQ-07 | `components/estudo/PainelEstudo.tsx` | `[x]` |
| T-18 | Testes do filtro | RNF-05 | `lib/study/filtro-questoes.test.ts` | `[x]` |

## 13. Plano de testes

| Caso | Tipo | Requisito | Resultado esperado |
|------|------|-----------|--------------------|
| CT-01 | unitário | RF-DES-01..03 | Agregação soma por matéria/bloco e calcula acerto e progresso da trilha |
| CT-02 | unitário | RF-DES-05 | Pontos fracos respeitam mínimo de 3 itens, corte de 70% e ordenação |
| CT-03 | unitário | RF-DES-04 | Semanas começam na segunda (BRT), 8 semanas, semana vazia com `pct = null` |
| CT-04 | unitário | RF-IA-02, RF-IA-03 | Prompt contém gabarito, alternativas, explicação e conteúdo do tópico |
| CT-05 | unitário | RF-IA-03 | Validação rejeita JSON sem `comentario`, aceita alerta com motivo |
| CT-06 | unitário | RF-BQ-02 | Filtro gera `where` correto para cada combinação de situação/tipo/dificuldade |
| CT-07 | integração | RF-DES-* | Aluno temporário com respostas vê números coerentes em `/estudo/desempenho` |
| CT-08 | integração | RF-BQ-01..03, RNF-01 | API do banco filtra, pagina, não expõe matéria sem acesso; resposta grava no histórico |
| CT-09 | integração | RF-IA-04, RF-IA-05 | Tópico inclui comentário visível; alerta não revisado e oculto ficam de fora |
| CT-10 | integração | RF-IA-10 | Sem chave da API, rotas de geração respondem 503 com mensagem clara |
| CT-11 | manual (admin) | RF-IA-06..08 | Lote de uma matéria pequena gerado, coletado e revisado no painel |

## 14. Execução (preenchido após a implementação)

Ver o final do documento, seção "Registro de execução".

## Registro de execução

**2026-10-22 — implementação das três fases.**

| Caso | Resultado |
|------|-----------|
| CT-01 a CT-06 | 27 testes novos em `lib/study/desempenho.test.ts`, `lib/ia/comentario-quiz.test.ts`, `lib/study/filtro-questoes.test.ts`, todos passando (suíte completa: 385). |
| CT-07 | Aluno temporário com 9 respostas semeadas + 1 pela rota: página mostrou 10 itens, 60% de acerto, 10 tentativas, 3 flashcards (67%); semana de 05/10 com 3 tentativas (33%) e de 19/10 com 7 (71%); tópico com 33% listado em "Onde reforçar". Contagem da trilha por bloco conferida no banco (69 + 69 + 67 + 110 = 315). |
| CT-08 | API do banco: 315 questões na LGPD; 4 erradas, 5 certas, 306 não respondidas; matéria sem acesso devolveu 0; valores inválidos na URL ignorados; resposta pela rota reduziu as não respondidas para 305. Fluxo na tela (escolher, responder, explicação, discussão) conferido no navegador. |
| CT-09 | Tópico com três comentários de teste: só o visível veio na API (campos `texto` e `revisado`); o com alerta e o oculto ficaram de fora. Depois de o admin marcar o alerta como revisado, ele passou a aparecer ao aluno, com "revisado pela equipe". |
| CT-10 | Sem `ANTHROPIC_API_KEY`: gerar e criar lote responderam 503 com mensagem; resumo, revisão e edição funcionaram; aluno chamando rota admin recebeu 403. |
| CT-11 | **Pendente** — depende da chave da API na Vercel. Roteiro: gerar o lote de Matemática Financeira (148 questões, ~US$ 2), coletar e revisar uma amostra. |

**Decisões tomadas durante a implementação**

- `maxDuration = 60` nas rotas de IA, valor aceito em qualquer plano da Vercel. A geração individual com esforço `medium` e a coleta de um lote (gravação em blocos de 100 com `createMany`) cabem nesse tempo.
- O resumo do painel de IA usa uma única consulta SQL agregada, para não abrir uma conexão por matéria (o plano de banco limita conexões por hora).
- No banco de questões, os filtros "não respondidas" e "que errei" funcionam como fila: "Próximas questões" recarrega do início, porque a paginação por posição pularia questões quando as respondidas saem do filtro.
- As matérias sem questões não aparecem no resumo do painel de IA (a consulta parte das questões da trilha).

**Defeitos encontrados e corrigidos:** nenhum na fase de testes. O único problema foi do próprio roteiro de teste (caminho de arquivo temporário no Windows).
