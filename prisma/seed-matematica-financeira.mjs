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
  // BLOCO 1 — JUROS SIMPLES
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Juros Simples",
    slug: "juros-simples",
    descricao: "A base de tudo. Capital, taxa, tempo, montante e desconto simples comercial vs. racional.",
    ordem: 1,
    topicos: [
      {
        titulo: "Conceitos Fundamentais e Fórmula M = C(1 + in)",
        slug: "conceitos-juros-simples",
        ordem: 1,
        resumo: "No regime de juros simples, os juros incidem sempre sobre o capital inicial. A fórmula fundamental é M = C × (1 + i × n). No regime simples, taxas são proporcionais: taxa mensal × 12 = taxa anual.",
        conteudo: `# Juros Simples — Conceitos Fundamentais

## A Ideia Central: Valor do Dinheiro no Tempo

> **R$ 1.000 hoje vale mais do que R$ 1.000 daqui a um ano.**

Isso ocorre porque o dinheiro presente pode ser investido e gerar rendimento. Essa é a base de toda a Matemática Financeira.

## Variáveis Fundamentais

| Variável | Símbolo | Significado |
|----------|---------|-------------|
| Capital (Principal) | C | Valor inicial aplicado ou emprestado |
| Taxa de juros | i | Percentual cobrado por período |
| Tempo (prazo) | n | Número de períodos |
| Juros | J | Remuneração pelo uso do capital |
| Montante | M | Capital + Juros ao final do prazo |

> **Regra de ouro**: a unidade da taxa e do tempo devem sempre ser a mesma. Taxa mensal com prazo em anos → converta tudo para meses antes de calcular.

## Fórmula dos Juros Simples

$$J = C \times i \times n$$

$$M = C + J = C \times (1 + i \times n)$$

**Exemplo**: R$ 5.000 aplicados por 6 meses a 3% ao mês.
- J = 5.000 × 0,03 × 6 = **R$ 900**
- M = 5.000 + 900 = **R$ 5.900**

## Proporcionalidade de Taxas no Regime Simples

No regime simples, as taxas são **proporcionais**:

| Conversão | Fórmula |
|-----------|---------|
| Mensal → Anual | i_anual = i_mensal × 12 |
| Anual → Mensal | i_mensal = i_anual ÷ 12 |
| Diária → Anual | i_anual = i_diária × 360 |

> **Atenção**: proporcionalidade de taxas só vale no regime **simples**. No regime composto, usa-se equivalência por potenciação — este é o erro mais comum em provas.

## Isolando Variáveis

A partir de M = C × (1 + i × n), é possível isolar qualquer variável:

- **C** = M ÷ (1 + i × n) → capital presente (valor atual)
- **i** = (M/C − 1) ÷ n → taxa de juros
- **n** = (M/C − 1) ÷ i → prazo
`,
      },
      {
        titulo: "Desconto Simples — Comercial vs. Racional",
        slug: "desconto-simples",
        ordem: 2,
        resumo: "Desconto é a operação de antecipar um título (receber antes do vencimento). No desconto comercial (bancário/por fora), o desconto incide sobre o valor futuro. No desconto racional (por dentro), incide sobre o valor presente. São regimes distintos — não confunda.",
        conteudo: `# Desconto Simples — Comercial vs. Racional

## Conceito de Desconto

**Descontar** um título significa receber seu valor antes do vencimento. O credor antecipa o pagamento, mas recebe menos que o valor de face (valor nominal).

- **Valor Nominal (N)**: valor que consta no título (valor futuro)
- **Valor Atual (PV)**: o que o portador recebe ao descontar antes do vencimento
- **Desconto (D)**: diferença entre N e PV → D = N − PV

## Desconto Simples Comercial (Por Fora / Bancário)

O desconto é calculado sobre o **valor nominal (futuro)**. É o mais usado pelos bancos.

$$D_c = N \times d \times n$$

$$PV = N \times (1 - d \times n)$$

Onde **d** é a taxa de desconto (não confundir com taxa de juros i).

**Exemplo**: Título de R$ 10.000 descontado 3 meses antes do vencimento, taxa de desconto 2% ao mês.
- D = 10.000 × 0,02 × 3 = **R$ 600**
- PV = 10.000 − 600 = **R$ 9.400**

## Desconto Simples Racional (Por Dentro / Matemático)

O desconto é calculado sobre o **valor atual (presente)**. Equivale a calcular os juros que o valor atual renderia até o vencimento.

$$D_r = N - PV$$

$$PV = \frac{N}{1 + i \times n}$$

**Exemplo**: Mesmo título (R$ 10.000, 3 meses, 2% ao mês).
- PV = 10.000 ÷ (1 + 0,02 × 3) = 10.000 ÷ 1,06 = **R$ 9.433,96**
- D_r = 10.000 − 9.433,96 = **R$ 566,04**

## Comparação

| Critério | Comercial (por fora) | Racional (por dentro) |
|----------|---------------------|----------------------|
| Base do desconto | Valor nominal (futuro) | Valor atual (presente) |
| Resultado | Desconto **maior** | Desconto **menor** |
| Uso | Bancos (operações de desconto de duplicatas) | Menos comum na prática |

> **Regra prática**: para o mesmo título, taxa e prazo, o desconto comercial é **sempre maior** que o racional — porque a base de cálculo (N) é maior.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 2 — JUROS COMPOSTOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Juros Compostos",
    slug: "juros-compostos",
    descricao: "Onde 90% das questões de concurso vivem. Fórmula M = C(1+i)ⁿ, equivalência de taxas, taxa nominal vs. efetiva e taxa real vs. aparente.",
    ordem: 2,
    topicos: [
      {
        titulo: "Fórmula Fundamental e Equivalência de Taxas",
        slug: "juros-compostos-formula-equivalencia",
        ordem: 1,
        resumo: "No regime composto, os juros de cada período são incorporados ao capital (juros sobre juros). A fórmula é M = C × (1+i)ⁿ. A equivalência de taxas é feita por potenciação — não por proporcionalidade. Taxa mensal de 1% NÃO equivale a 12% ao ano no regime composto.",
        conteudo: `# Juros Compostos — Fórmula e Equivalência de Taxas

## O que muda em relação ao Simples?

No regime **composto**, os juros de cada período são incorporados ao capital — ou seja, há **juros sobre juros**. Isso faz o montante crescer de forma **exponencial**, não linear.

## Fórmula Fundamental

$$M = C \times (1 + i)^n$$

| Variável | Significado |
|----------|-------------|
| M | Montante final |
| C | Capital inicial |
| i | Taxa de juros por período (decimal) |
| n | Número de períodos |

**Exemplo**: R$ 10.000 aplicados por 12 meses a 1% ao mês.
- M = 10.000 × (1,01)¹² = 10.000 × 1,1268... = **R$ 11.268,25**

No regime simples seria: 10.000 × (1 + 0,01 × 12) = **R$ 11.200,00**

> A diferença (R$ 68,25) são os **juros sobre juros** — pequena em 1 ano, enorme em prazos longos.

## Equivalência de Taxas no Regime Composto

Duas taxas são **equivalentes** quando, aplicadas a um mesmo capital pelo mesmo prazo, produzem o mesmo montante.

No regime composto, equivalência é por **potenciação**:

$$(1 + i_{mensal})^{12} = (1 + i_{anual})$$

**Exemplo**: Qual é a taxa anual equivalente a 1% ao mês?

- (1,01)¹² = 1,126825...
- Taxa anual = **12,6825%** (não 12%!)

### Fórmula geral de equivalência

$$i_1 = (1 + i_2)^{n_1/n_2} - 1$$

Onde n₁ e n₂ são os períodos das taxas que se quer converter.

## Proporcionalidade vs. Equivalência

| Regime | Método de conversão | Taxa mensal 1% → Taxa anual |
|--------|--------------------|-----------------------------|
| **Simples** | Proporcionalidade (× 12) | 12% ao ano |
| **Composto** | Equivalência (potenciação) | 12,6825% ao ano |

> **Este é o erro número 1 em provas**: usar proporcionalidade no regime composto. Sempre use potenciação!
`,
      },
      {
        titulo: "Taxa Nominal vs. Efetiva e Taxa Real vs. Aparente",
        slug: "taxa-nominal-efetiva-real",
        ordem: 2,
        resumo: "Taxa nominal é o que está escrito no contrato; taxa efetiva é o que você realmente paga. Um CDB de 12% ao ano com capitalização mensal tem taxa efetiva maior que 12%. A taxa real desconta a inflação usando a Fórmula de Fisher: (1+i) = (1+r) × (1+inflação).",
        conteudo: `# Taxa Nominal vs. Efetiva e Taxa Real vs. Aparente

## Taxa Nominal vs. Taxa Efetiva

### Taxa Nominal
É a taxa **declarada no contrato**, que utiliza período de capitalização **diferente** do período de referência.

> Exemplo: "12% ao ano, capitalizado mensalmente" → a capitalização é mensal, mas a taxa é expressa ao ano.

### Taxa Efetiva
É a taxa que **realmente incide** sobre o capital no período, considerando a capitalização real.

**Como converter nominal para efetiva:**

1. Divida a taxa nominal pelo número de capitalizações no período → taxa por período de capitalização.
2. Aplique a fórmula de equivalência de taxas compostas.

**Exemplo**: CDB com taxa nominal de 24% ao ano, capitalizado mensalmente.
- Taxa mensal nominal = 24% ÷ 12 = **2% ao mês**
- Taxa efetiva anual = (1,02)¹² − 1 = **26,82% ao ano**

> A taxa efetiva (26,82%) é **maior** que a nominal (24%) — esse é o efeito dos juros compostos.

### Resumo

| Situação | Taxa Nominal | Taxa Efetiva |
|----------|-------------|--------------|
| Capitalização anual | 12% a.a. | 12% a.a. (iguais) |
| Cap. semestral | 12% a.a. | 12,36% a.a. |
| Cap. mensal | 12% a.a. | 12,68% a.a. |
| Cap. diária | 12% a.a. | 12,75% a.a. |

> Quanto mais frequente a capitalização, maior a taxa efetiva em relação à nominal.

## Taxa Real vs. Taxa Aparente (Nominal com Inflação)

A **taxa aparente** (ou taxa nominal com inflação) é a que observamos no mercado. A **taxa real** é o rendimento após descontar a inflação.

### Fórmula de Fisher

$$(1 + i) = (1 + r) \times (1 + \pi)$$

Onde:
- **i** = taxa aparente (nominal)
- **r** = taxa real
- **π** (pi) = inflação no período

**Isolando a taxa real:**

$$r = \frac{(1 + i)}{(1 + \pi)} - 1$$

**Exemplo**: Aplicação rende 10% ao ano; inflação foi 4% ao ano.
- r = (1,10 ÷ 1,04) − 1 = 1,0577 − 1 = **5,77% ao ano (taxa real)**

> **Erro comum**: subtrair diretamente (10% − 4% = 6%). O correto pela Fórmula de Fisher é 5,77%. A diferença importa em questões mais precisas.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 3 — ANUIDADES
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Séries de Pagamentos — Anuidades",
    slug: "anuidades",
    descricao: "Parcelas, financiamentos e prestações. Anuidades vencidas vs. antecipadas, Valor Presente e Valor Futuro de séries uniformes.",
    ordem: 3,
    topicos: [
      {
        titulo: "Anuidades Vencidas e Antecipadas — VP e VF de Séries",
        slug: "anuidades-vp-vf",
        ordem: 1,
        resumo: "Anuidade é uma série de pagamentos iguais em intervalos regulares. Vencida: pagamento no fim do período (mais comum em financiamentos). Antecipada: pagamento no início (aluguel, por exemplo). O VP traz as parcelas futuras a valor presente; o VF acumula depósitos no tempo.",
        conteudo: `# Anuidades — Valor Presente e Valor Futuro de Séries

## O que é uma Anuidade?

**Anuidade** é uma série de pagamentos (ou recebimentos) de mesmo valor, em intervalos regulares de tempo.

Não precisa ser anual — pode ser mensal, trimestral etc. O nome é histórico.

## Tipos de Anuidade

| Tipo | Quando ocorre o pagamento | Exemplo |
|------|--------------------------|---------|
| **Vencida (ordinária)** | No **fim** de cada período | Financiamento de carro (parcelas mensais) |
| **Antecipada** | No **início** de cada período | Aluguel (paga-se antes de usar) |

> A anuidade **vencida** é a mais cobrada em concursos e é o padrão das calculadoras financeiras.

## Valor Presente de uma Série (VP)

Responde: **quanto vale hoje** uma série de pagamentos futuros?

$$VP = PMT \times \frac{1 - (1 + i)^{-n}}{i}$$

Onde:
- **PMT** = valor de cada parcela
- **i** = taxa de juros por período
- **n** = número de parcelas

**Exemplo**: Financiamento de 12 parcelas de R$ 1.000 a 2% ao mês. Qual o valor à vista?

$$VP = 1.000 \times \frac{1 - (1,02)^{-12}}{0,02} = 1.000 \times 10,5753 = \textbf{R\$ 10.575,30}$$

## Valor Futuro de uma Série (VF)

Responde: **quanto se acumula** fazendo depósitos regulares ao longo do tempo?

$$VF = PMT \times \frac{(1 + i)^n - 1}{i}$$

**Exemplo**: Depósitos mensais de R$ 500 por 24 meses a 0,8% ao mês.

$$VF = 500 \times \frac{(1,008)^{24} - 1}{0,008} = 500 \times 26,03 = \textbf{R\$ 13.015,00}$$

## Dica: HP-12C

Na HP-12C, as funções são:
| Tecla | Variável |
|-------|---------|
| PV | Valor Presente |
| FV | Valor Futuro |
| PMT | Parcela |
| N | Número de períodos |
| I | Taxa por período |

Insira 4 variáveis e calcule a 5ª. Para anuidade antecipada: ative o modo **BEGIN** antes de calcular.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 4 — SISTEMAS DE AMORTIZAÇÃO
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Sistemas de Amortização",
    slug: "sistemas-amortizacao",
    descricao: "Como os financiamentos realmente funcionam. SAC (prestações decrescentes), Price (prestações constantes) e SAA (juros periódicos + principal no final).",
    ordem: 4,
    topicos: [
      {
        titulo: "SAC — Sistema de Amortização Constante",
        slug: "sac",
        ordem: 1,
        resumo: "No SAC, a amortização do principal é sempre igual (daí o nome). Os juros decrescem a cada período porque incidem sobre o saldo devedor que cai. As prestações diminuem ao longo do tempo. É o sistema mais usado no mercado imobiliário brasileiro.",
        conteudo: `# SAC — Sistema de Amortização Constante

## Lógica do SAC

- **Amortização**: sempre igual → A = C ÷ n
- **Juros**: decrescem a cada período (calculados sobre o saldo devedor)
- **Prestação**: decresce ao longo do tempo (= Amortização + Juros)

## Fórmulas

$$A = \frac{C}{n}$$

$$J_k = SD_{k-1} \times i$$

$$Prestação_k = A + J_k$$

$$SD_k = SD_{k-1} - A$$

Onde:
- **A** = amortização constante
- **C** = capital (saldo devedor inicial)
- **n** = número de parcelas
- **J_k** = juros da parcela k
- **SD_k** = saldo devedor após a parcela k

## Exemplo Prático

Financiamento de R$ 12.000 em 4 parcelas mensais, taxa 2% ao mês.

- Amortização = 12.000 ÷ 4 = **R$ 3.000 (constante)**

| Mês | SD (início) | Juros (2%) | Amortização | Prestação | SD (fim) |
|-----|------------|-----------|------------|-----------|---------|
| 1 | 12.000 | 240,00 | 3.000 | **3.240,00** | 9.000 |
| 2 | 9.000 | 180,00 | 3.000 | **3.180,00** | 6.000 |
| 3 | 6.000 | 120,00 | 3.000 | **3.120,00** | 3.000 |
| 4 | 3.000 | 60,00 | 3.000 | **3.060,00** | 0 |

**Prestação 1 > Prestação 4** — as prestações decrescem. ✓

## Características do SAC

- Primeira parcela é a **mais cara**
- Total de juros pago é **menor** que no Price (para os mesmos C, n, i)
- Mais usado em: **financiamentos imobiliários** (CEF, Banco do Brasil)
- Vantagem: saldo devedor cai mais rápido → menos vulnerável à inadimplência
`,
      },
      {
        titulo: "Tabela Price — Sistema Francês de Amortização",
        slug: "price",
        ordem: 2,
        resumo: "Na Tabela Price, a prestação é constante do início ao fim. Os juros decrescem e a amortização cresce a cada período — mas a soma é sempre igual. É o sistema mais usado em financiamentos de veículos e crédito pessoal.",
        conteudo: `# Tabela Price — Sistema Francês de Amortização

## Lógica da Price

- **Prestação**: sempre igual (constante)
- **Juros**: decrescem a cada período
- **Amortização**: cresce a cada período
- **Regra**: Prestação = Juros + Amortização (sempre)

## Fórmula da Prestação Constante

$$PMT = C \times \frac{i \times (1 + i)^n}{(1 + i)^n - 1}$$

Ou usando o fator da tabela Price (**FC**):

$$PMT = C \times FC(i, n)$$

## Lógica de cada linha da tabela

1. **Juros** do período = Saldo Devedor anterior × taxa
2. **Amortização** = Prestação − Juros
3. **Saldo Devedor** = SD anterior − Amortização

## Exemplo Prático

Mesmo financiamento: R$ 12.000, 4 parcelas, 2% ao mês.

PMT = 12.000 × [0,02 × (1,02)⁴] ÷ [(1,02)⁴ − 1] = **R$ 3.192,95**

| Mês | SD (início) | Juros (2%) | Amortização | Prestação | SD (fim) |
|-----|------------|-----------|------------|-----------|---------|
| 1 | 12.000,00 | 240,00 | 2.952,95 | **3.192,95** | 9.047,05 |
| 2 | 9.047,05 | 180,94 | 3.012,01 | **3.192,95** | 6.035,04 |
| 3 | 6.035,04 | 120,70 | 3.072,25 | **3.192,95** | 2.962,79 |
| 4 | 2.962,79 | 59,26 | 3.133,69 | **3.192,95** | 0 |

**Prestação sempre R$ 3.192,95** — constante. ✓

## SAC vs. Price — Comparação

| Critério | SAC | Price |
|----------|-----|-------|
| Prestação | Decrescente | Constante |
| Amortização | Constante | Crescente |
| Juros | Decrescentes | Decrescentes |
| Total de juros pago | **Menor** | **Maior** |
| 1ª prestação | Maior | Menor |
| Uso típico | Imóveis | Veículos, crédito pessoal |

> **Dica de prova**: no Price, a amortização de um período = amortização do período anterior × (1+i). É uma progressão geométrica!
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 5 — ANÁLISE DE INVESTIMENTOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Análise de Investimentos",
    slug: "analise-investimentos",
    descricao: "Como decidir se um investimento vale a pena. VPL, TIR, Payback e desconto comercial de títulos.",
    ordem: 5,
    topicos: [
      {
        titulo: "VPL, TIR e Payback",
        slug: "vpl-tir-payback",
        ordem: 1,
        resumo: "O VPL traz todos os fluxos futuros a valor presente e subtrai o investimento inicial — VPL positivo significa viabilidade. A TIR é a taxa que zera o VPL: se TIR > TMA, aceita o projeto. Payback é o tempo de retorno do investimento.",
        conteudo: `# VPL, TIR e Payback — Análise de Investimentos

## VPL — Valor Presente Líquido

**Conceito**: traz todos os fluxos de caixa futuros a valor presente, utilizando a taxa mínima de atratividade (TMA), e subtrai o investimento inicial.

$$VPL = -I_0 + \sum_{t=1}^{n} \frac{FC_t}{(1+TMA)^t}$$

### Regra de decisão

| VPL | Decisão |
|-----|---------|
| **VPL > 0** | Aceitar — o projeto gera valor acima da TMA |
| **VPL = 0** | Indiferente — remunera exatamente a TMA |
| **VPL < 0** | Rejeitar — o projeto destrói valor |

**Exemplo**: Investimento de R$ 10.000. Recebe R$ 4.000 por ano durante 3 anos. TMA = 10% a.a.

VPL = −10.000 + 4.000/(1,1) + 4.000/(1,1)² + 4.000/(1,1)³
VPL = −10.000 + 3.636,36 + 3.305,79 + 3.005,26 = **−R$ 52,59**

Como VPL < 0: **rejeitar**. (Por pouquíssimo — se a TMA fosse 9,9% seria viável.)

## TIR — Taxa Interna de Retorno

**Conceito**: é a taxa de desconto que torna o **VPL = 0**. Representa o rendimento real do projeto.

### Regra de decisão

| Comparação | Decisão |
|-----------|---------|
| **TIR > TMA** | Aceitar |
| **TIR = TMA** | Indiferente |
| **TIR < TMA** | Rejeitar |

> A TIR não tem fórmula fechada simples — é calculada por tentativa e erro ou pela HP-12C (tecla IRR).

## Payback Simples

Tempo necessário para recuperar o investimento inicial, sem considerar o valor do dinheiro no tempo.

$$Payback = \frac{I_0}{FC_{médio}}$$

**Exemplo**: Investimento de R$ 12.000, fluxo de caixa de R$ 3.000/ano.
- Payback = 12.000 ÷ 3.000 = **4 anos**

## Payback Descontado

Igual ao payback simples, mas os fluxos futuros são trazidos a valor presente antes de acumular. Mais preciso, pois considera o custo do tempo.

| Método | Considera valor do tempo? | Precisão |
|--------|--------------------------|----------|
| Payback simples | Não | Menor |
| Payback descontado | Sim | Maior |
| VPL | Sim | Maior |
| TIR | Sim | Maior |
`,
      },
      {
        titulo: "Desconto Comercial de Títulos e Inflação",
        slug: "desconto-comercial-titulos-inflacao",
        ordem: 2,
        resumo: "Desconto comercial de títulos é muito cobrado em provas bancárias: PV = F × (1 − d × n). Inflação e índices (IPCA, IGPM, TR) entram nos cálculos de taxa real via Fórmula de Fisher.",
        conteudo: `# Desconto Comercial de Títulos e Inflação

## Desconto Comercial (Bancário) — Revisão Aplicada

Muito cobrado em provas de concurso bancário. Um título com **valor de face (F)** descontado a uma taxa **d** por **n** períodos:

$$PV = F \times (1 - d \times n)$$

**Exemplo**: Cheque de R$ 5.000 descontado no banco 45 dias antes do vencimento. Taxa de desconto: 3% ao mês (considerando mês de 30 dias → n = 45/30 = 1,5 mês).

PV = 5.000 × (1 − 0,03 × 1,5) = 5.000 × 0,955 = **R$ 4.775,00**

O banco antecipa R$ 4.775 e fica com R$ 225 de desconto.

## Taxa de Juros Implícita no Desconto Comercial

O desconto comercial gera uma **taxa de juros efetiva** diferente da taxa de desconto declarada — e sempre maior.

$$i = \frac{d}{1 - d \times n}$$

**Exemplo**: d = 3% ao mês, n = 1 mês.
- i = 0,03 ÷ (1 − 0,03 × 1) = 0,03 ÷ 0,97 = **3,093% ao mês**

A taxa de juros efetiva (3,093%) é maior que a taxa de desconto (3%).

## Inflação e Índices Relevantes

### IPCA — Índice Nacional de Preços ao Consumidor Amplo
- Calculado pelo **IBGE**
- Mede a variação de preços para famílias com renda de 1 a 40 salários mínimos
- É o **índice oficial de inflação** do Brasil
- Base da meta de inflação do Banco Central

### IGPM — Índice Geral de Preços do Mercado
- Calculado pela **FGV**
- Composto por IPA (atacado, 60%) + IPC (consumidor, 30%) + INCC (construção, 10%)
- Mais usado em contratos de aluguel e energia

### TR — Taxa Referencial
- Calculada pelo **Banco Central**
- Usada na correção de depósitos do FGTS e financiamentos imobiliários pela Caixa
- Hoje mantida próxima de zero

### Aplicando a Inflação: Fórmula de Fisher

$$r = \frac{(1 + i)}{(1 + \pi)} - 1$$

**Exemplo**: Poupança rendeu 6% ao ano; IPCA foi 4,5%.
- r = (1,06 ÷ 1,045) − 1 = 1,01435 − 1 = **1,435% ao ano (taxa real)**

A poupança teve rendimento real positivo, mas pequeno.
`,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════
const quizData = [
  // Bloco 1 — Juros Simples
  {
    blocoSlug: "juros-simples",
    topicoSlug: "conceitos-juros-simples",
    pergunta: "Um capital de R$ 8.000 é aplicado por 9 meses a uma taxa de juros simples de 2% ao mês. Qual é o montante ao final do período?",
    opcoes: [
      "R$ 8.160,00",
      "R$ 9.440,00",
      "R$ 9.600,00",
      "R$ 8.960,00",
    ],
    respostaCorreta: 1,
    explicacao: "M = C × (1 + i × n) = 8.000 × (1 + 0,02 × 9) = 8.000 × 1,18 = R$ 9.440,00. Os juros são J = 8.000 × 0,02 × 9 = R$ 1.440,00.",
  },
  {
    blocoSlug: "juros-simples",
    topicoSlug: "conceitos-juros-simples",
    pergunta: "No regime de juros simples, qual é a taxa mensal equivalente a uma taxa anual de 18%?",
    opcoes: [
      "1,5% ao mês (proporcionalidade: 18 ÷ 12)",
      "1,388% ao mês (equivalência por potenciação)",
      "2% ao mês (proporcionalidade: 18 ÷ 9)",
      "1,54% ao mês (equivalência composta)",
    ],
    respostaCorreta: 0,
    explicacao: "No regime SIMPLES, as taxas são proporcionais. Portanto, a taxa mensal = 18% ÷ 12 = 1,5% ao mês. A equivalência por potenciação só se aplica no regime composto.",
  },
  {
    blocoSlug: "juros-simples",
    topicoSlug: "desconto-simples",
    pergunta: "Um título de R$ 20.000 vence em 4 meses. O banco oferece desconto comercial de 3% ao mês. Qual o valor recebido hoje?",
    opcoes: [
      "R$ 17.600,00",
      "R$ 17.796,80",
      "R$ 18.400,00",
      "R$ 19.400,00",
    ],
    respostaCorreta: 2,
    explicacao: "Desconto comercial: PV = N × (1 − d × n) = 20.000 × (1 − 0,03 × 4) = 20.000 × 0,88 = R$ 17.600,00. Atenção: R$ 18.400 seria com desconto racional (PV = N ÷ (1 + i × n) = 20.000 ÷ 1,12 ≈ R$ 17.857). O desconto comercial resulta em R$ 17.600.",
  },
  // Bloco 2 — Juros Compostos
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "juros-compostos-formula-equivalencia",
    pergunta: "R$ 5.000 são aplicados por 2 anos a juros compostos de 10% ao ano. Qual o montante?",
    opcoes: [
      "R$ 6.000,00 (juros simples)",
      "R$ 6.050,00 (juros compostos)",
      "R$ 6.500,00",
      "R$ 5.500,00",
    ],
    respostaCorreta: 1,
    explicacao: "M = C × (1+i)ⁿ = 5.000 × (1,10)² = 5.000 × 1,21 = R$ 6.050,00. No regime simples seria 5.000 × (1 + 0,10 × 2) = R$ 6.000. A diferença (R$ 50) são os juros sobre juros do 2º ano.",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "juros-compostos-formula-equivalencia",
    pergunta: "Qual taxa anual é equivalente a 1% ao mês no regime de juros compostos?",
    opcoes: [
      "12% ao ano (proporcional)",
      "12,68% ao ano (equivalência composta)",
      "11,36% ao ano",
      "13% ao ano",
    ],
    respostaCorreta: 1,
    explicacao: "(1 + i_mensal)¹² = (1 + i_anual) → (1,01)¹² = 1,12682... → i_anual = 12,68% ao ano. O erro clássico é responder 12% (proporcionalidade simples), que é incorreto no regime composto.",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "taxa-nominal-efetiva-real",
    pergunta: "Um CDB oferece taxa nominal de 24% ao ano com capitalização mensal. Qual a taxa efetiva anual?",
    opcoes: [
      "24% ao ano (igual à nominal)",
      "24,00% ao ano",
      "26,82% ao ano",
      "22,13% ao ano",
    ],
    respostaCorreta: 2,
    explicacao: "Taxa mensal = 24% ÷ 12 = 2% ao mês. Taxa efetiva anual = (1,02)¹² − 1 = 1,2682 − 1 = 26,82% ao ano. A taxa efetiva sempre supera a nominal quando a capitalização é mais frequente que o período da taxa.",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "taxa-nominal-efetiva-real",
    pergunta: "Uma aplicação rendeu 8% ao ano. A inflação no período foi de 5%. Qual foi a taxa de juros real, pela Fórmula de Fisher?",
    opcoes: [
      "3% ao ano (subtração direta: 8% − 5%)",
      "2,86% ao ano (Fórmula de Fisher)",
      "3,5% ao ano",
      "4,2% ao ano",
    ],
    respostaCorreta: 1,
    explicacao: "Pela Fórmula de Fisher: r = (1,08 ÷ 1,05) − 1 = 1,02857 − 1 = 2,857% ≈ 2,86% ao ano. A subtração direta (3%) é uma aproximação que dá erro. A banca costuma aceitar ambas, mas a fórmula exata resulta em 2,86%.",
  },
  // Bloco 3 — Anuidades
  {
    blocoSlug: "anuidades",
    topicoSlug: "anuidades-vp-vf",
    pergunta: "Qual é a diferença entre anuidade vencida e anuidade antecipada?",
    opcoes: [
      "Vencida: pagamento no início do período. Antecipada: pagamento no final.",
      "Vencida: pagamento no final do período (mais comum). Antecipada: pagamento no início.",
      "São termos diferentes para o mesmo conceito.",
      "Vencida se aplica só a financiamentos; antecipada só a investimentos.",
    ],
    respostaCorreta: 1,
    explicacao: "Anuidade vencida (ou ordinária): pagamento no fim de cada período — é a forma mais comum (financiamentos em geral). Anuidade antecipada: pagamento no início de cada período — exemplo clássico é o aluguel (paga-se antes de usar o imóvel).",
  },
  // Bloco 4 — Sistemas de Amortização
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "sac",
    pergunta: "Em um financiamento pelo SAC com 5 parcelas, capital de R$ 10.000 e taxa de 2% ao mês, qual é o valor da amortização em cada parcela?",
    opcoes: [
      "Varia a cada mês, crescendo progressivamente.",
      "R$ 2.000,00 (constante em todas as parcelas).",
      "R$ 2.163,45 (prestação constante como no Price).",
      "R$ 1.800,00 na primeira parcela.",
    ],
    respostaCorreta: 1,
    explicacao: "No SAC (Sistema de Amortização Constante), a amortização é sempre igual: A = C ÷ n = 10.000 ÷ 5 = R$ 2.000,00. O que varia é a parcela total (juros + amortização), que decresce porque os juros caem à medida que o saldo devedor diminui.",
  },
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "price",
    pergunta: "Na Tabela Price, por que a parcela é constante enquanto os juros diminuem ao longo do tempo?",
    opcoes: [
      "Porque a taxa de juros diminui a cada mês.",
      "Porque a amortização decresce para compensar os juros maiores.",
      "Porque a amortização cresce compensando os juros que decrescem — a soma (prestação) fica constante.",
      "Porque o saldo devedor aumenta com o tempo.",
    ],
    respostaCorreta: 2,
    explicacao: "Na Price, os juros calculados sobre o saldo devedor decrescem a cada parcela (pois o SD cai). Para manter a prestação constante, a parcela de amortização aumenta no mesmo valor em que os juros diminuem. É uma progressão geométrica de razão (1+i): amortização_k = amortização_1 × (1+i)^(k-1).",
  },
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "price",
    pergunta: "Comparando SAC e Price para o mesmo financiamento (mesmo capital, prazo e taxa), qual sistema gera maior pagamento total de juros?",
    opcoes: [
      "SAC, pois a primeira parcela é maior.",
      "Price, pois o saldo devedor cai mais lentamente — pagam-se mais juros ao longo do tempo.",
      "Ambos pagam o mesmo total de juros.",
      "Depende do prazo: para prazos curtos, o SAC paga mais; para longos, a Price.",
    ],
    respostaCorreta: 1,
    explicacao: "No SAC, o saldo devedor cai mais rapidamente (amortização constante desde o início), o que gera menor base de cálculo para os juros. Na Price, o saldo devedor cai mais devagar (amortizações menores no início), resultando em mais juros pagos no total.",
  },
  // Bloco 5 — Análise de Investimentos
  {
    blocoSlug: "analise-investimentos",
    topicoSlug: "vpl-tir-payback",
    pergunta: "Um projeto exige investimento inicial de R$ 50.000 e gera R$ 20.000 por ano por 3 anos. A TMA é 12% ao ano. O VPL é aproximadamente R$ −2.000. Qual a decisão correta?",
    opcoes: [
      "Aceitar, pois o VPL é próximo de zero.",
      "Rejeitar, pois o VPL é negativo — o projeto não remunera a TMA.",
      "Aceitar, pois o fluxo total (R$ 60.000) supera o investimento (R$ 50.000).",
      "Indiferente — qualquer decisão é igualmente válida.",
    ],
    respostaCorreta: 1,
    explicacao: "VPL negativo significa que os fluxos futuros, trazidos a valor presente pela TMA, não cobrem o investimento inicial. O projeto destrói valor — deve ser rejeitado. Somar fluxos nominais (R$ 60.000 vs R$ 50.000) sem trazer a VP é erro conceitual grave.",
  },
  {
    blocoSlug: "analise-investimentos",
    topicoSlug: "desconto-comercial-titulos-inflacao",
    pergunta: "Qual dos índices abaixo é o indicador oficial de inflação do Brasil, calculado pelo IBGE e usado como referência para a meta de inflação do Banco Central?",
    opcoes: [
      "IGPM — Índice Geral de Preços do Mercado",
      "INPC — Índice Nacional de Preços ao Consumidor",
      "IPCA — Índice Nacional de Preços ao Consumidor Amplo",
      "TR — Taxa Referencial",
    ],
    respostaCorreta: 2,
    explicacao: "O IPCA (calculado pelo IBGE) é o índice oficial de inflação do Brasil e a referência para o sistema de metas de inflação adotado pelo Banco Central desde 1999. O IGPM é calculado pela FGV e mais usado em contratos de aluguel. A TR é calculada pelo Banco Central e usada no FGTS.",
  },
];

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcardsData = [
  // Bloco 1 — Juros Simples
  {
    blocoSlug: "juros-simples",
    topicoSlug: "conceitos-juros-simples",
    frente: "Qual é a fórmula do montante em juros simples?",
    verso: "M = C × (1 + i × n), onde C = capital, i = taxa por período, n = número de períodos. Os juros são J = C × i × n e o montante é M = C + J.",
  },
  {
    blocoSlug: "juros-simples",
    topicoSlug: "conceitos-juros-simples",
    frente: "No regime simples, como se converte taxa mensal em taxa anual?",
    verso: "Por proporcionalidade: taxa anual = taxa mensal × 12. No regime simples as taxas são proporcionais (não equivalentes). Ex.: 1,5% ao mês = 18% ao ano.",
  },
  {
    blocoSlug: "juros-simples",
    topicoSlug: "desconto-simples",
    frente: "Qual é a diferença entre desconto comercial e desconto racional?",
    verso: "Comercial (por fora): desconto calculado sobre o valor futuro (nominal). PV = N × (1 − d × n). Racional (por dentro): desconto calculado sobre o valor presente. PV = N ÷ (1 + i × n). Para mesmos dados, desconto comercial > desconto racional.",
  },
  // Bloco 2 — Juros Compostos
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "juros-compostos-formula-equivalencia",
    frente: "Qual é a fórmula do montante em juros compostos?",
    verso: "M = C × (1 + i)ⁿ. No regime composto há juros sobre juros — o montante cresce exponencialmente. Para n = 1 período, simples e composto dão o mesmo resultado.",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "juros-compostos-formula-equivalencia",
    frente: "Como se calcula equivalência de taxas no regime composto?",
    verso: "Por potenciação: (1 + i₁)^n₁ = (1 + i₂)^n₂. Ex.: taxa anual equivalente a 1% ao mês = (1,01)¹² − 1 = 12,68% ao ano. Nunca use proporcionalidade (× 12) no regime composto!",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "taxa-nominal-efetiva-real",
    frente: "O que é taxa nominal e como ela difere da taxa efetiva?",
    verso: "Nominal: taxa declarada com capitalização em período diferente do referencial (ex.: 24% a.a. cap. mensal). Efetiva: taxa real após a capitalização. Converte-se dividindo a nominal pelo nº de capitalizações e aplicando (1 + i_período)^n − 1.",
  },
  {
    blocoSlug: "juros-compostos",
    topicoSlug: "taxa-nominal-efetiva-real",
    frente: "Qual é a Fórmula de Fisher e para que serve?",
    verso: "Relaciona taxa aparente, taxa real e inflação: (1 + i) = (1 + r) × (1 + π). Isolando a taxa real: r = [(1 + i) ÷ (1 + π)] − 1. Serve para calcular o rendimento real de uma aplicação descontada a inflação.",
  },
  // Bloco 3 — Anuidades
  {
    blocoSlug: "anuidades",
    topicoSlug: "anuidades-vp-vf",
    frente: "Qual é a fórmula do Valor Presente de uma anuidade vencida?",
    verso: "VP = PMT × [1 − (1 + i)^−n] ÷ i. Onde PMT = valor de cada parcela, i = taxa por período, n = número de parcelas. Responde: quanto vale hoje uma série de pagamentos futuros iguais?",
  },
  {
    blocoSlug: "anuidades",
    topicoSlug: "anuidades-vp-vf",
    frente: "Qual é a diferença entre anuidade vencida e antecipada?",
    verso: "Vencida: pagamento no FIM de cada período (padrão de financiamentos — mais cobrado). Antecipada: pagamento no INÍCIO de cada período (ex.: aluguel). O VP antecipado = VP vencido × (1 + i).",
  },
  // Bloco 4 — Sistemas de Amortização
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "sac",
    frente: "Como se calcula a amortização e a prestação no SAC?",
    verso: "Amortização constante: A = C ÷ n. Juros do período k: J_k = SD_{k−1} × i. Prestação k: P_k = A + J_k (decresce com o tempo). Saldo devedor: SD_k = SD_{k−1} − A.",
  },
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "price",
    frente: "Como se calcula a prestação constante na Tabela Price?",
    verso: "PMT = C × [i × (1 + i)^n] ÷ [(1 + i)^n − 1]. Cada linha: Juros = SD × i; Amortização = PMT − Juros; SD novo = SD − Amortização. A amortização cresce a cada período em progressão geométrica de razão (1+i).",
  },
  {
    blocoSlug: "sistemas-amortizacao",
    topicoSlug: "price",
    frente: "Qual sistema paga mais juros no total: SAC ou Price? Por quê?",
    verso: "Price paga mais juros totais. No SAC, o saldo devedor cai mais rápido (amortizações maiores desde o início), reduzindo a base de cálculo dos juros. Na Price, o saldo cai mais devagar (amortizações menores no começo), gerando mais juros acumulados.",
  },
  // Bloco 5 — Análise de Investimentos
  {
    blocoSlug: "analise-investimentos",
    topicoSlug: "vpl-tir-payback",
    frente: "Qual é a regra de decisão do VPL?",
    verso: "VPL > 0: aceitar (projeto gera valor acima da TMA). VPL = 0: indiferente. VPL < 0: rejeitar. O VPL desconta todos os fluxos futuros pela TMA e subtrai o investimento inicial.",
  },
  {
    blocoSlug: "analise-investimentos",
    topicoSlug: "vpl-tir-payback",
    frente: "O que é a TIR e como ela se relaciona com a TMA?",
    verso: "TIR (Taxa Interna de Retorno) é a taxa que torna VPL = 0. Regra: se TIR > TMA → aceitar; TIR < TMA → rejeitar. A TIR representa o rendimento real do projeto e é calculada iterativamente (HP-12C: tecla IRR).",
  },
  {
    blocoSlug: "analise-investimentos",
    topicoSlug: "desconto-comercial-titulos-inflacao",
    frente: "Quais são os três principais índices de inflação/correção e quem os calcula?",
    verso: "IPCA: calculado pelo IBGE — índice oficial de inflação, referência para meta do Banco Central. IGPM: calculado pela FGV — usado em contratos de aluguel e energia. TR: calculada pelo Banco Central — usada na correção do FGTS e financiamentos habitacionais.",
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Iniciando seed — Matemática Financeira...\n");

  const materia = await prisma.materia.upsert({
    where: { slug: "matematica-financeira" },
    update: {},
    create: {
      nome: "Matemática Financeira",
      slug: "matematica-financeira",
      descricao:
        "Juros simples e compostos, equivalência de taxas, anuidades, sistemas de amortização (SAC e Price) e análise de investimentos (VPL, TIR, Payback).",
      icone: "📊",
      cor: "amber",
      ordem: 4,
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
    console.log(`  ✅ Quiz: ${q.pergunta.slice(0, 60)}...`);
  }

  console.log("\n🃏 Inserindo flashcards...");
  for (const f of flashcardsData) {
    const topicoId = topicoMap[`${f.blocoSlug}::${f.topicoSlug}`];
    if (!topicoId) {
      console.warn(`  ⚠️  Tópico não encontrado: ${f.blocoSlug}::${f.topicoSlug}`);
      continue;
    }
    await prisma.flashcard.create({
      data: {
        frente: f.frente,
        verso: f.verso,
        topicoId,
      },
    });
    console.log(`  ✅ Flashcard: ${f.frente.slice(0, 60)}...`);
  }

  console.log("\n🎉 Seed de Matemática Financeira concluído com sucesso!");
  console.log(`   📦 ${blocos.length} blocos`);
  console.log(`   📄 ${blocos.reduce((acc, b) => acc + b.topicos.length, 0)} tópicos`);
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
