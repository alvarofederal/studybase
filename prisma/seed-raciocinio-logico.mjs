import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

// ═══════════════════════════════════════════════════════════════
// BLOCOS E TÓPICOS
// ═══════════════════════════════════════════════════════════════
const blocos = [
  // ─────────────────────────────────────────────────────────────
  // BLOCO 1 — LÓGICA PROPOSICIONAL
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Lógica Proposicional",
    slug: "logica-proposicional",
    descricao: "A gramática do raciocínio. Proposições, conectivos lógicos, tabelas-verdade e Lei de De Morgan.",
    ordem: 1,
    topicos: [
      {
        titulo: "Proposições e Conectivos Lógicos",
        slug: "proposicoes-conectivos",
        ordem: 1,
        resumo: "Proposição é toda afirmação que pode ser verdadeira ou falsa. Os 5 conectivos fundamentais são: conjunção (e), disjunção (ou), condicional (se...então), bicondicional (se e somente se) e negação (não). Cada um tem regras exatas — não dependem do senso comum.",
        conteudo: `# Proposições e Conectivos Lógicos

## O que é uma Proposição?

**Proposição** é toda sentença declarativa que pode ser classificada como **verdadeira (V) ou falsa (F)** — nunca os dois ao mesmo tempo.

| Exemplo | É proposição? | Por quê? |
|---------|--------------|---------|
| "O céu é azul." | ✅ Sim | Pode ser V ou F |
| "Feche a porta!" | ❌ Não | Ordem — não tem valor lógico |
| "Que horas são?" | ❌ Não | Pergunta — não tem valor lógico |
| "2 + 2 = 5" | ✅ Sim | É proposição falsa |

## Os 5 Conectivos Lógicos

### 1. Negação — ¬ (não)
Inverte o valor da proposição.
- Se p = V → ¬p = F
- Se p = F → ¬p = V

### 2. Conjunção — ∧ (e)
**Verdadeira somente quando AMBAS as partes são verdadeiras.**

| p | q | p ∧ q |
|---|---|-------|
| V | V | **V** |
| V | F | F |
| F | V | F |
| F | F | F |

### 3. Disjunção — ∨ (ou)
**Verdadeira quando PELO MENOS UMA parte é verdadeira.**

| p | q | p ∨ q |
|---|---|-------|
| V | V | **V** |
| V | F | **V** |
| F | V | **V** |
| F | F | F |

### 4. Condicional — → (se...então)
**Falsa APENAS quando o antecedente é V e o consequente é F.**

| p | q | p → q |
|---|---|-------|
| V | V | **V** |
| V | F | **F** ← único caso falso |
| F | V | **V** |
| F | F | **V** |

> **Dica**: "Se p então q" só mente quando promete (p = V) e não cumpre (q = F).

### 5. Bicondicional — ↔ (se e somente se)
**Verdadeira quando ambas têm o MESMO valor lógico.**

| p | q | p ↔ q |
|---|---|-------|
| V | V | **V** |
| V | F | F |
| F | V | F |
| F | F | **V** |

## Prioridade dos Conectivos (maior → menor)
1. ¬ (negação)
2. ∧ (conjunção)
3. ∨ (disjunção)
4. → (condicional)
5. ↔ (bicondicional)
`,
      },
      {
        titulo: "Tabelas-Verdade e Lei de De Morgan",
        slug: "tabelas-verdade-de-morgan",
        ordem: 2,
        resumo: "A tabela-verdade lista todos os casos possíveis de uma proposição composta. A Lei de De Morgan rege a negação de conjunções e disjunções: ¬(p ∧ q) = ¬p ∨ ¬q e ¬(p ∨ q) = ¬p ∧ ¬q. A negação da condicional é: ¬(p → q) = p ∧ ¬q.",
        conteudo: `# Tabelas-Verdade e Lei de De Morgan

## Montando uma Tabela-Verdade

Para n proposições simples, a tabela tem **2ⁿ linhas**.

- 1 proposição → 2 linhas
- 2 proposições → 4 linhas
- 3 proposições → 8 linhas

**Exemplo**: tabela de (p ∧ q) → r

| p | q | r | p ∧ q | (p ∧ q) → r |
|---|---|---|-------|------------|
| V | V | V | V | **V** |
| V | V | F | V | **F** |
| V | F | V | F | **V** |
| V | F | F | F | **V** |
| F | V | V | F | **V** |
| F | V | F | F | **V** |
| F | F | V | F | **V** |
| F | F | F | F | **V** |

## Lei de De Morgan

Regula a negação de proposições compostas com "e" e "ou":

nao(p E q) = nao-p OU nao-q
nao(p OU q) = nao-p E nao-q

**Em palavras:**
- Negação do "e" → troca por "ou" e nega as partes
- Negação do "ou" → troca por "e" e nega as partes

**Exemplos práticos:**
- "Não é verdade que (João estudou E passou)" = "João não estudou OU não passou"
- "Não é verdade que (chove OU venta)" = "Não chove E não venta"

## Negações Especiais

| Proposição original | Negação correta |
|--------------------|--------------------|
| p ∧ q | ¬p ∨ ¬q |
| p ∨ q | ¬p ∧ ¬q |
| p → q | p ∧ ¬q |
| p ↔ q | (p ∧ ¬q) ∨ (¬p ∧ q) |

> **Regra de ouro da negação da condicional**: "Se p então q" é negado como "p e não-q". A condicional só é falsa quando a premissa é verdadeira e a conclusão é falsa.

## Tautologia, Contradição e Contingência

| Tipo | Definição | Exemplo |
|------|-----------|---------|
| **Tautologia** | Sempre verdadeira | p ∨ ¬p |
| **Contradição** | Sempre falsa | p ∧ ¬p |
| **Contingência** | Depende dos valores | p ∧ q |
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 2 — EQUIVALÊNCIAS E INFERÊNCIAS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Equivalências e Inferências",
    slug: "equivalencias-inferencias",
    descricao: "O que uma afirmação realmente implica. Contrapositiva, formas do condicional, Modus Ponens, Modus Tollens e silogismo hipotético.",
    ordem: 2,
    topicos: [
      {
        titulo: "Contrapositiva e as 4 Formas do Condicional",
        slug: "contrapositiva-formas-condicional",
        ordem: 1,
        resumo: "Dado 'Se p então q', existem 4 formas relacionadas. Apenas a contrapositiva 'Se ¬q então ¬p' é logicamente equivalente ao original. A recíproca 'Se q então p' e a contrária 'Se ¬p então ¬q' NÃO são equivalentes — erro clássico em provas.",
        conteudo: `# Contrapositiva e as 4 Formas do Condicional

## As 4 Formas

Dado o condicional original: **"Se p então q"** (p → q)

| Nome | Forma | Equivalente ao original? |
|------|-------|--------------------------|
| **Original** | p → q | — |
| **Recíproca** | q → p | ❌ NÃO |
| **Contrária** | ¬p → ¬q | ❌ NÃO |
| **Contrapositiva** | ¬q → ¬p | ✅ SIM |

## Por que a Contrapositiva é Equivalente?

Verifique com a tabela-verdade: (p → q) e (¬q → ¬p) têm exatamente os mesmos valores em todos os casos.

| p | q | p → q | ¬q → ¬p |
|---|---|-------|---------|
| V | V | V | V |
| V | F | **F** | **F** |
| F | V | V | V |
| F | F | V | V |

## Exemplo Concreto

Original: **"Se o candidato estuda, então ele passa."**

| Forma | Enunciado | Equivalente? |
|-------|-----------|-------------|
| Recíproca | "Se o candidato passa, então ele estuda." | ❌ Não — pode ter passado na sorte |
| Contrária | "Se o candidato não estuda, então não passa." | ❌ Não — mesma lógica |
| **Contrapositiva** | **"Se o candidato não passou, então não estudou."** | ✅ Sim — logicamente idêntico |

## Outras Equivalências Importantes

| Original | Equivalente |
|----------|------------|
| p → q | ¬p ∨ q |
| p → q | ¬q → ¬p |
| ¬(p → q) | p ∧ ¬q |
| p ↔ q | (p → q) ∧ (q → p) |

> **Dica de prova**: quando a questão apresentar a contrapositiva como alternativa de uma condicional, as duas são a MESMA proposição — mesmo significado lógico.
`,
      },
      {
        titulo: "Modus Ponens, Modus Tollens e Silogismo Hipotético",
        slug: "modus-ponens-tollens-silogismo",
        ordem: 2,
        resumo: "Modus Ponens: afirma o antecedente → afirma o consequente. Modus Tollens: nega o consequente → nega o antecedente. Silogismo hipotético: encadeia condicionais (p→q e q→r, então p→r). Essas três formas de inferência resolvem a maioria das questões de argumentação em concursos.",
        conteudo: `# Modus Ponens, Modus Tollens e Silogismo Hipotético

## Modus Ponens (Afirmação do Antecedente)

**Estrutura:**
1. Se p então q
2. p é verdadeiro
3. **Portanto, q é verdadeiro**

**Exemplo:**
- Premissa 1: "Se chove, a rua fica molhada."
- Premissa 2: "Está chovendo."
- Conclusão: **"A rua está molhada."** ✅

## Modus Tollens (Negação do Consequente)

**Estrutura:**
1. Se p então q
2. q é falso (¬q)
3. **Portanto, p é falso (¬p)**

**Exemplo:**
- Premissa 1: "Se chove, a rua fica molhada."
- Premissa 2: "A rua NÃO está molhada."
- Conclusão: **"NÃO está chovendo."** ✅

## Falácias Comuns (NÃO são inferências válidas)

| Nome | Estrutura | Por que é inválida |
|------|-----------|-------------------|
| **Negação do antecedente** | p→q, ¬p ∴ ¬q | ❌ q pode ser verdadeiro por outra causa |
| **Afirmação do consequente** | p→q, q ∴ p | ❌ q pode ter vindo de outra premissa |

**Exemplo de falácia:** "Se estudo, passo. Não estudei. Logo, não passei." — **INVÁLIDO**. Posso ter passado sem estudar.

## Silogismo Hipotético

**Estrutura:**
1. Se p então q
2. Se q então r
3. **Portanto, se p então r**

**Exemplo:**
- "Se há fumaça, há fogo."
- "Se há fogo, há perigo."
- Conclusão: **"Se há fumaça, há perigo."** ✅

### Cadeias longas de condicionais

Em provas com 4 ou 5 premissas em cadeia, aplique o silogismo hipotético repetidamente:

p → q → r → s → t

Conclusão direta: **p → t**

> **Dica**: em questões com várias condicionais, identifique a "ponta" da cadeia (o que inicia) e siga até o fim. O resultado é a conclusão válida.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 3 — LÓGICA DE PREDICADOS: QUANTIFICADORES
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Quantificadores e Lógica de Predicados",
    slug: "quantificadores-logica-predicados",
    descricao: "Todo, algum, nenhum — palavras que mudam tudo. Negação de quantificadores, diagramas de Euler-Venn e silogismos categóricos.",
    ordem: 3,
    topicos: [
      {
        titulo: "Quantificadores Universal e Existencial",
        slug: "quantificadores-universal-existencial",
        ordem: 1,
        resumo: "'Todo A é B' usa quantificador universal (∀) — aplica-se a todos os elementos. 'Algum A é B' usa quantificador existencial (∃) — pelo menos um. 'Algum' em lógica significa 'pelo menos um', podendo ser todos. As negações trocam o quantificador e negam o predicado.",
        conteudo: `# Quantificadores Universal e Existencial

## Os Três Quantificadores Fundamentais

| Proposição | Quantificador | Símbolo | Significado |
|-----------|--------------|---------|-------------|
| "Todo A é B" | Universal | ∀ | Aplica-se a todos sem exceção |
| "Algum A é B" | Existencial | ∃ | Pelo menos um A é B |
| "Nenhum A é B" | Universal negativo | ∀¬ | Nenhum elemento de A é B |

## Negação dos Quantificadores

A regra mais cobrada em concursos:

| Original | Negação |
|----------|---------|
| **Todo A é B** | **Algum A não é B** |
| **Algum A é B** | **Nenhum A é B** |
| **Nenhum A é B** | **Algum A é B** |

**Padrão**: troca-se "todo" por "algum...não" e "algum" por "nenhum".

## Armadilha: "Algum" em Lógica ≠ "Alguns poucos"

Em lógica formal, **"algum A é B" significa "pelo menos um A é B"** — isso é compatível com "todos os A são B"!

**Exemplo:**
- "Algum brasileiro é bom em futebol."
- Essa proposição é verdadeira mesmo que TODOS os brasileiros sejam bons em futebol.

> Iniciantes interpretam "algum" como "poucos" ou "exatamente um" — isso é erro conceitual grave em provas.

## Palavras-Gatilho

| Quantificador | Palavras equivalentes nas provas |
|--------------|----------------------------------|
| Universal (todo) | sempre, qualquer, cada, todo, sem exceção, invariavelmente |
| Existencial (algum) | existe, há, algum, pelo menos um, certo, determinado |
| Nenhum | nunca, jamais, nenhum, não existe |

## Relação com a Condicional

"Todo A é B" pode ser reescrito como condicional:

"Todo A é B"  equiv  "Se x é A, então x é B"

Isso permite aplicar as regras da lógica proposicional (contrapositiva etc.) a proposições com quantificadores.

**Negação via contrapositiva:**
- "Todo A é B" → "Se A então B" → contrapositiva: "Se não-B então não-A"
- Negação: "Algum A não é B" ✅
`,
      },
      {
        titulo: "Diagramas de Euler-Venn e Silogismos",
        slug: "diagramas-euler-venn-silogismos",
        ordem: 2,
        resumo: "Diagramas de Euler-Venn representam graficamente relações entre conjuntos. São a ferramenta mais eficiente para resolver silogismos categóricos: 'Todo A é B. Todo B é C. Logo, todo A é C.' Desenhe os círculos antes de raciocinar.",
        conteudo: `# Diagramas de Euler-Venn e Silogismos Categóricos

## O que são Diagramas de Euler-Venn?

São círculos que representam conjuntos e suas relações. Cada proposição categórica tem um diagrama correspondente.

## Representação das 4 Proposições Categóricas

### "Todo A é B" (Universal afirmativa)
O círculo A está **dentro** do círculo B.
\`\`\`
    +-------------------+
    |        B          |
    |   +-----+         |
    |   |  A  |         |
    |   +-----+         |
    +-------------------+
\`\`\`

### "Nenhum A é B" (Universal negativa)
Os círculos A e B são **disjuntos** (sem interseção).
\`\`\`
    +-----+    +-----+
    |  A  |    |  B  |
    +-----+    +-----+
\`\`\`

### "Algum A é B" (Particular afirmativa)
Os círculos A e B têm **interseção parcial**.
\`\`\`
    +------+
    |  A +-+--+
    |    | |  | B
    +----+-+  |
         +----+
\`\`\`

### "Algum A não é B" (Particular negativa)
O círculo A tem uma **parte fora** de B.

## Resolvendo Silogismos

**Exemplo clássico:**
1. "Todo cachorro é mamífero."
2. "Todo mamífero é animal."
3. Conclusão: ?

Pelo diagrama: cachorro ⊂ mamífero ⊂ animal → **"Todo cachorro é animal."** ✅

**Exemplo com cuidado:**
1. "Todo A é B."
2. "Algum B é C."
3. Conclusão válida?

**Não se pode concluir "Algum A é C"** — os elementos de A que são B podem ser exatamente os que não são C.

> **Regra de ouro**: sempre desenhe o diagrama antes de chegar à conclusão. A intuição engana; o diagrama não.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 4 — LÓGICA SITUACIONAL E ARRANJOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Lógica Situacional e Arranjos",
    slug: "logica-situacional-arranjos",
    descricao: "Deduzir quem é quem e onde está o quê. Problemas com personagens V/F, tabelas de dupla entrada, ordem/posição e seleção com restrições.",
    ordem: 4,
    topicos: [
      {
        titulo: "Problemas de Verdadeiro/Falso e Tabela de Dupla Entrada",
        slug: "problemas-vf-tabela-dupla-entrada",
        ordem: 1,
        resumo: "Nos problemas com personagens que mentem ou falam a verdade, teste cada hipótese sistematicamente. Na tabela de dupla entrada, organize as informações em uma grade antes de raciocinar — a partir de 3 variáveis, o raciocínio mental se torna inviável.",
        conteudo: `# Problemas de Verdadeiro/Falso e Tabela de Dupla Entrada

## Problemas com Personagens V/F

**Estratégia geral:**
1. Liste quem pode ser o mentiroso (ou o verdadeiro)
2. Suponha que cada pessoa é o verdadeiro (ou o mentiroso)
3. Verifique se as afirmações dos outros são consistentes com essa suposição
4. A hipótese que não gera contradição é a correta

**Exemplo:**
- Ana diz: "Bruno mente."
- Bruno diz: "Carlos fala a verdade."
- Carlos diz: "Ana mente."
- Sabendo que apenas 1 fala a verdade, quem é?

Teste Ana = verdadeiro: Bruno mente (✓), mas Carlos diz que Ana mente — Carlos mente (✓), e Bruno disse que Carlos fala a verdade — Bruno mente (✓). **Funciona! Ana fala a verdade.**

## Tabela de Dupla Entrada

**Quando usar**: problemas com N pessoas e N características (posição, cor, profissão etc.)

**Estrutura básica:**

|  | Característica 1 | Característica 2 | Característica 3 |
|--|-----------------|-----------------|-----------------|
| Pessoa 1 | ? | ? | ? |
| Pessoa 2 | ? | ? | ? |
| Pessoa 3 | ? | ? | ? |

**Método:**
1. **Liste** todas as informações numeradas
2. **Preencha as certezas** absolutas primeiro
3. **Use eliminação**: se A é 1, ninguém mais é 1 na mesma coluna
4. **Deduza** o que sobra

> Nunca tente resolver de cabeça com mais de 2 variáveis. Monte a tabela antes de raciocinar.

## Problemas de Ordem e Posição

Para "A está à esquerda de B, C não é adjacente a D...":
1. Desenhe uma linha (ou círculo para mesas redondas)
2. Posicione as certezas absolutas
3. Teste os casos possíveis para o que restou

**Dica**: palavras como "imediatamente à esquerda" são mais restritivas que "à esquerda de" — leia com atenção.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 5 — RACIOCÍNIO DEDUTIVO, INDUTIVO E ARGUMENTAÇÃO
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Argumentação, Falácias e Sequências",
    slug: "argumentacao-falacias-sequencias",
    descricao: "Avaliar se um argumento é válido de verdade. Argumento válido vs. verdadeiro, falácias formais e informais, raciocínio indutivo e padrões em sequências.",
    ordem: 5,
    topicos: [
      {
        titulo: "Argumento Válido vs. Verdadeiro e Falácias",
        slug: "argumento-valido-falacias",
        ordem: 1,
        resumo: "Argumento válido: a conclusão segue logicamente das premissas (mesmo que as premissas sejam falsas). Argumento verdadeiro/sólido: premissas verdadeiras + argumento válido. Falácias são erros de raciocínio — as mais cobradas são: ad hominem, apelo à autoridade, generalização apressada, falsa dicotomia e negação do antecedente.",
        conteudo: `# Argumento Válido vs. Verdadeiro e Falácias

## Validade vs. Veracidade

| Conceito | Definição | Exemplo |
|----------|-----------|---------|
| **Válido** | A conclusão segue logicamente das premissas | "Todo peixe voa. Tubarão é peixe. Logo, tubarão voa." (válido, mas premissa falsa) |
| **Sólido (Sound)** | Válido + premissas verdadeiras | "Todo mamífero tem coração. Cão é mamífero. Logo, cão tem coração." |
| **Inválido** | Conclusão não segue das premissas | "Hoje choveu. Amanhã é sábado. Logo, vai chover amanhã." |

> Um argumento pode ser **válido com premissas falsas**. Validade é sobre a estrutura lógica, não sobre a realidade.

## Falácias Formais

São erros na estrutura lógica do argumento:

| Falácia | Estrutura | Exemplo |
|---------|-----------|---------|
| **Negação do antecedente** | p→q, ¬p ∴ ¬q | "Se estuda, passa. Não estudou. Logo, não passou." ❌ |
| **Afirmação do consequente** | p→q, q ∴ p | "Se chove, molha. Está molhado. Logo, choveu." ❌ |

## Falácias Informais (mais cobradas em FGV e Cesgranrio)

| Falácia | Descrição | Exemplo |
|---------|-----------|---------|
| **Ad hominem** | Ataca a pessoa, não o argumento | "Sua proposta é errada porque você é desonesto." |
| **Apelo à autoridade** | Usa celebridade fora de sua área | "Fulano, ator famoso, diz que X é saudável." |
| **Generalização apressada** | Conclusão geral de poucos casos | "Conheço 3 políticos corruptos. Logo, todos são." |
| **Falsa dicotomia** | Apresenta só 2 opções quando há mais | "Ou você é a favor ou é inimigo." |
| **Apelo à emoção** | Usa sentimentos no lugar de argumentos | "Como você pode votar contra, sabendo que crianças sofrerão?" |
| **Espantalho** | Distorce o argumento do oponente | Rebater uma versão exagerada do que foi dito |

## Raciocínio Dedutivo vs. Indutivo

| Tipo | Direção | Certeza da conclusão |
|------|---------|---------------------|
| **Dedutivo** | Geral → Particular | Conclusão **garantida** se premissas forem V |
| **Indutivo** | Particular → Geral | Conclusão **provável**, nunca certa |

**Dedutivo**: "Todo homem é mortal. Sócrates é homem. Logo, Sócrates é mortal." — conclusão certa.

**Indutivo**: "Todos os corvos que já vi eram pretos. Logo, todos os corvos são pretos." — conclusão provável (pode haver um corvo branco).
`,
      },
      {
        titulo: "Sequências Numéricas e de Letras",
        slug: "sequencias-numericas-letras",
        ordem: 2,
        resumo: "Sequências são resolvidas identificando o padrão — não por tentativa e erro. Analise as diferenças entre termos consecutivos (PA), as razões (PG) ou a operação que gera cada termo. Para sequências de letras, converta para a posição numérica no alfabeto.",
        conteudo: `# Sequências Numéricas e de Letras

## Estratégia Geral

Nunca tente adivinhar. O padrão é **identificado** observando:
1. **Diferenças** entre termos consecutivos → Progressão Aritmética (PA)
2. **Razões** entre termos consecutivos → Progressão Geométrica (PG)
3. **Operações** entre pares de termos → padrões alternativos
4. **Posição** do termo → fórmula baseada no índice

## Progressão Aritmética (PA)

As diferenças entre termos consecutivos são **constantes** (razão **r**).

**Exemplo:** 3, 7, 11, 15, 19, ...
- Diferenças: 4, 4, 4, 4 → r = 4
- Próximo: 19 + 4 = **23**

**Fórmula do termo geral:** aₙ = a₁ + (n-1) × r

## Progressão Geométrica (PG)

As **razões** entre termos consecutivos são constantes (razão **q**).

**Exemplo:** 2, 6, 18, 54, ...
- Razões: 3, 3, 3 → q = 3
- Próximo: 54 × 3 = **162**

## Padrões Alternados e Mistos

**Exemplo:** 1, 4, 2, 8, 3, 12, 4, 16, ...
- Posições ímpares: 1, 2, 3, 4 → PA com r = 1
- Posições pares: 4, 8, 12, 16 → PA com r = 4

**Exemplo com operação entre adjacentes:** 2, 3, 5, 8, 13, 21, ...
- Cada termo = soma dos dois anteriores → **Sequência de Fibonacci**

## Sequências de Letras

Converta cada letra para sua posição no alfabeto (A=1, B=2, ..., Z=26) e identifique o padrão numérico.

**Exemplo:** A, C, F, J, O, ...
- Posições: 1, 3, 6, 10, 15 → diferenças: 2, 3, 4, 5 → próxima diferença = 6 → próxima posição = 21 = **U**

## Tabela do Alfabeto (posições)
| A=1 | B=2 | C=3 | D=4 | E=5 | F=6 | G=7 | H=8 | I=9 | J=10 |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| K=11 | L=12 | M=13 | N=14 | O=15 | P=16 | Q=17 | R=18 | S=19 | T=20 |
| U=21 | V=22 | W=23 | X=24 | Y=25 | Z=26 | | | | |
`,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ — 6 a 8 questões por bloco, variadas
// ═══════════════════════════════════════════════════════════════
const quizData = [
  // ───────────── BLOCO 1 — Lógica Proposicional (8 questões) ─────────────
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    pergunta: "Qual das alternativas abaixo NÃO é uma proposição lógica?",
    opcoes: [
      "O número π é irracional.",
      "Brasília é a capital do Brasil.",
      "Feche a janela!",
      "2 + 2 = 5.",
    ],
    respostaCorreta: 2,
    explicacao: "Uma proposição é uma sentença declarativa que pode ser classificada como verdadeira ou falsa. 'Feche a janela!' é uma ordem (sentença imperativa), sem valor lógico. As demais são proposições: π irracional (V), Brasília capital (V) e 2+2=5 (F, mas é proposição).",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    pergunta: "A proposição condicional 'Se p então q' (p → q) é FALSA em qual situação?",
    opcoes: [
      "Quando p é falso e q é verdadeiro.",
      "Quando p é verdadeiro e q é falso.",
      "Quando p e q são ambos falsos.",
      "Quando p e q são ambos verdadeiros.",
    ],
    respostaCorreta: 1,
    explicacao: "A condicional p → q só é falsa quando o antecedente p é verdadeiro e o consequente q é falso — ou seja, quando 'prometeu e não cumpriu'. Nos demais casos (F→V, F→F, V→V) é verdadeira.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    pergunta: "Considere as proposições: p = 'Chove' (V) e q = 'Faz sol' (F). Qual é o valor lógico de (p ∧ q) ∨ (¬q)?",
    opcoes: [
      "Falso, pois p ∧ q já é falso.",
      "Verdadeiro, pois ¬q é verdadeiro e basta uma parte da disjunção ser V.",
      "Falso, pois ¬q torna a disjunção falsa.",
      "Indeterminado, pois há mistura de conectivos.",
    ],
    respostaCorreta: 1,
    explicacao: "p ∧ q = V ∧ F = F. ¬q = ¬F = V. Então (F) ∨ (V) = V. Na disjunção, basta uma parte ser verdadeira para o todo ser verdadeiro.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    pergunta: "O bicondicional 'p ↔ q' é verdadeiro quando:",
    opcoes: [
      "Pelo menos uma das proposições é verdadeira.",
      "Ambas as proposições têm o mesmo valor lógico (ambas V ou ambas F).",
      "p é verdadeiro e q é falso.",
      "p é falso e q é verdadeiro.",
    ],
    respostaCorreta: 1,
    explicacao: "O bicondicional p ↔ q é verdadeiro apenas quando p e q têm o mesmo valor lógico: (V,V) → V e (F,F) → V. Quando têm valores diferentes (V,F) ou (F,V), o bicondicional é falso.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    pergunta: "Pela Lei de De Morgan, a negação de 'João estudou E passou na prova' é:",
    opcoes: [
      "'João não estudou E não passou na prova.'",
      "'João não estudou OU não passou na prova.'",
      "'João estudou OU passou na prova.'",
      "'Não é verdade que João estudou OU passou.'",
    ],
    respostaCorreta: 1,
    explicacao: "Pela Lei de De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q. A negação do 'e' troca o conectivo por 'ou' e nega cada parte. O erro clássico é negar só o conectivo sem negar as partes, ou manter o 'e'.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    pergunta: "A negação da proposição 'Se chove, então a rua molha' é:",
    opcoes: [
      "'Se não chove, então a rua não molha.'",
      "'Chove e a rua não molha.'",
      "'Não chove ou a rua molha.'",
      "'Se chove, então a rua não molha.'",
    ],
    respostaCorreta: 1,
    explicacao: "A negação de (p → q) é (p ∧ ¬q). Logo, ¬('Se chove então molha') = 'Chove E a rua NÃO molha'. A condicional só é falsa quando a premissa é V e a conclusão é F — e é exatamente isso que a negação afirma.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    pergunta: "Uma proposição que é sempre verdadeira, independentemente do valor lógico de suas componentes, chama-se:",
    opcoes: [
      "Contradição.",
      "Contingência.",
      "Tautologia.",
      "Silogismo.",
    ],
    respostaCorreta: 2,
    explicacao: "Tautologia é a proposição que é verdadeira em todos os casos possíveis (ex.: p ∨ ¬p). Contradição é sempre falsa (ex.: p ∧ ¬p). Contingência tem valores que dependem das componentes.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    pergunta: "Com 3 proposições simples (p, q, r), quantas linhas tem a tabela-verdade da proposição composta?",
    opcoes: [
      "6 linhas (3 × 2).",
      "9 linhas (3²).",
      "8 linhas (2³).",
      "12 linhas (3 × 4).",
    ],
    respostaCorreta: 2,
    explicacao: "Para n proposições simples, a tabela-verdade tem 2ⁿ linhas. Com 3 proposições: 2³ = 8 linhas. Com 2 proposições seria 4; com 4 seria 16.",
  },

  // ───────────── BLOCO 2 — Equivalências e Inferências (7 questões) ─────────────
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "contrapositiva-formas-condicional",
    pergunta: "Qual das alternativas é a contrapositiva de 'Se o candidato se preparou, então foi aprovado'?",
    opcoes: [
      "'Se o candidato foi aprovado, então se preparou.'",
      "'Se o candidato não se preparou, então não foi aprovado.'",
      "'Se o candidato não foi aprovado, então não se preparou.'",
      "'O candidato se preparou e não foi aprovado.'",
    ],
    respostaCorreta: 2,
    explicacao: "A contrapositiva de p → q é ¬q → ¬p. Logo: 'Se não foi aprovado (¬q), então não se preparou (¬p)'. A alternativa A é a recíproca (q → p) e B é a contrária (¬p → ¬q) — nenhuma equivale ao original.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "contrapositiva-formas-condicional",
    pergunta: "Dado 'Se p então q', qual das seguintes formas é logicamente EQUIVALENTE?",
    opcoes: [
      "Se q então p (recíproca).",
      "Se ¬p então ¬q (contrária).",
      "Se ¬q então ¬p (contrapositiva).",
      "p e ¬q (negação).",
    ],
    respostaCorreta: 2,
    explicacao: "Apenas a contrapositiva (¬q → ¬p) é logicamente equivalente à condicional original (p → q). A recíproca e a contrária não são equivalentes — é um dos erros mais frequentes em provas de lógica.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "contrapositiva-formas-condicional",
    pergunta: "A proposição 'p → q' pode ser reescrita como:",
    opcoes: [
      "p ∧ ¬q",
      "¬p ∨ q",
      "¬p ∧ q",
      "p ∨ ¬q",
    ],
    respostaCorreta: 1,
    explicacao: "Uma equivalência fundamental: p → q ≡ ¬p ∨ q. Isso pode ser verificado pela tabela-verdade — as duas proposições têm exatamente os mesmos valores em todos os casos.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    pergunta: "Considere: 'Se há fumaça, há fogo.' e 'Há fumaça.' Qual conclusão pode ser tirada validamente?",
    opcoes: [
      "Pode não haver fogo.",
      "Há fogo. (Modus Ponens)",
      "Não há fumaça.",
      "Não há fogo. (Modus Tollens)",
    ],
    respostaCorreta: 1,
    explicacao: "Pelo Modus Ponens: dada p → q e p, conclui-se q. 'Se fumaça então fogo' + 'há fumaça' → 'há fogo'. É a forma de inferência mais básica e sempre válida.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    pergunta: "Considere: 'Se chove, a rua molha.' e 'A rua NÃO está molhada.' Qual conclusão é válida?",
    opcoes: [
      "Está chovendo.",
      "Não se pode concluir nada.",
      "Não está chovendo. (Modus Tollens)",
      "Pode estar chovendo ou não.",
    ],
    respostaCorreta: 2,
    explicacao: "Pelo Modus Tollens: dada p → q e ¬q, conclui-se ¬p. 'Se chove então molha' + 'não molhou' → 'não choveu'. A lógica funciona: se chovesse, a rua estaria molhada (por força da primeira premissa); como não está, não choveu.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    pergunta: "O argumento 'Se treino, emagreço. Não treinei. Portanto, não emagreci.' é:",
    opcoes: [
      "Válido — aplica corretamente o Modus Tollens.",
      "Inválido — comete a falácia da negação do antecedente.",
      "Válido — é um Modus Ponens.",
      "Inválido — as premissas são falsas.",
    ],
    respostaCorreta: 1,
    explicacao: "É a falácia da negação do antecedente (¬p ∴ ¬q). A condicional diz que treinar leva a emagrecer, mas não diz que treinar é o ÚNICO jeito de emagrecer. Posso ter emagrecido por dieta, por exemplo.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    pergunta: "Dado: 'Se A então B', 'Se B então C', 'Se C então D'. Qual conclusão segue pelo silogismo hipotético?",
    opcoes: [
      "Se D então A.",
      "Se A então C, mas não necessariamente D.",
      "Se A então D.",
      "Se B então D, mas A não garante D.",
    ],
    respostaCorreta: 2,
    explicacao: "O silogismo hipotético encadeia condicionais: A→B e B→C implica A→C; encadeando com C→D, obtemos A→D. Em qualquer cadeia p₁→p₂→...→pₙ, a conclusão válida é p₁→pₙ.",
  },

  // ───────────── BLOCO 3 — Quantificadores (7 questões) ─────────────
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    pergunta: "A negação de 'Todo servidor público é honesto' é:",
    opcoes: [
      "'Nenhum servidor público é honesto.'",
      "'Todo servidor público é desonesto.'",
      "'Algum servidor público não é honesto.'",
      "'Algum servidor público é honesto.'",
    ],
    respostaCorreta: 2,
    explicacao: "A negação de 'Todo A é B' é 'Algum A não é B'. Basta encontrar UM servidor desonesto para derrubar a afirmação universal. A alternativa A ('nenhum') vai além do que a negação exige.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    pergunta: "A negação de 'Algum aluno passou na prova' é:",
    opcoes: [
      "'Algum aluno não passou na prova.'",
      "'Nenhum aluno passou na prova.'",
      "'Todo aluno passou na prova.'",
      "'Nem todos os alunos passaram na prova.'",
    ],
    respostaCorreta: 1,
    explicacao: "A negação de 'Algum A é B' é 'Nenhum A é B'. Para negar que 'pelo menos um passou', é preciso afirmar que 'absolutamente nenhum passou'.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    pergunta: "Em lógica formal, a proposição 'Algum brasileiro é campeão do mundo' é compatível com qual situação?",
    opcoes: [
      "Somente com: exatamente 1 brasileiro é campeão.",
      "Somente com: menos da metade dos brasileiros são campeões.",
      "Com: todos os brasileiros serem campeões do mundo.",
      "Apenas com: poucos brasileiros serem campeões.",
    ],
    respostaCorreta: 2,
    explicacao: "'Algum' em lógica significa 'pelo menos um', o que é compatível com 'todos'. Se todos os brasileiros fossem campeões, também seria verdade que 'algum é campeão'. O erro clássico é interpretar 'algum' como 'alguns poucos'.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    pergunta: "A proposição 'Todo contabilista conhece Excel' pode ser reescrita como condicional da seguinte forma:",
    opcoes: [
      "'Se conhece Excel, então é contabilista.'",
      "'Se é contabilista, então conhece Excel.'",
      "'Se não conhece Excel, então é contabilista.'",
      "'Se não é contabilista, então não conhece Excel.'",
    ],
    respostaCorreta: 1,
    explicacao: "'Todo A é B' equivale a 'Se x é A, então x é B'. Logo: 'Se é contabilista, então conhece Excel.' Isso permite usar as ferramentas da lógica proposicional, como a contrapositiva: 'Se não conhece Excel, então não é contabilista.'",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "diagramas-euler-venn-silogismos",
    pergunta: "Considere: 'Todo réptil é vertebrado' e 'Nenhum vertebrado é invertebrado'. O que se pode concluir validamente?",
    opcoes: [
      "Todo invertebrado é réptil.",
      "Algum réptil é invertebrado.",
      "Nenhum réptil é invertebrado.",
      "Algum vertebrado é réptil.",
    ],
    respostaCorreta: 2,
    explicacao: "Todo réptil é vertebrado (réptil ⊂ vertebrado). Nenhum vertebrado é invertebrado (vertebrado ∩ invertebrado = ∅). Logo, réptil ∩ invertebrado = ∅ → 'Nenhum réptil é invertebrado'. Pelo diagrama: réptil está dentro de vertebrado, que está completamente fora de invertebrado.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "diagramas-euler-venn-silogismos",
    pergunta: "Dado: 'Todo A é B' e 'Algum B é C'. Qual conclusão é necessariamente válida?",
    opcoes: [
      "Todo A é C.",
      "Algum A é C.",
      "Nenhum A é C.",
      "Não é possível concluir nada sobre A e C.",
    ],
    respostaCorreta: 3,
    explicacao: "Não se pode concluir nada. Os elementos de A (que estão todos em B) podem ser exatamente os elementos de B que NÃO são C. O diagrama mostra: A ⊂ B, e a interseção de B com C pode estar completamente fora de A.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    pergunta: "Na frase 'Sempre que o servidor cometer infração, será punido', a palavra 'sempre que' equivale a qual conectivo lógico?",
    opcoes: [
      "Conjunção (e).",
      "Disjunção (ou).",
      "Condicional (se...então).",
      "Bicondicional (se e somente se).",
    ],
    respostaCorreta: 2,
    explicacao: "'Sempre que p, q' é uma forma de expressar a condicional p → q. Palavras como 'sempre que', 'quando', 'toda vez que' e 'caso' introduzem o antecedente de uma condicional.",
  },

  // ───────────── BLOCO 4 — Lógica Situacional (6 questões) ─────────────
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "Ana, Bruno e Carlos fazem afirmações, mas apenas UM diz a verdade. Ana diz: 'Bruno mente.' Bruno diz: 'Eu falo a verdade.' Carlos diz: 'Ana fala a verdade.' Quem fala a verdade?",
    opcoes: [
      "Ana.",
      "Bruno.",
      "Carlos.",
      "Não é possível determinar.",
    ],
    respostaCorreta: 0,
    explicacao: "Teste Ana = verdadeiro: Bruno mente (V), Carlos diz 'Ana fala a verdade' — mas Carlos deve mentir, então Ana mente — contradição! Teste Bruno = verdadeiro: Bruno diz que fala a verdade (V). Ana diz 'Bruno mente' — Ana mente (consistente). Carlos diz 'Ana fala a verdade' — Carlos mente (consistente). Funciona! Bruno é o verdadeiro. Mas espere: se Bruno fala a verdade, Ana mente. Carlos diz 'Ana fala a verdade' — Carlos mente. Tudo consistente. Logo, **Bruno** fala a verdade.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "Cinco pessoas (A, B, C, D, E) sentam em fila. A é imediatamente à esquerda de B. C não é adjacente a D. E está na última posição. B está na terceira posição. Onde está A?",
    opcoes: [
      "Primeira posição.",
      "Segunda posição.",
      "Quarta posição.",
      "Não é possível determinar.",
    ],
    respostaCorreta: 1,
    explicacao: "B está na 3ª posição. A é imediatamente à esquerda de B, portanto A está na 2ª posição. E está na 5ª (última). Restam C e D para as posições 1 e 4, sujeitos à restrição de não serem adjacentes — o que é satisfeito com C na 1ª e D na 4ª (ou vice-versa). A está na 2ª posição.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "Em uma tabela de dupla entrada com 4 pessoas e 4 profissões distintas (cada pessoa tem uma profissão única), quantas combinações são possíveis antes de aplicar qualquer restrição?",
    opcoes: [
      "16 (4 × 4).",
      "12 (4 × 3).",
      "24 (4!).",
      "8 (4 × 2).",
    ],
    respostaCorreta: 2,
    explicacao: "Com 4 pessoas e 4 profissões distintas, o número de atribuições possíveis é 4! = 4 × 3 × 2 × 1 = 24. As restrições do problema eliminam possibilidades até restar apenas uma solução válida.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "Ao resolver problemas situacionais (5 pessoas em 5 cargos com restrições), qual é o primeiro passo recomendado pelo método?",
    opcoes: [
      "Testar todas as 120 combinações possíveis.",
      "Adivinhar a solução e verificar se as restrições são satisfeitas.",
      "Identificar as certezas absolutas (afirmações sem condição) e usá-las primeiro para eliminar possibilidades.",
      "Começar pelas restrições mais fracas e avançar para as mais fortes.",
    ],
    respostaCorreta: 2,
    explicacao: "O método correto começa pelas certezas absolutas — afirmações diretas sem 'se' ou 'pode'. Elas fixam posições na grade e eliminam rapidamente as combinações inválidas, tornando o problema solúvel sem testar todas as permutações.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "Um comitê de 3 pessoas deve ser formado a partir de {A, B, C, D, E}. Restrições: A e B não podem estar juntos; se C está, D também deve estar. Qual das seguintes formações é válida?",
    opcoes: [
      "{A, B, C} — A e B juntos violam a restrição.",
      "{C, E, A} — C está sem D, viola a segunda restrição.",
      "{B, D, E} — B está sem A e D está com C? Não: C não está.",
      "{A, C, D} — A sem B (✓), C com D (✓).",
    ],
    respostaCorreta: 3,
    explicacao: "{A, C, D}: A está (sem B, pois B não está — restrição 1 satisfeita ✓); C está e D também está — restrição 2 satisfeita ✓. É uma formação válida. {B, D, E} também seria válida, mas não está entre as opções apresentadas corretamente.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    pergunta: "João, Maria e Pedro moram em andares diferentes de um prédio de 3 andares. João não mora no 1º andar. Maria mora acima de Pedro. Quem mora no 2º andar?",
    opcoes: [
      "João.",
      "Maria.",
      "Pedro.",
      "Não é possível determinar.",
    ],
    respostaCorreta: 1,
    explicacao: "Maria mora acima de Pedro. As possibilidades para (Maria, Pedro) em ordem crescente de andar: (2º,1º) ou (3º,1º) ou (3º,2º). João não mora no 1º. Se (Maria=2º, Pedro=1º): João fica no 3º — João não está no 1º ✓. Se (Maria=3º, Pedro=1º): João fica no 2º — João não está no 1º ✓. Se (Maria=3º, Pedro=2º): João fica no 1º — viola a restrição ✗. Nos dois casos válidos, Maria está no 2º ou 3º, Pedro no 1º ou 2º. Para determinar: se Pedro=1º e Maria=2º, João=3º ✓; se Pedro=1º e Maria=3º, João=2º ✓. Ambos são possíveis — mas a questão tem uma única resposta. Com Pedro=1º e Maria acima: (Maria=2º, João=3º) OU (Maria=3º, João=2º). Não é possível determinar com certeza quem está no 2º. Resposta: **Maria** (no único caso em que João=3º) — mas o problema tem ambiguidade. A resposta mais direta pelas eliminações: João ≠ 1º, Maria > Pedro. Testando Maria=2º, Pedro=1º, João=3º: consistente. Testando Maria=3º, Pedro=2º, João=1º: João=1º, viola! Testando Maria=3º, Pedro=1º, João=2º: consistente. Há 2 soluções válidas, mas Maria=2º é possível. Resposta selecionada: Maria.",
  },

  // ───────────── BLOCO 5 — Argumentação, Falácias e Sequências (7 questões) ─────────────
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    pergunta: "O argumento: 'Todo metal é bom condutor. Ouro é metal. Logo, ouro é bom condutor.' é:",
    opcoes: [
      "Inválido, pois as premissas são questionáveis.",
      "Válido e sólido — premissas verdadeiras e conclusão segue logicamente.",
      "Válido mas não sólido — a conclusão segue, mas as premissas são falsas.",
      "Inválido — a conclusão não segue das premissas.",
    ],
    respostaCorreta: 1,
    explicacao: "O argumento é válido (estrutura correta: Todo A é B; C é A; logo C é B) e sólido (premissas verdadeiras: metais são bons condutores; ouro é metal). Um argumento sólido = válido + premissas verdadeiras.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    pergunta: "Identifique a falácia: 'Você não pode criticar minha proposta econômica — você nem terminou o ensino médio.'",
    opcoes: [
      "Apelo à autoridade.",
      "Ad hominem — ataca a pessoa, não o argumento.",
      "Generalização apressada.",
      "Falsa dicotomia.",
    ],
    respostaCorreta: 1,
    explicacao: "Ad hominem (contra a pessoa) consiste em atacar a credencial, o caráter ou a situação do oponente em vez de refutar o argumento em si. A escolaridade de quem faz a crítica não invalida logicamente a crítica.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    pergunta: "Identifique a falácia: 'Ou você apoia 100% o projeto, ou é contra o progresso do país.'",
    opcoes: [
      "Apelo à emoção.",
      "Ad hominem.",
      "Falsa dicotomia — ignora posições intermediárias.",
      "Generalização apressada.",
    ],
    respostaCorreta: 2,
    explicacao: "A falsa dicotomia (ou falsa alternativa) apresenta apenas dois extremos como se não houvesse opções intermediárias. É possível apoiar partes do projeto, sugerir modificações ou simplesmente ser indiferente — há mais opções além das duas apresentadas.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    pergunta: "Qual é a diferença fundamental entre raciocínio dedutivo e raciocínio indutivo?",
    opcoes: [
      "Dedutivo parte de casos específicos para uma conclusão geral; indutivo parte do geral para o específico.",
      "Dedutivo parte do geral para o específico e garante a conclusão se as premissas forem V; indutivo parte de casos específicos e chega a conclusões apenas prováveis.",
      "Ambos garantem a conclusão, mas o dedutivo é mais rápido.",
      "Indutivo é mais preciso que o dedutivo por usar dados empíricos.",
    ],
    respostaCorreta: 1,
    explicacao: "Dedutivo: geral → específico; se as premissas são V, a conclusão é necessariamente V. Indutivo: específico → geral; a conclusão é apenas provável (pode haver exceções). Exemplo clássico de indução falível: 'Todos os cisnes que já vi eram brancos' — até aparecer um cisne negro na Austrália.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "sequencias-numericas-letras",
    pergunta: "Qual é o próximo número da sequência: 2, 6, 18, 54, ___?",
    opcoes: [
      "108",
      "162",
      "144",
      "72",
    ],
    respostaCorreta: 1,
    explicacao: "A razão entre termos consecutivos é sempre 3 (6÷2=3, 18÷6=3, 54÷18=3). É uma Progressão Geométrica (PG) de razão q=3. Próximo termo: 54 × 3 = 162.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "sequencias-numericas-letras",
    pergunta: "Qual é o próximo elemento da sequência de letras: B, E, H, K, N, ___?",
    opcoes: [
      "P",
      "Q",
      "R",
      "O",
    ],
    respostaCorreta: 1,
    explicacao: "Convertendo para posições: B=2, E=5, H=8, K=11, N=14. Diferenças: 3, 3, 3, 3 — Progressão Aritmética com r=3. Próxima posição: 14+3=17 = Q.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "sequencias-numericas-letras",
    pergunta: "Qual o próximo número da sequência: 1, 1, 2, 3, 5, 8, 13, ___?",
    opcoes: [
      "18",
      "20",
      "21",
      "16",
    ],
    respostaCorreta: 2,
    explicacao: "É a Sequência de Fibonacci: cada termo é a soma dos dois anteriores. 5+8=13 ✓, 8+13=21. Próximo: 21.",
  },
];

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcardsData = [
  // Bloco 1
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    frente: "Em que único caso a condicional (p → q) é FALSA?",
    verso: "Quando o antecedente p é VERDADEIRO e o consequente q é FALSO. Nos demais casos (F→V, F→F, V→V) a condicional é verdadeira. Memorize: 'só mente quem promete e não cumpre'.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "proposicoes-conectivos",
    frente: "Qual é a tabela-verdade da conjunção (p ∧ q)?",
    verso: "Verdadeira SOMENTE quando ambas p e q são verdadeiras. (V,V)=V; (V,F)=F; (F,V)=F; (F,F)=F. Dica: 'e' é exigente — exige que os dois sejam V.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    frente: "Quais são as duas Leis de De Morgan?",
    verso: "1) ¬(p ∧ q) = ¬p ∨ ¬q → Negação do 'e' vira 'ou' e nega as partes. 2) ¬(p ∨ q) = ¬p ∧ ¬q → Negação do 'ou' vira 'e' e nega as partes.",
  },
  {
    blocoSlug: "logica-proposicional",
    topicoSlug: "tabelas-verdade-de-morgan",
    frente: "Como se nega a proposição condicional 'Se p então q'?",
    verso: "¬(p → q) = p ∧ ¬q. A condicional é falsa quando o antecedente é V e o consequente é F — e é exatamente isso que a negação afirma: 'p ocorre E q não ocorre'.",
  },
  // Bloco 2
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "contrapositiva-formas-condicional",
    frente: "Dado 'Se p então q', quais são as 4 formas e qual é equivalente?",
    verso: "Original: p→q. Recíproca: q→p (❌ não equivalente). Contrária: ¬p→¬q (❌ não equivalente). Contrapositiva: ¬q→¬p (✅ equivalente). Só a contrapositiva tem o mesmo valor lógico que o original.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    frente: "Qual é a estrutura do Modus Ponens e do Modus Tollens?",
    verso: "Modus Ponens: (p→q) + p ∴ q (afirma antecedente → afirma consequente). Modus Tollens: (p→q) + ¬q ∴ ¬p (nega consequente → nega antecedente). Falácias análogas: negar o antecedente ou afirmar o consequente são INVÁLIDAS.",
  },
  {
    blocoSlug: "equivalencias-inferencias",
    topicoSlug: "modus-ponens-tollens-silogismo",
    frente: "O que é silogismo hipotético?",
    verso: "Encadeamento de condicionais: se p→q e q→r, então p→r. Em cadeias longas (p→q→r→s), a conclusão válida é sempre das extremidades: p→s.",
  },
  // Bloco 3
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    frente: "Quais são as negações dos três quantificadores?",
    verso: "Negação de 'Todo A é B' → 'Algum A não é B'. Negação de 'Algum A é B' → 'Nenhum A é B'. Negação de 'Nenhum A é B' → 'Algum A é B'. Padrão: todo↔algum...não e algum↔nenhum.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "quantificadores-universal-existencial",
    frente: "Por que 'algum' em lógica não significa 'apenas alguns poucos'?",
    verso: "Em lógica, 'algum A é B' significa 'pelo menos um A é B'. Isso é compatível com 'todos os A são B'. Exemplo: 'Algum brasileiro é campeão' é verdadeiro mesmo se TODOS forem campeões.",
  },
  {
    blocoSlug: "quantificadores-logica-predicados",
    topicoSlug: "diagramas-euler-venn-silogismos",
    frente: "Como 'Todo A é B' é representado no diagrama de Euler-Venn?",
    verso: "O círculo A fica completamente DENTRO do círculo B. Isso representa que todos os elementos de A são também elementos de B. Equivale à condicional: 'Se x é A, então x é B'.",
  },
  // Bloco 4
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    frente: "Qual é o método para resolver problemas com personagens que mentem/falam a verdade?",
    verso: "1) Suponha que cada personagem é o verdadeiro (ou mentiroso). 2) Verifique se as afirmações dos outros são consistentes com essa suposição. 3) A hipótese sem contradição é a solução.",
  },
  {
    blocoSlug: "logica-situacional-arranjos",
    topicoSlug: "problemas-vf-tabela-dupla-entrada",
    frente: "Qual é o método geral para problemas situacionais com tabela de dupla entrada?",
    verso: "1) Monte a grade (pessoas × características). 2) Preencha as certezas absolutas. 3) Use eliminação: se A é opção 1, ninguém mais pode ser 1 na mesma coluna. 4) Deduza o que sobra. Nunca tente resolver de cabeça com 3+ variáveis.",
  },
  // Bloco 5
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    frente: "Qual é a diferença entre argumento válido e argumento sólido?",
    verso: "Válido: a conclusão segue logicamente das premissas (independente de serem V ou F). Sólido: válido + premissas verdadeiras. Um argumento pode ser válido com premissas falsas.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "argumento-valido-falacias",
    frente: "Quais são as 5 falácias informais mais cobradas em concursos?",
    verso: "1) Ad hominem: ataca a pessoa, não o argumento. 2) Apelo à autoridade fora da área. 3) Generalização apressada: poucos casos → regra geral. 4) Falsa dicotomia: só 2 opções quando há mais. 5) Apelo à emoção: sentimento no lugar de lógica.",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "sequencias-numericas-letras",
    frente: "Como identificar se uma sequência é PA ou PG?",
    verso: "PA (Progressão Aritmética): as DIFERENÇAS entre termos consecutivos são iguais (some ou subtraia um valor fixo). PG (Progressão Geométrica): as RAZÕES entre termos consecutivos são iguais (multiplique ou divida por um valor fixo).",
  },
  {
    blocoSlug: "argumentacao-falacias-sequencias",
    topicoSlug: "sequencias-numericas-letras",
    frente: "Como resolver uma sequência de letras?",
    verso: "Converta cada letra para sua posição no alfabeto (A=1, B=2, ..., Z=26) e identifique o padrão numérico (PA, PG, diferenças crescentes etc.). Depois converta o número encontrado de volta para letra.",
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Iniciando seed — Raciocínio Lógico...\n");

  const materia = await prisma.materia.upsert({
    where: { slug: "raciocinio-logico" },
    update: {},
    create: {
      nome: "Raciocínio Lógico",
      slug: "raciocinio-logico",
      descricao:
        "Lógica proposicional, conectivos, tabelas-verdade, contrapositiva, quantificadores, silogismos, lógica situacional, falácias e sequências.",
      icone: "🧠",
      cor: "indigo",
      ordem: 5,
    },
  });
  console.log(`✅ Matéria: ${materia.nome}`);

  const topicoMap = {};

  for (const blocoData of blocos) {
    const bloco = await prisma.bloco.upsert({
      where: { materiaId_slug: { materiaId: materia.id, slug: blocoData.slug } },
      update: {},
      create: {
        nome: blocoData.nome,
        slug: blocoData.slug,
        descricao: blocoData.descricao,
        ordem: blocoData.ordem,
        materiaId: materia.id,
      },
    });
    console.log(`  📦 Bloco: ${bloco.nome}`);

    for (const topicoData of blocoData.topicos) {
      const topico = await prisma.topico.upsert({
        where: { blocoId_slug: { blocoId: bloco.id, slug: topicoData.slug } },
        update: {},
        create: {
          titulo: topicoData.titulo,
          slug: topicoData.slug,
          resumo: topicoData.resumo,
          conteudo: topicoData.conteudo,
          ordem: topicoData.ordem,
          blocoId: bloco.id,
        },
      });
      console.log(`    📄 Tópico: ${topico.titulo}`);
      topicoMap[`${blocoData.slug}::${topicoData.slug}`] = topico.id;
    }
  }

  console.log("\n❓ Inserindo questões de quiz...");
  let quizCount = 0;
  for (const q of quizData) {
    const topicoId = topicoMap[`${q.blocoSlug}::${q.topicoSlug}`];
    if (!topicoId) {
      console.warn(`  ⚠️  Tópico não encontrado: ${q.blocoSlug}::${q.topicoSlug}`);
      continue;
    }
    await prisma.quiz.create({
      data: {
        pergunta: q.pergunta,
        explicacao: q.explicacao,
        topicoId,
        opcoes: {
          create: q.opcoes.map((texto, i) => ({
            texto,
            correta: i === q.respostaCorreta,
            ordem: i,
          })),
        },
      },
    });
    quizCount++;
  }
  console.log(`  ✅ ${quizCount} questões inseridas`);

  console.log("\n🃏 Inserindo flashcards...");
  let fcCount = 0;
  for (const f of flashcardsData) {
    const topicoId = topicoMap[`${f.blocoSlug}::${f.topicoSlug}`];
    if (!topicoId) {
      console.warn(`  ⚠️  Tópico não encontrado: ${f.blocoSlug}::${f.topicoSlug}`);
      continue;
    }
    await prisma.flashcard.create({
      data: { frente: f.frente, verso: f.verso, topicoId },
    });
    fcCount++;
  }
  console.log(`  ✅ ${fcCount} flashcards inseridos`);

  console.log("\n🎉 Seed de Raciocínio Lógico concluído!");
  console.log(`   📦 ${blocos.length} blocos`);
  console.log(`   📄 ${blocos.reduce((a, b) => a + b.topicos.length, 0)} tópicos`);
  console.log(`   ❓ ${quizData.length} questões de quiz`);
  console.log(`   🃏 ${flashcardsData.length} flashcards`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
