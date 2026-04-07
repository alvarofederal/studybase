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
];

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcards = [
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis", frente: "Quais são os 3 níveis do SFN?", verso: "1. Órgãos Normativos (CMN, CNSP, CNPC) — fazem as regras\n2. Entidades Supervisoras (BCB, CVM, Susep, Previc) — fiscalizam\n3. Operadores (bancos, corretoras, seguradoras) — executam" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis", frente: "Qual a diferença entre CMN e Banco Central?", verso: "CMN = normatiza (cria regras). Nunca fiscaliza nem pune.\nBanco Central = supervisiona e executa. Pune os bancos, emite moeda, executa política monetária." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional", frente: "Quem compõe o CMN?", verso: "3 membros: Ministro da Fazenda (presidente do CMN), Ministro do Planejamento e Presidente do Banco Central." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes", frente: "Cite as 4 funções principais do Banco Central.", verso: "1. Emissor de moeda\n2. Banco dos bancos (redesconto, compulsório)\n3. Gestor das reservas internacionais\n4. Executor da política monetária (Copom/Selic)" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc", frente: "Qual entidade regula o PGBL e o VGBL?", verso: "Susep (Superintendência de Seguros Privados), vinculada ao CNSP. PGBL e VGBL são previdência ABERTA — supervisionada pela Susep." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc", frente: "Qual a diferença entre Susep e Previc?", verso: "Susep: previdência ABERTA (planos vendidos em bancos para qualquer pessoa). Previc: previdência FECHADA (fundos de pensão de empresas específicas, ex: Previ/BB)." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic", frente: "O que é o Copom e quando se reúne?", verso: "Comitê de Política Monetária — define a taxa Selic meta. Reúne-se a cada 45 dias. Composto pelo Presidente do BCB e 8 diretores." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic", frente: "Selic alta favorece ou prejudica investidores de renda fixa?", verso: "FAVORECE. Selic alta = maior remuneração em CDB, Tesouro Selic, poupança. O erro clássico é achar que Selic alta é sempre ruim — depende da perspectiva." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio", frente: "O que é o depósito compulsório e qual seu efeito?", verso: "Percentual dos depósitos que os bancos devem recolher ao BCB. Compulsório alto = menos dinheiro para empréstimos = crédito contrai. Compulsório baixo = mais crédito disponível." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto", frente: "Qual é o instrumento de política monetária mais usado pelo BCB no dia a dia?", verso: "Open Market (operações de mercado aberto). O BCB compra/vende títulos públicos diariamente para manter a Selic próxima à meta do Copom." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto", frente: "O que é o redesconto bancário?", verso: "Empréstimo do BCB para bancos com falta temporária de liquidez. BCB = emprestador de última instância. O banco dá títulos como garantia e paga a 'taxa de redesconto'." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca", frente: "CDB, LCI e LCA: qual(is) é(são) isento(s) de IR para pessoa física?", verso: "LCI e LCA são ISENTOS de IR para pessoa física.\nCDB tem IR regressivo: de 22,5% (até 180 dias) a 15% (acima de 720 dias)." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca", frente: "Qual a regra de remuneração da poupança quando a Selic está acima de 8,5% a.a.?", verso: "TR + 0,5% ao mês (equivalente a ~6,17% ao ano). Quando a Selic está abaixo de 8,5%, a poupança rende 70% da Selic + TR." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas", frente: "Por que o crédito consignado tem a taxa mais baixa entre os créditos pessoais?", verso: "A parcela é descontada diretamente da folha de pagamento antes de o dinheiro chegar ao trabalhador. Risco de inadimplência próximo de zero = banco cobra taxa menor." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio", frente: "Quem opera o Pix? É o mesmo que o TED?", verso: "O Pix é operado pelo BANCO CENTRAL via SPI (Sistema de Pagamentos Instantâneos). O TED passa pelo STR (também do BCB, mas infraestrutura diferente). São sistemas distintos." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl", frente: "Qual a diferença de tributação entre PGBL e VGBL no resgate?", verso: "PGBL: IR incide sobre o VALOR TOTAL (principal + rendimento).\nVGBL: IR incide apenas sobre o RENDIMENTO.\nPGBL compensa pela dedução anual de até 12% da renda bruta." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais", frente: "Qual a diferença entre mercado primário e mercado secundário?", verso: "Primário: empresa emite pela 1ª vez → dinheiro vai para a empresa.\nSecundário: investidores negociam entre si → dinheiro vai para o vendedor. A empresa só capta no primário." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos", frente: "Ação ON ou PN: qual dá direito a voto?", verso: "ON (Ordinária) = direito a VOTO nas assembleias.\nPN (Preferencial) = prioridade nos DIVIDENDOS, geralmente sem voto.\nMnemônico: ON = vote; PN = prefere dinheiro." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto", frente: "Cite os 3 principais títulos do Tesouro Direto e suas características.", verso: "LTN (Tesouro Prefixado): taxa fixa, sem proteção à inflação.\nNTN-B (Tesouro IPCA+): IPCA + taxa, protege da inflação.\nLFT (Tesouro Selic): segue a Selic, mínima volatilidade, ideal para reserva." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613", frente: "Quais são as 3 fases da lavagem de dinheiro?", verso: "1. COLOCAÇÃO: inserir o dinheiro sujo no sistema financeiro\n2. OCULTAÇÃO: disfarçar a origem com transações complexas\n3. INTEGRAÇÃO: reinserir como dinheiro legítimo na economia\nMnemônico: COI" },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613", frente: "O que é o COAF e o que ele faz?", verso: "Conselho de Controle de Atividades Financeiras — órgão do Ministério da Fazenda. Recebe comunicações de operações suspeitas dos bancos, analisa e repassa às autoridades investigativas. NÃO é órgão de investigação — é de inteligência financeira." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001", frente: "Quem pode quebrar o sigilo bancário SEM autorização judicial?", verso: "CPI (Comissão Parlamentar de Inquérito) e Receita Federal (para fiscalização tributária). O MP e a Polícia precisam de autorização judicial. (STF validou o acesso direto da Receita em 2016.)" },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos", frente: "Quais são os limites do FGC?", verso: "R$ 250.000 por CPF por instituição financeira.\nTeto global de R$ 1.000.000 por CPF a cada 4 anos.\nCobre: conta corrente, poupança, CDB, LCI, LCA. NÃO cobre fundos de investimento." },
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
  console.log(`   5 blocos · ${blocos.reduce((a,b) => a + b.topicos.length, 0)} tópicos · ${quizCount} questões · ${fcCount} flashcards\n`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
