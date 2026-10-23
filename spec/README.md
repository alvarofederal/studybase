# spec/ — Documentação orientada a especificação

Cada entrega relevante do StudyBase ganha um documento próprio aqui, escrito **antes** do código e
atualizado **depois** com o que foi executado de fato (status das tarefas, testes, defeitos).

| Documento | Escopo | Status |
|-----------|--------|--------|
| [01-desempenho-comentario-ia-banco.md](01-desempenho-comentario-ia-banco.md) | Página de desempenho do aluno, comentário com IA nas questões e banco de questões com filtros | Implementado |

Referência rápida do sistema (stack, schema, rotas): [`../CONTEXT.md`](../CONTEXT.md).

## Convenções

- Requisitos funcionais: `RF-<área>-<nº>` (ex.: `RF-DES-03`). Não funcionais: `RNF-<nº>`.
- Decisões de arquitetura: `ADR-<nº>`, com contexto, decisão e consequência.
- Tarefas: `T-<nº>`, sempre apontando para o requisito que justificam e para o artefato de código.
  Tarefa sem requisito é escopo inventado; requisito sem tarefa é escopo esquecido.
- Domínio e negócio em português; termos técnicos em inglês.
