// Raciocínio Lógico — novos blocos 6 a 9 (Negações/Equivalências, Conjuntos, Análise Combinatória, Probabilidade)
// Base: "Raciocínio Lógico Facilitado" (Bruno Villa), caps. 2, 7, 8 e 9, com texto próprio.
export default [
  {
    nome: "Negações e Equivalências (aprofundamento)",
    slug: "negacoes-equivalencias",
    descricao: "Negação de proposições compostas, implicação e equivalências — o ‘pão com manteiga’ do CEBRASPE.",
    ordem: 6,
    topicos: [
      {
        titulo: "Negação de Proposições Compostas e Equivalências Fundamentais",
        slug: "negacao-compostas-equivalencias",
        resumo: "Negação da conjunção (De Morgan), da disjunção, da condicional (p e não q), da bicondicional (disjunção exclusiva) e da disjunção exclusiva (bicondicional). Equivalências da condicional: contrapositiva e ¬p ∨ q. Equivalência da bicondicional.",
        conteudo: `# Negação de Proposições Compostas e Equivalências Fundamentais

> **Negar** uma proposição é obter outra que tenha **sempre o valor lógico oposto**. Negar **não** é "dizer o contrário": negar "O dia está claro" é "O dia **não** está claro", e não "O dia está escuro".

## Negações (decore!)

| Proposição | **Negação** | Como lembrar |
|---|---|---|
| **p ∧ q** (e) | **¬p ∨ ¬q** | troca *e* por *ou* e nega as duas (De Morgan) |
| **p ∨ q** (ou) | **¬p ∧ ¬q** | troca *ou* por *e* e nega as duas (De Morgan) |
| **p → q** (se… então) | **p ∧ ¬q** | "mantém o 1º, **e**, nega o 2º" |
| **p ↔ q** (se e somente se) | **p ⊻ q** (ou… ou) ≡ (p ∧ ¬q) ∨ (¬p ∧ q) | os dois valores **diferem** |
| **p ⊻ q** (ou… ou) | **p ↔ q** | os dois valores **coincidem** |
| **¬p** | **p** | dupla negação |

### Exemplos

- *"Maria é médica **e** João é engenheiro"* → **negação:** *"Maria **não** é médica **ou** João **não** é engenheiro."*
- *"Se chove, então a rua molha"* → **negação:** *"Chove **e** a rua **não** molha."*
- *"O candidato é aprovado **ou** é eliminado"* (inclusivo) → *"Não é aprovado **e** não é eliminado."*

## Equivalências

Duas proposições são **equivalentes** quando têm **a mesma tabela-verdade**.

### Da condicional (p → q)

| Forma | Equivalente? |
|---|---|
| **¬q → ¬p** (**contrapositiva**) | ✅ **sempre** |
| **¬p ∨ q** | ✅ **sempre** |
| q → p (recíproca) | ❌ **não** |
| ¬p → ¬q (inversa) | ❌ **não** |

> 💡 A **contrapositiva** **troca a ordem e nega os dois lados**: de *p → q* para *¬q → ¬p*.

### Da bicondicional (p ↔ q)

- **(p → q) ∧ (q → p)**
- **(p ∧ q) ∨ (¬p ∧ ¬q)**
- **¬(p ⊻ q)**

### Da disjunção inclusiva (p ∨ q)

- **¬p → q** (e também **¬q → p**).

### Da disjunção exclusiva (p ⊻ q)

- **¬(p ↔ q)** · **(p ∨ q) ∧ ¬(p ∧ q)** · **(p ∧ ¬q) ∨ (¬p ∧ q)**.

## Implicação lógica

Diz-se que **p implica q** (p ⇒ q) quando **toda vez que p é verdadeira, q também é**; ou seja, **p → q é tautologia**. Equivalência é implicação nos **dois sentidos**.

## Como a banca testa

- *"A negação de 'Se estudo, então passo' é 'Não estudo ou não passo'."* ❌ (a negação é **estudo e não passo**).
- *"'Se p então q' é equivalente a 'se q então p'."* ❌.
- *"'Se p então q' é equivalente a 'não p ou q'."* ✅.
`,
        fc: [
          ["Negação de ‘Se p, então q’?", "‘p e não q’ (mantém o antecedente, troca o conectivo por ‘e’ e nega o consequente)."],
          ["Equivalências da condicional p → q?", "A contrapositiva (¬q → ¬p) e ¬p ∨ q. A recíproca (q → p) e a inversa (¬p → ¬q) NÃO são equivalentes."],
          ["Negação da bicondicional p ↔ q?", "A disjunção exclusiva: ‘ou p ou q’, isto é, (p ∧ ¬q) ∨ (¬p ∧ q)."],
        ],
        mc: [
          ["A negação da proposição ‘Se o servidor é diligente, então é promovido’ é:", ["O servidor não é diligente e não é promovido.", "O servidor é diligente e não é promovido.", "Se o servidor não é diligente, então não é promovido.", "O servidor não é diligente ou é promovido."], 1, "¬(p → q) ≡ p ∧ ¬q.", "MEDIO"],
          ["Qual proposição é equivalente a ‘Se chove, então a rua fica molhada’?", ["Se a rua fica molhada, então chove.", "Se não chove, então a rua não fica molhada.", "Se a rua não fica molhada, então não chove.", "Chove e a rua não fica molhada."], 2, "Contrapositiva: ¬q → ¬p.", "MEDIO"],
          ["A negação de ‘Maria foi à reunião ou João faltou’ é:", ["Maria não foi à reunião ou João não faltou.", "Maria não foi à reunião e João não faltou.", "Maria foi à reunião e João não faltou.", "Se Maria foi, então João não faltou."], 1, "¬(p ∨ q) ≡ ¬p ∧ ¬q.", "FACIL"],
        ],
        ce: [
          ["A negação da proposição ‘Se estudo, então passo’ é ‘Estudo e não passo’.", "C", "¬(p → q) ≡ p ∧ ¬q."],
          ["As proposições ‘Se p, então q’ e ‘Se q, então p’ são equivalentes.", "E", "A recíproca não é equivalente à condicional."],
          ["A proposição ‘Se p, então q’ é equivalente a ‘Não p ou q’.", "C", "p → q ≡ ¬p ∨ q."],
          ["A negação de ‘p e q’ é ‘não p e não q’.", "E", "É ‘não p ou não q’ (De Morgan)."],
        ],
      },
    ],
  },
  {
    nome: "Conjuntos",
    slug: "conjuntos",
    descricao: "Representação, pertinência, inclusão, operações e problemas com diagramas de Venn.",
    ordem: 7,
    topicos: [
      {
        titulo: "Conjuntos: Conceitos, Relações e Operações",
        slug: "conjuntos-conceitos-operacoes",
        resumo: "Pertinência (∈) liga elemento a conjunto; inclusão (⊂) liga conjunto a conjunto. Um conjunto com n elementos tem 2ⁿ subconjuntos. União, interseção, diferença, complementar. n(A ∪ B) = n(A) + n(B) − n(A ∩ B).",
        conteudo: `# Conjuntos: Conceitos, Relações e Operações

## Representação

- **Enumeração:** A = {1, 2, 3}
- **Propriedade:** A = {x | x é número par e x < 10}
- **Diagrama de Venn:** curvas fechadas com os elementos dentro.

### Conjuntos especiais

| Conjunto | Símbolo | Observação |
|---|---|---|
| **Vazio** | ∅ ou { } | não tem elementos |
| **Unitário** | {a} | um único elemento |
| **Universo** | U | todos os elementos considerados |

> ⚠️ **∅ ≠ {∅}**: o primeiro é vazio; o segundo é um conjunto **com um elemento** (o vazio).

## Pertinência × inclusão

| | Liga | Símbolos |
|---|---|---|
| **Pertinência** | **elemento** e **conjunto** | ∈ (pertence), ∉ |
| **Inclusão** | **conjunto** e **conjunto** | ⊂ (está contido), ⊄, ⊃ (contém) |

*3 ∈ {1, 2, 3}* ✔ · *{3} ⊂ {1, 2, 3}* ✔ · *3 ⊂ {1, 2, 3}* ✘ (3 é elemento, não conjunto).

## Subconjuntos

- **A ⊂ B**: todo elemento de A pertence a B.
- O **vazio** é subconjunto de **qualquer** conjunto.
- Um conjunto com **n elementos** tem **2ⁿ subconjuntos** (contando o vazio e o próprio conjunto). Os **subconjuntos próprios** (sem o próprio conjunto) são **2ⁿ − 1**; os próprios e **não vazios**, **2ⁿ − 2**. Leia o enunciado.
  - Ex.: {a, b, c} tem **8** subconjuntos.

## Operações

| Operação | Símbolo | Significado |
|---|---|---|
| **União** | A ∪ B | elementos de **A ou B** (ou ambos) |
| **Interseção** | A ∩ B | elementos de **A e B** |
| **Diferença** | A − B | elementos de A que **não** estão em B |
| **Complementar** | Aᶜ (ou Ā) | elementos de **U** que não estão em A |
| **Diferença simétrica** | A Δ B | **(A − B) ∪ (B − A)**: estão em **só um** |

## Número de elementos

> **n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**

Ex.: *n(A) = 20, n(B) = 15, n(A ∩ B) = 5* → **n(A ∪ B) = 30**.

Se **A ∩ B = ∅** (disjuntos): n(A ∪ B) = n(A) + n(B).

## Propriedades úteis

- **A ∪ A = A** · **A ∩ A = A**
- **A ∪ ∅ = A** · **A ∩ ∅ = ∅**
- **A ⊂ B** ⇒ **A ∪ B = B** e **A ∩ B = A**
- **De Morgan:** (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ · (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ
`,
        fc: [
          ["Pertence (∈) × está contido (⊂)?", "∈ liga elemento a conjunto; ⊂ liga conjunto a conjunto. 3 ∈ {1,2,3}; {3} ⊂ {1,2,3}."],
          ["Quantos subconjuntos tem um conjunto com n elementos?", "2ⁿ (incluindo o vazio e o próprio conjunto). Ex.: {a, b, c} tem 8."],
          ["Fórmula de n(A ∪ B)?", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)."],
        ],
        mc: [
          ["O número de subconjuntos de um conjunto com 4 elementos é:", ["4.", "8.", "16.", "24."], 2, "2⁴ = 16.", "FACIL"],
          ["Dados n(A) = 20, n(B) = 15 e n(A ∩ B) = 5, o valor de n(A ∪ B) é:", ["30.", "35.", "40.", "25."], 0, "20 + 15 − 5 = 30.", "FACIL"],
          ["Assinale a alternativa correta, sendo A = {1, 2, 3}.", ["2 ⊂ A.", "{2} ∈ A.", "{2} ⊂ A.", "∅ ∈ A."], 2, "{2} é conjunto contido em A. ‘2 ⊂ A’ e ‘{2} ∈ A’ confundem elemento e conjunto; ∅ não é elemento de A.", "MEDIO"],
        ],
        ce: [
          ["O conjunto vazio é subconjunto de qualquer conjunto.", "C", "Propriedade fundamental."],
          ["Um conjunto com 5 elementos possui 32 subconjuntos.", "C", "2⁵ = 32."],
          ["Se A = {1, 2} e B = {2, 3}, então A − B = {1, 3}.", "E", "A − B = {1}; A Δ B = {1, 3}."],
          ["O conjunto ∅ e o conjunto {∅} são iguais.", "E", "O primeiro não tem elementos; o segundo tem um elemento."],
        ],
      },
      {
        titulo: "Problemas com Diagramas de Venn (2 e 3 Conjuntos)",
        slug: "conjuntos-venn-problemas",
        resumo: "Em problemas com duas ou três categorias, comece pela interseção mais ‘interna’ e vá subtraindo para as demais regiões. Com 3 conjuntos: n(A ∪ B ∪ C) = ΣA − Σ(pares) + n(A ∩ B ∩ C). Atenção ao ‘somente’, ao ‘pelo menos um’ e ao ‘nenhum’.",
        conteudo: `# Problemas com Diagramas de Venn

## Método (passo a passo)

1. **Desenhe** os diagramas e identifique o **universo** (total de pessoas).
2. Preencha **de dentro para fora**: primeiro a **interseção de todos**, depois as interseções de **dois a dois (sem a tripla)**, depois as regiões **"somente"**.
3. Some tudo e confira com o **total** (e com o que está **fora** de todos).

## Dois conjuntos

> **n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**  ·  **Total = n(A ∪ B) + nenhum**

**Exemplo.** Em um grupo de **120** pessoas, **70** leem jornal, **60** leem revista e **20** não leem nenhum. Quantas leem ambos?
- Leem **pelo menos um**: 120 − 20 = **100**.
- 100 = 70 + 60 − x ⇒ **x = 30**.
- Só jornal: 70 − 30 = **40** · só revista: 60 − 30 = **30**.

## Três conjuntos

> **n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C)**

**Exemplo.** n(A) = 40, n(B) = 30, n(C) = 20, n(A ∩ B) = 10, n(A ∩ C) = 8, n(B ∩ C) = 6, n(A ∩ B ∩ C) = 4.

- **União:** 40 + 30 + 20 − 10 − 8 − 6 + 4 = **70**.
- **Somente A:** 40 − (10 − 4) − (8 − 4) − 4 = 40 − 6 − 4 − 4 = **26**.
  (ou: n(A) − n(A∩B) − n(A∩C) + n(A∩B∩C) = 40 − 10 − 8 + 4 = **26**)

## Vocabulário

| Expressão | Significa |
|---|---|
| **"pelo menos um"** | união (A ∪ B ∪ …) |
| **"somente A"** | só A, sem B e sem C |
| **"exatamente dois"** | soma das regiões de pares, **sem a tripla** |
| **"nenhum"** | fora de todos os conjuntos |
| **"A mas não B"** | A − B |

> 💡 **Erro clássico:** somar n(A ∩ B) como se fosse "só A e B"; essa região **inclui** a tripla. Para "exatamente A e B" use **n(A ∩ B) − n(A ∩ B ∩ C)**.
`,
        fc: [
          ["Fórmula da união de três conjuntos?", "n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C)."],
          ["‘Exatamente A e B’ (e não C)?", "n(A ∩ B) − n(A ∩ B ∩ C)."],
          ["Por onde começar a preencher o diagrama de Venn de três conjuntos?", "Pela interseção dos três conjuntos; depois as interseções de dois a dois (subtraindo a tripla) e por fim as regiões ‘somente’."],
        ],
        mc: [
          ["Em um grupo de 120 pessoas, 70 leem jornal, 60 leem revista e 20 não leem nenhum dos dois. O número de pessoas que leem os dois é:", ["10.", "20.", "30.", "40."], 2, "Pelo menos um: 100. 70 + 60 − x = 100 ⇒ x = 30.", "MEDIO"],
          ["Com n(A)=40, n(B)=30, n(C)=20, n(A∩B)=10, n(A∩C)=8, n(B∩C)=6 e n(A∩B∩C)=4, o valor de n(A ∪ B ∪ C) é:", ["60.", "66.", "70.", "78."], 2, "40 + 30 + 20 − 10 − 8 − 6 + 4 = 70.", "MEDIO"],
          ["Com os dados da questão anterior, o número de elementos que pertencem a A mas não a B nem a C é:", ["22.", "24.", "26.", "28."], 2, "40 − 10 − 8 + 4 = 26.", "DIFICIL"],
        ],
        ce: [
          ["Se, em um grupo de 50 pessoas, 30 gostam de A e 25 gostam de B, e todos gostam de pelo menos um dos dois, então 5 pessoas gostam de ambos.", "C", "30 + 25 − x = 50 ⇒ x = 5."],
          ["A expressão ‘exatamente dois conjuntos’ corresponde à soma das interseções de dois a dois, incluindo a interseção tripla.", "E", "Exatamente dois = interseções de pares sem a região tripla."],
          ["Em um universo de 100 elementos, se n(A) = 60 e n(B) = 50, então n(A ∩ B) é no mínimo 10.", "C", "n(A ∩ B) ≥ 60 + 50 − 100 = 10."],
          ["Se A e B são disjuntos, n(A ∪ B) = n(A) + n(B).", "C", "Sem interseção, não há o que subtrair."],
        ],
      },
    ],
  },
  {
    nome: "Análise Combinatória",
    slug: "analise-combinatoria",
    descricao: "Princípio fundamental da contagem, fatorial, permutações, arranjos e combinações.",
    ordem: 8,
    topicos: [
      {
        titulo: "Princípio Fundamental da Contagem e Fatorial",
        slug: "pfc-fatorial",
        resumo: "Se uma decisão pode ser tomada de m modos e outra, independente, de n modos, o total é m · n (princípio multiplicativo). Fatorial: n! = n·(n−1)·…·1, com 0! = 1. Com ‘ou’ (excludentes) soma-se; com ‘e’ (etapas) multiplica-se.",
        conteudo: `# Princípio Fundamental da Contagem e Fatorial

## Princípio fundamental da contagem (PFC)

Se um evento ocorre em **etapas sucessivas e independentes**, com **n₁** modos na 1ª etapa, **n₂** na 2ª, …, **n_k** na k-ésima, o número total de possibilidades é:

> **n₁ × n₂ × … × n_k**

**Exemplo 1.** 4 camisas e 3 calças → **4 × 3 = 12** combinações.

**Exemplo 2 (senhas).**
- Senha de 4 dígitos (0 a 9), **com repetição**: **10 × 10 × 10 × 10 = 10 000**.
- Senha de 4 dígitos **distintos**: **10 × 9 × 8 × 7 = 5 040**.

**Exemplo 3 (placa).** 3 letras (26) e 4 algarismos (10), com repetição: **26³ × 10⁴ = 175 760 000**.

## Regra do "e" × regra do "ou"

| Palavra | Operação | Quando |
|---|---|---|
| **e** (etapas) | **multiplica** | decisões sucessivas |
| **ou** (casos excludentes) | **soma** | uma coisa **ou** outra, nunca as duas |

> 💡 Quando houver **restrição** (ex.: "o primeiro dígito não pode ser zero"), **comece pela etapa mais restrita**.

## Fatorial

> **n! = n · (n − 1) · (n − 2) · … · 2 · 1**  com **0! = 1** e **1! = 1**

| n | n! |
|---|---|
| 3 | 6 |
| 4 | 24 |
| 5 | 120 |
| 6 | 720 |

**Simplificação:** n! = n · (n − 1)!. Exemplo: **8!/6! = 8 · 7 = 56**.

> ⚠️ **(a + b)! ≠ a! + b!** — o fatorial **não** distribui sobre a soma.
`,
        fc: [
          ["O que é o princípio multiplicativo (PFC)?", "Se há m modos de fazer a 1ª etapa e n modos de fazer a 2ª, independentes, o total é m · n. Estende-se a qualquer número de etapas."],
          ["Quanto vale 0! e por quê?", "0! = 1, por definição (convenção que mantém consistentes as fórmulas de combinação e permutação)."],
          ["Quando somar e quando multiplicar?", "Multiplica-se em etapas sucessivas (e); soma-se em casos excludentes (ou)."],
        ],
        mc: [
          ["Uma pessoa tem 4 camisas e 3 calças. De quantas maneiras pode se vestir usando uma camisa e uma calça?", ["7.", "12.", "24.", "81."], 1, "4 × 3 = 12.", "FACIL"],
          ["O valor de 8!/6! é:", ["2.", "14.", "56.", "336."], 2, "8!/6! = 8 · 7 = 56.", "FACIL"],
          ["Quantas senhas de 4 dígitos distintos (0 a 9) podem ser formadas?", ["10 000.", "5 040.", "720.", "210."], 1, "10 · 9 · 8 · 7 = 5 040.", "MEDIO"],
        ],
        ce: [
          ["O número de senhas numéricas de 4 dígitos, permitida a repetição, é 10 000.", "C", "10⁴ = 10 000."],
          ["O fatorial de zero é igual a zero.", "E", "0! = 1."],
          ["Há 175 760 000 placas formadas por 3 letras (26 possíveis) seguidas de 4 algarismos, com repetição permitida.", "C", "26³ · 10⁴ = 17 576 · 10 000 = 175 760 000."],
          ["(3 + 2)! é igual a 3! + 2!.", "E", "5! = 120, e 3! + 2! = 8."],
        ],
      },
      {
        titulo: "Arranjos e Permutações",
        slug: "arranjos-permutacoes",
        resumo: "Arranjo A(n,p) = n!/(n−p)! quando a ordem importa. Permutação simples P(n) = n!; com elementos repetidos, n!/(a!·b!…); circular: (n−1)!. ‘Juntos’ = tratar como bloco; ‘um antes do outro’ = metade.",
        conteudo: `# Arranjos e Permutações

## Pergunta-chave

> **A ordem dos elementos importa?** Se **sim** → arranjo/permutação. Se **não** → combinação.

## Arranjo simples

Escolher **p** elementos entre **n**, **com ordem**:

> **A(n, p) = n! / (n − p)!**

**Exemplo.** Presidente, vice e secretário entre 10 pessoas: **A(10, 3) = 10 · 9 · 8 = 720**.

## Permutação simples

Ordenar **todos** os **n** elementos distintos:

> **P(n) = n!**

**Exemplos.**
- Filas com 5 pessoas: **5! = 120**.
- Anagramas de **BRASIL** (6 letras distintas): **6! = 720**.
- Anagramas de BRASIL que **começam com B**: **5! = 120**.

## Permutação com elementos repetidos

> **P(n; a, b, …) = n! / (a! · b! · …)**

**Exemplo.** Anagramas de **CONCURSO** (8 letras; C aparece 2 vezes e O, 2 vezes): **8!/(2!·2!) = 40 320 / 4 = 10 080**.

## Permutação circular

> **PC(n) = (n − 1)!**

**Exemplo.** 5 pessoas em uma mesa redonda: **4! = 24**.

## Técnicas com restrições

| Situação | Como resolver |
|---|---|
| **Dois elementos sempre juntos** | trate o par como **1 bloco** e multiplique por **2!** (ordem dentro do par). *5 pessoas, 2 sempre juntas:* 4! · 2! = **48** |
| **A antes de B** (em fila) | total ÷ 2 |
| **Primeira posição fixa** | permute o restante |
| **Nunca juntos** | total − (juntos) |

> 💡 **Arranjo × permutação:** permutação é um **arranjo de todos** os elementos: P(n) = A(n, n).
`,
        fc: [
          ["Fórmula do arranjo A(n, p)?", "A(n, p) = n!/(n − p)! — escolher p entre n elementos, com ordem relevante."],
          ["Anagramas de palavra com letras repetidas?", "n! dividido pelo fatorial de cada repetição: CONCURSO = 8!/(2!·2!) = 10 080."],
          ["Permutação circular de n elementos?", "(n − 1)!"],
        ],
        mc: [
          ["Quantos anagramas tem a palavra BRASIL?", ["120.", "360.", "720.", "5 040."], 2, "6! = 720.", "FACIL"],
          ["De quantas maneiras 10 pessoas podem ocupar os cargos de presidente, vice-presidente e secretário (sem acumular cargos)?", ["120.", "720.", "1 000.", "3 628 800."], 1, "A(10,3) = 10 · 9 · 8 = 720.", "MEDIO"],
          ["Cinco pessoas sentam-se em uma mesa redonda. O número de disposições distintas é:", ["24.", "60.", "120.", "5."], 0, "(5 − 1)! = 24.", "MEDIO"],
        ],
        ce: [
          ["O número de anagramas da palavra CONCURSO é 10 080.", "C", "8!/(2!·2!) = 10 080."],
          ["Em uma fila com 5 pessoas, se duas delas devem ficar sempre juntas, há 48 disposições possíveis.", "C", "4! · 2! = 48."],
          ["O número de anagramas de BRASIL que começam por B é 6!.", "E", "Fixando o B, permutam-se as 5 restantes: 5! = 120."],
          ["Para escolher 3 pessoas de um grupo de 10 em uma comissão sem cargos, usa-se arranjo.", "E", "Sem ordem, usa-se combinação."],
        ],
      },
      {
        titulo: "Combinações",
        slug: "combinacoes",
        resumo: "Combinação C(n,p) = n!/(p!(n−p)!) quando a ordem NÃO importa (comissões, grupos, apertos de mão). C(n,p) = C(n,n−p). Para ‘pelo menos um’, calcule o total e subtraia o complementar.",
        conteudo: `# Combinações

## Combinação simples

Escolher **p** elementos entre **n**, **sem importar a ordem**:

> **C(n, p) = n! / [p! · (n − p)!]**

**Propriedades:**
- **C(n, 0) = C(n, n) = 1** · **C(n, 1) = n**
- **C(n, p) = C(n, n − p)** (escolher p é o mesmo que "deixar" n − p)
- **Relação:** **A(n, p) = C(n, p) · p!**

## Exemplos

| Problema | Resolução |
|---|---|
| Comissão de **3** pessoas entre **8** | C(8, 3) = **56** |
| **Apertos de mão** em 10 pessoas | C(10, 2) = **45** |
| Comissão com **2 homens** (de 5) e **3 mulheres** (de 6) | C(5,2) · C(6,3) = 10 · 20 = **200** |
| Jogos de turno único entre 8 times | C(8, 2) = **28** |

## "Pelo menos um" → **complementar**

Em uma comissão de **3** pessoas formada entre **4 homens e 3 mulheres**, quantas têm **pelo menos 1 mulher**?

- Total: C(7, 3) = **35**
- Sem nenhuma mulher (só homens): C(4, 3) = **4**
- **Pelo menos 1 mulher: 35 − 4 = 31**

## Combinação com repetição

Escolher **p** elementos entre **n** tipos, podendo **repetir**: **C(n + p − 1, p)**.

*Ex.: comprar 3 salgados entre 4 tipos:* C(4 + 3 − 1, 3) = C(6, 3) = **20**.

## Como decidir

| Pergunta | Ferramenta |
|---|---|
| A ordem importa? | **Sim** → arranjo/permutação · **Não** → **combinação** |
| Há grupos distintos de escolha? | **Multiplique** as combinações |
| "Pelo menos…" | **Total − complementar** |

> 💡 Sinais de combinação: *comissão, grupo, time, subconjunto, cartela, mão de cartas, apertos de mão*. Sinais de arranjo: *presidente/vice, 1º/2º/3º lugares, senha, fila*.
`,
        fc: [
          ["Fórmula da combinação C(n, p)?", "C(n, p) = n!/[p!(n − p)!]; a ordem não importa."],
          ["Quantos apertos de mão entre 10 pessoas?", "C(10, 2) = 45."],
          ["Como resolver ‘pelo menos um’?", "Calcular o total e subtrair o caso complementar (nenhum). Ex.: C(7,3) − C(4,3) = 35 − 4 = 31."],
        ],
        mc: [
          ["De quantas maneiras pode ser formada uma comissão de 3 pessoas entre 8 candidatos?", ["24.", "56.", "336.", "512."], 1, "C(8, 3) = 56.", "FACIL"],
          ["Em uma comissão de 3 pessoas escolhidas entre 4 homens e 3 mulheres, quantas têm pelo menos uma mulher?", ["24.", "31.", "35.", "21."], 1, "C(7,3) − C(4,3) = 35 − 4 = 31.", "MEDIO"],
          ["Quantas comissões com 2 homens e 3 mulheres podem ser formadas com 5 homens e 6 mulheres?", ["30.", "120.", "200.", "330."], 2, "C(5,2) · C(6,3) = 10 · 20 = 200.", "MEDIO"],
        ],
        ce: [
          ["O número de apertos de mão trocados entre 10 pessoas, todas se cumprimentando uma única vez, é 45.", "C", "C(10,2) = 45."],
          ["C(8, 3) é igual a C(8, 5).", "C", "C(n, p) = C(n, n − p)."],
          ["O número de maneiras de escolher o 1º, o 2º e o 3º lugares entre 5 candidatos é C(5, 3).", "E", "A ordem importa: A(5,3) = 60."],
          ["O valor de C(6, 2) é 15.", "C", "6 · 5 / 2 = 15."],
        ],
      },
    ],
  },
  {
    nome: "Probabilidade",
    slug: "probabilidade-rl",
    descricao: "Conceitos, regras da adição e da multiplicação, probabilidade condicional e distribuição binomial.",
    ordem: 9,
    topicos: [
      {
        titulo: "Probabilidade: Conceitos Iniciais",
        slug: "probabilidade-conceitos",
        resumo: "P(A) = casos favoráveis / casos possíveis (espaço amostral equiprovável). 0 ≤ P ≤ 1. P(complementar) = 1 − P(A). Eventos mutuamente exclusivos não ocorrem juntos. Use análise combinatória para contar os casos.",
        conteudo: `# Probabilidade: Conceitos Iniciais

## Definições

- **Experimento aleatório:** o resultado não pode ser previsto com certeza (lançar um dado).
- **Espaço amostral (E ou Ω):** conjunto de **todos os resultados possíveis**.
- **Evento:** qualquer **subconjunto** do espaço amostral.

> **P(A) = número de casos favoráveis / número de casos possíveis** — válida se os resultados são **equiprováveis**.

## Propriedades

| Propriedade | Valor |
|---|---|
| **0 ≤ P(A) ≤ 1** | probabilidade nunca é negativa nem maior que 1 |
| **Evento certo** | P = 1 |
| **Evento impossível** | P = 0 |
| **Complementar** | **P(Ā) = 1 − P(A)** |

## Exemplos

- **Dado:** P(par) = 3/6 = **1/2** · P(> 4) = 2/6 = **1/3**.
- **Duas moedas:** espaço {CC, CK, KC, KK}; P(duas caras) = **1/4**.
- **Dois dados, soma 7:** casos favoráveis 6 [(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)] em 36 ⇒ **1/6**.
- **Pelo menos uma cara em 3 lançamentos:** 1 − P(nenhuma cara) = 1 − 1/8 = **7/8**.

## Eventos

| Tipo | Definição |
|---|---|
| **Mutuamente exclusivos** | **não podem** ocorrer juntos (A ∩ B = ∅) |
| **Complementares** | exclusivos **e** cobrem todo o espaço |
| **Independentes** | a ocorrência de um **não altera** a probabilidade do outro |

> 💡 "**Pelo menos um**" quase sempre se resolve por **1 − P(nenhum)**.

> ⚠️ **Probabilidade ≠ certeza.** P = 0,9 não garante que o evento ocorrerá, e P = 0,1 não impede.
`,
        fc: [
          ["Fórmula básica da probabilidade?", "P(A) = casos favoráveis / casos possíveis, para resultados equiprováveis."],
          ["Probabilidade do evento complementar?", "P(Ā) = 1 − P(A)."],
          ["Como calcular ‘pelo menos um’?", "1 − P(nenhum). Ex.: pelo menos uma cara em 3 lançamentos = 1 − 1/8 = 7/8."],
        ],
        mc: [
          ["Ao lançar um dado honesto, a probabilidade de obter um número maior que 4 é:", ["1/6.", "1/3.", "1/2.", "2/3."], 1, "Favoráveis: 5 e 6 ⇒ 2/6 = 1/3.", "FACIL"],
          ["Ao lançar dois dados honestos, a probabilidade de a soma ser 7 é:", ["1/12.", "1/9.", "1/6.", "1/4."], 2, "6 casos em 36 = 1/6.", "MEDIO"],
          ["A probabilidade de obter pelo menos uma cara em três lançamentos de uma moeda honesta é:", ["1/8.", "3/8.", "1/2.", "7/8."], 3, "1 − (1/2)³ = 7/8.", "MEDIO"],
        ],
        ce: [
          ["A probabilidade de um evento qualquer pode assumir valores entre 0 e 1, inclusive.", "C", "0 ≤ P(A) ≤ 1."],
          ["Ao lançar duas moedas honestas, a probabilidade de obter duas caras é 1/2.", "E", "É 1/4."],
          ["Se P(A) = 0,3, então a probabilidade do evento complementar de A é 0,7.", "C", "1 − 0,3 = 0,7."],
          ["Eventos mutuamente exclusivos são sempre independentes.", "E", "Se são exclusivos e têm probabilidade positiva, a ocorrência de um impede o outro; logo são dependentes."],
        ],
      },
      {
        titulo: "Regras da Adição e da Multiplicação; Probabilidade Condicional",
        slug: "probabilidade-regras-condicional",
        resumo: "Adição (‘ou’): P(A∪B) = P(A) + P(B) − P(A∩B). Multiplicação (‘e’): independentes P(A∩B) = P(A)·P(B); dependentes P(A)·P(B|A). Condicional: P(A|B) = P(A∩B)/P(B). Sorteios sem reposição alteram as probabilidades.",
        conteudo: `# Regras da Adição e da Multiplicação; Probabilidade Condicional

## Regra da adição (o "ou")

> **P(A ∪ B) = P(A) + P(B) − P(A ∩ B)**

Se **A e B são mutuamente exclusivos**: **P(A ∪ B) = P(A) + P(B)**.

**Exemplo.** P(A) = 0,5; P(B) = 0,4; P(A ∩ B) = 0,2 ⇒ **P(A ∪ B) = 0,5 + 0,4 − 0,2 = 0,7**.

## Regra da multiplicação (o "e")

### Eventos independentes

> **P(A ∩ B) = P(A) · P(B)**

**Exemplo.** P(A) = 0,3 e P(B) = 0,4, independentes ⇒ P(A ∩ B) = **0,12**.

### Eventos dependentes (sorteio sem reposição)

> **P(A ∩ B) = P(A) · P(B | A)**

**Exemplo (urna).** 5 bolas vermelhas e 3 azuis; retiram-se **2** bolas:

| Modo | P(duas vermelhas) |
|---|---|
| **Com reposição** (independentes) | 5/8 · 5/8 = **25/64** |
| **Sem reposição** (dependentes) | 5/8 · 4/7 = 20/56 = **5/14** |

## Probabilidade condicional

Probabilidade de **A, sabendo que B ocorreu**:

> **P(A | B) = P(A ∩ B) / P(B)**   (com P(B) > 0)

**Exemplo.** P(A ∩ B) = 0,12 e P(B) = 0,4 ⇒ **P(A | B) = 0,12/0,4 = 0,3**.

> 💡 Se **A e B são independentes**, então **P(A | B) = P(A)**.

## Como resolver (roteiro)

1. Identifique se é **"ou" (soma)** ou **"e" (multiplica)**.
2. Veja se há **reposição** (independentes) ou **não** (dependentes).
3. Em "**dado que…**", "**sabendo que…**", use a **condicional** (o universo se reduz).
4. Considere a **árvore de possibilidades** quando houver várias etapas.

> ⚠️ **Independência não é exclusividade.** Dois eventos com probabilidade positiva que **não** podem ocorrer juntos são **dependentes**.
`,
        fc: [
          ["Regra da adição para dois eventos?", "P(A ∪ B) = P(A) + P(B) − P(A ∩ B); se exclusivos, P(A) + P(B)."],
          ["Probabilidade condicional?", "P(A | B) = P(A ∩ B) / P(B), com P(B) > 0."],
          ["Diferença entre sortear com e sem reposição?", "Com reposição os eventos são independentes (as probabilidades se mantêm); sem reposição são dependentes (as probabilidades das etapas seguintes mudam)."],
        ],
        mc: [
          ["Sendo P(A) = 0,5, P(B) = 0,4 e P(A ∩ B) = 0,2, o valor de P(A ∪ B) é:", ["0,7.", "0,9.", "0,2.", "0,5."], 0, "0,5 + 0,4 − 0,2 = 0,7.", "FACIL"],
          ["Uma urna tem 5 bolas vermelhas e 3 azuis. Retiram-se duas bolas, sem reposição. A probabilidade de ambas serem vermelhas é:", ["25/64.", "5/14.", "5/8.", "3/7."], 1, "5/8 · 4/7 = 20/56 = 5/14. Sem reposição, na segunda retirada restam 4 vermelhas em 7 bolas.", "MEDIO"],
          ["Se P(A ∩ B) = 0,12 e P(B) = 0,4, então P(A | B) vale:", ["0,12.", "0,3.", "0,4.", "0,48."], 1, "0,12 / 0,4 = 0,3.", "MEDIO"],
        ],
        ce: [
          ["Se A e B são independentes, com P(A) = 0,3 e P(B) = 0,4, então P(A ∩ B) = 0,12.", "C", "Produto das probabilidades."],
          ["Para eventos mutuamente exclusivos, P(A ∪ B) = P(A) + P(B).", "C", "Não há interseção a subtrair."],
          ["Em dois sorteios consecutivos sem reposição, as probabilidades de cada etapa permanecem as mesmas.", "E", "Sem reposição, o espaço amostral muda."],
          ["Se A e B são independentes, então P(A | B) = P(A).", "C", "Definição de independência."],
        ],
      },
      {
        titulo: "Distribuição Binomial",
        slug: "distribuicao-binomial",
        resumo: "Em n tentativas independentes, cada uma com probabilidade de sucesso p (e fracasso q = 1 − p), a probabilidade de exatamente k sucessos é C(n,k)·pᵏ·qⁿ⁻ᵏ. Reconheça pelo padrão: tentativas repetidas, independentes, mesmas probabilidades, dois resultados.",
        conteudo: `# Distribuição Binomial

## Quando usar

Situações em que há:
1. **n tentativas** (repetições) **independentes**;
2. cada tentativa tem **dois resultados** (sucesso/fracasso);
3. a **probabilidade de sucesso p** é a **mesma** em todas.

## Fórmula

> **P(X = k) = C(n, k) · pᵏ · qⁿ⁻ᵏ**, com **q = 1 − p**

- **C(n, k):** de quantas formas os **k sucessos** podem ocorrer entre as **n tentativas**.
- **pᵏ:** probabilidade de **k sucessos**.
- **qⁿ⁻ᵏ:** probabilidade de **n − k fracassos**.

## Exemplos

### 1) Moeda honesta
**Exatamente 2 caras em 5 lançamentos:**
P = C(5, 2) · (1/2)² · (1/2)³ = 10 · 1/32 = **10/32 = 5/16**.

### 2) Probabilidade de acerto 0,2
Um teste tem acerto com p = 0,2. **Exatamente 1 acerto em 3 tentativas:**
P = C(3, 1) · 0,2 · 0,8² = 3 · 0,2 · 0,64 = **0,384**.

### 3) "Pelo menos"
**Pelo menos 1 sucesso em n tentativas** = **1 − qⁿ**.
*Em 3 tentativas com p = 0,2:* 1 − 0,8³ = 1 − 0,512 = **0,488**.

## Cuidados

- Se há **mais de um modo** de contar (por exemplo, "no máximo 1 sucesso"), **some** os casos: **P(0) + P(1)**.
- Se as tentativas **não são independentes** (sem reposição em populações pequenas), a binomial **não** se aplica.
- O fator **C(n, k)** conta **em quais das n tentativas** ocorrem os k sucessos.
`,
        fc: [
          ["Fórmula da distribuição binomial?", "P(X = k) = C(n, k) · pᵏ · qⁿ⁻ᵏ, com q = 1 − p."],
          ["Quando se aplica a binomial?", "Em n tentativas independentes, com dois resultados possíveis e probabilidade de sucesso p constante."],
          ["Como calcular ‘pelo menos um sucesso’ em n tentativas?", "1 − qⁿ (um menos a probabilidade de nenhum sucesso)."],
        ],
        mc: [
          ["A probabilidade de obter exatamente 2 caras em 5 lançamentos de uma moeda honesta é:", ["1/32.", "5/16.", "1/4.", "1/2."], 1, "C(5,2)/2⁵ = 10/32 = 5/16.", "MEDIO"],
          ["Em 3 tentativas independentes, com probabilidade de sucesso 0,2 em cada, a probabilidade de exatamente 1 sucesso é:", ["0,2.", "0,384.", "0,488.", "0,6."], 1, "3 · 0,2 · 0,8² = 0,384.", "MEDIO"],
          ["A probabilidade de pelo menos um sucesso em 3 tentativas independentes com p = 0,2 é:", ["0,512.", "0,6.", "0,488.", "0,384."], 2, "1 − 0,8³ = 0,488.", "DIFICIL"],
        ],
        ce: [
          ["Na distribuição binomial, as tentativas devem ser independentes e ter a mesma probabilidade de sucesso.", "C", "Condições do modelo."],
          ["A probabilidade de exatamente 2 caras em 5 lançamentos de uma moeda honesta é 5/16.", "C", "C(5,2)/32 = 10/32."],
          ["Em n tentativas com probabilidade de sucesso p, a probabilidade de pelo menos um sucesso é pⁿ.", "E", "É 1 − qⁿ; pⁿ é a probabilidade de sucesso em todas."],
          ["Em 3 tentativas com p = 0,5, a probabilidade de exatamente 3 sucessos é 1/8.", "C", "C(3,3) · 0,5³ = 1/8."],
        ],
      },
    ],
  },
];
