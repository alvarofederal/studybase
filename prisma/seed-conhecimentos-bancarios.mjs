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
  // BLOCO 1 — SISTEMA FINANCEIRO NACIONAL
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Sistema Financeiro Nacional",
    slug: "sistema-financeiro-nacional",
    descricao: "Quem manda em quem? Hierarquia, órgãos e funções do SFN.",
    ordem: 1,
    topicos: [
      {
        titulo: "Estrutura do SFN — Os 3 Níveis",
        slug: "estrutura-sfn-3-niveis",
        ordem: 1,
        resumo: "O SFN opera em três camadas: órgãos normativos definem regras, entidades supervisoras fiscalizam e operadores executam. Entender essa hierarquia resolve a maioria das questões.",
        conteudo: `# Estrutura do SFN — Os 3 Níveis

O **Sistema Financeiro Nacional (SFN)** é organizado em três níveis hierárquicos. Entender essa estrutura é o ponto de partida de Conhecimentos Bancários.

## 1. Órgãos Normativos (quem cria as regras)

| Órgão | Área de atuação |
|-------|----------------|
| **CMN** — Conselho Monetário Nacional | Moeda, crédito, câmbio, mercado de capitais |
| **CNSP** — Conselho Nacional de Seguros Privados | Seguros, previdência privada aberta, capitalização |
| **CNPC** — Conselho Nacional de Previdência Complementar | Fundos de pensão (entidades fechadas) |

## 2. Entidades Supervisoras (quem fiscaliza)

| Entidade | Subordinada a | Supervisiona |
|----------|---------------|-------------|
| **Banco Central (BCB)** | CMN | Bancos, cooperativas, instituições de pagamento |
| **CVM** | CMN | Mercado de valores mobiliários (bolsa, fundos) |
| **Susep** | CNSP | Seguradoras, resseguradoras, corretoras de seguro |
| **Previc** | CNPC | Entidades de previdência complementar fechada (EFPC) |

## 3. Operadores (quem executa)

Bancos comerciais, bancos de investimento, caixas econômicas, cooperativas de crédito, corretoras, distribuidoras, seguradoras, fundos de pensão, administradoras de consórcio etc.

## A lógica da hierarquia

> **CMN normatiza → BCB/CVM/Susep/Previc supervisionam → Operadores executam**

Nenhum órgão normativo fiscaliza diretamente o mercado. O CMN nunca pune um banco — quem pune é o Banco Central.

> 💡 **Ponto de prova:** A confusão mais comum é atribuir funções do CMN ao Banco Central e vice-versa. O CMN **define a política**. O BCB **executa e fiscaliza**.`,
      },
      {
        titulo: "CMN — Conselho Monetário Nacional",
        slug: "cmn-conselho-monetario-nacional",
        ordem: 2,
        resumo: "O CMN é o órgão máximo normativo do SFN. Não executa, não fiscaliza — apenas normatiza. Composto por Ministro da Fazenda, Ministro do Planejamento e Presidente do Banco Central.",
        conteudo: `# CMN — Conselho Monetário Nacional

O **Conselho Monetário Nacional (CMN)** é o órgão de cúpula do SFN. Sua função é **normativa** — cria as regras que todos os demais devem seguir.

## Composição

- **Ministro da Fazenda** (presidente do CMN)
- **Ministro do Planejamento e Orçamento**
- **Presidente do Banco Central do Brasil**

> O CMN **não tem presidente próprio**. Quem preside é o Ministro da Fazenda.

## Principais competências

- Fixar as **diretrizes da política monetária, cambial e de crédito**
- Regular o **valor externo da moeda** (câmbio)
- Zelar pela **liquidez e solvência** das instituições financeiras
- Regular a **constituição e funcionamento** de instituições financeiras
- Determinar as **taxas de recolhimento compulsório**
- Aprovar o **orçamento monetário** preparado pelo BCB

## O que o CMN NÃO faz

- **Não fiscaliza** nenhuma instituição diretamente
- **Não emite** moeda (isso é o BCB)
- **Não intervém** em bancos (isso é o BCB)
- **Não pune** instituições financeiras

## Secretaria Executiva

O CMN é assessorado pelo **Comef** (Comitê de Estabilidade Financeira) e pelo **Comoc** (Comitê de Organização e Regulação Financeira).

> 💡 **Mnemônico para prova:** CMN = **C**ria, **M**anda, **N**ormatiza. Nunca executa.`,
      },
      {
        titulo: "Banco Central do Brasil — Funções",
        slug: "banco-central-funcoes",
        ordem: 3,
        resumo: "O BCB tem 4 funções essenciais: emissor de moeda, banco dos bancos, gestor das reservas internacionais e executor da política monetária. É autarquia federal vinculada ao CMN.",
        conteudo: `# Banco Central do Brasil — Funções

O **Banco Central do Brasil (BCB)** é a principal entidade supervisora do SFN. É uma **autarquia federal** vinculada ao CMN, com sede em Brasília.

## As 4 Grandes Funções

### 1. Emissor de moeda
- Única entidade autorizada a **emitir papel-moeda e moeda metálica** no Brasil
- Controla a quantidade de dinheiro em circulação

### 2. Banco dos bancos
- Emprestador de última instância (redesconto)
- Recebe o recolhimento compulsório dos bancos
- Compra e vende títulos públicos (open market)

### 3. Gestor das Reservas Internacionais
- Administra as **reservas em moeda estrangeira** do Brasil
- Executa a política cambial definida pelo CMN

### 4. Executor da Política Monetária
- Implementa as decisões do **Copom** (Comitê de Política Monetária)
- Define a **taxa Selic meta**
- Usa os instrumentos: compulsório, redesconto, open market

## Outras competências relevantes

- **Autorizar** e **fiscalizar** o funcionamento de instituições financeiras
- Aplicar **penalidades** (advertência, multa, intervenção, liquidação extrajudicial)
- **Gerir o SPI** (Sistema de Pagamentos Instantâneos) — a infraestrutura do Pix
- Administrar a dívida pública **mobiliária federal interna** (junto ao Tesouro Nacional)

## Estrutura de Governança (desde 2021)

O BCB tem **autonomia operacional** desde a Lei 179/2021 — o presidente e diretores têm mandatos fixos e não podem ser demitidos por razões políticas.

> 💡 **Ponto crítico:** O BCB **fiscaliza e pune** bancos. O CMN apenas **normatiza**. Confundir os dois derruba questões em todo concurso.`,
      },
      {
        titulo: "CVM, Susep e Previc",
        slug: "cvm-susep-previc",
        ordem: 4,
        resumo: "CVM supervisiona o mercado de capitais (bolsa, fundos). Susep cuida de seguros e previdência privada aberta. Previc fiscaliza os fundos de pensão (previdência fechada).",
        conteudo: `# CVM, Susep e Previc

## CVM — Comissão de Valores Mobiliários

**O que supervisiona:** mercado de valores mobiliários — ações, debêntures, cotas de fundos, BDRs, derivativos.

**Vinculada ao:** CMN

**Principais atribuições:**
- Regulamentar e fiscalizar a **emissão e negociação** de valores mobiliários
- Proteger os **investidores** contra fraudes e irregularidades
- Assegurar o **funcionamento eficiente da B3**
- Credenciar e supervisionar **auditores, analistas e consultores**

> A CVM é para o mercado de capitais o que o BCB é para o sistema bancário.

## Susep — Superintendência de Seguros Privados

**O que supervisiona:** seguros privados, resseguros, previdência **aberta** (PGBL, VGBL), capitalização.

**Vinculada ao:** CNSP

**Principais atribuições:**
- Autorizar o funcionamento de **seguradoras e resseguradoras**
- Fiscalizar as condições das **apólices**
- Proteger os **segurados**

> 📌 Previdência **aberta** (vendida em bancos para qualquer pessoa) = Susep. Previdência **fechada** (fundo de pensão de empresa) = Previc.

## Previc — Superintendência Nacional de Previdência Complementar

**O que supervisiona:** **entidades fechadas** de previdência complementar (EFPC) — fundos de pensão de empresas (ex: Previ/BB, Funcef/CEF, Petros/Petrobras).

**Vinculada ao:** CNPC

**Principais atribuições:**
- Autorizar e fiscalizar as EFPC
- Proteger os **participantes e beneficiários** dos fundos de pensão

## Quadro-resumo rápido

| Entidade | Supervisiona | Vinculada a |
|----------|-------------|-------------|
| **BCB** | Bancos, cooperativas, IPs | CMN |
| **CVM** | Mercado de capitais | CMN |
| **Susep** | Seguros, previdência aberta | CNSP |
| **Previc** | Fundos de pensão (EFPC) | CNPC |

> 💡 **Dica de prova:** Questões adoram trocar Susep por Previc e vice-versa. O critério é simples: **aberta** (banco, qualquer pessoa) = Susep. **Fechada** (empresa específica) = Previc.`,
      },
      {
        titulo: "Instituições Operadoras — Bancos, BB, CEF e Cooperativas",
        slug: "instituicoes-operadoras-sfn",
        ordem: 5,
        resumo: "Bancos comerciais captam à vista e emprestam curto prazo. Bancos de investimento focam em longo prazo, sem captar à vista. Banco do Brasil é agente financeiro do governo federal. CEF tem exclusividade no penhor, no FGTS e nas loterias. Cooperativas atendem só associados, sem fins lucrativos.",
        conteudo: `# Instituições Operadoras — Bancos, BB, CEF e Cooperativas

As instituições operadoras estão no **3º nível do SFN**. São elas que fazem o dinheiro circular na economia real. Todas são fiscalizadas pelo BCB.

## Tipos de Bancos

### Banco Comercial
- Foco: **operações de curto e médio prazo**
- **Capta depósitos à vista** (conta corrente) — isso é exclusividade importante
- Concede crédito pessoal, CDC, cheque especial, desconto de duplicatas
- É a única instituição que pode captar depósitos à vista além das caixas econômicas e cooperativas

### Banco de Investimento
- Foco: **financiamento de longo prazo** para empresas
- **NÃO capta depósitos à vista** — não tem conta corrente convencional
- Opera com: underwriting (emissão de ações/debêntures), repasses do BNDES, project finance, fusões e aquisições
- Não tem rede de varejo (agências para o público geral)

### Banco Múltiplo
- Reúne **pelo menos 2 carteiras** em uma única pessoa jurídica (ex: carteira comercial + investimento + câmbio + crédito imobiliário)
- Exige que uma das carteiras seja **comercial ou de investimento**
- A maioria dos grandes bancos brasileiros são múltiplos: BB, Bradesco, Itaú, Santander, CEF

### Banco de Desenvolvimento
- Foco: **desenvolvimento econômico regional/nacional** de longo prazo
- Principal exemplo: **BNDES** — não atende o público diretamente
- Financia projetos de infraestrutura, inovação, exportações

## Instituições Especiais — o que mais cai em prova

### Banco do Brasil (BB)
O BB tem papel **híbrido**: banco comercial + agente do governo federal.
- Banco múltiplo com carteira comercial
- **Agente financeiro do governo federal:** arrecada tributos federais, paga salários de servidores, opera o câmbio do Tesouro
- Principal operador do **crédito rural** no Brasil
- Executa políticas do governo federal em áreas como agronegócio e comércio exterior

### Caixa Econômica Federal (CEF)
A CEF é voltada para habitação, poupança popular e programas sociais.
- Banco múltiplo com carteira comercial
- **Gestora exclusiva do FGTS** — só a CEF administra
- **Exclusividade no penhor** — único banco que pode conceder empréstimo com garantia de bem pessoal (joias, relógios etc.)
- Principal agente do crédito **habitacional** (Minha Casa Minha Vida, SFH)
- Operadora das **loterias federais** (Mega-Sena, Lotofácil, Quina)
- Atende beneficiários de programas sociais (Bolsa Família, BPC)

| Exclusividade | CEF | BB |
|--------------|-----|----|
| FGTS | ✅ Sim | ❌ Não |
| Penhor | ✅ Sim | ❌ Não |
| Loterias federais | ✅ Sim | ❌ Não |
| Crédito rural principal | ❌ Não | ✅ Sim |
| Agente financeiro federal | Parcial | ✅ Principal |

## Cooperativas de Crédito

- Sistema **fechado**: atendem apenas seus **associados** (funcionários de uma empresa, profissionais de uma área, moradores de uma região)
- **Sem fins lucrativos** — sobras são distribuídas proporcionalmente entre os associados
- Podem captar depósitos à vista de seus associados
- Reguladas e fiscalizadas pelo **BCB**
- Principais sistemas: **Sicoob, Sicredi, Unicred, Cresol**
- Diferença crucial para banco: na cooperativa, o associado é **dono e cliente ao mesmo tempo** — vota nas decisões e recebe as sobras

## A B3

A **B3 — Brasil, Bolsa, Balcão** é a bolsa de valores brasileira (resultado da fusão BM&F + Bovespa):
- Ambiente de negociação eletrônica de ações, títulos e derivativos
- Câmara de compensação e liquidação (garante as operações)
- Autorreguladora — mas sujeita à supervisão da **CVM**

## Quadro-Resumo Final

| Instituição | Capta à vista? | Atende | Diferencial principal |
|------------|:---:|--------|----------------------|
| Banco Comercial | ✅ | Geral | Crédito curto prazo |
| Banco de Investimento | ❌ | Empresas | Longo prazo, underwriting |
| Banco Múltiplo | ✅ | Geral/empresas | Várias carteiras numa CNPJ |
| BB | ✅ | Geral + governo | Agente do governo, crédito rural |
| CEF | ✅ | Geral + social | FGTS, penhor, loterias, habitação |
| Cooperativa de Crédito | ✅ | Só associados | Sem fins lucrativos |
| BNDES | ❌ | Empresas/projetos | Desenvolvimento econômico |

> 💡 **Para a prova:** BB e CEF são os mais cobrados em concursos bancários. Memorize as exclusividades: **CEF = penhor + FGTS + loterias**. **BB = agente financeiro federal + crédito rural**. Banco de investimento **nunca capta à vista**.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 2 — BANCO CENTRAL E POLÍTICA MONETÁRIA
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Banco Central e Política Monetária",
    slug: "banco-central-politica-monetaria",
    descricao: "Como o Estado controla a economia pelo dinheiro? Selic, compulsório, open market e redesconto.",
    ordem: 2,
    topicos: [
      {
        titulo: "Taxa Selic — O Termostato da Economia",
        slug: "taxa-selic",
        ordem: 1,
        resumo: "A Selic é a taxa básica de juros da economia. O Copom se reúne a cada 45 dias para defini-la. Selic alta contém inflação mas freia o crescimento. Selic baixa estimula mas pode gerar inflação.",
        conteudo: `# Taxa Selic — O Termostato da Economia

A **taxa Selic** (Sistema Especial de Liquidação e Custódia) é a **taxa básica de juros** da economia brasileira. É o principal instrumento de política monetária do Banco Central.

## O que é tecnicamente

A Selic é a taxa média das operações de **empréstimos de um dia** (overnight) entre bancos, lastreadas em **títulos públicos federais**, registradas no Selic.

- **Selic meta:** a taxa definida pelo Copom (política monetária)
- **Selic over:** a taxa efetivamente praticada no mercado (muito próxima à meta)

## O Copom

O **Comitê de Política Monetária (Copom)** reúne-se **a cada 45 dias** para decidir a Selic meta. É composto pelo Presidente do BCB e pelos 8 Diretores.

O Brasil adota o regime de **metas de inflação** — o Copom usa a Selic para fazer a inflação (IPCA) convergir para a meta fixada pelo CMN.

## A lógica do termostato

| Situação | Ação do Copom | Efeito |
|----------|---------------|--------|
| Inflação alta | **Sobe** a Selic | Crédito fica caro → consumo cai → inflação recua |
| Economia fraca | **Baixa** a Selic | Crédito fica barato → consumo sobe → economia aquece |

## Impacto nos investimentos

- Selic alta → melhor remuneração em **renda fixa** (CDB, Tesouro Selic)
- Selic baixa → renda fixa perde atratividade → investidor migra para **renda variável**

> 💡 **Erro clássico de iniciante:** "Selic alta é sempre ruim." Errado. Para quem investe em renda fixa, Selic alta é ótima. O BCB usa a Selic como **termostato**, não como punição.`,
      },
      {
        titulo: "Depósito Compulsório",
        slug: "deposito-compulsorio",
        ordem: 2,
        resumo: "O compulsório é o percentual dos depósitos que os bancos são obrigados a recolher ao Banco Central. É instrumento de controle da liquidez e da criação de moeda pelo sistema bancário.",
        conteudo: `# Depósito Compulsório

O **depósito compulsório** (ou recolhimento compulsório) é a fração dos depósitos captados pelos bancos que deve ser **recolhida obrigatoriamente ao Banco Central**, ficando indisponível para empréstimos.

## Como funciona

Se um banco capta R$ 1.000 em depósitos e o compulsório é 20%, ele deve depositar R$ 200 no BCB. Só pode emprestar os R$ 800 restantes.

## Quem define?

O **CMN** determina as alíquotas (percentuais). O **BCB** operacionaliza o recolhimento.

## Efeito na economia

| Ação | Efeito |
|------|--------|
| **Aumentar** o compulsório | Menos dinheiro disponível → **contrai** o crédito e a inflação |
| **Reduzir** o compulsório | Mais dinheiro disponível → **expande** o crédito e a economia |

## Tipos de depósitos e compulsório

- **Depósitos à vista** (conta corrente): alíquota mais alta
- **Depósitos a prazo** (CDB, RDB): alíquota menor ou zero
- **Poupança**: regulamentação própria

## Multiplicador bancário

O compulsório controla o **efeito multiplicador do crédito**. Sem compulsório, um depósito de R$ 100 poderia gerar infinitos empréstimos. Com compulsório de 20%, o multiplicador é 5 (1/0,20).

> 💡 **Para a prova:** O compulsório é o instrumento mais **direto** de controle da liquidez. Diferente da Selic (que age via incentivo de preço), o compulsório **obriga** o banco a recolher. É mais brusco e usado em situações extremas.`,
      },
      {
        titulo: "Open Market e Redesconto",
        slug: "open-market-redesconto",
        ordem: 3,
        resumo: "Open market: BCB compra/vende títulos públicos para regular a liquidez diariamente. Redesconto: empréstimo de última instância do BCB aos bancos. Juntos com o compulsório, formam os 3 instrumentos de política monetária.",
        conteudo: `# Open Market e Redesconto

## Operações de Mercado Aberto (Open Market)

É o instrumento mais **ágil** de política monetária. O BCB compra e vende **títulos públicos federais** no mercado para ajustar a liquidez diariamente.

### Como funciona

| Operação | Ação do BCB | Efeito |
|----------|-------------|--------|
| **Expansionista** | Compra títulos dos bancos | Injeta dinheiro no sistema → liquidez aumenta |
| **Contracionista** | Vende títulos para os bancos | Retira dinheiro do sistema → liquidez diminui |

### Por que é o mais usado?

- **Velocidade:** pode ser realizado diariamente
- **Precisão:** permite ajustes finos no volume de moeda
- **Reversibilidade:** fácil de desfazer a operação

## Redesconto (Empréstimo de Última Instância)

É quando o **BCB empresta dinheiro a bancos** com problemas temporários de liquidez. O banco entrega títulos como garantia e recebe recursos — o BCB cobra a **taxa de redesconto**.

### Lógica do redesconto

- Se a taxa de redesconto estiver **acima da Selic**, os bancos preferem buscar recursos no interbancário
- Se precisarem do BCB é porque não conseguiram no mercado — sinal de estresse
- O redesconto evita **corridas bancárias** e **contágio sistêmico**

### Papel sistêmico

O redesconto é a principal razão pela qual o BCB é chamado de **"banco dos bancos"** — ele é o emprestador de última instância de todo o sistema.

## Os 3 Instrumentos — Comparação

| Instrumento | Velocidade | Uso típico |
|-------------|-----------|------------|
| **Open market** | Diário | Ajuste fino da liquidez |
| **Compulsório** | Semanas | Controle estrutural do crédito |
| **Redesconto** | Instantâneo | Emergência de um banco específico |

> 💡 **Para a prova:** O BCB usa **open market** no dia a dia para manter a Selic na meta. O **compulsório** é mais poderoso mas menos preciso. O **redesconto** é para crises pontuais.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 3 — PRODUTOS E SERVIÇOS BANCÁRIOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Produtos e Serviços Bancários",
    slug: "produtos-servicos-bancarios",
    descricao: "O que os bancos vendem? Captação, crédito, serviços, seguros e previdência.",
    ordem: 3,
    topicos: [
      {
        titulo: "Captação — CDB, LCI, LCA e Poupança",
        slug: "captacao-cdb-lci-lca-poupanca",
        ordem: 1,
        resumo: "CDB, LCI e LCA são renda fixa emitidos por bancos. A diferença crucial: LCI e LCA são isentos de IR para pessoa física. Poupança tem regra de remuneração própria vinculada à Selic.",
        conteudo: `# Captação — CDB, LCI, LCA e Poupança

Os bancos captam recursos dos clientes para depois emprestá-los com juros maiores. Os principais instrumentos de captação de varejo são:

## CDB — Certificado de Depósito Bancário

- Emissor: **bancos comerciais, múltiplos e de investimento**
- Remuneração: prefixada, pós-fixada (% do CDI) ou híbrida (IPCA + taxa)
- **IR:** progressivo por prazo (22,5% até 180 dias → 15% acima de 720 dias)
- Garantia: **FGC** cobre até R$ 250 mil por CPF por instituição
- Liquidez: geralmente no vencimento (pode haver CDB com liquidez diária)

## LCI — Letra de Crédito Imobiliário

- Emissor: instituições financeiras autorizadas pelo BCB
- **Lastro:** créditos imobiliários
- **IR: isento para pessoa física** (grande diferença do CDB)
- Garantia: **FGC** cobre até R$ 250 mil
- Carência mínima: 90 dias

## LCA — Letra de Crédito do Agronegócio

- Emissor: instituições financeiras
- **Lastro:** créditos do agronegócio
- **IR: isento para pessoa física** (igual à LCI)
- Garantia: **FGC** cobre até R$ 250 mil
- Carência mínima: 90 dias

## Poupança

- Emissor: bancos e caixas econômicas
- Remuneração:
  - Se Selic > 8,5% a.a.: **TR + 0,5% a.m.** (≈ 6,17% a.a.)
  - Se Selic ≤ 8,5% a.a.: **70% da Selic + TR**
- **IR: isento para pessoa física**
- Garantia: **FGC** cobre até R$ 250 mil
- Liquidez: no "aniversário" da aplicação (mensal)

## Comparativo rápido

| Produto | Emissor | IR (PF) | FGC | Liquidez |
|---------|---------|---------|-----|---------|
| CDB | Bancos | Sim | Sim | Vencimento |
| LCI | Bancos | **Isento** | Sim | Carência 90d |
| LCA | Bancos | **Isento** | Sim | Carência 90d |
| Poupança | Bancos | **Isento** | Sim | Mensal |

> 💡 **Erro clássico:** "LCI e LCA são mais rentáveis que CDB." Depende. A isenção de IR pode torná-las mais vantajosas, mas é preciso comparar a taxa bruta equivalente. Um CDB a 110% do CDI pode render mais que uma LCI a 85% do CDI após o IR.`,
      },
      {
        titulo: "Crédito — Tipos e Características",
        slug: "credito-tipos-caracteristicas",
        ordem: 2,
        resumo: "O crédito bancário vai do cheque especial (mais caro) ao consignado (mais barato). CDC, leasing financeiro e operacional, crédito imobiliário e rural têm regras distintas.",
        conteudo: `# Crédito — Tipos e Características

Os bancos emprestam dinheiro de diversas formas. As taxas variam muito dependendo do risco para o banco.

## Hierarquia de custo do crédito (do mais caro ao mais barato)

1. **Cheque especial** — crédito automático pré-aprovado na conta corrente. Taxas altíssimas (regulamentadas desde 2020 em até 8% a.m.).
2. **Cartão de crédito rotativo** — quando não paga o total da fatura. Teto de 100% da dívida em juros desde 2017.
3. **Crédito pessoal** — empréstimo sem garantia, taxa menor que cheque especial.
4. **CDC** (Crédito Direto ao Consumidor) — para compra de bens. O bem pode ser a garantia.
5. **Leasing** — arrendamento mercantil com opção de compra ao final.
6. **Crédito consignado** — desconto em folha de pagamento/benefício. Taxa mais baixa do crédito pessoal (menor risco de inadimplência).
7. **Crédito imobiliário** — prazo longo, imóvel como garantia (alienação fiduciária). SFH e SFI.

## Leasing — Financeiro vs. Operacional

| | Leasing Financeiro | Leasing Operacional |
|--|-------------------|---------------------|
| Objetivo | **Comprar** ao final | **Usar** (devolve ao final) |
| Opção de compra | Sim, pelo **valor residual** | Não obrigatória |
| Quem mantém o bem | Arrendatário | Arrendador |
| Exemplo | Carro com plano de compra | Frota de veículos corporativos |

## Crédito Consignado — Por que é mais barato?

O banco debita a parcela **diretamente da folha** antes de o dinheiro chegar ao trabalhador. Risco de inadimplência ≈ zero. Por isso, a taxa é a menor do crédito pessoal.

> 💡 **Para a prova:** questões sobre consignado normalmente testam: quem pode contratar (CLT, aposentados INSS, servidores), o limite de comprometimento da renda (geralmente 35% do salário líquido) e as taxas reguladas.`,
      },
      {
        titulo: "Serviços Bancários — Pix, TED, DOC e Câmbio",
        slug: "servicos-bancarios-pix-ted-doc-cambio",
        ordem: 3,
        resumo: "Pix operado pelo BCB (SPI), 24/7, gratuito para PF. TED via STR, mesmo dia útil, até 17h. DOC só até R$ 4.999,99, liquidação D+1. Câmbio: compra e venda de moeda estrangeira regulada pelo BCB.",
        conteudo: `# Serviços Bancários — Pix, TED, DOC e Câmbio

## Pix

- **Operador:** Banco Central (via SPI — Sistema de Pagamentos Instantâneos)
- **Disponibilidade:** 24/7/365, incluindo feriados
- **Custo:** gratuito para **pessoa física** por determinação regulatória
- **Limite:** definido pela instituição (com limites noturnos obrigatórios)
- **Chaves:** CPF/CNPJ, e-mail, telefone ou chave aleatória
- O Pix **não é TED rápido** — tem infraestrutura própria do BCB

## TED — Transferência Eletrônica Disponível

- **Liquidação:** mesmo dia útil (D+0), se enviada até o horário limite (~17h)
- **Infraestrutura:** STR (Sistema de Transferência de Reservas) — do BCB
- **Valor:** sem limite mínimo ou máximo regulatório (cada banco define)
- **Custo:** pode ser cobrado (TED tem tarifa, diferente do Pix)
- Funciona apenas em **dias úteis, horário bancário**

## DOC — Documento de Ordem de Crédito

- **Liquidação:** D+1 (dia seguinte)
- **Valor máximo:** R$ 4.999,99 (acima disso, obrigatório usar TED ou Pix)
- Praticamente **obsoleto** com o Pix

## Câmbio

- **Definição:** compra e venda de moeda estrangeira
- **Regulado pelo:** Banco Central
- **Taxa de câmbio:** definida pelo mercado; BCB intervém para evitar volatilidade excessiva
- **Quem pode operar:** apenas instituições **autorizadas pelo BCB** (bancos, corretoras)
- **Spread:** diferença entre taxa de compra e venda — é a receita do banco

### Modalidades
- **Câmbio pronto:** entrega imediata da moeda
- **Câmbio futuro:** entrega em data futura, usado por empresas para se proteger (hedge)

## Correspondentes Bancários

Empresas (lotéricas, supermercados, farmácias) que prestam serviços bancários em nome de uma instituição financeira. Fundamentais para a **inclusão financeira** em municípios sem agência bancária.

> 💡 **Para a prova:** O Pix é operado pelo **BCB**. O TED passa pelo **STR** (também do BCB). O DOC passa pela **Compe** (câmara de compensação). Conheça a infraestrutura por trás de cada serviço.`,
      },
      {
        titulo: "Seguros e Previdência — PGBL vs. VGBL",
        slug: "seguros-previdencia-pgbl-vgbl",
        ordem: 4,
        resumo: "PGBL: dedução no IR (até 12% da renda bruta), tributação no resgate sobre o total. VGBL: sem dedução, tributação só sobre o rendimento. Regra: PGBL para quem declara IR completo; VGBL para os demais.",
        conteudo: `# Seguros e Previdência — PGBL vs. VGBL

## Previdência Complementar Aberta

São planos vendidos por **seguradoras e bancos** para qualquer pessoa. Regulados pela **Susep**.

### PGBL — Plano Gerador de Benefício Livre

- **Dedução no IR:** até **12% da renda bruta anual** na declaração completa
- **Tributação no resgate:** sobre o **valor total** (principal + rendimento)
- **Para quem:** quem declara IR pelo modelo **completo** e tem renda tributável

### VGBL — Vida Gerador de Benefício Livre

- **Dedução no IR:** **não deduz** (é considerado seguro de vida)
- **Tributação no resgate:** apenas sobre o **rendimento** (não sobre o principal)
- **Para quem:** quem declara IR pelo modelo **simplificado** ou é isento

### Regra prática de escolha

| Perfil | Plano indicado |
|--------|---------------|
| Declara IR completo, renda tributável alta | **PGBL** (aproveita a dedução agora) |
| Declara IR simplificado ou é isento | **VGBL** (não tem dedução a usar) |
| Quer diversificar (já tem PGBL no limite) | **VGBL** |

## Tabelas de tributação

Ambos podem usar **tabela regressiva** ou **progressiva**:

| Prazo de acumulação | Tabela Regressiva |
|---------------------|------------------|
| Até 2 anos | 35% |
| 2 a 4 anos | 30% |
| 4 a 6 anos | 25% |
| 6 a 8 anos | 20% |
| 8 a 10 anos | 15% |
| Acima de 10 anos | **10%** |

> 💡 **Para a prova:** A diferença principal é **onde incide o IR**. PGBL = total do resgate. VGBL = só o rendimento. O erro clássico é dizer que "PGBL é melhor que VGBL" — depende do perfil do contribuinte.`,
      },
      {
        titulo: "Tipos de Contas Bancárias — Corrente, Poupança e Salário",
        slug: "tipos-de-contas",
        ordem: 5,
        resumo: "Conta corrente: movimentação diária, pode ter tarifa de manutenção. Conta poupança: guardar e render (TR + 0,5% a.m. ou 70% Selic + TR). Conta salário: ABERTA PELO EMPREGADOR, isenta, só saque/extrato/débito, sem cartão de crédito. O BCB regulamenta serviços essenciais gratuitos.",
        conteudo: `# Tipos de Contas Bancárias — Corrente, Poupança e Salário

Toda relação do cliente com o banco começa com uma conta. As três principais são frequentemente comparadas em prova.

## Comparativo das 3 contas

| Característica | Conta Corrente | Conta Poupança | Conta Salário |
|----------------|---------------|----------------|---------------|
| **Finalidade** | Movimentação diária | Guardar e render | Receber salário |
| **Rendimento** | Não rende | Rende mensalmente | Não rende |
| **Tarifas** | Pode ter manutenção | Geralmente isenta | **Isenta** |
| **Quem abre** | O próprio cliente | O próprio cliente | **O empregador** |
| **Restrições** | Nenhuma | Não recebe salário diretamente | Só saque, extrato e débito |
| **Cartão de crédito** | Sim | Não | **Não** (só débito) |

> ⚠️ **Detalhe crítico cobrado em prova:** A conta salário é aberta pelo **EMPREGADOR**, não pelo funcionário. Ela permite até **5 saques e 2 extratos por mês** sem custo. O trabalhador pode transferir os recursos para outra conta de sua escolha.

## Conta Poupança — regra de remuneração

- Se Selic > 8,5% a.a.: **TR + 0,5% ao mês** (≈ 6,17% ao ano)
- Se Selic ≤ 8,5% a.a.: **70% da Selic + TR**
- IR: **isento** para pessoa física
- FGC: cobre até R$ 250.000

## Portabilidade de Conta Salário

O trabalhador tem o **direito legal** de redirecionar seu salário para qualquer banco de sua escolha, **sem autorização do empregador**. O banco de destino faz todo o processo. É tema frequente em questões de ética bancária.

## Serviços Essenciais Gratuitos na Conta Corrente

O BCB regulamenta que os bancos devem oferecer **gratuitamente** na conta corrente de pessoa física:
- **4 saques** por mês
- **4 extratos** por mês
- **2 TEDs** por mês
- **1 cartão de débito**

Os bancos não podem cobrar por esses serviços — qualquer cobrança acima é ilegal.

> 💡 **Para a prova:** Conta salário = quem abre é o **empregador**. Não tem cartão de crédito. Portabilidade é **direito do trabalhador**, independente do empregador. Esses três pontos são clássicos de questão.`,
      },
      {
        titulo: "Cartões de Crédito e Débito — Bandeira, Emissor e Rotativo",
        slug: "cartoes-credito-debito",
        ordem: 6,
        resumo: "Débito: desconta o saldo em tempo real, sem parcelamento. Crédito: opera com limite pré-aprovado, fatura futura, permite parcelamento. Bandeira (Visa, Mastercard) ≠ emissor (banco). Crédito rotativo: quando se paga só o mínimo — é a modalidade mais cara do mercado (acima de 15% ao mês).",
        conteudo: `# Cartões de Crédito e Débito — Bandeira, Emissor e Rotativo

## Cartão de Débito vs. Cartão de Crédito

| | Cartão de Débito | Cartão de Crédito |
|--|-----------------|-------------------|
| **Desconto** | Tempo real (imediato) | Vencimento futuro (até ~40 dias) |
| **Teto de gasto** | Saldo disponível na conta | Limite pré-aprovado pela instituição |
| **Parcelamento** | ❌ Não | ✅ Sim |
| **Risco ao banco** | Nenhum | Risco de crédito |
| **Custo ao cliente** | Geralmente isento | Anuidade possível |

## Bandeira vs. Emissor — a distinção mais cobrada

Muita gente confunde. São entidades **completamente distintas**:

| | Bandeira | Emissor |
|--|---------|---------|
| **Exemplos** | Visa, Mastercard, Elo, Amex | Bancos (Bradesco, Itaú, CEF, BB) |
| **Função** | Rede de aceitação (conecta lojistas e bancos) | Libera o crédito, emite o cartão |
| **Quem empresta o dinheiro?** | ❌ Não | ✅ Sim |
| **Relação com o cliente** | Nenhuma (é infraestrutura) | Contratual (contrato de cartão) |

> **Macete:** A Visa NÃO empresta dinheiro. Quem libera o crédito é o **banco emissor**. A Visa é apenas a "estrada" — o banco é o "dono do carro".

## Crédito Rotativo — o mais caro do mercado

O crédito rotativo é ativado quando o cliente paga **apenas o valor mínimo** da fatura (geralmente 15% do total). O saldo restante entra no rotativo, com:
- Taxas **acima de 15% ao mês** (as mais altas do mercado)
- Permite ao banco cobrar juros sobre juros
- Após 30 dias no rotativo, deve ser renegociado (parcelado)

> ⚠️ **Erro clássico:** O mínimo da fatura NÃO é um benefício — é o **gatilho** para entrar no crédito rotativo. Quem paga só o mínimo regularmente pode ter a dívida triplicada em poucos meses.

## Hierarquia de Taxas de Crédito (crescente)

Do mais barato ao mais caro:

1. **Crédito consignado** (desconto em folha — risco mínimo)
2. **CDC** (bem como garantia)
3. **Empréstimo pessoal** (sem garantia)
4. **Cheque especial** (automático, teto de 8% a.m. pelo BCB)
5. **Rotativo do cartão** (> 15% a.m. — mais caro de todos)

> 💡 **Para a prova:** Memorize essa hierarquia. Qualquer questão que coloque consignado como caro ou rotativo como barato está ERRADA. A ordem é axiomática em concursos bancários.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 4 — MERCADO DE CAPITAIS E TÍTULOS PÚBLICOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Mercado de Capitais e Títulos Públicos",
    slug: "mercado-de-capitais-titulos-publicos",
    descricao: "Além dos bancos, como o dinheiro é captado? B3, ações, debêntures, Tesouro Direto.",
    ordem: 4,
    topicos: [
      {
        titulo: "B3, CVM e Estrutura do Mercado de Capitais",
        slug: "b3-cvm-estrutura-mercado-capitais",
        ordem: 1,
        resumo: "O mercado de capitais conecta quem precisa de dinheiro (empresas/governo) com quem tem dinheiro para investir. A CVM regula. A B3 é a bolsa. Mercado primário: 1ª emissão. Mercado secundário: negociação posterior.",
        conteudo: `# B3, CVM e Estrutura do Mercado de Capitais

## Por que existe o mercado de capitais?

Empresas precisam de dinheiro para crescer. Têm duas opções:
1. **Pegar empréstimo no banco** (crédito bancário — mais caro)
2. **Emitir ações ou debêntures** (mercado de capitais — pode ser mais barato e sem prazo fixo de devolução)

O mercado de capitais **conecta diretamente** quem precisa de recursos com quem tem dinheiro para investir.

## Quem regula: CVM

A **Comissão de Valores Mobiliários (CVM)** regula e fiscaliza o mercado de capitais. Vinculada ao CMN.

Principais funções:
- Autorizar e regular **emissões** de valores mobiliários
- Fiscalizar as **companhias abertas** (empresas com ações na bolsa)
- Proteger **investidores** contra insider trading, manipulação de mercado e fraudes
- Credenciar **auditores, analistas e administradores de carteira**

## A B3 — Brasil, Bolsa, Balcão

A **B3** é a bolsa de valores brasileira (fusão da BM&F com a Bovespa). Onde as ações são negociadas.

Funções da B3:
- **Ambiente de negociação** (pregão eletrônico)
- **Câmara de compensação e liquidação** (garante as operações)
- **Autorregulação** (mas sujeita à supervisão da CVM)

## Mercado Primário vs. Secundário

| Mercado | O que é | Para quem vai o dinheiro |
|---------|---------|--------------------------|
| **Primário** | 1ª emissão do título pela empresa | Para a **empresa emissora** |
| **Secundário** | Negociações posteriores entre investidores | Para o **vendedor** (investidor) |

> A empresa capta recursos **só no mercado primário**. O mercado secundário garante **liquidez** para o investidor.

## IPO — Oferta Pública Inicial

Quando uma empresa abre seu capital pela primeira vez (entra na bolsa). É uma operação no **mercado primário**.

> 💡 **Por que empresas vão à bolsa?** Para captar dinheiro sem prazo fixo de devolução e sem pagar juros. Em troca, dividem o controle com os acionistas.`,
      },
      {
        titulo: "Ações — ON, PN e Direitos",
        slug: "acoes-on-pn-direitos",
        ordem: 2,
        resumo: "Ações ON (ordinárias) dão direito a voto. Ações PN (preferenciais) têm preferência no recebimento de dividendos. Tag along protege minoritários em caso de venda do controle.",
        conteudo: `# Ações — ON, PN e Direitos

## O que é uma ação?

Uma ação representa uma **fração do capital social** de uma empresa. Quem a possui é **sócio** da empresa.

## Ações Ordinárias (ON)

- Sufixo: **3** (ex: PETR3, VALE3)
- **Direito a voto** nas assembleias
- Participação nos resultados (**dividendos**)
- Em caso de liquidação: recebem por **último**
- Seguem regras do **tag along**

## Ações Preferenciais (PN)

- Sufixo: **4** (ex: PETR4, BBAS4) ou **11** (units)
- **Sem direito a voto** (geralmente)
- **Prioridade** no recebimento de dividendos
- Dividendo mínimo garantido (10% maior que o das ON, via lei)
- Em caso de liquidação: recebem **antes das ON**

> Desde 2001 (Lei 10.303), novas emissões de PN só podem ter no máximo 50% do capital total.

## Dividendos e Juros sobre Capital Próprio (JCP)

- **Dividendos:** distribuição de lucros. **Isento de IR** para pessoa física.
- **JCP:** outra forma de remunerar o acionista, mas com **IR retido na fonte (15%)**.

## Tag Along

Protege os **acionistas minoritários** em caso de venda do controle da empresa. Se o controlador vende sua participação, os minoritários têm direito de vender suas ações pelo mesmo preço (ou % do preço).

- ON: **tag along** mínimo de 80% do preço pago ao controlador (Lei das S.A.)
- No Novo Mercado da B3: 100% para todas as ações

## Novo Mercado da B3

Segmento de governança corporativa mais elevado:
- Apenas ações **ON** (não há PN)
- **Tag along** de 100%
- Mínimo de 25% das ações em **free float** (circulação)
- Conselho de Administração com ao menos 20% de conselheiros independentes

> 💡 **Para a prova:** ON = voto. PN = dividendo preferencial. Novo Mercado = só ON, máxima governança.`,
      },
      {
        titulo: "Títulos Públicos Federais — Tesouro Direto",
        slug: "titulos-publicos-tesouro-direto",
        ordem: 3,
        resumo: "LTN (Tesouro Prefixado): taxa fixa, sem correção. NTN-B (Tesouro IPCA+): protege da inflação. LFT (Tesouro Selic): pós-fixado, baixíssima volatilidade. Tesouro Direto é o programa de venda direta ao investidor.",
        conteudo: `# Títulos Públicos Federais — Tesouro Direto

O **Tesouro Nacional** emite títulos para financiar o governo federal. São os investimentos de **menor risco** do Brasil (risco soberano).

## Programa Tesouro Direto

Criado em 2002 para permitir que **pessoas físicas** comprem títulos públicos pela internet, com valores a partir de R$ 30.

## Os Principais Títulos

### LTN — Letra do Tesouro Nacional (= Tesouro Prefixado)

- **Rentabilidade:** **prefixada** — você sabe exatamente quanto vai receber no vencimento
- **Proteção à inflação:** **não** — se a inflação subir, pode ter rentabilidade real negativa
- **Volatilidade:** alta se vender antes do vencimento
- **Para quem:** investidor que acredita que os juros vão **cair** no futuro

### NTN-B — Nota do Tesouro Nacional série B (= Tesouro IPCA+)

- **Rentabilidade:** **IPCA + taxa prefixada** (ex: IPCA + 6% a.a.)
- **Proteção à inflação:** **sim** — seu poder de compra é preservado
- **Volatilidade:** alta se vender antes do vencimento (parte prefixada)
- **Para quem:** investidor de longo prazo, aposentadoria

### LFT — Letra Financeira do Tesouro (= Tesouro Selic)

- **Rentabilidade:** **pós-fixada** = Selic (acompanha a taxa básica)
- **Proteção à inflação:** indireta (Selic costuma superar a inflação)
- **Volatilidade:** **mínima** — pode vender a qualquer momento sem perda expressiva
- **Para quem:** reserva de emergência, investidor conservador

## Comparativo

| Título | Remuneração | Risco de mercado | Proteção à inflação |
|--------|-------------|-----------------|---------------------|
| LTN | Taxa fixa | Alto | Não |
| NTN-B | IPCA + taxa fixa | Médio-alto | **Sim** |
| LFT | Selic | Mínimo | Indireta |

> 💡 **Para a prova:** não decore fórmulas — entenda a lógica. Prefixado: você trava a taxa. IPCA+: você trava o ganho real. Selic: você segue o mercado. Em prova, "qual título protege da inflação?" = NTN-B.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 5 — REGULAÇÃO, ÉTICA E TEMAS TRANSVERSAIS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Regulação, Ética e Temas Transversais",
    slug: "regulacao-etica-temas-transversais",
    descricao: "Regras do jogo: sigilo bancário, lavagem de dinheiro, COAF e autorregulação bancária.",
    ordem: 5,
    topicos: [
      {
        titulo: "Sigilo Bancário — LC 105/2001",
        slug: "sigilo-bancario-lc-105-2001",
        ordem: 1,
        resumo: "O sigilo bancário protege informações financeiras dos clientes. A LC 105/2001 define quando pode ser quebrado: por ordem judicial, CPI ou, em alguns casos, pela Receita Federal sem autorização judicial.",
        conteudo: `# Sigilo Bancário — LC 105/2001

## O que é

O **sigilo bancário** é a obrigação das instituições financeiras de não divulgar informações sobre operações de seus clientes (saldos, movimentações, investimentos).

## Base legal: LC 105/2001

A **Lei Complementar 105/2001** regula o sigilo das operações de instituições financeiras no Brasil.

## Quando o sigilo pode ser quebrado?

| Situação | Precisa de autorização judicial? |
|----------|----------------------------------|
| Determinação do **Poder Judiciário** | Não (o próprio juiz ordena) |
| **CPI** (Comissão Parlamentar de Inquérito) | Não (CPIs têm poderes de investigação) |
| **Receita Federal** (dados para fiscalização tributária) | **Não** — o STF validou em 2016 |
| **COAF** (para investigação de lavagem) | Não (troca de informações entre órgãos) |
| **Ministério Público** (sem mandado judicial) | **Sim** (MP precisa de autorização do juiz) |
| Particulares, imprensa | **Não permitido** |

## STF e a questão da Receita Federal

Em 2016, o **STF** decidiu que a Receita Federal pode acessar dados bancários **diretamente**, sem autorização judicial, para fins de fiscalização tributária. Isso foi considerado constitucional.

## Transferência de informações entre o BCB e a Receita

O BCB e a Receita Federal podem trocar informações sigilosas para fins de fiscalização — sem necessidade de ordem judicial, desde que no âmbito de suas competências.

## Sigilo x Transparência

O sigilo não é absoluto. A lei equilibra **privacidade** do cidadão com o interesse público em **combater crimes financeiros** e garantir arrecadação tributária.

> 💡 **Para a prova:** o erro clássico é achar que o sigilo bancário só pode ser quebrado por ordem judicial. CPI e Receita Federal também podem, sem decisão do juiz.`,
      },
      {
        titulo: "Lavagem de Dinheiro — As 3 Fases e a Lei 9.613/98",
        slug: "lavagem-de-dinheiro-lei-9613",
        ordem: 2,
        resumo: "Lavagem = transformar dinheiro ilícito em lícito. As 3 fases: Colocação → Ocultação → Integração. A Lei 9.613/98 criou o COAF. Todo banco é obrigado a comunicar operações suspeitas.",
        conteudo: `# Lavagem de Dinheiro — As 3 Fases e a Lei 9.613/98

**Lavagem de dinheiro** é o processo de tornar legítimos recursos provenientes de crimes.

## As 3 Fases (cobradas em todo concurso bancário)

### 1. Colocação (Placement)
Inserção do dinheiro sujo no sistema financeiro.

Exemplos:
- Depósitos em espécie em várias contas (fracionamento)
- Uso de casas de câmbio
- Pagamentos em dinheiro vivo em estabelecimentos

### 2. Ocultação (Layering)
Disfarçar a origem ilícita por meio de transações complexas.

Exemplos:
- Transferências internacionais em cascata
- Compra e venda de ativos (imóveis, obras de arte)
- Uso de empresas "fantasma" (laranjas)

### 3. Integração (Integration)
Reinserção do dinheiro na economia como se fosse legítimo.

Exemplos:
- Compra de imóveis de luxo
- Investimento em empresas legítimas
- Pagamento de salários fictícios

## A Lei 9.613/1998

- Criou o crime de lavagem de dinheiro no Brasil
- Criou o **COAF** (Conselho de Controle de Atividades Financeiras)
- Definiu as obrigações das instituições financeiras

### Obrigações dos bancos (e funcionários)

- **Identificar** clientes (know your customer - KYC)
- **Registrar** operações acima de R$ 2.000 em espécie
- **Comunicar ao COAF** operações suspeitas (sem avisar o cliente!)
- Manter **registros** por no mínimo 5 anos

> ⚠️ Comunicar ao COAF **não é denúncia** — é obrigação legal. E deve ser feito **sigilosamente** — comunicar ao cliente que foi reportado é crime.

## COAF — Unidade de Inteligência Financeira

- Órgão do **Ministério da Fazenda**
- Recebe, analisa e dissemina informações sobre suspeitas de lavagem
- Não é órgão de investigação — é de **inteligência financeira**

> 💡 **Mnemônico:** COI = **Co**locação, **O**cultação, **I**ntegração. Esse é o único que precisa decorar. O resto é consequência lógica.`,
      },
      {
        titulo: "FGC — Fundo Garantidor de Créditos",
        slug: "fgc-fundo-garantidor-creditos",
        ordem: 3,
        resumo: "O FGC garante depósitos e investimentos em até R$ 250 mil por CPF por instituição, com teto global de R$ 1 milhão a cada 4 anos. Cobre: conta corrente, poupança, CDB, LCI, LCA. Não cobre fundos de investimento.",
        conteudo: `# FGC — Fundo Garantidor de Créditos

## O que é

O **Fundo Garantidor de Créditos (FGC)** é uma entidade privada, sem fins lucrativos, que protege correntistas e investidores em caso de **falência ou intervenção** em uma instituição financeira associada.

## Limites de cobertura

- **Por CPF/CNPJ por instituição:** até **R$ 250.000**
- **Teto global por CPF:** até **R$ 1.000.000** a cada **4 anos**

> O teto de R$ 1 milhão existe para evitar que o FGC seja usado como proteção para grandes investidores que distribuem recursos entre várias instituições.

## O que o FGC cobre

✅ Depósitos à vista (conta corrente)
✅ Conta poupança
✅ CDB (Certificado de Depósito Bancário)
✅ RDB (Recibo de Depósito Bancário)
✅ LCI (Letra de Crédito Imobiliário)
✅ LCA (Letra de Crédito do Agronegócio)
✅ LC (Letra de Câmbio)
✅ LH (Letra Hipotecária)
✅ Depósitos a prazo

## O que o FGC NÃO cobre

❌ **Fundos de investimento** (CDBs dentro de fundos não contam)
❌ **Debêntures**
❌ **Ações**
❌ **Títulos públicos** (risco soberano)
❌ Valores acima do limite de R$ 250 mil

## Instituições associadas

Bancos comerciais, múltiplos, de investimento, caixas econômicas, cooperativas de crédito e outras instituições autorizadas pelo BCB.

> 💡 **Para a prova:** o erro mais comum é achar que fundos de investimento são cobertos pelo FGC. **Não são.** Outro erro: confundir o teto por instituição (R$ 250 mil) com o teto global (R$ 1 milhão em 4 anos).`,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════
const quizData = [
  // ── BLOCO 1: SISTEMA FINANCEIRO NACIONAL — 24 questões ──────

  // estrutura-sfn-3-niveis (6 questões)
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "A Lei nº 4.595/1964 é considerada o marco fundador do SFN porque:",
    explicacao: "A Lei 4.595/1964 criou a estrutura hierárquica do SFN, estabelecendo os órgãos normativos e supervisores pela primeira vez. Antes dela, o sistema era fragmentado e sem regulação centralizada. É a 'certidão de nascimento' do SFN moderno.",
    opcoes: [
      { texto: "Criou o Banco Central do Brasil e estruturou o SFN em segmentos normativos e supervisores", correta: true },
      { texto: "Instituiu o Pix como sistema de pagamento instantâneo", correta: false },
      { texto: "Criou o FGC para proteger os depósitos bancários", correta: false },
      { texto: "Regulamentou o sigilo bancário e as operações cambiais", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "Qual é a função do CMN (Conselho Monetário Nacional) no SFN?",
    explicacao: "O CMN é o órgão normativo máximo do SFN. Ele cria as regras (normatiza), mas não fiscaliza nem executa. Quem fiscaliza os bancos é o Banco Central; quem fiscaliza o mercado de capitais é a CVM.",
    opcoes: [
      { texto: "Fiscalizar e punir instituições financeiras", correta: false },
      { texto: "Emitir moeda e controlar a inflação", correta: false },
      { texto: "Normatizar as políticas monetária, cambial e de crédito", correta: true },
      { texto: "Operar o mercado de ações junto à B3", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "No âmbito do Sistema Financeiro Nacional, os bancos comerciais e as corretoras de valores são classificados como:",
    explicacao: "Bancos, corretoras e demais intermediários financeiros são os OPERADORES do SFN — o terceiro nível. Eles executam as operações com o público. O primeiro nível (normativos) define regras; o segundo (supervisores) fiscaliza.",
    opcoes: [
      { texto: "Órgãos normativos", correta: false },
      { texto: "Entidades supervisoras", correta: false },
      { texto: "Operadores do sistema", correta: true },
      { texto: "Órgãos auxiliares de regulação", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "A Susep é a entidade responsável pela supervisão de:",
    explicacao: "A Susep (Superintendência de Seguros Privados) supervisiona o mercado de seguros, resseguros, capitalização e previdência complementar ABERTA (PGBL, VGBL). A Previc cuida da previdência FECHADA (fundos de pensão).",
    opcoes: [
      { texto: "Fundos de pensão de empresas estatais", correta: false },
      { texto: "Seguros, resseguros, capitalização e previdência aberta", correta: true },
      { texto: "Operações de crédito rural", correta: false },
      { texto: "Emissão de valores mobiliários em bolsa", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "Qual das seguintes afirmações sobre os três segmentos do SFN está CORRETA?",
    explicacao: "Os órgãos normativos (CMN, CNSP, CNPC) criam normas mas NÃO exercem funções executivas ou de supervisão direta sobre instituições. A supervisão é papel das entidades do segundo nível (BCB, CVM, Susep, Previc).",
    opcoes: [
      { texto: "O Banco Central normatiza e o CMN fiscaliza os bancos comerciais", correta: false },
      { texto: "Os operadores compõem o primeiro nível e definem as políticas", correta: false },
      { texto: "Os órgãos normativos estabelecem diretrizes sem exercer supervisão direta", correta: true },
      { texto: "A CVM faz parte do nível normativo junto ao CMN", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "estrutura-sfn-3-niveis",
    pergunta: "O CNPC — Conselho Nacional de Previdência Complementar — é o órgão normativo responsável por regular:",
    explicacao: "O CNPC é o órgão normativo (primeiro nível) que regula a previdência complementar FECHADA — os fundos de pensão (ex: Previ do BB, Funcef da CEF). A Previc é quem supervisiona (segundo nível). O CNSP regula seguros e previdência aberta.",
    opcoes: [
      { texto: "A previdência social (INSS) e a previdência aberta", correta: false },
      { texto: "Os planos PGBL e VGBL comercializados em bancos", correta: false },
      { texto: "A previdência complementar fechada (fundos de pensão)", correta: true },
      { texto: "As cooperativas de crédito e suas reservas", correta: false },
    ],
  },

  // cmn-conselho-monetario-nacional (5 questões)
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "Quem preside o CMN — Conselho Monetário Nacional?",
    explicacao: "O CMN é presidido pelo Ministro da Fazenda. É composto por 3 membros: Ministro da Fazenda (presidente), Ministro do Planejamento e Presidente do Banco Central.",
    opcoes: [
      { texto: "Presidente do Banco Central do Brasil", correta: false },
      { texto: "Ministro da Fazenda", correta: true },
      { texto: "Presidente da República", correta: false },
      { texto: "Presidente da CVM", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "Qual das alternativas representa uma atribuição do CMN?",
    explicacao: "Fixar as diretrizes para as políticas monetária, creditícia e cambial é função clássica do CMN. O CMN não emite moeda (BCB), não fiscaliza bancos (BCB), e não autoriza abertura de capital (CVM).",
    opcoes: [
      { texto: "Emitir papel-moeda para atender à demanda da economia", correta: false },
      { texto: "Fixar as diretrizes das políticas monetária, creditícia e cambial", correta: true },
      { texto: "Fiscalizar e punir instituições financeiras em infração", correta: false },
      { texto: "Autorizar a abertura de capital de empresas na B3", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "Em relação ao CMN, é INCORRETO afirmar que:",
    explicacao: "O CMN NÃO tem poder de investigar ou punir instituições — isso é papel do BCB e da CVM. O CMN é apenas normativo: estabelece regras, metas e diretrizes. Jamais executa ou fiscaliza diretamente.",
    opcoes: [
      { texto: "O CMN é presidido pelo Ministro da Fazenda", correta: false },
      { texto: "O CMN fixa as metas de inflação a serem perseguidas pelo BCB", correta: false },
      { texto: "O CMN pode investigar e punir bancos em situação de insolvência", correta: true },
      { texto: "O CMN é o órgão máximo do Sistema Financeiro Nacional", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "A meta de inflação do Brasil é definida por qual órgão?",
    explicacao: "A meta de inflação (regime de metas para a inflação) é definida pelo CMN, com base no IPCA calculado pelo IBGE. O Banco Central é responsável por CUMPRIR essa meta usando os instrumentos de política monetária.",
    opcoes: [
      { texto: "Banco Central do Brasil, por meio do Copom", correta: false },
      { texto: "Ministério da Fazenda, unilateralmente", correta: false },
      { texto: "CMN — Conselho Monetário Nacional", correta: true },
      { texto: "IBGE, com base nos dados de inflação coletados", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "As Resoluções do CMN têm qual natureza jurídica?",
    explicacao: "As Resoluções do CMN são normas de caráter geral e obrigatório para todo o sistema financeiro. Toda instituição financeira autorizada a funcionar deve obedecê-las. Têm hierarquia de norma regulatória infralegal.",
    opcoes: [
      { texto: "São recomendações sem força vinculante para as instituições financeiras", correta: false },
      { texto: "Normas de cumprimento obrigatório por todas as instituições do SFN", correta: true },
      { texto: "Leis complementares que dependem de aprovação do Congresso Nacional", correta: false },
      { texto: "Atos administrativos internos do BCB, sem eficácia externa", correta: false },
    ],
  },

  // banco-central-funcoes (6 questões)
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "Qual das alternativas descreve uma função EXCLUSIVA do Banco Central do Brasil?",
    explicacao: "A emissão de papel-moeda é função exclusiva do Banco Central. O BCB é o único autorizado a colocar dinheiro em circulação no Brasil. As demais alternativas descrevem funções de outras entidades.",
    opcoes: [
      { texto: "Normatizar as condições de emissão de ações", correta: false },
      { texto: "Emitir papel-moeda e moeda metálica", correta: true },
      { texto: "Fiscalizar companhias abertas na B3", correta: false },
      { texto: "Regulamentar seguradoras e resseguradoras", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "A LC 179/2021 conferiu autonomia operacional ao Banco Central. Qual a principal consequência dessa mudança?",
    explicacao: "Com a LC 179/2021, o BCB passou a ter autonomia operacional: os diretores têm mandatos fixos de 4 anos, não coincidentes com o mandato presidencial. O objetivo é isolar a política monetária de pressões políticas de curto prazo, preservando a credibilidade.",
    opcoes: [
      { texto: "O BCB passou a fixar a meta de inflação sem participação do CMN", correta: false },
      { texto: "Os diretores do BCB passaram a ter mandatos fixos, reduzindo a influência política", correta: true },
      { texto: "O BCB deixou de ser vinculado ao governo federal", correta: false },
      { texto: "O BCB passou a regular o mercado de capitais junto à CVM", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "O Banco Central do Brasil atua como 'banco dos bancos'. Isso significa que:",
    explicacao: "O BCB é o 'banco dos bancos' porque é o depositário compulsório dos bancos (recebe o recolhimento compulsório) e emprestador de última instância (redesconto). Bancos recorrem ao BCB quando não encontram liquidez no mercado interbancário.",
    opcoes: [
      { texto: "O BCB oferece crédito e serviços financeiros ao público em geral", correta: false },
      { texto: "O BCB mantém as reservas dos bancos e empresta a eles em caso de necessidade de liquidez", correta: true },
      { texto: "O BCB concede crédito subsidiado exclusivamente a bancos públicos", correta: false },
      { texto: "O BCB é o maior acionista dos principais bancos brasileiros", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "Qual entidade é responsável por gerir as reservas internacionais do Brasil?",
    explicacao: "A gestão das reservas internacionais (dólares, euros, ouro etc. mantidos no exterior) é função exclusiva do Banco Central. As reservas servem como 'colchão' para estabilizar o câmbio em momentos de crise.",
    opcoes: [
      { texto: "Ministério da Fazenda", correta: false },
      { texto: "BNDES — Banco Nacional de Desenvolvimento Econômico e Social", correta: false },
      { texto: "Banco Central do Brasil", correta: true },
      { texto: "Tesouro Nacional", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "O Copom — Comitê de Política Monetária — é responsável por:",
    explicacao: "O Copom define a meta para a taxa Selic a cada 45 dias. É composto pelo Presidente do BCB e 8 diretores. A Selic é o principal instrumento de política monetária para controle da inflação.",
    opcoes: [
      { texto: "Fixar as metas de inflação anuais para o Brasil", correta: false },
      { texto: "Definir a meta para a taxa Selic a cada 45 dias", correta: true },
      { texto: "Supervisionar os bancos comerciais e aplicar sanções", correta: false },
      { texto: "Emitir papel-moeda conforme a demanda da economia", correta: false },
    ],
  },

  // cvm-susep-previc (4 questões)
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cvm-susep-previc",
    pergunta: "Um cliente contrata um plano PGBL em um banco. Qual entidade supervisiona esse produto?",
    explicacao: "O PGBL é um produto de previdência complementar ABERTA — vendido por bancos e seguradoras para qualquer pessoa. Produtos de previdência aberta são supervisionados pela Susep, vinculada ao CNSP.",
    opcoes: [
      { texto: "Previc", correta: false },
      { texto: "CVM", correta: false },
      { texto: "Banco Central do Brasil", correta: false },
      { texto: "Susep", correta: true },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cvm-susep-previc",
    pergunta: "A CVM tem como uma de suas competências proteger os investidores contra:",
    explicacao: "Insider trading (uso de informação privilegiada) e manipulação de mercado são crimes contra o mercado de capitais, investigados e punidos pela CVM. Quem negocia ações com base em informações que o mercado ainda não tem obtém vantagem ilegal.",
    opcoes: [
      { texto: "Variações cambiais e riscos de crédito no sistema bancário", correta: false },
      { texto: "Inadimplência em operações de crédito consignado", correta: false },
      { texto: "Insider trading e manipulação de preços no mercado de capitais", correta: true },
      { texto: "Falência de instituições seguradoras e de capitalização", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cvm-susep-previc",
    pergunta: "A Previ (fundo de pensão dos funcionários do Banco do Brasil) é supervisionada por:",
    explicacao: "A Previ é um fundo de pensão — previdência complementar FECHADA, voltada para funcionários de uma empresa específica (BB). Fundos de pensão são supervisionados pela Previc, vinculada ao CNPC.",
    opcoes: [
      { texto: "Susep", correta: false },
      { texto: "CVM", correta: false },
      { texto: "Previc", correta: true },
      { texto: "Banco Central do Brasil", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cvm-susep-previc",
    pergunta: "Uma corretora de valores que atua como intermediária na compra e venda de ações na B3 está sujeita à supervisão de qual entidade?",
    explicacao: "Corretoras de valores que atuam no mercado de capitais (ações, debêntures, fundos etc.) são supervisionadas pela CVM. O BCB supervisiona as instituições do sistema bancário (bancos, cooperativas de crédito etc.).",
    opcoes: [
      { texto: "Banco Central do Brasil", correta: false },
      { texto: "CMN — Conselho Monetário Nacional", correta: false },
      { texto: "CVM — Comissão de Valores Mobiliários", correta: true },
      { texto: "Susep — Superintendência de Seguros Privados", correta: false },
    ],
  },

  // instituicoes-operadoras-sfn (3 questões novas)
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "instituicoes-operadoras-sfn",
    pergunta: "O Banco do Brasil desempenha uma função especial no SFN que os demais bancos comerciais não têm. Qual é ela?",
    explicacao: "O BB atua como agente financeiro do governo federal: arrecada tributos, realiza pagamentos de servidores, opera o câmbio do Tesouro e executa políticas públicas de crédito (crédito rural, por exemplo). É um banco híbrido: comercial + agente do Estado.",
    opcoes: [
      { texto: "É o único banco autorizado a operar câmbio no Brasil", correta: false },
      { texto: "Tem exclusividade na gestão do FGTS e das loterias federais", correta: false },
      { texto: "Atua como agente financeiro do governo federal, arrecadando tributos e executando políticas públicas", correta: true },
      { texto: "É o único banco estatal autorizado a captar depósitos à vista", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "instituicoes-operadoras-sfn",
    pergunta: "A Caixa Econômica Federal possui exclusividades legais que nenhum outro banco possui. Quais são elas?",
    explicacao: "A CEF tem exclusividade legal no penhor (empréstimo com garantia de bem pessoal), na gestão do FGTS e na operação das loterias federais. Nenhum banco privado pode concorrer nessas funções.",
    opcoes: [
      { texto: "Crédito rural, câmbio e financiamento de exportações", correta: false },
      { texto: "Penhor, gestão do FGTS e operação das loterias federais", correta: true },
      { texto: "Emissão de LCI, gestão do FGTS e crédito consignado para servidores", correta: false },
      { texto: "Financiamento habitacional, crédito rural e câmbio", correta: false },
    ],
  },
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "instituicoes-operadoras-sfn",
    pergunta: "Um banco de investimento se diferencia de um banco comercial principalmente porque:",
    explicacao: "O banco de investimento foca no financiamento de longo prazo para empresas (underwriting, project finance, repasses do BNDES) e NÃO pode captar depósitos à vista (conta corrente). Já o banco comercial capta à vista e concede crédito de curto prazo.",
    opcoes: [
      { texto: "Opera exclusivamente com clientes do setor público", correta: false },
      { texto: "Não pode conceder crédito, apenas captar recursos", correta: false },
      { texto: "Não capta depósitos à vista e foca em financiamento de longo prazo para empresas", correta: true },
      { texto: "É regulado pela CVM, não pelo Banco Central", correta: false },
    ],
  },

  // ── BLOCO 2: BANCO CENTRAL E POLÍTICA MONETÁRIA — 22 questões ───

  // taxa-selic (6 questões)
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O Banco Central decide elevar a taxa Selic. Qual efeito direto essa decisão produz?",
    explicacao: "Elevar a Selic encarece o crédito, desestimula o consumo e o investimento. Com menos dinheiro circulando, a demanda cai e a inflação tende a recuar. É a principal ferramenta para controlar a inflação.",
    opcoes: [
      { texto: "Aumento da inflação e do consumo", correta: false },
      { texto: "Redução da inflação pelo encarecimento do crédito", correta: true },
      { texto: "Redução da rentabilidade de investimentos em renda fixa", correta: false },
      { texto: "Aumento imediato do emprego", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "Qual é a diferença entre a Selic Meta e a Selic Over?",
    explicacao: "A Selic Meta é a taxa definida pelo COPOM nas reuniões periódicas (o alvo). A Selic Over é a taxa efetiva apurada diariamente nas operações overnight entre bancos — ela flutua próxima à meta e é convergida para ela pelas operações de mercado aberto do Banco Central.",
    opcoes: [
      { texto: "São a mesma taxa, apenas com nomes diferentes para diferentes contextos", correta: false },
      { texto: "Selic Meta é definida pelo CMN; Selic Over é definida pelo COPOM", correta: false },
      { texto: "Selic Meta é o alvo definido pelo COPOM; Selic Over é a taxa efetiva diária interbancária", correta: true },
      { texto: "Selic Over é sempre maior que a Selic Meta por incluir o spread bancário", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "Se a Selic está alta, qual é o efeito sobre investidores de renda fixa (CDB, Tesouro Selic)?",
    explicacao: "Selic alta é boa para investidores de renda fixa: CDB, Tesouro Selic e outros produtos pós-fixados rendem mais. O erro clássico é achar que Selic alta é sempre ruim — ela é ruim para quem toma crédito, mas ótima para quem investe em renda fixa.",
    opcoes: [
      { texto: "Prejuízo, pois os títulos perdem valor com juros altos", correta: false },
      { texto: "Neutro — Selic afeta apenas o crédito, não os investimentos", correta: false },
      { texto: "Benefício — CDB e Tesouro Selic pagam mais quando a Selic é alta", correta: true },
      { texto: "Risco aumentado — alta da Selic gera volatilidade nos títulos de renda fixa", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O COPOM decide reduzir a taxa Selic para estimular a economia em recessão. Qual é a cadeia de efeitos esperada?",
    explicacao: "Selic menor → crédito mais barato → famílias e empresas tomam mais empréstimos → consumo e investimento aumentam → economia aquece. Esse é o mecanismo de política monetária expansionista. O risco é que, se exagerado, pode elevar a inflação.",
    opcoes: [
      { texto: "Selic menor → crédito mais caro → consumo cai → inflação recua", correta: false },
      { texto: "Selic menor → crédito mais barato → consumo cresce → economia aquece", correta: true },
      { texto: "Selic menor → câmbio aprecia → exportações crescem → inflação sobe", correta: false },
      { texto: "Selic menor → bancos recolhem mais compulsório → crédito escasseia", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "Qual órgão define a meta da taxa Selic e com que frequência se reúne para isso?",
    explicacao: "O COPOM (Comitê de Política Monetária) é o órgão interno do Banco Central responsável por definir a meta da Selic. Ele se reúne 8 vezes por ano (a cada ~45 dias), por 2 dias (terça e quarta-feira), e publica a ata em até 6 dias úteis.",
    opcoes: [
      { texto: "CMN — reúne-se mensalmente para definir a Selic", correta: false },
      { texto: "COPOM — reúne-se 8 vezes por ano, a cada ~45 dias", correta: true },
      { texto: "Banco Central em plenário — reúne-se semanalmente", correta: false },
      { texto: "Ministério da Fazenda — define a Selic conforme a meta fiscal do governo", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O que acontece se o Banco Central descumprir a meta de inflação definida pelo CMN?",
    explicacao: "O Presidente do Banco Central deve enviar uma carta aberta ao Ministro da Fazenda explicando os motivos do descumprimento, as medidas corretivas que serão adotadas e o prazo estimado para retorno à meta. Esse procedimento está previsto no Decreto 3.088/1999 e reafirmado pela LC 179/2021.",
    opcoes: [
      { texto: "O Presidente do BC é automaticamente demitido pelo Presidente da República", correta: false },
      { texto: "O CMN assume temporariamente a função de executor da política monetária", correta: false },
      { texto: "O Presidente do BC envia carta aberta ao Ministro da Fazenda com explicações e medidas corretivas", correta: true },
      { texto: "O governo intervém diretamente no BC para ajustar a taxa Selic", correta: false },
    ],
  },

  // deposito-compulsorio (4 questões)
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "O Banco Central aumenta o percentual do depósito compulsório. Qual o efeito esperado?",
    explicacao: "Aumentar o compulsório reduz a quantidade de dinheiro disponível para empréstimos. Os bancos têm que recolher mais ao BCB, o que contrai o crédito e pode reduzir a inflação.",
    opcoes: [
      { texto: "Expansão da oferta de crédito no mercado", correta: false },
      { texto: "Aumento da base monetária em circulação", correta: false },
      { texto: "Contração da oferta de crédito e redução da liquidez", correta: true },
      { texto: "Redução das reservas internacionais do país", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "Um banco capta R$ 100 em depósitos à vista e o depósito compulsório é de 20%. Quanto o banco pode emprestar?",
    explicacao: "Com compulsório de 20%, o banco deve recolher R$ 20 ao Banco Central e pode emprestar os R$ 80 restantes. O compulsório determina o efeito multiplicador do crédito: quanto menor o compulsório, mais os bancos emprestam e mais 'moeda escritural' é criada na economia.",
    opcoes: [
      { texto: "R$ 100 — o banco pode emprestar o valor total captado", correta: false },
      { texto: "R$ 20 — o banco só pode emprestar o valor do compulsório", correta: false },
      { texto: "R$ 80 — o banco recolhe R$ 20 ao BC e empresta o restante", correta: true },
      { texto: "R$ 120 — o banco usa alavancagem para emprestar além do captado", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "Em uma crise de liquidez (como a de 2008), por que o Banco Central reduziu o depósito compulsório?",
    explicacao: "Em crises de liquidez, os bancos ficam reticentes em se emprestar entre si, gerando escassez de dinheiro. Reduzir o compulsório libera imediatamente recursos para os bancos emprestarem, injetando liquidez sem precisar alterar a Selic. É uma medida rápida e de efeito imediato.",
    opcoes: [
      { texto: "Para controlar a inflação que costuma subir em crises bancárias", correta: false },
      { texto: "Para injetar liquidez no sistema e estimular o crédito sem alterar a Selic", correta: true },
      { texto: "Para aumentar as reservas internacionais do Brasil", correta: false },
      { texto: "Para punir bancos que contribuíram para a crise", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "O depósito compulsório é igual para todos os tipos de depósito bancário?",
    explicacao: "Não. O Banco Central define alíquotas diferentes para diferentes tipos de depósito: depósitos à vista têm alíquota maior (maior risco de corrida bancária); depósitos a prazo têm alíquota menor; depósitos de poupança têm alíquota própria. Essa diferenciação é uma forma de política monetária seletiva.",
    opcoes: [
      { texto: "Sim — a mesma alíquota se aplica a todos os tipos de depósito", correta: false },
      { texto: "Não — existem alíquotas diferentes para depósitos à vista, a prazo e de poupança", correta: true },
      { texto: "O compulsório só incide sobre depósitos à vista; poupança e CDB são isentos", correta: false },
      { texto: "A alíquota do compulsório é definida pelo CMN, não pelo Banco Central", correta: false },
    ],
  },

  // open-market-redesconto (6 questões)
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "O Banco Central vende títulos públicos no mercado aberto. Que tipo de política monetária essa operação representa?",
    explicacao: "Ao VENDER títulos, o BC recebe dinheiro dos bancos → esse dinheiro SAI de circulação → menos liquidez no sistema → juros sobem → crédito encarece → política CONTRACIONISTA (aperta o crédito para conter inflação). Mnemônico: BC vende = retira dinheiro do sistema.",
    opcoes: [
      { texto: "Expansionista, pois o BC está injetando moeda na economia", correta: false },
      { texto: "Contracionista, pois o BC retira dinheiro do sistema ao receber o pagamento dos títulos", correta: true },
      { texto: "Neutra — operações de mercado aberto não afetam a liquidez", correta: false },
      { texto: "Expansionista apenas se os títulos forem comprados por pessoas físicas", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Por que as operações de mercado aberto são consideradas o instrumento mais ágil e preciso de política monetária?",
    explicacao: "As operações de mercado aberto ocorrem diariamente (várias vezes por dia), permitem ao BC regular a liquidez em tempo real com volumes exatos, e são reversíveis no dia seguinte (uma venda pode ser desfeita com uma compra). São mais rápidas que alterar o compulsório (efeito brusco) ou a Selic (decisão bimestral).",
    opcoes: [
      { texto: "Porque alteram permanentemente a base monetária, com efeito duradouro", correta: false },
      { texto: "Porque são gratuitas para os bancos, incentivando maior participação", correta: false },
      { texto: "Porque ocorrem diariamente, permitem ajuste preciso da liquidez e são reversíveis", correta: true },
      { texto: "Porque são o único instrumento que o COPOM pode usar sem aprovação do CMN", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "O que são 'operações compromissadas' no contexto do mercado aberto?",
    explicacao: "Operações compromissadas são aquelas em que o BC vende títulos com compromisso de recompra (ou compra com compromisso de revenda) em data futura. Isso garante que o efeito seja temporário e controlado — o BC não perde os títulos permanentemente. É o formato mais comum das operações de mercado aberto no Brasil.",
    opcoes: [
      { texto: "Operações em que o BC compra títulos diretamente de investidores pessoa física", correta: false },
      { texto: "Compras ou vendas de títulos com compromisso de reversão em data futura", correta: true },
      { texto: "Operações autorizadas pelo CMN para situações de emergência fiscal", correta: false },
      { texto: "Empréstimos do BC para o Tesouro Nacional cobertos por garantia de títulos", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Um banco comercial está com problema agudo de liquidez no curtíssimo prazo. Qual instrumento do Banco Central pode ser acionado?",
    explicacao: "O redesconto é o empréstimo de curtíssimo prazo do Banco Central para bancos com problema de liquidez imediata. O banco entrega títulos como garantia e recebe recursos. É o 'emprestador de última instância'. A taxa cobrada é a taxa de redesconto — se alta, desestimula o recurso; se baixa, facilita.",
    opcoes: [
      { texto: "Compulsório — o banco pode resgatar o valor recolhido ao BC quando precisar", correta: false },
      { texto: "Mercado aberto — o banco vende títulos diretamente ao público para captar recursos", correta: false },
      { texto: "Redesconto — empréstimo de curtíssimo prazo do BC com títulos como garantia", correta: true },
      { texto: "Selic — o banco solicita ao COPOM uma redução emergencial da taxa", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Por que bancos que recorrem frequentemente ao redesconto são vistos negativamente pelo mercado?",
    explicacao: "O redesconto é um instrumento de EMERGÊNCIA, não de rotina. Bancos que o utilizam frequentemente sinalizam ao mercado que têm problemas estruturais de liquidez — isso gera 'estigma'. Por isso, o instrumento funciona mais como uma ameaça regulatória do que como ferramenta de uso diário.",
    opcoes: [
      { texto: "Porque o BC publica a lista de bancos que usam o redesconto, expondo-os ao público", correta: false },
      { texto: "Porque o uso frequente sinaliza problemas de liquidez e gera estigma no mercado", correta: true },
      { texto: "Porque o uso do redesconto implica intervenção do CMN na gestão do banco", correta: false },
      { texto: "Porque o redesconto tem custo zero e os bancos perdem credibilidade por usar subsídio público", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Assinale a alternativa que descreve corretamente a política monetária EXPANSIONISTA:",
    explicacao: "Política expansionista = BC frouxa o dinheiro para estimular a economia (usada em recessão): Selic CAI, compulsório CAI, BC COMPRA títulos no mercado aberto, taxa de redesconto CAI. Resultado: crédito barato → consumo sobe → economia aquece (mas inflação pode subir).",
    opcoes: [
      { texto: "BC sobe a Selic, aumenta o compulsório e vende títulos no mercado aberto", correta: false },
      { texto: "BC reduz a Selic, diminui o compulsório e compra títulos no mercado aberto", correta: true },
      { texto: "BC mantém a Selic e vende títulos para controlar a base monetária", correta: false },
      { texto: "BC aumenta o compulsório e compra títulos simultaneamente para equilibrar a liquidez", correta: false },
    ],
  },

  // banco-central-funcoes (6 questões extras)
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O Banco Central do Brasil é classificado como qual tipo de entidade no SFN?",
    explicacao: "O BCB é uma autarquia federal vinculada ao Ministério da Fazenda, criada pela Lei 4.595/1964. Desde a LC 179/2021, possui autonomia operacional formal, com mandatos fixos para seus diretores e objetivo primário de estabilidade de preços.",
    opcoes: [
      { texto: "Empresa pública federal, com capital social do governo", correta: false },
      { texto: "Órgão normativo máximo do SFN, superior ao CMN", correta: false },
      { texto: "Autarquia federal com autonomia operacional e mandatos fixos desde 2021", correta: true },
      { texto: "Fundação pública vinculada ao Ministério do Planejamento", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "Quem fabrica fisicamente as cédulas e moedas do Real no Brasil?",
    explicacao: "A fabricação física das cédulas e moedas é feita pela Casa da Moeda do Brasil, empresa pública vinculada ao Ministério da Fazenda. O Banco Central AUTORIZA e CONTROLA o volume de emissão, mas não fabrica as cédulas diretamente. Essa distinção cai frequentemente em provas.",
    opcoes: [
      { texto: "O Banco Central do Brasil, que tem exclusividade na emissão de moeda", correta: false },
      { texto: "O Tesouro Nacional, que financia a produção de cédulas", correta: false },
      { texto: "A Casa da Moeda do Brasil, vinculada ao Ministério da Fazenda", correta: true },
      { texto: "A FEBRABAN, que coordena a logística de distribuição de cédulas", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "A LC 179/2021 formalizou a autonomia do Banco Central. Qual é o objetivo PRIMÁRIO do BC definido por essa lei?",
    explicacao: "A LC 179/2021 definiu que o objetivo primário do BCB é a ESTABILIDADE DE PREÇOS (controle da inflação). O desenvolvimento econômico e social é objetivo SECUNDÁRIO — o BC deve persegui-lo apenas quando não comprometer o objetivo principal. Isso isolou a política monetária de pressões políticas de curto prazo.",
    opcoes: [
      { texto: "Desenvolvimento econômico e geração de empregos", correta: false },
      { texto: "Estabilidade do sistema financeiro e prevenção de crises bancárias", correta: false },
      { texto: "Estabilidade de preços (controle da inflação)", correta: true },
      { texto: "Equilíbrio do câmbio e manutenção das reservas internacionais", correta: false },
    ],
  },
  // ── BLOCO 3: PRODUTOS E SERVIÇOS BANCÁRIOS — ~25 questões ──────

  // tipos-de-contas (5 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "tipos-de-contas",
    pergunta: "Um trabalhador com carteira assinada recebe seu salário em conta salário no Banco X. Ele deseja transferir recebimentos para o Banco Y, mas seu empregador alega que não pode fazer isso. Qual é a situação correta?",
    explicacao: "A portabilidade de conta salário é um DIREITO garantido pelo Banco Central. O trabalhador pode transferir os recebimentos para qualquer banco de sua preferência SEM necessidade de autorização do empregador. A conta salário é aberta pelo empregador, mas a portabilidade é unilateral do trabalhador.",
    opcoes: [
      { texto: "O empregador tem razão, pois o salário deve ser recebido na conta que ele definiu", correta: false },
      { texto: "O trabalhador pode solicitar portabilidade, mas precisa da assinatura do empregador", correta: false },
      { texto: "O trabalhador pode exercer a portabilidade unilateralmente, sem autorização do empregador", correta: true },
      { texto: "A portabilidade só é permitida uma vez por ano", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "tipos-de-contas",
    pergunta: "Sobre a conta salário, é INCORRETO afirmar que:",
    explicacao: "A conta salário NÃO permite cartão de crédito vinculado — essa é uma de suas restrições legais. A conta é aberta pelo EMPREGADOR (não pelo trabalhador), é isenta de tarifas, e o trabalhador tem direito a 5 saques e 2 extratos gratuitos por mês.",
    opcoes: [
      { texto: "É aberta pelo empregador para o crédito do salário", correta: false },
      { texto: "É isenta de tarifas para o trabalhador", correta: false },
      { texto: "Permite a emissão de cartão de crédito pelo banco", correta: true },
      { texto: "O trabalhador tem direito a saques e extratos gratuitos", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "tipos-de-contas",
    pergunta: "Quando a taxa Selic está em 10% a.a., qual é a forma de cálculo da rentabilidade da caderneta de poupança?",
    explicacao: "Quando a Selic está ACIMA de 8,5% a.a., a poupança rende TR + 0,5% ao mês (regime antigo). Quando a Selic está abaixo ou igual a 8,5%, a poupança rende 70% da Selic + TR (regime novo, criado em 2012). Com Selic a 10%, aplica-se o regime antigo: TR + 0,5%/mês.",
    opcoes: [
      { texto: "70% da Selic + TR", correta: false },
      { texto: "TR + 0,5% ao mês", correta: true },
      { texto: "100% do CDI + TR", correta: false },
      { texto: "IPCA + 0,5% ao mês", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "tipos-de-contas",
    pergunta: "Qual das afirmações abaixo descreve corretamente a conta corrente em comparação com a poupança?",
    explicacao: "A conta corrente permite movimentação irrestrita (emissão de cheques, TED, Pix, débito automático) e pode cobrar tarifas por seus serviços. A poupança tem a função principal de guardar dinheiro, com rendimento mensal garantido e isento de IR para pessoa física.",
    opcoes: [
      { texto: "A conta corrente rende TR + 0,5% ao mês, enquanto a poupança não tem rendimento", correta: false },
      { texto: "A poupança permite emissão de cheques, enquanto a conta corrente não rende juros", correta: false },
      { texto: "A conta corrente permite movimentação ampla e pode cobrar tarifas; a poupança tem rendimento isento de IR", correta: true },
      { texto: "Ambas têm o mesmo rendimento e a mesma finalidade", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "tipos-de-contas",
    pergunta: "O Banco Central regulamenta a cesta de serviços essenciais gratuitos para contas correntes. Qual conjunto corresponde corretamente a esses serviços?",
    explicacao: "A Resolução CMN determina que bancos devem oferecer gratuitamente: 4 saques/mês, 4 extratos/mês, 2 TEDs/mês (DOC/TED por terminal eletrônico), 1 cartão de débito/mês e consultas por internet banking ilimitadas. Esses serviços essenciais não podem ser cobrados.",
    opcoes: [
      { texto: "Saques ilimitados, extratos ilimitados e 1 cartão de crédito gratuito", correta: false },
      { texto: "4 saques, 4 extratos, 2 TEDs e 1 cartão de débito por mês", correta: true },
      { texto: "2 saques, 2 extratos e emissão de talão de cheques gratuito", correta: false },
      { texto: "Todos os serviços são gratuitos para quem tem conta corrente há mais de 1 ano", correta: false },
    ],
  },

  // cartoes-credito-debito (4 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "cartoes-credito-debito",
    pergunta: "Um cliente usa seu cartão Visa emitido pelo Banco do Brasil para pagar em uma loja. Qual entidade efetua a liquidação financeira da operação, transferindo os recursos ao lojista?",
    explicacao: "A BANDEIRA (Visa, Mastercard) define a rede de aceitação e as regras do sistema, mas NÃO é quem liquida os recursos. Quem transfere o dinheiro para o lojista é o banco EMISSOR (Banco do Brasil, no caso). A bandeira é intermediária tecnológica e normativa, não financeira.",
    opcoes: [
      { texto: "A Visa, pois ela é responsável pelo sistema de pagamento", correta: false },
      { texto: "O Banco do Brasil, como banco emissor do cartão", correta: true },
      { texto: "O Banco Central, que liquida todas as transações eletrônicas", correta: false },
      { texto: "A credenciadora (adquirente) do lojista, que repassa direto ao emitente", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "cartoes-credito-debito",
    pergunta: "Um consumidor paga apenas o mínimo da fatura do cartão de crédito por três meses consecutivos. O saldo restante é financiado pelo crédito rotativo. Qual é a consequência mais grave dessa prática?",
    explicacao: "O crédito rotativo é o tipo de crédito mais caro do mercado brasileiro, com taxas que podem superar 15% ao mês (quase 400% ao ano). Pagar apenas o mínimo faz o saldo devedor crescer exponencialmente, gerando uma espiral de endividamento difícil de sair.",
    opcoes: [
      { texto: "O banco cancela o cartão após 3 meses de pagamento mínimo", correta: false },
      { texto: "O saldo é renegociado automaticamente com taxa de consignado", correta: false },
      { texto: "O saldo restante é financiado pela taxa do rotativo, que pode superar 15% ao mês", correta: true },
      { texto: "A Susep intervém para limitar os juros cobrados", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "cartoes-credito-debito",
    pergunta: "Qual é a principal diferença entre o cartão de débito e o cartão de crédito no momento da compra?",
    explicacao: "No débito, o valor é debitado IMEDIATAMENTE da conta corrente. No crédito, a compra é registrada e cobrada na fatura seguinte (prazo de até ~40 dias). O crédito também permite parcelamento; o débito não. Isso faz do crédito um instrumento de financiamento de consumo.",
    opcoes: [
      { texto: "O cartão de débito tem limite de crédito pré-aprovado pelo banco", correta: false },
      { texto: "O cartão de crédito debita o valor imediatamente da conta; o débito gera fatura", correta: false },
      { texto: "O cartão de débito desconta o valor na hora da conta; o crédito gera fatura futura", correta: true },
      { texto: "Ambos têm o mesmo funcionamento, diferindo apenas na bandeira", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "cartoes-credito-debito",
    pergunta: "Considerando a hierarquia de taxas de juros no Brasil, qual é a ordem CRESCENTE correta (da menor para a maior taxa)?",
    explicacao: "A hierarquia de taxas reflete o risco de inadimplência: Consignado (desconto em folha, menor risco) < CDC (bem como garantia) < Crédito pessoal (sem garantia) < Cheque especial (disponível sem solicitação) < Rotativo do cartão (pior cenário, maior inadimplência histórica).",
    opcoes: [
      { texto: "Rotativo < Cheque especial < Pessoal < Consignado", correta: false },
      { texto: "Consignado < CDC < Pessoal < Cheque especial < Rotativo", correta: true },
      { texto: "CDC < Consignado < Pessoal < Rotativo < Cheque especial", correta: false },
      { texto: "Pessoal < Consignado < CDC < Cheque especial < Rotativo", correta: false },
    ],
  },

  // captacao-cdb-lci-lca-poupanca (4 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "Qual a principal vantagem da LCI em relação ao CDB para o investidor pessoa física?",
    explicacao: "A LCI é isenta de Imposto de Renda para pessoa física — enquanto o CDB tem tributação regressiva de 22,5% (até 180 dias) a 15% (acima de 720 dias). Isso torna a LCI mais atrativa quando a taxa bruta equivalente for superior.",
    opcoes: [
      { texto: "A LCI tem rentabilidade sempre maior que o CDB", correta: false },
      { texto: "A LCI é garantida pelo FGC com valor superior ao CDB", correta: false },
      { texto: "A LCI é isenta de Imposto de Renda para pessoa física", correta: true },
      { texto: "A LCI tem liquidez diária, diferente do CDB", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "O Fundo Garantidor de Créditos (FGC) garante aplicações em CDB, LCI e LCA até qual valor por CPF por instituição?",
    explicacao: "O FGC cobre até R$ 250.000 por CPF por instituição financeira, com teto global de R$ 1.000.000 por CPF a cada 4 anos. CDB, LCI e LCA são cobertos; fundos de investimento não são.",
    opcoes: [
      { texto: "R$ 100.000 por CPF por instituição", correta: false },
      { texto: "R$ 250.000 por CPF por instituição", correta: true },
      { texto: "R$ 500.000 por CPF por instituição", correta: false },
      { texto: "Não há cobertura do FGC para esses produtos", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "A LCA (Letra de Crédito do Agronegócio) é um título emitido por instituições financeiras com a finalidade de financiar qual setor?",
    explicacao: "A LCA capta recursos para financiar o setor do agronegócio, da mesma forma que a LCI financia o setor imobiliário. Ambas são isentas de IR para pessoa física, têm cobertura do FGC até R$250.000 e são lastreadas em créditos concedidos pelo banco emissor.",
    opcoes: [
      { texto: "Setor industrial e de exportações", correta: false },
      { texto: "Setor imobiliário e de habitação", correta: false },
      { texto: "Setor do agronegócio", correta: true },
      { texto: "Setor público e financiamento de obras de infraestrutura", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "Um investidor aplica R$ 10.000 em um CDB por 200 dias. Qual alíquota de Imposto de Renda será aplicada sobre o rendimento?",
    explicacao: "A tributação do CDB é regressiva: até 180 dias = 22,5%; de 181 a 360 dias = 20%; de 361 a 720 dias = 17,5%; acima de 720 dias = 15%. Com 200 dias (entre 181 e 360), a alíquota é 20%.",
    opcoes: [
      { texto: "22,5%", correta: false },
      { texto: "20%", correta: true },
      { texto: "17,5%", correta: false },
      { texto: "15%", correta: false },
    ],
  },

  // credito-tipos-caracteristicas (5 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "O crédito consignado apresenta as menores taxas de juros entre as modalidades de crédito pessoal porque:",
    explicacao: "No crédito consignado, as parcelas são descontadas diretamente da folha de pagamento (ou benefício do INSS) antes de o valor chegar ao tomador. Isso reduz drasticamente o risco de inadimplência, pois o banco não depende da boa vontade do devedor para receber.",
    opcoes: [
      { texto: "É regulado pelo CMN com teto fixo de juros abaixo das demais modalidades", correta: false },
      { texto: "As parcelas são descontadas em folha, eliminando o risco de inadimplência", correta: true },
      { texto: "É garantido pelo FGC até R$ 250.000", correta: false },
      { texto: "O banco cobra tarifa adicional que compensa a taxa menor", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "No crédito imobiliário pelo Sistema Financeiro de Habitação (SFH), qual é o indexador permitido para corrigir as prestações?",
    explicacao: "O SFH usa a TR (Taxa Referencial) como indexador das prestações. O FGTS pode ser usado como garantia ou entrada. O SFH tem limites de valor do imóvel e taxa máxima de juros definidos pelo CMN.",
    opcoes: [
      { texto: "IPCA, que corrige as prestações pela inflação oficial", correta: false },
      { texto: "Taxa Selic, definida pelo Copom", correta: false },
      { texto: "TR (Taxa Referencial)", correta: true },
      { texto: "IGP-M, utilizado nos contratos de aluguel", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "Qual modalidade de crédito uma empresa utiliza para antecipar o recebimento de duplicatas (notas fiscais a prazo) junto ao banco?",
    explicacao: "O desconto de duplicatas (ou desconto de recebíveis) permite que a empresa antecipe o recebimento de vendas a prazo. O banco antecipa o valor, descontando os juros, e fica responsável pela cobrança na data de vencimento. É diferente do cheque especial ou do crédito pessoal.",
    opcoes: [
      { texto: "Crédito consignado para pessoas jurídicas", correta: false },
      { texto: "Cheque especial empresarial", correta: false },
      { texto: "Desconto de duplicatas (antecipação de recebíveis)", correta: true },
      { texto: "Crédito rural — custeio agrícola", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "O BNDES é classificado como banco de desenvolvimento. Qual é sua principal forma de atuar no crédito para empresas?",
    explicacao: "O BNDES não opera diretamente com o cliente final na maioria dos casos. Ele repassa recursos a taxas subsidiadas para bancos comerciais (repassadores), que emprestam às empresas. Essa estrutura é chamada de 'repasse do BNDES' e permite que o BNDES alcance mais empresas sem ter uma rede de agências.",
    opcoes: [
      { texto: "Concede crédito diretamente, sem intermediários, a qualquer empresa no Brasil", correta: false },
      { texto: "Financia apenas empresas estatais e projetos governamentais", correta: false },
      { texto: "Repassa recursos a bancos comerciais, que emprestam às empresas (crédito indireto)", correta: true },
      { texto: "Emite debêntures no mercado para captar recursos e financiar o governo", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "O cheque especial é uma modalidade de crédito que se caracteriza por:",
    explicacao: "O cheque especial é um limite de crédito pré-aprovado vinculado à conta corrente, que funciona automaticamente quando o saldo fica negativo. Por ser de fácil acesso (sem solicitação formal), tem das maiores taxas de juros do mercado — perdendo apenas para o rotativo do cartão de crédito.",
    opcoes: [
      { texto: "Ser a modalidade de menor taxa de juros, pois a conta corrente serve como garantia", correta: false },
      { texto: "Exigir aprovação especial do gerente a cada utilização", correta: false },
      { texto: "Ser um limite pré-aprovado de crédito com ativação automática quando a conta fica negativa", correta: true },
      { texto: "Ser exclusivo para pessoas jurídicas que precisam de capital de giro", correta: false },
    ],
  },

  // servicos-bancarios-pix-ted-doc-cambio (4 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "Qual é a principal característica que diferencia o Pix do TED e do DOC?",
    explicacao: "O Pix é instantâneo (liquidação em segundos), funciona 24h/7 dias da semana/365 dias do ano e é gratuito para pessoa física. O TED é liquidado no mesmo dia (se realizado no horário permitido, até às 17h). O DOC era liquidado no dia útil seguinte e foi descontinuado pelo BCB em 2024.",
    opcoes: [
      { texto: "O Pix é processado apenas em dias úteis, como o TED e o DOC", correta: false },
      { texto: "O Pix funciona 24h/7 dias com liquidação instantânea, sem custo para pessoa física", correta: true },
      { texto: "O Pix tem limite menor que o TED e é usado apenas para pequenos valores", correta: false },
      { texto: "O Pix é operado pela CVM, enquanto TED e DOC são operados pelo BCB", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "O Pix é operado por qual infraestrutura e qual órgão é seu gestor?",
    explicacao: "O Pix funciona no SPI — Sistema de Pagamentos Instantâneos, criado e operado pelo Banco Central do Brasil. O BCB atua como gestor do arranjo e como liquidante central. As instituições participantes se conectam ao SPI para processar as transações.",
    opcoes: [
      { texto: "STR (Sistema de Transferência de Reservas), gerido pelos bancos privados", correta: false },
      { texto: "SPI (Sistema de Pagamentos Instantâneos), gerido pelo Banco Central do Brasil", correta: true },
      { texto: "COMPE (Câmara de Compensação de Cheques), gerida pelo BCB", correta: false },
      { texto: "B3 (Bolsa de Valores), que liquida também pagamentos instantâneos", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "Uma empresa brasileira importa equipamentos dos EUA e precisa pagar o fornecedor em dólar. Qual operação bancária é necessária?",
    explicacao: "Para pagar em moeda estrangeira, a empresa realiza uma operação de câmbio — conversão de reais em dólares, intermediada por instituição autorizada pelo Banco Central a operar câmbio (bancos, corretoras de câmbio). O BCB regula todas as operações cambiais do país.",
    opcoes: [
      { texto: "TED internacional, pois o TED permite transferências para qualquer país", correta: false },
      { texto: "Operação de câmbio em banco autorizado pelo Banco Central", correta: true },
      { texto: "Pix internacional, disponível para pagamentos fora do Brasil", correta: false },
      { texto: "Emissão de cheque em reais aceito internacionalmente", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "O boleto bancário se diferencia do TED e do Pix porque:",
    explicacao: "O boleto é um instrumento de cobrança: o pagador usa o boleto para quitar uma dívida com o credor. O TED e o Pix são transferências diretas entre contas. O boleto também tem prazo de vencimento, pode ter desconto por antecipação e mora por atraso, e pode ser pago em qualquer banco.",
    opcoes: [
      { texto: "O boleto só pode ser pago no banco emissor, diferentemente do TED", correta: false },
      { texto: "O boleto é um instrumento de cobrança, podendo ser pago em qualquer banco", correta: true },
      { texto: "O boleto é operado pelo Banco Central via SPI, como o Pix", correta: false },
      { texto: "O boleto tem liquidação instantânea, igual ao Pix", correta: false },
    ],
  },

  // seguros-previdencia-pgbl-vgbl (3 questões)
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "Um servidor público que declara o Imposto de Renda pelo modelo completo decide contratar previdência privada. Qual plano permite deduzir as contribuições da base de cálculo do IR?",
    explicacao: "O PGBL permite deduzir até 12% da renda bruta anual na declaração completa do IR. O VGBL não oferece essa dedução — por isso é mais indicado para quem declara no modelo simplificado ou já atingiu o limite de dedução.",
    opcoes: [
      { texto: "VGBL, porque é isento de IR no resgate", correta: false },
      { texto: "PGBL, porque permite dedução de até 12% da renda bruta", correta: true },
      { texto: "Ambos permitem dedução idêntica", correta: false },
      { texto: "Nenhum dos dois permite dedução no IR", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "No momento do resgate, a principal diferença entre PGBL e VGBL quanto ao Imposto de Renda é:",
    explicacao: "No PGBL, o IR incide sobre o VALOR TOTAL resgatado (principal + rendimentos), pois o contribuinte deduziu aportes durante a fase de acumulação. No VGBL, o IR incide APENAS sobre os rendimentos, pois os aportes foram feitos com dinheiro já tributado.",
    opcoes: [
      { texto: "PGBL é isento de IR; VGBL paga IR sobre o total", correta: false },
      { texto: "No PGBL, IR incide sobre o total; no VGBL, apenas sobre os rendimentos", correta: true },
      { texto: "Ambos têm IR sobre o valor total resgatado", correta: false },
      { texto: "Ambos são isentos de IR no resgate por serem previdência privada", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "PGBL e VGBL são regulados por qual entidade supervisora?",
    explicacao: "PGBL e VGBL são planos de previdência complementar ABERTA — comercializados por seguradoras e bancos para qualquer pessoa. Por isso são regulados pela Susep (Superintendência de Seguros Privados), vinculada ao CNSP. A Previc regula apenas fundos de pensão FECHADOS.",
    opcoes: [
      { texto: "Previc, que supervisiona toda a previdência complementar no Brasil", correta: false },
      { texto: "CVM, pois são produtos de investimento de longo prazo", correta: false },
      { texto: "Susep, pois são planos de previdência complementar aberta", correta: true },
      { texto: "Banco Central, pois os planos são distribuídos por bancos", correta: false },
    ],
  },
  // ── BLOCO 4: MERCADO DE CAPITAIS E TÍTULOS PÚBLICOS — 18 questões

  // b3-cvm-estrutura-mercado-capitais (5 questões)
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "No mercado primário de ações, quem recebe o dinheiro das novas ações emitidas?",
    explicacao: "No mercado PRIMÁRIO, a empresa emite novas ações pela primeira vez e recebe diretamente o capital dos investidores. No mercado SECUNDÁRIO (B3), os investidores negociam ações já existentes entre si — e a empresa NÃO recebe nada dessa negociação. O IPO é o exemplo clássico de mercado primário.",
    opcoes: [
      { texto: "O investidor que compra as ações, como remuneração pelo risco assumido", correta: false },
      { texto: "A B3, que retém o valor como garantia das operações", correta: false },
      { texto: "A empresa emissora, que recebe capital para financiar suas atividades", correta: true },
      { texto: "O governo, via impostos sobre a emissão de novos títulos", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "Qual é a principal distinção entre a CVM e a B3 no mercado de capitais?",
    explicacao: "A CVM (Comissão de Valores Mobiliários) é o órgão REGULADOR e FISCALIZADOR — supervisiona e pune irregularidades (insider trading, fraudes). A B3 é a BOLSA DE VALORES — a infraestrutura onde as negociações efetivamente acontecem. São entidades distintas: uma é regulador público, a outra é operadora privada.",
    opcoes: [
      { texto: "CVM e B3 têm funções idênticas, sendo a B3 apenas uma filial da CVM", correta: false },
      { texto: "CVM é o regulador público que fiscaliza; B3 é a bolsa que opera as negociações", correta: true },
      { texto: "A B3 é regulada pelo Banco Central, enquanto a CVM regula apenas fundos imobiliários", correta: false },
      { texto: "A CVM é uma empresa privada; a B3 é uma autarquia federal", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "O que é um IPO (Initial Public Offering) e qual é o papel do processo de bookbuilding?",
    explicacao: "O IPO é a primeira oferta pública de ações de uma empresa — quando ela abre seu capital. No bookbuilding, a empresa e seus assessores coletam intenções de compra de investidores institucionais para definir o preço de lançamento das ações. Após o IPO, as ações passam a ser negociadas no mercado secundário (B3).",
    opcoes: [
      { texto: "IPO é a recompra de ações pela própria empresa; bookbuilding define o preço máximo permitido", correta: false },
      { texto: "IPO é a primeira oferta pública de ações; bookbuilding coleta intenções para definir o preço", correta: true },
      { texto: "IPO é qualquer emissão de ações; bookbuilding é o processo de auditoria da CVM", correta: false },
      { texto: "IPO e bookbuilding são dois nomes para o mesmo processo, realizados pela B3", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "Por que uma empresa pode preferir captar recursos emitindo ações em vez de contrair um empréstimo bancário?",
    explicacao: "Ao emitir ações, a empresa NÃO paga juros e NÃO devolve o principal — ela divide a propriedade e o risco com os investidores. O banco cobra juros fixos independentemente do lucro. Porém, ao emitir ações, a empresa perde parte do controle societário. A escolha depende do custo de capital e da estrutura de controle desejada.",
    opcoes: [
      { texto: "Porque ações têm custo zero para a empresa — não há remuneração ao acionista", correta: false },
      { texto: "Para não pagar juros nem devolver principal, dividindo propriedade e risco com investidores", correta: true },
      { texto: "Porque a CVM garante que as ações sempre valorizarão acima da inflação", correta: false },
      { texto: "Porque empréstimos bancários são proibidos para empresas de capital aberto", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "Qual é o código típico de uma ação ordinária (ON) de uma empresa na B3?",
    explicacao: "As ações ordinárias (ON) terminam em 3 na B3 (ex.: VALE3, PETR3). As ações preferenciais (PN) terminam em 4 (ex.: PETR4). As units (mistura de ON e PN) terminam em 11 (ex.: ITSA11). Esse padrão de codificação é cobrado em provas de Conhecimentos Bancários.",
    opcoes: [
      { texto: "Termina em 4 (ex.: VALE4)", correta: false },
      { texto: "Termina em 3 (ex.: VALE3)", correta: true },
      { texto: "Termina em 11 (ex.: VALE11)", correta: false },
      { texto: "Não há padrão definido — cada empresa escolhe seu código", correta: false },
    ],
  },

  // acoes-on-pn-direitos (5 questões)
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Qual é a característica que diferencia as ações ordinárias (ON) das ações preferenciais (PN)?",
    explicacao: "As ações ordinárias conferem direito a voto nas assembleias. As preferenciais geralmente não têm direito a voto, mas têm prioridade no recebimento de dividendos e, em caso de liquidação, recebem antes dos detentores de ON.",
    opcoes: [
      { texto: "Ações ON têm prioridade no recebimento de dividendos", correta: false },
      { texto: "Ações PN conferem direito a voto nas assembleias", correta: false },
      { texto: "Ações ON conferem direito a voto nas assembleias", correta: true },
      { texto: "Ações ON e PN têm os mesmos direitos patrimoniais", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Em caso de falência de uma empresa, qual classe de acionista tem prioridade no recebimento dos ativos?",
    explicacao: "Na falência, a ordem de recebimento é: credores trabalhistas → credores com garantia real → credores quirografários → debenturistas → acionistas PN → acionistas ON (por último). O acionista ON assume o maior risco — por isso em compensação tem direito a voto. O debenturista é credor, não sócio.",
    opcoes: [
      { texto: "Acionistas ON — pois têm mais poder de voto e controle da empresa", correta: false },
      { texto: "Acionistas PN — têm prioridade sobre ON em dividendos e na liquidação", correta: true },
      { texto: "Ambas as classes recebem proporcionalmente, sem distinção", correta: false },
      { texto: "Somente os credores recebem; acionistas não têm direito a receber nada", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "O que é tag along e qual é o percentual mínimo garantido por lei para ações ON?",
    explicacao: "Tag along é o direito dos acionistas minoritários de vender suas ações pelo mesmo preço (ou percentual dele) que o controlador recebeu na transferência de controle. Para ações ON, a lei garante MÍNIMO de 80% do preço pago ao controlador. Para PN, pode ou não existir — depende do estatuto.",
    opcoes: [
      { texto: "Tag along garante 100% do preço para ON e 50% para PN", correta: false },
      { texto: "Tag along garante mínimo de 80% para ON; para PN, depende do estatuto", correta: true },
      { texto: "Tag along só se aplica a ações PN, pois ON já têm proteção pelo direito de voto", correta: false },
      { texto: "Tag along é facultativo e definido pelo conselho de administração a cada operação", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Uma debênture e uma ação são instrumentos de captação diferentes porque:",
    explicacao: "Quem compra uma AÇÃO torna-se SÓCIO da empresa (participação societária) — compartilha lucro e prejuízo, não tem garantia de retorno. Quem compra uma DEBÊNTURE torna-se CREDOR — emprestou dinheiro e tem direito a receber juros + principal no vencimento, independentemente do lucro da empresa.",
    opcoes: [
      { texto: "Ação tem rentabilidade garantida; debênture depende do desempenho da empresa", correta: false },
      { texto: "Ação torna o investidor sócio; debênture torna o investidor credor com direito a juros", correta: true },
      { texto: "Ambas dão direito a voto nas assembleias, mas com pesos diferentes", correta: false },
      { texto: "Debênture e ação são sinônimos — ambas representam participação no capital", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "O que são debêntures incentivadas e qual é sua vantagem para o investidor pessoa física?",
    explicacao: "Debêntures incentivadas são emitidas por empresas de infraestrutura (energia elétrica, rodovias, saneamento, transporte). Em troca do financiamento a setores estratégicos, o governo concede ISENÇÃO DE IR para pessoa física. São reguladas pela CVM e não têm cobertura do FGC.",
    opcoes: [
      { texto: "São debêntures emitidas pelo governo federal com garantia do Tesouro Nacional", correta: false },
      { texto: "São isentas de IR para pessoa física por financiarem setores de infraestrutura", correta: true },
      { texto: "Têm garantia do FGC até R$250.000, diferente das debêntures comuns", correta: false },
      { texto: "São emitidas apenas por bancos públicos e têm rentabilidade pré-fixada", correta: false },
    ],
  },

  // titulos-publicos-tesouro-direto (8 questões)
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "Qual título público protege o investidor da inflação, garantindo ganho real acima do IPCA?",
    explicacao: "A NTN-B (Tesouro IPCA+) paga IPCA + uma taxa prefixada. Isso garante que o investidor sempre terá rendimento acima da inflação, preservando o poder de compra. LTN é prefixado sem proteção inflacionária; LFT acompanha a Selic.",
    opcoes: [
      { texto: "LTN (Tesouro Prefixado)", correta: false },
      { texto: "LFT (Tesouro Selic)", correta: false },
      { texto: "NTN-B (Tesouro IPCA+)", correta: true },
      { texto: "CDB pós-fixado", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "Um investidor compra uma LTN (Tesouro Prefixado) com taxa de 13% ao ano. Depois, o Banco Central sobe a Selic para 14,75%. O que acontece com o investimento?",
    explicacao: "Ao comprar uma LTN prefixada, o investidor TRAVOU a taxa de 13% a.a. Se a Selic subir depois, quem comprou LFT (Tesouro Selic) passa a ganhar mais que 13%. O investidor da LTN 'perdeu' em relação à alternativa, mas ainda recebe os 13% acordados se ficar até o vencimento. Se quiser vender antes, receberá menos.",
    opcoes: [
      { texto: "O título se valoriza, pois a Selic alta aumenta a rentabilidade do prefixado", correta: false },
      { texto: "A taxa do título sobe automaticamente para acompanhar a nova Selic", correta: false },
      { texto: "O investidor mantém a taxa contratada de 13%, mas perde em relação a quem ficou na LFT", correta: true },
      { texto: "O Tesouro Nacional recompra o título à taxa original sem nenhum custo ao investidor", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "Qual título público é mais indicado para um investidor conservador que quer manter liquidez e acompanhar a taxa básica de juros?",
    explicacao: "O LFT (Tesouro Selic) é o título mais conservador e de maior liquidez do Tesouro Direto. Seu preço varia muito pouco (baixíssima marcação a mercado), pois acompanha a Selic diariamente. É ideal para reserva de emergência e para quem pode precisar do dinheiro a qualquer momento.",
    opcoes: [
      { texto: "NTN-B (Tesouro IPCA+) com juros semestrais, pela alta rentabilidade", correta: false },
      { texto: "LTN (Tesouro Prefixado), pois trava uma boa taxa sem risco de variação", correta: false },
      { texto: "LFT (Tesouro Selic), pela baixa volatilidade e liquidez diária", correta: true },
      { texto: "CDB de banco grande, pois tem FGC e rende mais que os títulos públicos", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "O Tesouro Direto é gerido pelo Tesouro Nacional ou pelo Banco Central?",
    explicacao: "O Tesouro Direto é um programa do TESOURO NACIONAL (Secretaria do Tesouro Nacional, vinculada ao Ministério da Fazenda). O Banco Central executa a política monetária e opera o STR, mas não gere os títulos públicos — essa é função do Tesouro. A plataforma do Tesouro Direto foi desenvolvida em parceria com a B3.",
    opcoes: [
      { texto: "Pelo Banco Central, que emite e vende títulos para financiar a política monetária", correta: false },
      { texto: "Pelo Tesouro Nacional (Ministério da Fazenda), em parceria com a B3", correta: true },
      { texto: "Pela CVM, que regula todos os investimentos de renda fixa no Brasil", correta: false },
      { texto: "Pelo CMN, que autoriza a emissão de novos títulos a cada reunião", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "Qual é o investimento de menor risco no Brasil e por quê?",
    explicacao: "Os títulos públicos federais (Tesouro Direto) são os investimentos de MENOR RISCO do Brasil, pois são garantidos pelo governo federal. O risco é o risco soberano do país — para deixar de pagar, o país teria que declarar calote (default), o que tornaria todo o sistema financeiro instável. CDB tem risco do banco; ação tem risco de mercado.",
    opcoes: [
      { texto: "CDB de banco estatal, pois tem garantia governamental e do FGC simultaneamente", correta: false },
      { texto: "Poupança, pois é isenta de IR e o governo sempre garantiu seu valor historicamente", correta: false },
      { texto: "Títulos públicos federais (Tesouro Direto), garantidos pelo governo federal", correta: true },
      { texto: "Fundo DI de banco grande, pela diversificação e gestão profissional", correta: false },
    ],
  },

  // ── BLOCO 5: REGULAÇÃO, ÉTICA E TEMAS TRANSVERSAIS — 20 questões

  // lavagem-de-dinheiro-lei-9613 (6 questões)
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Em qual fase da lavagem de dinheiro o criminoso realiza diversas transações complexas para disfarçar a origem ilícita dos recursos?",
    explicacao: "A ocultação (layering) é a segunda fase. É quando se realizam operações complexas — transferências internacionais, compra e venda de ativos, empresas laranjas — para dificultar o rastreamento da origem ilícita do dinheiro.",
    opcoes: [
      { texto: "Colocação (placement)", correta: false },
      { texto: "Ocultação (layering)", correta: true },
      { texto: "Integração (integration)", correta: false },
      { texto: "Estratificação", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Na primeira fase da lavagem de dinheiro, o criminoso faz vários depósitos fracionados em diferentes bancos, abaixo do limite de reporte obrigatório. Qual fase é essa e qual técnica usa?",
    explicacao: "Essa é a fase de COLOCAÇÃO (placement) — o dinheiro ilícito entra no sistema financeiro formal pela primeira vez. A técnica de fazer vários pequenos depósitos para ficar abaixo dos limites de reporte é chamada de 'smurfing' ou 'fracionamento'. Depósitos acima de R$100.000 devem ser reportados ao COAF automaticamente.",
    opcoes: [
      { texto: "Ocultação — o criminoso está escondendo a trilha do dinheiro com múltiplas transações", correta: false },
      { texto: "Integração — o dinheiro já está sendo reinvestido em ativos legais", correta: false },
      { texto: "Colocação — é a entrada do dinheiro ilícito no sistema financeiro pela primeira vez", correta: true },
      { texto: "Estratificação — técnica exclusiva da terceira fase da lavagem", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Um gerente de banco percebe que um cliente fez uma operação suspeita de lavagem de dinheiro. Qual é a conduta correta?",
    explicacao: "O funcionário deve comunicar a operação suspeita ao COAF, SEM avisar o cliente. Avisar o cliente suspeito é expressamente PROIBIDO pela Lei 9.613/98 — configura crime de obstrução à investigação. O cliente não pode ser alertado para que não fuja ou destrua evidências.",
    opcoes: [
      { texto: "Informar o cliente para que ele regularize a situação antes de reportar", correta: false },
      { texto: "Comunicar internamente ao compliance e ao COAF, sem informar o cliente", correta: true },
      { texto: "Recusar a operação e registrar em ata, sem necessidade de comunicar ao COAF", correta: false },
      { texto: "Aguardar 3 operações suspeitas do mesmo cliente antes de reportar ao COAF", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "A qual órgão os bancos devem reportar operações suspeitas de lavagem de dinheiro?",
    explicacao: "As operações suspeitas devem ser comunicadas ao COAF — Conselho de Controle de Atividades Financeiras, vinculado ao Banco Central do Brasil (desde 2019). O COAF não investiga crimes — ele recebe, analisa e encaminha informações às autoridades competentes (PF, MP, CGU). É uma Unidade de Inteligência Financeira (UIF).",
    opcoes: [
      { texto: "À Polícia Federal, que tem competência exclusiva para investigar crimes financeiros", correta: false },
      { texto: "Ao Ministério Público, que abre inquérito imediatamente", correta: false },
      { texto: "Ao COAF, que analisa e encaminha às autoridades competentes sem investigar diretamente", correta: true },
      { texto: "À Receita Federal, pois lavagem de dinheiro implica evasão fiscal", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "O que é o princípio KYC (Know Your Customer) e por que é obrigatório para os bancos?",
    explicacao: "KYC — 'Conheça seu Cliente' — é a obrigação legal de identificar e cadastrar clientes com documentos válidos, verificar a origem dos recursos e monitorar o perfil das operações. É fundamental para detectar lavagem de dinheiro: sem conhecer o cliente, o banco não consegue identificar o que é suspeito versus o que é normal para aquele perfil.",
    opcoes: [
      { texto: "É uma opção voluntária dos bancos para oferecer serviços personalizados de crédito", correta: false },
      { texto: "É obrigação legal de identificar, cadastrar clientes e monitorar operações para prevenir lavagem", correta: true },
      { texto: "É o processo de análise de crédito para concessão de empréstimos consignados", correta: false },
      { texto: "É uma norma da FEBRABAN aplicada apenas a clientes de alta renda", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Na fase de INTEGRAÇÃO da lavagem de dinheiro, qual é a característica do dinheiro?",
    explicacao: "Na integração (terceira e última fase), o dinheiro retorna à economia com aparência completamente legal — via compra de imóveis, empresas, contratos simulados, investimentos. Nessa fase, é mais difícil para as autoridades rastrear a origem ilícita, pois as transações têm aparência totalmente legítima.",
    opcoes: [
      { texto: "O dinheiro entra no sistema financeiro pela primeira vez por meio de depósitos", correta: false },
      { texto: "O dinheiro passa por diversas transações para criar uma trilha confusa", correta: false },
      { texto: "O dinheiro retorna à economia com aparência legal, via imóveis e empresas", correta: true },
      { texto: "O dinheiro é bloqueado pelo COAF e confiscado pelas autoridades", correta: false },
    ],
  },

  // sigilo-bancario-lc-105-2001 (4 questões)
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "Com base na LC 105/2001 e na jurisprudência do STF, qual órgão pode acessar dados bancários SEM prévia autorização judicial?",
    explicacao: "O STF decidiu em 2016 que a Receita Federal pode acessar dados bancários diretamente, sem autorização judicial, para fins de fiscalização tributária. CPIs também podem. O Ministério Público, porém, precisa de ordem judicial.",
    opcoes: [
      { texto: "Ministério Público Estadual", correta: false },
      { texto: "Polícia Civil, em investigações criminais", correta: false },
      { texto: "Receita Federal, para fins de fiscalização tributária", correta: true },
      { texto: "Apenas o Poder Judiciário pode acessar", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "O sigilo bancário no Brasil é garantido fundamentalmente por qual tipo de norma?",
    explicacao: "O sigilo bancário é um direito constitucional (art. 5º, X e XII da CF/88), não uma criação dos bancos. A LC 105/2001 regulamenta como esse direito opera na prática — quem pode quebrar e em quais condições. Não é apenas um contrato entre banco e cliente, é uma garantia fundamental do cidadão.",
    opcoes: [
      { texto: "Por contrato entre o cliente e o banco, renovado anualmente", correta: false },
      { texto: "Por norma do CMN, que pode alterá-la a qualquer momento", correta: false },
      { texto: "Por direito constitucional (art. 5º, CF/88), regulamentado pela LC 105/2001", correta: true },
      { texto: "Por autorregulação da FEBRABAN, como código de ética voluntário", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "Uma CPI (Comissão Parlamentar de Inquérito) pode quebrar o sigilo bancário de um investigado sem decisão judicial?",
    explicacao: "Sim. As CPIs têm poderes investigativos próprios equiparados ao Poder Judiciário — podem requisitar dados bancários diretamente, sem precisar de autorização judicial prévia. Isso está previsto na Constituição Federal (art. 58, §3º) e confirmado pelo STF.",
    opcoes: [
      { texto: "Não — somente o Poder Judiciário pode quebrar sigilo bancário no Brasil", correta: false },
      { texto: "Sim — as CPIs têm poderes investigativos constitucionais equiparados ao Judiciário", correta: true },
      { texto: "Apenas se aprovado por maioria qualificada do Congresso Nacional em sessão conjunta", correta: false },
      { texto: "Sim, mas apenas para investigar crimes cometidos por agentes públicos federais", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "Violar o sigilo bancário de um cliente sem autorização legal gera quais consequências?",
    explicacao: "A violação não autorizada do sigilo bancário gera responsabilidade em três esferas: civil (indenização ao cliente), administrativa (punição pelo BACEN ao banco) e penal (reclusão de 1 a 4 anos, conforme art. 10 da LC 105/2001). O sigilo é uma garantia séria e sua violação tem consequências graves.",
    opcoes: [
      { texto: "Apenas advertência administrativa ao banco responsável pela violação", correta: false },
      { texto: "Responsabilidade civil, administrativa e penal (até 4 anos de reclusão)", correta: true },
      { texto: "Somente multa financeira ao funcionário que violou o sigilo", correta: false },
      { texto: "A Lei 9.613/98 não prevê punição — o cliente deve buscar indenização na Justiça Civil", correta: false },
    ],
  },

  // fgc-fundo-garantidor-creditos (5 questões)
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Um investidor possui R$ 300.000 em CDB no Banco X. O banco entra em liquidação. Qual valor será ressarcido pelo FGC?",
    explicacao: "O FGC cobre até R$ 250.000 por CPF por instituição financeira. Como o investidor tem R$ 300.000, receberá apenas R$ 250.000. Os R$ 50.000 restantes ficam sujeitos ao processo de liquidação do banco.",
    opcoes: [
      { texto: "R$ 300.000 (valor integral)", correta: false },
      { texto: "R$ 250.000 (limite por instituição)", correta: true },
      { texto: "Nada, pois CDB não é coberto pelo FGC", correta: false },
      { texto: "R$ 200.000 (limite para pessoa física)", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Um investidor tem R$ 200.000 no Banco X e R$ 200.000 no Banco Y — sendo que X e Y pertencem ao mesmo conglomerado financeiro. Se ambos entrarem em liquidação, quanto o FGC pagará?",
    explicacao: "O FGC cobre por CPF por CONGLOMERADO, não por banco individual. Bancos do mesmo grupo econômico são tratados como uma única entidade. Portanto, R$ 400.000 em um único conglomerado → cobertura de apenas R$ 250.000 no total. Se fossem conglomerados diferentes, seria R$ 250.000 por cada.",
    opcoes: [
      { texto: "R$ 400.000 — R$ 200.000 de cada banco, pois são entidades distintas", correta: false },
      { texto: "R$ 500.000 — limite global do FGC é de R$ 500.000 por CPF", correta: false },
      { texto: "R$ 250.000 — o FGC cobre por conglomerado financeiro, não por banco isolado", correta: true },
      { texto: "Nada — o FGC não cobre depósitos em bancos que pertencem a conglomerados", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Qual é o teto GLOBAL de cobertura do FGC por CPF em um período de 4 anos?",
    explicacao: "O FGC tem dois limites: (1) R$ 250.000 por CPF por conglomerado financeiro (limite por instituição); e (2) R$ 1.000.000 por CPF a cada 4 anos (teto global). Esse teto global foi criado para evitar que investidores distribuam recursos indefinidamente entre instituições pequenas para maximizar a proteção do FGC.",
    opcoes: [
      { texto: "R$ 250.000 por CPF no total de todas as instituições", correta: false },
      { texto: "R$ 500.000 por CPF por ano", correta: false },
      { texto: "R$ 1.000.000 por CPF a cada 4 anos", correta: true },
      { texto: "Não há teto global — cada conta em cada banco tem cobertura de R$250.000", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Qual dos seguintes produtos NÃO tem cobertura do FGC?",
    explicacao: "Fundos de investimento NÃO são cobertos pelo FGC — o risco é do investidor. O FGC cobre: conta corrente, poupança, CDB, LCI, LCA, RDB e LC. NÃO cobre: fundos de investimento, debêntures, ações, COE e depósitos em instituições de pagamento (carteiras digitais).",
    opcoes: [
      { texto: "CDB emitido por banco de médio porte", correta: false },
      { texto: "Poupança em qualquer banco autorizado pelo BCB", correta: false },
      { texto: "Fundo de investimento de renda fixa de um grande banco", correta: true },
      { texto: "LCI emitida por banco com carteira imobiliária", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "O FGC é uma entidade pública ou privada? Quem o mantém financeiramente?",
    explicacao: "O FGC é uma entidade PRIVADA, sem fins lucrativos, mantida pelas próprias instituições financeiras associadas por meio de contribuições mensais proporcionais ao saldo de depósitos. Ele não é do governo e não usa dinheiro público. Sua função é garantir os depósitos dos clientes em caso de falência de associados.",
    opcoes: [
      { texto: "Pública — criada pelo Banco Central e mantida com recursos do governo federal", correta: false },
      { texto: "Privada, sem fins lucrativos, mantida por contribuições das instituições financeiras associadas", correta: true },
      { texto: "Mista — 50% público (BACEN) e 50% privado (bancos associados)", correta: false },
      { texto: "Pública — vinculada ao Ministério da Fazenda e gerida pelo Tesouro Nacional", correta: false },
    ],
  },

  // open-finance-pix-correspondentes (5 questões)
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "O Open Finance representa uma mudança de paradigma em relação ao sigilo bancário porque:",
    explicacao: "O Open Finance parte do princípio de que os dados financeiros pertencem ao CLIENTE, não ao banco. Com autorização expressa do cliente, os dados podem ser compartilhados entre instituições. Isso não viola o sigilo bancário — pois o próprio titular autoriza o compartilhamento, exercendo sua autodeterminação informativa.",
    opcoes: [
      { texto: "Elimina o sigilo bancário para todos os clientes que usam produtos digitais", correta: false },
      { texto: "O cliente autoriza o compartilhamento de seus dados — o titular decide, não o banco", correta: true },
      { texto: "É uma exceção ao sigilo bancário criada pelo CMN para beneficiar fintechs", correta: false },
      { texto: "Aplica-se apenas a pessoas jurídicas, pois pessoas físicas têm sigilo absoluto", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "A participação no Pix é obrigatória para todas as instituições financeiras?",
    explicacao: "A participação no Pix é OBRIGATÓRIA para instituições financeiras com mais de 500 mil contas ativas. Para instituições menores, a participação é opcional. Essa regra foi estabelecida pelo Banco Central para garantir abrangência nacional ao sistema de pagamentos instantâneos.",
    opcoes: [
      { texto: "Sim — todas as instituições financeiras são obrigadas a oferecer Pix", correta: false },
      { texto: "Não — o Pix é um serviço opcional que cada banco oferece voluntariamente", correta: false },
      { texto: "Obrigatória para instituições com mais de 500 mil contas ativas; opcional para menores", correta: true },
      { texto: "Obrigatória apenas para bancos públicos; bancos privados podem escolher não participar", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Os correspondentes bancários (lotéricas, farmácias) que atuam em nome de bancos estão sujeitos às normas de prevenção à lavagem de dinheiro?",
    explicacao: "Sim. Os correspondentes atuam como extensão do banco contratante e, portanto, estão sujeitos às mesmas obrigações de KYC e prevenção à lavagem. O banco CONTRATANTE é responsável pelos atos do correspondente — deve monitorá-lo, auditá-lo e pode ser punido pelos seus erros. A Febraban criou sistema de autorregulação específico para correspondentes.",
    opcoes: [
      { texto: "Não — correspondentes são empresas independentes e não têm obrigações bancárias", correta: false },
      { texto: "Sim — atuam como extensão do banco e o banco contratante é responsável por seus atos", correta: true },
      { texto: "Apenas os correspondentes que operam crédito consignado têm essas obrigações", correta: false },
      { texto: "Somente se o correspondente tiver mais de 5 funcionários dedicados a serviços bancários", correta: false },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcards = [
  // ── BLOCO 1: SISTEMA FINANCEIRO NACIONAL — 18 flashcards ─────

  // estrutura-sfn-3-niveis (5 flashcards)
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Quais são os 3 segmentos do SFN e quem está em cada um?",
    verso: "NORMATIVO: CMN, CNSP, CNPC — criam as regras\nSUPERVISOR: BCB, CVM, Susep, Previc — fiscalizam\nOPERADOR: bancos, corretoras, seguradoras, B3 — executam\n\nRegra de ouro: nenhum órgão do nível 1 fiscaliza; nenhum do nível 3 cria normas." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Qual a diferença entre CMN e Banco Central?",
    verso: "CMN = NORMATIZA (cria regras, fixa metas, define diretrizes). Nunca fiscaliza nem pune.\nBanco Central = SUPERVISIONA E EXECUTA. Pune bancos, emite moeda, faz política monetária.\nMacete: CMN = regra. BCB = ação." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Quais são os órgãos normativos do SFN e o que cada um regula?",
    verso: "CMN → sistema financeiro (bancos, câmbio, crédito, moeda)\nCNSP → seguros, capitalização e previdência aberta (PGBL, VGBL)\nCNPC → previdência complementar fechada (fundos de pensão como Previ, Funcef)" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Qual é a lei que criou o Sistema Financeiro Nacional?",
    verso: "Lei nº 4.595/1964. Ela estruturou o SFN pela primeira vez, criando o CMN e o Banco Central e definindo os três segmentos (normativo, supervisor, operador). Antes dela, o sistema era fragmentado e sem regulação centralizada." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "O que é intermediação financeira e por que precisa ser regulada?",
    verso: "Intermediação financeira = conectar quem poupa com quem precisa de crédito (via bancos).\nPrecisa ser regulada porque gera risco sistêmico: se um banco quebra pode contaminar todo o sistema. O SFN protege o poupador e estabiliza a economia." },

  // cmn-conselho-monetario-nacional (4 flashcards)
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "Quem compõe o CMN e quem o preside?",
    verso: "3 membros: Ministro da Fazenda (PRESIDENTE do CMN), Ministro do Planejamento e Orçamento, Presidente do Banco Central.\nEssa composição garante coordenação entre política fiscal e monetária." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "O CMN pode fiscalizar ou punir um banco por prática irregular?",
    verso: "NÃO. O CMN é APENAS normativo. Quem fiscaliza e pune bancos é o Banco Central. A CVM pune irregularidades no mercado de capitais.\nErro clássico de prova: atribuir ao CMN funções de fiscalização." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "Qual índice de preços é usado na meta de inflação definida pelo CMN?",
    verso: "IPCA — Índice Nacional de Preços ao Consumidor Amplo, calculado pelo IBGE.\nO CMN define a meta; o BCB (via Copom/Selic) é responsável por cumpri-la. Se descumprir, o presidente do BCB deve escrever carta aberta ao Ministro da Fazenda." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "O CMN fixa metas de inflação ou executa a política monetária?",
    verso: "O CMN apenas FIXA A META (define o alvo de inflação via IPCA).\nQuem EXECUTA a política monetária para atingir a meta é o Banco Central (Copom, Selic, open market, compulsório).\nCMN = planejador estratégico. BCB = executor operacional." },

  // banco-central-funcoes (4 flashcards)
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "Cite as 5 funções clássicas do Banco Central.",
    verso: "1. EMISSOR de moeda (exclusividade)\n2. BANCO DOS BANCOS (compulsório + redesconto)\n3. BANCO DO GOVERNO (reservas internacionais + Tesouro Nacional)\n4. EXECUTOR da política monetária (Copom/Selic/open market)\n5. SUPERVISOR/FISCALIZADOR das instituições financeiras" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "O que mudou com a LC 179/2021 (autonomia formal do BCB)?",
    verso: "O BCB ganhou AUTONOMIA OPERACIONAL FORMAL:\n• Diretores têm mandatos fixos de 4 anos\n• Mandatos não coincidem com o mandato presidencial\n• Objetivo: isolar a política monetária de pressões políticas\n• Antes: o presidente podia demitir diretores do BCB a qualquer momento" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "O que é o Copom e como funciona?",
    verso: "Comitê de Política Monetária do BCB. Define a META SELIC.\n• 8 reuniões por ano (a cada ~45 dias)\n• Composto pelo Presidente do BCB + 8 diretores\n• Reunião dura 2 dias; decisão divulgada no 2º dia\n• Publica ata detalhada dias depois" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "Qual a diferença entre 'banco do governo' e 'banco dos bancos' para o BCB?",
    verso: "BANCO DO GOVERNO: BCB gere as reservas internacionais e é agente financeiro do Tesouro Nacional.\nBANCO DOS BANCOS: BCB recebe o compulsório dos bancos e é emprestador de última instância (redesconto). Bancos com falta de liquidez recorrem ao BCB." },

  // cvm-susep-previc (3 flashcards)
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc",
    frente: "Qual entidade regula o PGBL e o VGBL?",
    verso: "Susep (Superintendência de Seguros Privados), vinculada ao CNSP.\nPGBL e VGBL são previdência ABERTA — vendidos por bancos/seguradoras para qualquer pessoa. Por isso: Susep, não Previc.\nA Previc cuida de fundos de pensão FECHADOS (Previ, Funcef etc.)." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc",
    frente: "Susep vs Previc: qual cuida de qual tipo de previdência?",
    verso: "SUSEP → previdência ABERTA (PGBL, VGBL — qualquer pessoa pode contratar em banco)\nPREVIC → previdência FECHADA (fundos de pensão — só funcionários de empresa específica)\nMnemônico: Susep = qualquer um pode Sair com o plano. Previc = plano Preso à empresa." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc",
    frente: "O que é insider trading e quem pune no Brasil?",
    verso: "Insider trading = usar informação privilegiada (não pública) para negociar valores mobiliários (ações, debêntures).\nQuem pune: CVM (administrativamente: multa, suspensão) + Poder Judiciário (penalmente: reclusão de 1 a 5 anos).\nÉ crime contra o mercado de capitais." },

  // instituicoes-operadoras-sfn (2 flashcards)
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "instituicoes-operadoras-sfn",
    frente: "Quais são as exclusividades da CEF no SFN?",
    verso: "1. Gestão do FGTS (Fundo de Garantia do Tempo de Serviço)\n2. PENHOR (empréstimo com garantia de bem pessoal: joias, relógios)\n3. Operação das LOTERIAS FEDERAIS (Mega-Sena, Lotofácil etc.)\n4. Principal agente do crédito HABITACIONAL (SFH, Minha Casa Minha Vida)" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "instituicoes-operadoras-sfn",
    frente: "Por que o banco de investimento não pode captar depósitos à vista?",
    verso: "Banco de investimento tem foco em LONGO PRAZO para empresas (underwriting, project finance, repasse BNDES).\nDepósito à vista é instrumento de CURTO PRAZO, incompatível com essa missão.\nSem depósito à vista = sem conta corrente para o público geral. Captam recursos via CDB longo prazo, repasses e mercado de capitais." },

  // ── BLOCO 2: BANCO CENTRAL E POLÍTICA MONETÁRIA — 20 flashcards ─

  // taxa-selic (6 flashcards)
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "O que é o Copom e quando se reúne?",
    verso: "Comitê de Política Monetária do BCB — define a META SELIC.\n• 8 reuniões por ano (a cada ~45 dias)\n• 9 membros: presidente do BCB + 8 diretores\n• Reunião dura 2 dias; decisão divulgada ao final do 2º dia\n• Publica ata em 6 dias úteis\nErro clássico: o Copom NÃO define a Selic Over (diária), só a Meta." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Qual a diferença entre Selic Meta e Selic Over?",
    verso: "SELIC META: definida pelo Copom a cada ~45 dias — é o alvo que orienta a política monetária.\nSELIC OVER: taxa efetiva das operações overnight entre bancos (lastreadas em títulos públicos). É a taxa real que os bancos cobram entre si no dia a dia.\nNa prática, a Over é muito próxima da Meta, mas não necessariamente igual." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Selic alta: quem se beneficia e quem é prejudicado?",
    verso: "BENEFICIADOS: investidores de renda fixa (CDB, Tesouro Selic, poupança), poupadores.\nPREJUDICADOS: tomadores de crédito (empréstimos ficam mais caros), empresas (custo do capital sobe), governo (dívida pública fica mais cara).\nNo câmbio: Selic alta ATRAI capital estrangeiro → dólar tende a cair." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Se a inflação está acima da meta, o Copom eleva ou reduz a Selic?",
    verso: "ELEVA a Selic (política contracionista).\nSelic alta → crédito mais caro → consumo cai → demanda recua → inflação cede.\nMnemônico: inflação SOBE → Selic SOBE. Recessão/desemprego → Selic CAI (expansionista)." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "O que é a 'carta aberta' do presidente do Banco Central?",
    verso: "Se a inflação ultrapassar o limite da banda definida pelo CMN, o presidente do BCB deve enviar 'carta aberta' ao Ministro da Fazenda explicando:\n1. As causas do descumprimento\n2. As providências tomadas para retomar a meta\n3. O prazo previsto para a convergência\nÉ uma medida de TRANSPARÊNCIA e ACCOUNTABILITY do sistema de metas." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "O BCB é autarquia, empresa pública ou ministério?",
    verso: "AUTARQUIA de natureza especial — pessoa jurídica de direito público com autonomia operacional garantida pela LC 179/2021.\nNão é empresa pública (não visa lucro) nem ministério (não é subordinado hierarquicamente ao poder político).\nSua autonomia garante que a política monetária não seja usada para fins eleitorais." },

  // deposito-compulsorio (4 flashcards)
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "O que é o depósito compulsório e qual seu efeito?",
    verso: "Percentual dos depósitos que os bancos OBRIGATORIAMENTE recolhem ao BCB, sem remuneração plena.\nCompulsório ALTO → menos recursos disponíveis para empréstimos → crédito contrai → desinflaciona.\nCompulsório BAIXO → mais recursos → crédito expande → estimula economia.\nInstrumento de calibração da liquidez bancária." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "O que é o efeito multiplicador bancário e como o compulsório o afeta?",
    verso: "Multiplicador = 1 / compulsório.\nSe compulsório = 20% → multiplicador = 5 → cada R$100 depositado gera até R$500 em crédito no sistema.\nCompulsório alto → multiplicador menor → expansão de crédito limitada.\nCompulsório baixo → multiplicador maior → sistema cria mais dinheiro.\nPor isso o compulsório é poderoso instrumento de política monetária." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "Em uma crise de liquidez bancária, o BCB pode reduzir o compulsório. Qual o objetivo?",
    verso: "Reduzir o compulsório libera recursos que os bancos tinham 'presos' no BCB, aumentando a liquidez imediata do sistema.\nEfeito: bancos voltam a emprestar entre si e para clientes → reduz o risco de corrida bancária.\nFoi usado pelo BCB na crise de 2008 e na pandemia de 2020 para injetar liquidez rapidamente." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "Compulsório vs Open Market: qual a diferença como instrumento de política monetária?",
    verso: "COMPULSÓRIO: altera estruturalmente a quantidade de crédito; impacto de médio/longo prazo; mais lento para ajustar.\nOPEN MARKET: operação diária e precisa; ajusta a liquidez de curto prazo (overnight); é o instrumento mais usado no cotidiano.\nO BCB usa Open Market diariamente; compulsório muda raramente e sinaliza movimentos estruturais." },

  // open-market-redesconto (5 flashcards)
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "Qual é o instrumento de política monetária mais usado pelo BCB no dia a dia?",
    verso: "Open Market (operações de mercado aberto).\nO BCB compra/vende títulos públicos diariamente para manter a Selic próxima à meta do Copom.\nVENDE títulos → retira dinheiro do mercado → Selic sobe (contracionista).\nCOMPRA títulos → injeta dinheiro → Selic cai (expansionista)." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "O BCB vende títulos públicos no open market. Isso é política contracionista ou expansionista?",
    verso: "CONTRACIONISTA.\nVender títulos = retirar dinheiro do mercado (os bancos pagam e o dinheiro sai de circulação).\nMenos dinheiro circulando → Selic sobe → crédito encarece → demanda cai → inflação recua.\nMnemônico: VENDE = retira = aperta. COMPRA = injeta = afrouxa." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "O que são operações compromissadas no open market?",
    verso: "São operações em que o BCB compra (ou vende) títulos COM COMPROMISSO de revenda (ou recompra) em data futura.\nSão temporárias — o BCB injeta ou retira liquidez por prazo determinado, sem alterar permanentemente o estoque de títulos do Tesouro.\nSão as operações mais comuns no dia a dia do BCB para calibrar a Selic." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "O que é o redesconto bancário?",
    verso: "Empréstimo do BCB para bancos com falta TEMPORÁRIA de liquidez (emprestador de última instância).\nO banco oferece títulos como garantia e paga a 'taxa de redesconto' (geralmente acima da Selic).\nFunção: evitar que problemas de liquidez de um banco virem crise sistêmica.\nO BCB usa o redesconto para garantir estabilidade, não para financiar bancos mal geridos." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "Por que o redesconto tem 'estigma' no mercado bancário?",
    verso: "Recorrer ao redesconto sinaliza para o mercado que o banco está com dificuldades de liquidez.\nOutros bancos podem recusar operações interbancárias com ele, agravando a crise.\nPor isso, bancos evitam o redesconto mesmo quando precisam — buscam alternativas no mercado interbancário primeiro.\nO BCB tenta manter o redesconto discreto para evitar o efeito pânico." },

  // banco-central-funcoes e politica monetaria (5 flashcards)
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Cite os 4 instrumentos clássicos de política monetária do BCB.",
    verso: "1. TAXA SELIC (instrumento principal via Copom)\n2. DEPÓSITO COMPULSÓRIO (percentual retido dos depósitos)\n3. OPEN MARKET (compra/venda de títulos públicos — mais usado)\n4. REDESCONTO (empréstimo de última instância para bancos)\nMnemônico: SCOR — Selic, Compulsório, Open market, Redesconto." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "Política CONTRACIONISTA: quais são os efeitos em cada instrumento?",
    verso: "Quando o BCB aperta a política para combater inflação:\n• Selic → SOBE\n• Compulsório → SOBE (menos crédito disponível)\n• Open market → BCB VENDE títulos (retira liquidez)\n• Redesconto → taxa SOBE (mais caro pedir empréstimo ao BCB)\nResultado: crédito encarece, consumo cai, inflação recua." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "Política EXPANSIONISTA: quais são os efeitos em cada instrumento?",
    verso: "Quando o BCB afrouxa a política para estimular a economia em recessão:\n• Selic → CAI\n• Compulsório → CAI (mais crédito disponível)\n• Open market → BCB COMPRA títulos (injeta liquidez)\n• Redesconto → taxa CAI (mais barato pedir ao BCB)\nResultado: crédito barato, consumo sobe, economia aquece." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "O que a LC 179/2021 mudou na relação do Banco Central com o governo?",
    verso: "Concedeu autonomia operacional formal ao BCB:\n• Diretores têm mandato fixo de 4 anos (escalonados)\n• Mandatos não coincidem com o mandato presidencial\n• Presidente da República não pode demitir diretores sem justa causa\n• Objetivo primário: estabilidade de preços (não mais 'desenvolvimento econômico' como prioridade igual)\nAntes: o governo podia pressionar/demitir diretores para alterar a política monetária." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Sistema de Metas de Inflação: como funciona no Brasil?",
    verso: "1. CMN define a META de inflação (via IPCA, calculado pelo IBGE)\n2. BCB (Copom) usa os instrumentos de política monetária para atingir a meta\n3. Se a inflação sair da banda, o presidente do BCB envia CARTA ABERTA ao Ministro da Fazenda\n4. O BCB publica o Relatório de Inflação trimestralmente\nFoi adotado no Brasil em 1999 após o Plano Real e a crise cambial." },

  // ── BLOCO 3: PRODUTOS E SERVIÇOS BANCÁRIOS — 18 flashcards ──────

  // tipos-de-contas (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "tipos-de-contas",
    frente: "Quais são as 3 principais contas bancárias e suas características centrais?",
    verso: "CONTA CORRENTE: movimentação ampla (Pix, TED, cheque, débito automático), pode ter tarifas, sem rendimento automático.\nPOUPANÇA: rendimento mensal garantido (TR+0,5% ou 70%Selic+TR), isenta de IR, mais limitada.\nCONTA SALÁRIO: aberta pelo EMPREGADOR, isenta de tarifas, sem cartão de crédito, portabilidade é direito do trabalhador." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "tipos-de-contas",
    frente: "Poupança: qual a regra de rentabilidade e quando muda?",
    verso: "SELIC > 8,5% a.a. → TR + 0,5% ao mês (regime antigo)\nSELIC ≤ 8,5% a.a. → 70% da Selic + TR (regime novo, desde 2012)\nRendimento é isento de IR para pessoa física. Credita mensalmente na 'data de aniversário' da aplicação." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "tipos-de-contas",
    frente: "O que é portabilidade de conta salário e como funciona?",
    verso: "DIREITO do trabalhador de receber seu salário em qualquer banco de sua escolha.\nO trabalhador pede ao banco de destino que solicite a portabilidade — SEM autorização do empregador.\nO empregador continua depositando no banco original; o banco redireciona para o banco destino automaticamente." },

  // cartoes-credito-debito (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "cartoes-credito-debito",
    frente: "Bandeira vs Emissor: qual é a diferença no cartão de crédito?",
    verso: "BANDEIRA (Visa, Mastercard): define a rede de aceitação e as regras do sistema. NÃO empresta dinheiro, NÃO liquida pagamentos.\nEMISSOR (banco): concede o limite de crédito, liquida pagamentos ao lojista, cobra a fatura do cliente.\nMacete: a bandeira é o 'idioma'; o banco é quem paga a conta." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "cartoes-credito-debito",
    frente: "O que é o crédito rotativo do cartão e por que é perigoso?",
    verso: "Crédito rotativo = financiar o saldo restante quando o cliente paga apenas o MÍNIMO da fatura.\nÉ o crédito com MAIOR taxa de juros do Brasil: pode ultrapassar 15% ao mês (≈400% ao ano).\nNova lei (2017): se o cliente não quitar o rotativo em 1 mês, o banco deve parcelar a dívida automaticamente em condições melhores." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "cartoes-credito-debito",
    frente: "Hierarquia de taxas de juros (crescente): qual é a ordem?",
    verso: "1º CONSIGNADO (menor) — desconto em folha, risco mínimo\n2º CDC (crédito direto ao consumidor) — bem financiado como garantia\n3º PESSOAL — sem garantia real\n4º CHEQUE ESPECIAL — acesso automático, alto risco\n5º ROTATIVO do cartão (maior) — pior histórico de inadimplência\nRegra: menos garantia = mais risco = mais juros." },

  // captacao-cdb-lci-lca-poupanca (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "CDB, LCI e LCA: quais são isentos de IR para pessoa física?",
    verso: "LCI (imobiliário) e LCA (agronegócio): ISENTOS de IR para pessoa física.\nCDB: IR REGRESSIVO — 22,5% (até 180 dias) → 20% (181-360) → 17,5% (361-720) → 15% (>720 dias).\nTodos têm cobertura do FGC até R$250.000 por CPF por instituição." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "Qual a diferença de lastro entre LCI e LCA?",
    verso: "LCI — Letra de Crédito IMOBILIÁRIO: lastreada em créditos do setor imobiliário (financiamentos de imóveis).\nLCA — Letra de Crédito do AGRONEGÓCIO: lastreada em créditos do setor agrícola.\nAmbas são emitidas por bancos para captar recursos destinados especificamente a esses setores." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "O FGC cobre poupança, CDB, LCI e LCA? Qual o limite?",
    verso: "SIM — poupança, conta corrente, CDB, LCI e LCA são cobertos pelo FGC.\nLimite: R$250.000 por CPF por instituição financeira.\nTeto global: R$1.000.000 por CPF a cada 4 anos.\nNÃO são cobertos: fundos de investimento, debêntures, ações." },

  // credito-tipos-caracteristicas (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "Por que o crédito consignado tem a taxa mais baixa entre os créditos pessoais?",
    verso: "A parcela é descontada diretamente da folha de pagamento (ou benefício INSS) ANTES de o dinheiro chegar ao tomador.\nRisco de inadimplência ≈ zero → banco aceita taxa muito menor.\nLimite legal: comprometimento máximo de 35% da renda líquida (30% consignado + 5% cartão consignado)." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que é CDC (Crédito Direto ao Consumidor)?",
    verso: "Modalidade de crédito em que o banco financia um bem específico para o consumidor (carro, eletrodoméstico, etc.).\nO bem financiado frequentemente serve como garantia — por isso taxa menor que crédito pessoal.\nPrazo e taxa são fixados no contrato. A diferença do consignado: não há desconto automático em folha." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O BNDES opera crédito direto ou indireto com as empresas?",
    verso: "BNDES atua principalmente de forma INDIRETA: repassa recursos (a taxas subsidiadas) para bancos comerciais parceiros (agentes repassadores), que emprestam às empresas.\nO BNDES também opera crédito DIRETO para grandes projetos de alto valor.\nNão tem rede de agências para o público em geral." },

  // servicos-bancarios-pix-ted-doc-cambio (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "Compare Pix, TED e DOC em prazo, horário e custo.",
    verso: "PIX: instantâneo (segundos), 24h/365 dias, GRATUITO para PF.\nTED: mesmo dia (se até ~17h em dia útil), dias úteis, pode ter tarifa.\nDOC: descontinuado pelo BCB em 2024 — liquidava no dia útil seguinte.\nMacete: Pix = o mais rápido e o mais democrático." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "O Pix é operado por qual sistema e quem o gere?",
    verso: "SPI — Sistema de Pagamentos Instantâneos, criado e operado pelo BANCO CENTRAL do Brasil.\nO BCB é o gestor do arranjo Pix e o liquidante central.\nO TED opera no STR (Sistema de Transferência de Reservas), também do BCB, mas com infraestrutura diferente." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "O que é câmbio e quem pode operar no Brasil?",
    verso: "Câmbio = conversão de moeda nacional (real) em moeda estrangeira (dólar, euro etc.) ou vice-versa.\nSomente instituições AUTORIZADAS pelo Banco Central podem operar câmbio: bancos, corretoras de câmbio, agências de turismo credenciadas.\nO BCB regula e supervisiona todas as operações cambiais." },

  // seguros-previdencia-pgbl-vgbl (3 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl",
    frente: "Qual a diferença de tributação entre PGBL e VGBL no resgate?",
    verso: "PGBL: IR incide sobre o VALOR TOTAL resgatado (principal + rendimentos) — porque os aportes foram deduzidos do IR durante a acumulação.\nVGBL: IR incide apenas sobre os RENDIMENTOS — aportes foram feitos com renda já tributada.\nPGBL compensa pela dedução anual de até 12% da renda bruta." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl",
    frente: "Para quem é mais indicado o PGBL e para quem é o VGBL?",
    verso: "PGBL → indicado para quem faz declaração COMPLETA do IR e tem renda tributável (aproveita a dedução de 12%).\nVGBL → indicado para quem declara no modelo SIMPLIFICADO ou já atingiu o limite de dedução do PGBL.\nRegra prática: se vai deduzir, escolha PGBL; se não vai, VGBL." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl",
    frente: "PGBL e VGBL são regulados por qual órgão supervisor?",
    verso: "SUSEP (Superintendência de Seguros Privados), vinculada ao CNSP.\nSão previdência complementar ABERTA — qualquer pessoa pode contratar em banco ou seguradora.\nNÃO confundir com Previc (fundos de pensão FECHADOS, como Previ e Funcef)." },
  // ── BLOCO 3 EXTRAS: PRODUTOS E SERVIÇOS BANCÁRIOS — 6 flashcards adicionais ─

  // captacao-cdb-lci-lca-poupanca extras (2 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "FGC cobre por conglomerado ou por banco individual?",
    verso: "Por CONGLOMERADO FINANCEIRO, não por banco individual.\nSe o Banco X e o Banco Y pertencem ao mesmo grupo econômico (conglomerado), os R$250.000 de cobertura valem para a SOMA dos saldos nos dois bancos.\nErro clássico: achar que distribuir entre bancos do mesmo grupo multiplica a cobertura. Só funciona se forem conglomerados DIFERENTES." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "IOF no CDB: quando incide e quando não incide?",
    verso: "IOF (Imposto sobre Operações Financeiras) incide sobre CDB apenas se o resgate for feito nos primeiros 29 dias.\nA partir do 30º dia: IOF = ZERO.\nIR regressivo permanece: 22,5% (até 180 dias) → 20% (181-360) → 17,5% (361-720) → 15% (>720 dias).\nAssim: resgate no dia 10 = IOF + IR; resgate no dia 200 = só IR (17,5% se entre 181-360 dias)." },

  // credito-tipos-caracteristicas extras (2 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que é leasing financeiro e como difere do operacional?",
    verso: "LEASING FINANCEIRO: prazo ≈ vida útil do bem; VRG (Valor Residual Garantido) geralmente baixo; cliente quase sempre exerce a opção de compra; risco e benefícios são do arrendatário. Similar a um financiamento disfarçado.\nLEASING OPERACIONAL: prazo menor; empresa (arrendadora) mantém riscos; bem normalmente devolvido no fim; sem VRG obrigatório. Semelhante a um aluguel de longo prazo.\nEm prova: financeiro ≈ compra parcelada; operacional ≈ aluguel." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que é o CDI e por que é referência para investimentos?",
    verso: "CDI — Certificado de Depósito Interbancário: título emitido por bancos para captar recursos de outros bancos em operações overnight.\nA TAXA CDI ≈ Selic Over (varia décimos acima ou abaixo).\nÉ a referência de custo de oportunidade para renda fixa: CDB '100% do CDI' significa que rende quanto os bancos cobram entre si — ou seja, o 'preço justo' do dinheiro sem risco." },

  // fundos de investimento (2 flashcards)
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "O que é come-cotas e quando ocorre?",
    verso: "Come-cotas é a cobrança antecipada do IR sobre fundos de investimento (RF e Multimercado).\nOcorre semestralmente: último dia útil de MAIO e NOVEMBRO.\nA alíquota é a menor da tabela regressiva vigente (15% para LP; 20% para CP).\nFundos de ações: NÃO têm come-cotas — IR só incide no resgate.\nImpacto: reduz o número de cotas do investidor (o IR é cobrado em cotas, não em reais)." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "Fundos de investimento têm cobertura do FGC?",
    verso: "NÃO. Fundos de investimento NÃO são cobertos pelo FGC.\nO investidor de fundo assume o risco de mercado — se os ativos caírem, a cota cai.\nFGC cobre produtos de CAPTAÇÃO do banco (CDB, poupança, LCI, LCA, conta corrente).\nFundo é uma carteira coletiva gerida por gestora profissional — o risco é do investidor, não do banco." },

  // ── BLOCO 4: MERCADO DE CAPITAIS E TÍTULOS PÚBLICOS — 15 flashcards ─

  // b3-cvm-estrutura-mercado-capitais (5 flashcards)
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "Qual a diferença entre mercado primário e mercado secundário?",
    verso: "PRIMÁRIO: empresa/governo emite o título pela 1ª vez → o dinheiro vai para o EMISSOR.\nSECUNDÁRIO: investidores negociam entre si após a emissão → dinheiro vai para o VENDEDOR, não para a empresa.\nIPO ocorre no primário. Depois, as ações são negociadas no secundário (B3).\nA empresa só capta recursos no mercado primário." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é a CVM e o que ela regula?",
    verso: "CVM — Comissão de Valores Mobiliários: autarquia federal que regula e fiscaliza o mercado de capitais.\nRegula: ações, debêntures, fundos de investimento, IPOs, insider trading.\nPune irregularidades (multas, suspensões) — é o 'policial' do mercado de capitais.\nNÃO confundir com B3 (bolsa que opera as negociações) — a CVM supervisiona, a B3 executa." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é a B3 e qual é sua função?",
    verso: "B3 — Brasil, Bolsa, Balcão: única bolsa de valores do Brasil (resultado da fusão BM&F + Bovespa + Cetip).\nFunções: organizar e operar as negociações de ações, derivativos e renda fixa privada.\nÉ uma empresa privada com fins lucrativos — não é órgão do governo.\nA B3 também faz a custódia e a liquidação das operações. CVM a supervisiona; B3 a executa." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é IPO e o que é bookbuilding?",
    verso: "IPO (Initial Public Offering): primeira oferta pública de ações — quando a empresa abre seu capital na bolsa.\nBOOKBUILDING: processo de coleta de intenções de compra dos investidores institucionais para DEFINIR O PREÇO do IPO.\nO banco coordenador organiza o livro de ordens, detecta a demanda real e estabelece um preço justo de lançamento.\nApós o IPO, as ações passam a ser negociadas no mercado secundário (B3)." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "Por que uma empresa emite ações em vez de pedir empréstimo bancário?",
    verso: "Ação = participação societária — a empresa NÃO paga juros e NÃO devolve o principal.\nEmpréstimo = dívida — há pagamento de juros fixos independentemente do lucro.\nVantagem da ação: não compromete o fluxo de caixa futuro com serviço de dívida.\nDesvantagem: a empresa dilui o controle societário — novos sócios entram com direitos.\nEscolha depende do custo de capital e da estrutura de controle desejada pelos fundadores." },

  // acoes-on-pn-direitos (5 flashcards)
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "Ação ON ou PN: qual dá direito a voto e qual tem prioridade em dividendos?",
    verso: "ON (Ordinária — código 3, ex.: VALE3):\n→ VOTO nas assembleias de acionistas\n→ Sem prioridade em dividendos\nPN (Preferencial — código 4, ex.: PETR4):\n→ Geralmente SEM voto\n→ PRIORIDADE em dividendos e na liquidação\nMnemônico: ON = vOta; PN = Prefere dividendo." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "Em caso de falência da empresa, qual é a ordem de recebimento dos credores e acionistas?",
    verso: "1º Créditos trabalhistas\n2º Créditos com garantia real\n3º Créditos quirografários (sem garantia)\n4º Debenturistas (são credores, não sócios)\n5º Acionistas PN (prioridade sobre ON)\n6º Acionistas ON (por último — maior risco, por isso têm direito a voto)\nRegra: quem assume mais risco vota mais." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "O que é tag along e qual o mínimo legal para ações ON?",
    verso: "Tag along: direito do acionista minoritário de vender suas ações pelo mesmo preço (ou %) pago ao controlador na transferência de controle da empresa.\nMÍNIMO LEGAL para ON: 80% do preço pago ao controlador.\nPara PN: depende do estatuto da empresa (pode ou não ter).\nGarante que acionistas menores não sejam prejudicados em operações de troca de controle." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "Debênture vs ação: qual é a diferença essencial?",
    verso: "DEBÊNTURE: o investidor vira CREDOR — empresta dinheiro à empresa e recebe juros + principal no vencimento.\nAÇÃO: o investidor vira SÓCIO — participa dos lucros e assume os riscos do negócio.\nDebenturista tem prioridade na falência; acionista é o último a receber.\nDebênture é renda fixa; ação é renda variável." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "O que são debêntures incentivadas e qual sua vantagem fiscal?",
    verso: "Debêntures emitidas por empresas de INFRAESTRUTURA (energia, rodovias, saneamento, transportes).\nVantagem para pessoa física: ISENÇÃO DE IR sobre os rendimentos.\nO governo oferece o benefício fiscal para estimular o investimento privado em infraestrutura.\nNão têm cobertura do FGC.\nSão reguladas pela CVM (são valores mobiliários, não depósitos bancários)." },

  // titulos-publicos-tesouro-direto (5 flashcards)
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Cite os 3 principais títulos do Tesouro Direto e suas características.",
    verso: "LTN (Tesouro Prefixado): taxa FIXA definida na compra; sem proteção à inflação; ideal quando se acredita que a Selic vai cair.\nNTN-B (Tesouro IPCA+): IPCA + taxa prefixada; PROTEGE da inflação; melhor para longo prazo.\nLFT (Tesouro Selic): segue a Selic diariamente; mínima volatilidade; ideal para reserva de emergência." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Por que a LFT (Tesouro Selic) é ideal para investidor conservador?",
    verso: "Baixíssima marcação a mercado: o preço da LFT varia muito pouco porque acompanha a Selic diariamente.\nLiquidez diária: pode vender a qualquer momento sem grande perda.\nSem risco de taxa: diferente da LTN (que perde valor se a Selic subir), a LFT sempre renderá a Selic do período.\nÉ a 'reserva de emergência' do Tesouro Direto." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "O que acontece com a LTN (Tesouro Prefixado) se a Selic subir após a compra?",
    verso: "A LTN mantém a taxa contratada — o investidor receberá os 13% (ou seja lá qual for) se ficar até o vencimento.\nPorém, se quiser vender ANTES do vencimento, o preço da LTN CAI (marcação a mercado negativa).\nIsso ocorre pois novos títulos no mercado passam a oferecer taxas maiores, desvalorizando os títulos antigos prefixados.\nRisco de mercado: LTN > LFT." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Qual título protege da inflação e garante ganho real?",
    verso: "NTN-B (Tesouro IPCA+): paga IPCA + taxa prefixada.\nGarante que o investidor sempre terá rendimento ACIMA da inflação (ganho real positivo).\nIdeal para objetivos de longo prazo (aposentadoria, planejamento de 10+ anos).\nRisco: se a taxa prefixada cair e o investidor vender antes do vencimento, pode realizar prejuízo." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Quem gere o Tesouro Direto: Tesouro Nacional ou Banco Central?",
    verso: "TESOURO NACIONAL (Secretaria do Tesouro Nacional — STN, vinculada ao Ministério da Fazenda).\nO BCB executa a política monetária e opera o STR, mas não gere títulos públicos do Tesouro.\nA plataforma do Tesouro Direto é gerida pela STN em parceria com a B3.\nErro clássico de prova: atribuir ao BCB a gestão do Tesouro Direto." },

  // ── BLOCO 5: REGULAÇÃO, ÉTICA E TEMAS TRANSVERSAIS — 15 flashcards ─

  // lavagem-de-dinheiro (5 flashcards)
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "Quais são as 3 fases da lavagem de dinheiro?",
    verso: "1. COLOCAÇÃO (placement): inserir o dinheiro ilícito no sistema financeiro (depósitos, compra de ativos)\n2. OCULTAÇÃO (layering): disfarçar a origem com transações complexas, empresas laranjas, transferências internacionais\n3. INTEGRAÇÃO (integration): reinserir o dinheiro com aparência legal na economia (imóveis, empresas)\nMnemônico: COI — Coloca, Oculta, Integra." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "O que é o COAF, onde está vinculado e o que faz?",
    verso: "COAF — Conselho de Controle de Atividades Financeiras.\nVinculado ao Banco Central do Brasil (desde 2019 — antes era no Ministério da Fazenda).\nFunção: receber comunicações de operações suspeitas, analisar e encaminhar às autoridades competentes (PF, MP, CGU).\nNÃO investiga crimes. NÃO prende. É uma Unidade de Inteligência Financeira (UIF).\nÉ a 'central de alertas' do sistema financeiro contra lavagem." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "O funcionário do banco suspeita que um cliente está lavando dinheiro. Pode avisar o cliente?",
    verso: "NÃO — expressamente PROIBIDO pela Lei 9.613/98.\nAvisar o cliente suspeito configura OBSTACULIZAÇÃO DA INVESTIGAÇÃO — é crime.\nO funcionário deve comunicar internamente ao setor de compliance e ao COAF, sem alertar o cliente.\nO sigilo da comunicação protege a investigação e evita que o suspeito destrua evidências ou fuja." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "O que é KYC (Know Your Customer) e por que é obrigatório?",
    verso: "KYC — 'Conheça seu Cliente': obrigação legal dos bancos de:\n• Identificar clientes com documentos válidos\n• Verificar a origem dos recursos\n• Monitorar o perfil e as transações continuamente\nSem conhecer o cliente, o banco não consegue identificar o que é suspeito.\nKYC é a primeira linha de defesa contra lavagem de dinheiro e financiamento ao terrorismo." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "O que é smurfing e em qual fase da lavagem ocorre?",
    verso: "Smurfing (ou fracionamento): técnica da fase de COLOCAÇÃO onde o criminoso divide o dinheiro ilícito em muitos pequenos depósitos abaixo do limite de reporte obrigatório, em diferentes bancos ou datas.\nObjetivo: não acionar os sistemas automáticos de reporte ao COAF (depósitos acima de R$100.000 são reportados automaticamente).\nSe detectado, é indício claro de lavagem mesmo que cada depósito individual seja 'pequeno'." },

  // sigilo-bancario (4 flashcards)
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "Quem pode quebrar o sigilo bancário SEM autorização judicial?",
    verso: "RECEITA FEDERAL: para fins de fiscalização tributária (STF validou em 2016).\nCPI (Comissão Parlamentar de Inquérito): tem poderes investigativos constitucionais equivalentes ao Judiciário.\nMINISTÉRIO PÚBLICO e POLÍCIA: precisam de autorização judicial.\nO Poder Judiciário pode quebrar o sigilo em qualquer investigação criminal.\nErro clássico: achar que só o Judiciário pode — CPI e Receita Federal dispensam ordem judicial." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "O sigilo bancário é uma criação dos bancos ou um direito legal?",
    verso: "É um DIREITO CONSTITUCIONAL: art. 5º, X e XII da CF/88 (intimidade, vida privada, sigilo de dados).\nNão é criação dos bancos nem do contrato — é garantia fundamental do cidadão.\nA LC 105/2001 regulamenta como esse direito funciona na prática: quem pode quebrar, em quais condições e com quais formalidades.\nViolá-lo sem autorização: responsabilidade civil, administrativa e penal (até 4 anos de reclusão, art. 10 da LC 105/2001)." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "Uma CPI pode quebrar o sigilo bancário de um investigado?",
    verso: "SIM — por previsão constitucional (art. 58, §3º da CF/88).\nAs CPIs têm 'poderes de investigação próprios das autoridades judiciais'.\nPodem requisitar dados bancários diretamente sem ordem judicial.\nLimitação: não podem determinar prisão (exceto em flagrante) e não podem anular atos do Executivo.\nO STF confirmou essa prerrogativa das CPIs reiteradamente." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "O que é o Open Finance e como ele se relaciona com o sigilo bancário?",
    verso: "Open Finance: sistema em que o cliente AUTORIZA o compartilhamento de seus dados financeiros entre instituições.\nPrincípio central: os dados pertencem ao CLIENTE, não ao banco.\nNÃO viola o sigilo bancário: o próprio titular autoriza o acesso, exercendo sua autodeterminação informativa.\nDiferença do sigilo bancário tradicional: antes, o banco 'guardava' o dado. Com Open Finance, o cliente 'libera' conforme sua conveniência." },

  // fgc e outros (6 flashcards)
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "Quais são os limites do FGC?",
    verso: "LIMITE POR CONGLOMERADO: R$250.000 por CPF por conglomerado financeiro.\nTETO GLOBAL: R$1.000.000 por CPF a cada 4 anos (independentemente do número de instituições).\nCOBRE: conta corrente, poupança, CDB, LCI, LCA, RDB, LC.\nNÃO cobre: fundos de investimento, debêntures, ações, COE.\nErro clássico: confundir limite por instituição com limite por conglomerado." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "FGC por conglomerado: o que significa na prática?",
    verso: "Se o Banco X e o Banco Y pertencem ao mesmo GRUPO ECONÔMICO (conglomerado), o FGC trata os dois como UMA ÚNICA entidade.\nExemplo: R$200.000 no Banco X + R$200.000 no Banco Y (mesmo conglomerado) → cobertura de apenas R$250.000 no total (não R$400.000).\nSe fossem conglomerados DIFERENTES: R$250.000 de cobertura em cada → proteção total de R$500.000.\nEstrategia: para maximizar cobertura, distribuir em conglomerados diferentes." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "O FGC é público ou privado? Quem o mantém?",
    verso: "PRIVADO, sem fins lucrativos.\nMantido por contribuições MENSAIS obrigatórias das instituições financeiras associadas (proporcional ao saldo de depósitos garantidos).\nNão usa dinheiro público. Não é do governo.\nFoi criado em 1995 pelo CMN para dar segurança ao sistema financeiro após o Plano Real.\nSua existência evita corridas bancárias: depositantes sabem que estão protegidos." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "Quais produtos NÃO têm cobertura do FGC?",
    verso: "NÃO cobertos pelo FGC:\n• Fundos de investimento (qualquer tipo)\n• Debêntures\n• Ações\n• COE (Certificado de Operações Estruturadas)\n• Depósitos em contas de pagamento (ex.: carteiras digitais como Mercado Pago)\n• Letras Financeiras acima de R$300.000 (isentas da cobertura)\nCOBERTOS: conta corrente, poupança, CDB, LCI, LCA, RDB." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "O Pix é obrigatório para quais instituições?",
    verso: "Obrigatório para instituições financeiras com mais de 500 mil contas ativas.\nPara instituições menores: OPCIONAL.\nRegulado pelo BANCO CENTRAL via SPI (Sistema de Pagamentos Instantâneos).\nCaracterísticas: 24h/365 dias, instantâneo, gratuito para PF.\nO BCB é o gestor do arranjo Pix e o liquidante central de todas as transações." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "Os correspondentes bancários estão sujeitos às normas de prevenção à lavagem de dinheiro?",
    verso: "SIM. Correspondentes (lotéricas, farmácias, supermercados que prestam serviços bancários) atuam como EXTENSÃO do banco contratante.\nO banco CONTRATANTE é responsável pelos atos do correspondente — pode ser punido pelos erros dele.\nO banco deve monitorar, auditar e capacitar os correspondentes em PLD (Prevenção à Lavagem de Dinheiro).\nO correspondente deve seguir o KYC e reportar operações suspeitas da mesma forma que o banco." },
];

// ═══════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Iniciando seed — Conhecimentos Bancários...\n");

  const materia = await prisma.materia.upsert({
    where: { slug: "conhecimentos-bancarios" },
    update: {},
    create: {
      nome: "Conhecimentos Bancários",
      slug: "conhecimentos-bancarios",
      descricao: "Domine o sistema financeiro nacional, política monetária, produtos bancários, mercado de capitais e regulação em 20 horas de estudo focado.",
      icone: "🏦",
      cor: "teal",
      ordem: 2,
    },
  });
  console.log(`✅ Matéria: ${materia.nome}\n`);

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

    for (const t of blocoData.topicos) {
      const topico = await prisma.topico.upsert({
        where: { blocoId_slug: { blocoId: bloco.id, slug: t.slug } },
        update: {},
        create: {
          titulo: t.titulo,
          slug: t.slug,
          conteudo: t.conteudo,
          resumo: t.resumo,
          ordem: t.ordem,
          blocoId: bloco.id,
        },
      });
      topicoMap[`${blocoData.slug}::${t.slug}`] = topico.id;
    }

    console.log(`  📦 Bloco ${blocoData.ordem}: ${blocoData.nome} — ${blocoData.topicos.length} tópicos`);
  }

  // ── Limpar quizzes e flashcards existentes (idempotência) ──
  const topicoIds = Object.values(topicoMap);
  if (topicoIds.length > 0) {
    const quizzesExistentes = await prisma.quiz.findMany({
      where: { topicoId: { in: topicoIds } },
      select: { id: true },
    });
    const quizIds = quizzesExistentes.map((q) => q.id);
    if (quizIds.length > 0) {
      await prisma.opcaoQuiz.deleteMany({ where: { quizId: { in: quizIds } } });
      await prisma.quiz.deleteMany({ where: { id: { in: quizIds } } });
    }
    await prisma.flashcard.deleteMany({ where: { topicoId: { in: topicoIds } } });
    if (quizIds.length > 0 || topicoIds.length > 0) {
      console.log(`  🗑️  Dados anteriores removidos (${quizIds.length} quizzes, flashcards)`);
    }
  }

  // Quizzes
  let quizCount = 0;
  for (const [idx, q] of quizData.entries()) {
    const topicoId = topicoMap[`${q.blocoSlug}::${q.topicoSlug}`];
    if (!topicoId) { console.warn(`  ⚠️  Tópico não encontrado: ${q.topicoSlug}`); continue; }
    await prisma.quiz.create({
      data: {
        pergunta: q.pergunta,
        explicacao: q.explicacao,
        ordem: idx + 1,
        topicoId,
        opcoes: { create: q.opcoes.map((o, i) => ({ texto: o.texto, correta: o.correta, ordem: i })) },
      },
    });
    quizCount++;
  }
  console.log(`\n  🧠 ${quizCount} questões de quiz criadas`);

  // Flashcards
  let fcCount = 0;
  for (const [idx, fc] of flashcards.entries()) {
    const topicoId = topicoMap[`${fc.blocoSlug}::${fc.topicoSlug}`];
    if (!topicoId) { console.warn(`  ⚠️  Tópico não encontrado: ${fc.topicoSlug}`); continue; }
    await prisma.flashcard.create({
      data: { frente: fc.frente, verso: fc.verso, dica: fc.dica ?? null, ordem: idx + 1, topicoId },
    });
    fcCount++;
  }
  console.log(`  🃏 ${fcCount} flashcards criados`);

  console.log(`\n✅ Seed concluído — Conhecimentos Bancários`);
  console.log(`   ${blocos.length} blocos · ${blocos.reduce((a,b) => a + b.topicos.length, 0)} tópicos · ${quizCount} questões · ${fcCount} flashcards\n`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
