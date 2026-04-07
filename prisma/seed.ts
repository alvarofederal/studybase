/**
 * Seed gerado a partir do conteúdo de:
 * index-atualizades-sistema-financeiro.html
 *
 * Matéria: Atualidades do Mercado Financeiro
 * 5 Blocos | 15 Tópicos | 10 Quizzes | 12 Flashcards
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed — Atualidades do Mercado Financeiro...\n");

  // ─────────────────────────────────────────────
  // MATÉRIA
  // ─────────────────────────────────────────────
  const materia = await prisma.materia.upsert({
    where: { slug: "atualidades-mercado-financeiro" },
    update: {},
    create: {
      nome: "Atualidades do Mercado Financeiro",
      slug: "atualidades-mercado-financeiro",
      descricao:
        "Conteúdo essencial sobre inovações financeiras, fintechs, regulação digital, ESG e a Agenda BC# para concursos bancários (BB, CEF, Banco do Brasil e similares).",
      icone: "🏦",
      cor: "emerald",
      ordem: 1,
    },
  });
  console.log(`✅ Matéria: ${materia.nome}`);

  // ─────────────────────────────────────────────
  // HELPER: slug
  // ─────────────────────────────────────────────
  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);

  // ─────────────────────────────────────────────
  // BLOCO 1 — Nova Infraestrutura Financeira
  // ─────────────────────────────────────────────
  const b1 = await prisma.bloco.upsert({
    where: { materiaId_slug: { materiaId: materia.id, slug: "nova-infraestrutura-financeira" } },
    update: {},
    create: {
      nome: "⚡ Bloco 1 — Nova Infraestrutura Financeira",
      slug: "nova-infraestrutura-financeira",
      descricao: "Como o dinheiro circula hoje no Brasil? Pix, Open Finance, SPB e Real Digital (Drex). Meta: 4h",
      ordem: 1,
      materiaId: materia.id,
    },
  });

  const b1_topics = [
    {
      titulo: "Pix — Arquitetura e Modalidades",
      slug: "pix-arquitetura-e-modalidades",
      ordem: 1,
      resumo: "O Pix é operado diretamente pelo Banco Central, funciona 24/7 e é gratuito por regulação. Ele criou uma nova infraestrutura — não é só velocidade.",
      conteudo: `# Pix — Arquitetura e Modalidades

## O que é o Pix?

O Pix **não é simplesmente "TED rápido"**. Ele é operado diretamente pelo **Banco Central**, funciona **24 horas por dia, 7 dias por semana**, incluindo feriados, e é obrigatoriamente gratuito para pessoas físicas por determinação regulatória.

## Modalidades do Pix

- **Pix Cobrança:** substitui o boleto bancário com QR Code dinâmico
- **Pix Saque e Pix Troco:** permite sacar dinheiro em estabelecimentos comerciais
- **Pix Automático:** substitui o débito automático para cobranças recorrentes
- **Chaves Pix:** CPF/CNPJ, e-mail, telefone ou chave aleatória

## Ponto-chave

💡 **Impacto estratégico:** O Pix forçou a gratuidade de transferências e quebrou barreiras de entrada para novas instituições, intensificando a concorrência bancária.

## Infraestrutura

O Pix é suportado pelo **SPI (Sistema de Pagamentos Instantâneos)**, operado diretamente pelo Banco Central. É diferente do TED, que passa por câmaras privadas.`,
    },
    {
      titulo: "Open Finance — As 4 Fases",
      slug: "open-finance-as-4-fases",
      ordem: 2,
      resumo: "O Open Finance é a evolução do Open Banking. Sua lógica central: os dados financeiros pertencem ao cliente, não ao banco.",
      conteudo: `# Open Finance — As 4 Fases

## O que é o Open Finance?

O Open Finance é a evolução do Open Banking. Sua lógica central: **os dados financeiros pertencem ao cliente**, não ao banco. Isso permite portabilidade de histórico e acesso a melhores condições de crédito.

## As 4 Fases

- **Fase 1:** Compartilhamento de dados das próprias instituições (produtos e serviços)
- **Fase 2:** Compartilhamento de dados cadastrais e transacionais dos clientes
- **Fase 3:** Iniciação de pagamentos e propostas de crédito via terceiros
- **Fase 4:** Expansão para seguros, previdência, câmbio e investimentos

## Diferença entre Open Banking e Open Finance

| Aspecto | Open Banking | Open Finance |
|---------|-------------|-------------|
| Escopo | Dados bancários | Bancários + seguros + previdência + câmbio + investimentos |
| Abrangência | Parcial | Total do ecossistema financeiro |

## Ponto-chave

💡 **É uma política antimonopólio.** O cliente leva seu histórico a outro banco e consegue crédito melhor. Entender a lógica resolve questões difíceis em concursos.`,
    },
    {
      titulo: "Drex — Real Digital (CBDC)",
      slug: "drex-real-digital-cbdc",
      ordem: 3,
      resumo: "O Drex é a moeda digital do Banco Central do Brasil (CBDC). Diferente das criptomoedas, é emitido e controlado pelo Estado.",
      conteudo: `# Drex — Real Digital (CBDC)

## O que é o Drex?

O Drex é a **moeda digital do Banco Central do Brasil** (CBDC — Central Bank Digital Currency). Diferente das criptomoedas, é emitido e controlado pelo Estado.

## Características principais

- Operado em **blockchain permissionada** — acesso controlado, não público
- Equivale ao Real físico: **1 Drex = R$ 1,00** garantido pelo BCB
- Permite **contratos inteligentes** (smart contracts) em transações financeiras
- Não é aberto ao público diretamente — passa por bancos e instituições autorizadas

## Drex vs Criptomoedas

| Aspecto | Drex | Bitcoin/Criptomoedas |
|---------|------|---------------------|
| Emissão | Banco Central | Descentralizada |
| Controle | Estatal | Sem controle central |
| Volatilidade | Estável (= R$) | Alta |
| Blockchain | Permissionada | Pública |

## Ponto-chave

💡 **Diferença crucial para a prova:** Drex ≠ criptomoeda. Criptomoeda é descentralizada, sem controle estatal, e volátil. O Drex é centralizado, garantido pelo BCB e estável.`,
    },
    {
      titulo: "SPB — Sistema de Pagamentos Brasileiro",
      slug: "spb-sistema-de-pagamentos-brasileiro",
      ordem: 4,
      resumo: "O SPB é o conjunto de entidades, sistemas e procedimentos que processam as transferências de fundos no Brasil. Foi modernizado em 2002 e o Pix é sua evolução mais recente.",
      conteudo: `# SPB — Sistema de Pagamentos Brasileiro

## O que é o SPB?

O SPB é o conjunto de entidades, sistemas e procedimentos que processam as transferências de fundos no Brasil. Foi modernizado em 2002 e o **Pix é sua evolução mais recente**.

## Principais sistemas do SPB

- **STR (Sistema de Transferência de Reservas):** liquidação em tempo real, operado pelo BCB
- **SITRAF:** câmara de transferência de fundos (TED)
- **SPI (Sistema de Pagamentos Instantâneos):** infraestrutura que suporta o Pix

## Relação entre os sistemas

| Sistema | Produto | Operador |
|---------|---------|----------|
| STR | Transferências de grande valor | Banco Central |
| SITRAF | TED | Câmara privada (CIP) |
| SPI | Pix | Banco Central |

## Ponto-chave

💡 **Para a prova:** o SPI é a infraestrutura tecnológica do Pix, assim como o STR é a infraestrutura das transferências de grande valor. O Banco Central opera ambos diretamente.`,
    },
  ];

  for (const t of b1_topics) {
    await prisma.topico.upsert({
      where: { blocoId_slug: { blocoId: b1.id, slug: t.slug } },
      update: {},
      create: { ...t, blocoId: b1.id },
    });
  }
  console.log(`  ✅ Bloco 1: ${b1_topics.length} tópicos`);

  // ─────────────────────────────────────────────
  // BLOCO 2 — Fintechs e Novos Modelos
  // ─────────────────────────────────────────────
  const b2 = await prisma.bloco.upsert({
    where: { materiaId_slug: { materiaId: materia.id, slug: "fintechs-e-novos-modelos" } },
    update: {},
    create: {
      nome: "🚀 Bloco 2 — Fintechs e Novos Modelos",
      slug: "fintechs-e-novos-modelos",
      descricao: "Quem está desafiando os bancos tradicionais? Fintechs, bancos digitais, BaaS, Embedded Finance, Big Techs. Meta: 4h",
      ordem: 2,
      materiaId: materia.id,
    },
  });

  const b2_topics = [
    {
      titulo: "Fintechs — Conceito e Categorias",
      slug: "fintechs-conceito-e-categorias",
      ordem: 1,
      resumo: "Fintech é qualquer empresa que usa tecnologia para oferecer serviços financeiros. Banco digital é apenas uma categoria dentro desse universo.",
      conteudo: `# Fintechs — Conceito e Categorias

## O que é uma Fintech?

**Fintech (Financial Technology)** é qualquer empresa que usa tecnologia para oferecer serviços financeiros de forma mais eficiente, acessível ou barata que os players tradicionais.

## Categorias de Fintechs

- **Fintechs de pagamento:** processadoras, carteiras digitais (ex: PicPay)
- **Fintechs de crédito:** SCDs (Sociedades de Crédito Direto), plataformas P2P
- **Fintechs de investimento:** plataformas de corretagem digital
- **Insurtechs:** seguradoras digitais
- **Regtechs:** tecnologia para conformidade regulatória

## Erro clássico de concurso

💡 **Erro clássico: Fintech ≠ banco digital.** Banco digital é UMA categoria de fintech. Há fintechs que nunca serão bancos — como uma maquininha ou um app de câmbio.

## Regulação no Brasil

As fintechs de crédito são reguladas pelo Banco Central como:
- **SCD (Sociedade de Crédito Direto):** concede crédito com recursos próprios
- **SEP (Sociedade de Empréstimo entre Pessoas):** plataforma P2P de crédito`,
    },
    {
      titulo: "Instituições de Pagamento (IPs)",
      slug: "instituicoes-de-pagamento-ips",
      ordem: 2,
      resumo: "As IPs são reguladas pelo Banco Central mas NÃO são bancos. Não captam depósitos nem concedem crédito da forma tradicional.",
      conteudo: `# Instituições de Pagamento (IPs)

## O que são as IPs?

As IPs são reguladas pelo Banco Central mas **NÃO são bancos**. Elas não captam depósitos nem concedem crédito da forma tradicional — mas podem realizar pagamentos e manter recursos de clientes.

## Tipos de Instituições de Pagamento

- **Emissor de instrumento de pagamento pós-pago:** emite cartão de crédito
- **Emissor de moeda eletrônica:** mantém conta de pagamento (ex: carteira digital)
- **Credenciador:** opera maquininhas de cartão
- **Iniciador de pagamento:** inicia Pix sem deter os recursos

## Conta de Pagamento vs Conta Corrente

| Aspecto | Conta de Pagamento | Conta Corrente |
|---------|-------------------|----------------|
| Quem oferece | IP (não banco) | Banco |
| Crédito | Não oferece | Pode oferecer |
| IOF em transferências | Não incide | Incide |
| Recursos | Segregados | No patrimônio do banco |

## Ponto-chave

💡 **Conta de pagamento ≠ conta corrente.** A conta de pagamento não tem incidência de IOF nas transferências e não oferece crédito. Os recursos ficam segregados.`,
    },
    {
      titulo: "Banking as a Service (BaaS)",
      slug: "banking-as-a-service-baas",
      ordem: 3,
      resumo: "BaaS é o modelo em que uma instituição financeira licenciada disponibiliza sua infraestrutura regulatória para que outras empresas ofereçam produtos financeiros.",
      conteudo: `# Banking as a Service (BaaS)

## O que é BaaS?

BaaS é o modelo em que uma **instituição financeira licenciada disponibiliza sua infraestrutura regulatória** para que outras empresas (não-financeiras) ofereçam produtos financeiros sob sua própria marca.

## Exemplos práticos

- Um varejista oferece crédito sem ser banco — usando a licença de um banco parceiro
- Um app de mobilidade oferece cartão de crédito — infraestrutura de um emissor
- Permite que marcas não-financeiras criem experiências financeiras integradas

## BaaS vs Embedded Finance

| Conceito | O que é |
|----------|---------|
| **BaaS** | A infraestrutura (licença + tecnologia) disponibilizada |
| **Embedded Finance** | A experiência do usuário final (financeiro embutido no produto) |

## Ponto-chave

💡 **BaaS é a base técnica do Embedded Finance.** Sem o BaaS (infraestrutura), não existe o Embedded Finance (experiência do usuário). São conceitos complementares.`,
    },
    {
      titulo: "Big Techs no Mercado Financeiro",
      slug: "big-techs-no-mercado-financeiro",
      ordem: 4,
      resumo: "Google, Amazon, Apple e Meta estão entrando no mercado financeiro. O Banco Central e o Cade monitoram esse movimento de perto.",
      conteudo: `# Big Techs no Mercado Financeiro

## O movimento das Big Techs

Empresas como Google, Amazon, Apple e Meta estão entrando no mercado financeiro global. No Brasil, o **Banco Central e o Cade (antitruste)** monitoram esse movimento de perto.

## Riscos identificados pelos reguladores

- **Risco de concentração:** Big Techs já têm bilhões de usuários e dados comportamentais valiosos
- **Vantagem de dados:** acesso a informações que bancos tradicionais não têm
- **Poder de mercado:** capacidade de subsidiar serviços financeiros com receitas de outras áreas

## Exemplos no Brasil e no mundo

- **Google Pay, Apple Pay:** carteiras digitais integradas ao ecossistema
- **Mercado Pago:** maior fintech da América Latina, ligada ao Mercado Livre
- **WhatsApp Pay:** obrigado a garantir interoperabilidade pelo BCB

## Caso WhatsApp Pay — ponto de prova

💡 **Para prova:** o caso do WhatsApp Pay é emblemático. O BCB suspendeu o serviço em 2020 e exigiu aprovação formal para garantir **interoperabilidade** — não foi por "falta de segurança", mas por questão competitiva.`,
    },
  ];

  for (const t of b2_topics) {
    await prisma.topico.upsert({
      where: { blocoId_slug: { blocoId: b2.id, slug: t.slug } },
      update: {},
      create: { ...t, blocoId: b2.id },
    });
  }
  console.log(`  ✅ Bloco 2: ${b2_topics.length} tópicos`);

  // ─────────────────────────────────────────────
  // BLOCO 3 — Ativos Digitais
  // ─────────────────────────────────────────────
  const b3 = await prisma.bloco.upsert({
    where: { materiaId_slug: { materiaId: materia.id, slug: "ativos-digitais" } },
    update: {},
    create: {
      nome: "🔗 Bloco 3 — Ativos Digitais",
      slug: "ativos-digitais",
      descricao: "O que são esses novos produtos financeiros? Criptomoedas, tokenização, stablecoins, regulação brasileira. Meta: 3h",
      ordem: 3,
      materiaId: materia.id,
    },
  });

  const b3_topics = [
    {
      titulo: "Criptomoedas e Regulação Brasileira",
      slug: "criptomoedas-e-regulacao-brasileira",
      ordem: 1,
      resumo: "A Lei 14.478/2022 é o marco legal das criptomoedas no Brasil. Ela cria um ambiente regulatório para as PSAVs (prestadoras de serviços de ativos virtuais).",
      conteudo: `# Criptomoedas e Regulação Brasileira

## Marco Legal — Lei 14.478/2022

A **Lei 14.478/2022** é o marco legal das criptomoedas no Brasil. Ela não proíbe nem fomenta — **cria um ambiente regulatório** para as prestadoras de serviços de ativos virtuais (PSAVs).

## Conceitos fundamentais

- **Blockchain:** registro distribuído e imutável de transações
- **Bitcoin:** reserva de valor digital, oferta limitada a 21 milhões
- **Altcoins:** todas as criptomoedas que não são Bitcoin
- **Supervisão:** Banco Central supervisiona as exchanges no Brasil
- **Tributação:** Receita Federal — ganhos acima de R$35k/mês são tributados

## PSAVs — Prestadoras de Serviços de Ativos Virtuais

A Lei 14.478/2022 define "ativo virtual" e exige que as PSAVs:
- Tenham autorização para operar no Brasil
- Sigam regras de prevenção à lavagem de dinheiro
- Mantenham registro das operações

## Ponto-chave

💡 **Ponto de prova:** a Lei 14.478/2022 define "ativo virtual" e exige que as PSAVs tenham autorização para operar no Brasil, com regras de prevenção à lavagem de dinheiro.`,
    },
    {
      titulo: "Tokenização de Ativos",
      slug: "tokenizacao-de-ativos",
      ordem: 2,
      resumo: "Tokenizar um ativo é representá-lo digitalmente em blockchain — criando um token que pode ser negociado, fracionado e transferido com muito mais agilidade.",
      conteudo: `# Tokenização de Ativos

## O que é tokenização?

Tokenizar um ativo é **representá-lo digitalmente em blockchain** — criando um "token" que pode ser negociado, fracionado e transferido com muito mais agilidade que o ativo original.

## Exemplos de tokenização

- **Imóvel tokenizado:** um imóvel de R$1M pode ser dividido em 1.000 tokens de R$1.000
- **Recebível tokenizado:** uma nota fiscal pode ser tokenizada para antecipação
- **Drex e tokenização:** o Real Digital viabiliza liquidação instantânea de ativos tokenizados

## Regulação

- CVM e Banco Central estão desenvolvendo regulação conjunta para o tema
- O Drex (Real Digital) foi concebido também como infraestrutura para liquidação de ativos tokenizados

## Ponto-chave

💡 **A tokenização não cria novos ativos** — ela cria novas formas de negociar ativos existentes, com mais liquidez, menor custo e maior fracionamento.`,
    },
    {
      titulo: "Stablecoins e Riscos",
      slug: "stablecoins-e-riscos",
      ordem: 3,
      resumo: "Stablecoins são criptomoedas atreladas a um ativo estável (geralmente o dólar), criadas para eliminar a volatilidade típica das criptomoedas.",
      conteudo: `# Stablecoins e Riscos

## O que são stablecoins?

Stablecoins são criptomoedas atreladas a um ativo estável (geralmente o dólar), criadas para eliminar a volatilidade típica das criptomoedas.

## Principais stablecoins

- **USDT (Tether):** maior stablecoin, lastreada em dólar
- **USDC:** stablecoin regulada, com auditoria de reservas

## Tipos de stablecoin

| Tipo | Como funciona | Risco |
|------|--------------|-------|
| **Lastreada** | Reservas reais em dólar/ouro | Risco de contraparte |
| **Algorítmica** | Código mantém a paridade | Pode colapsar (ex: TerraLUNA) |

## Caso TerraLUNA (2022)

O colapso do TerraLUNA em 2022 destruiu **US$40 bilhões** em valor. Era uma stablecoin algorítmica — usava código e outra criptomoeda (LUNA) para manter paridade com o dólar. Quando a lógica falhou, o colapso foi instantâneo e total.

## Ponto-chave

💡 **Para a prova:** stablecoin algorítmica ≠ stablecoin lastreada. A algorítmica usa código para manter a paridade — e pode falhar catastroficamente, como demonstrou o TerraLUNA.`,
    },
  ];

  for (const t of b3_topics) {
    await prisma.topico.upsert({
      where: { blocoId_slug: { blocoId: b3.id, slug: t.slug } },
      update: {},
      create: { ...t, blocoId: b3.id },
    });
  }
  console.log(`  ✅ Bloco 3: ${b3_topics.length} tópicos`);

  // ─────────────────────────────────────────────
  // BLOCO 4 — IA, Dados e Crédito
  // ─────────────────────────────────────────────
  const b4 = await prisma.bloco.upsert({
    where: { materiaId_slug: { materiaId: materia.id, slug: "ia-dados-e-credito" } },
    update: {},
    create: {
      nome: "🤖 Bloco 4 — IA, Dados e Crédito",
      slug: "ia-dados-e-credito",
      descricao: "Como a tecnologia mudou a relação banco-cliente? LGPD, Cadastro Positivo, IA nos bancos, segurança cibernética. Meta: 5h",
      ordem: 4,
      materiaId: materia.id,
    },
  });

  const b4_topics = [
    {
      titulo: "LGPD no Sistema Financeiro",
      slug: "lgpd-no-sistema-financeiro",
      ordem: 1,
      resumo: "A Lei Geral de Proteção de Dados (Lei 13.709/2018) impacta diretamente bancos e fintechs, que trabalham com dados sensíveis em larga escala.",
      conteudo: `# LGPD no Sistema Financeiro

## A Lei Geral de Proteção de Dados

A **LGPD (Lei 13.709/2018)** impacta diretamente bancos e fintechs, que trabalham com dados sensíveis em larga escala.

## Órgão fiscalizador

- **ANPD — Autoridade Nacional de Proteção de Dados:** fiscaliza o cumprimento da LGPD

## Bases legais para tratamento de dados

Além do **consentimento**, outras bases legais permitem o tratamento:
- Execução de contrato
- Legítimo interesse
- Obrigação legal
- Proteção ao crédito

## Direitos do titular de dados

- Acesso aos dados
- Correção de dados incorretos
- Exclusão (direito ao esquecimento)
- Portabilidade dos dados

## Conexão com Open Finance

💡 **Conexão importante:** Open Finance SEM LGPD seria impossível — é a LGPD que garante que o compartilhamento de dados seja feito com **consentimento** e finalidade definida.`,
    },
    {
      titulo: "Cadastro Positivo",
      slug: "cadastro-positivo",
      ordem: 2,
      resumo: "O Cadastro Positivo registra o histórico de pagamentos em dia. Desde 2019, a adesão é automática (opt-out) — todos estão incluídos automaticamente.",
      conteudo: `# Cadastro Positivo

## O que é o Cadastro Positivo?

O Cadastro Positivo registra o **histórico de pagamentos em dia** de pessoas físicas e jurídicas. Desde 2019, a adesão é **automática (opt-out)** — todos estão incluídos automaticamente.

## Gestores do Cadastro Positivo

Gerenciado pelos bureaus de crédito: **Serasa, SPC, Boa Vista, Quod**

## Por que é importante?

- Permite que bons pagadores tenham **acesso a crédito mais barato**
- Beneficia especialmente os **desbancarizados** sem histórico em banco
- O score de crédito melhora com dados positivos, não apenas negativos

## A mudança de 2019

| Antes de 2019 | Depois de 2019 |
|---------------|----------------|
| Opt-in (você pedia para entrar) | Opt-out (você é incluído automaticamente) |
| Só aparecia quem se cadastrava | Todos aparecem, a menos que solicitem saída |

## Ponto-chave

💡 **Antes do Cadastro Positivo**, o sistema de crédito brasileiro era apenas "negativo" — você só aparecia se tivesse dívida. Isso prejudicava quem sempre pagou em dia mas não tinha histórico bancário.`,
    },
    {
      titulo: "Inteligência Artificial nos Bancos",
      slug: "inteligencia-artificial-nos-bancos",
      ordem: 3,
      resumo: "A IA está transformando todas as funções bancárias — do relacionamento com clientes à análise de risco sistêmico.",
      conteudo: `# Inteligência Artificial nos Bancos

## Aplicações da IA no sistema financeiro

- **Análise de crédito:** modelos de machine learning analisam centenas de variáveis simultaneamente
- **Detecção de fraudes:** IA identifica padrões anômalos em tempo real
- **Chatbots e assistentes:** atendimento 24/7, resolução de demandas simples
- **Personalização:** ofertas de produtos baseadas em comportamento do cliente

## Riscos da IA no sistema financeiro

- **Viés algorítmico:** pode discriminar grupos vulneráveis no crédito
- **Opacidade:** modelos de "caixa preta" dificultam a contestação de decisões
- **Dependência sistêmica:** falha em um modelo pode afetar todo o mercado

## Perspectiva regulatória

💡 **Ponto de atenção regulatória:** o Banco Central e o CMN estão desenvolvendo diretrizes para uso ético de IA, especialmente para evitar discriminação algorítmica em concessões de crédito.`,
    },
    {
      titulo: "Segurança Cibernética — Resolução BCB 4.893/2021",
      slug: "seguranca-cibernetica-resolucao-bcb-4893",
      ordem: 4,
      resumo: "A Resolução BCB 4.893/2021 obriga todas as instituições financeiras a terem uma política de segurança cibernética estruturada.",
      conteudo: `# Segurança Cibernética — Resolução BCB 4.893/2021

## A Resolução BCB 4.893/2021

Obriga todas as instituições financeiras a terem uma **política de segurança cibernética estruturada**.

## Exigências principais

- Política formal de segurança cibernética
- Plano de resposta a incidentes
- Testes regulares de vulnerabilidade

## Principais ameaças cibernéticas

- **Engenharia social:** manipulação psicológica para obter dados (phishing, vishing)
- **SIM Swap:** clonagem de chip celular para interceptar SMS de autenticação
- **Ransomware:** sequestro de dados com pedido de resgate

## Responsabilidade dos bancos

O banco tem **responsabilidade objetiva** por falhas de segurança em seus sistemas. Se o cliente foi vítima de phishing sofisticado sem negligência própria, o banco pode responder.

## Ponto-chave

💡 **Para provas:** o banco tem responsabilidade objetiva por falhas de segurança em seus sistemas. Isso significa que a culpa do banco não precisa ser provada — basta demonstrar o dano e o nexo causal.`,
    },
  ];

  for (const t of b4_topics) {
    await prisma.topico.upsert({
      where: { blocoId_slug: { blocoId: b4.id, slug: t.slug } },
      update: {},
      create: { ...t, blocoId: b4.id },
    });
  }
  console.log(`  ✅ Bloco 4: ${b4_topics.length} tópicos`);

  // ─────────────────────────────────────────────
  // BLOCO 5 — ESG e Agenda BC#
  // ─────────────────────────────────────────────
  const b5 = await prisma.bloco.upsert({
    where: { materiaId_slug: { materiaId: materia.id, slug: "esg-e-agenda-bc" } },
    update: {},
    create: {
      nome: "🌱 Bloco 5 — ESG e Agenda BC#",
      slug: "esg-e-agenda-bc",
      descricao: "Para onde o mercado financeiro está indo? ESG, Agenda BC#, inclusão financeira, sandbox regulatório. Meta: 4h",
      ordem: 5,
      materiaId: materia.id,
    },
  });

  const b5_topics = [
    {
      titulo: "Agenda BC# — Os 4 Pilares",
      slug: "agenda-bc-os-4-pilares",
      ordem: 1,
      resumo: "A Agenda BC# é o programa estratégico do Banco Central do Brasil, lançado em 2019. Ela explica POR QUE o Pix, o Open Finance e o Drex existem.",
      conteudo: `# Agenda BC# — Os 4 Pilares

## O que é a Agenda BC#?

A **Agenda BC#** é o programa estratégico do Banco Central do Brasil, lançado em 2019. Ela explica **POR QUE** o Pix, o Open Finance e o Drex existem. Quem entende a Agenda BC# conecta todos os temas.

## Os 4 Pilares — ICTE

| Pilar | O que significa | Exemplo |
|-------|----------------|---------|
| **Inclusão** | Ampliar o acesso ao sistema financeiro para desbancarizados | Pix gratuito para PF |
| **Competitividade** | Reduzir concentração bancária, facilitar novos players | Open Finance |
| **Transparência** | Mais informação ao consumidor sobre tarifas, produtos e riscos | CVM e ANPD |
| **Educação financeira** | Capacitar a população para decisões financeiras conscientes | Programas do BCB |

## Mnemônico

💡 **Mnemônico: ICTE** — Inclusão, Competitividade, Transparência, Educação. O Pix serve à Competitividade e Inclusão. O Open Finance serve à Competitividade e Transparência.`,
    },
    {
      titulo: "ESG no Mercado Financeiro",
      slug: "esg-no-mercado-financeiro",
      ordem: 2,
      resumo: "ESG (Environmental, Social, Governance) deixou de ser pauta de sustentabilidade para se tornar critério financeiro. O risco climático agora é tratado como risco de crédito.",
      conteudo: `# ESG no Mercado Financeiro

## ESG como risco financeiro

ESG (Environmental, Social, Governance) deixou de ser pauta de sustentabilidade para se tornar **critério financeiro**. O risco climático agora é tratado como risco de crédito.

## Marco regulatório

- **Resolução CMN 4.945/2021:** obriga bancos a ter política de responsabilidade socioambiental

## Produtos e instrumentos ESG

- **Green Bonds:** títulos de dívida emitidos para financiar projetos sustentáveis
- **Crédito verde:** linhas com taxas menores para projetos de baixo impacto ambiental
- **Mercado de carbono:** Brasil avança em regulação para créditos de carbono
- **Análise de risco climático:** carteiras bancárias devem mapear exposição a ativos "stranded"

## Por que ESG é risco financeiro?

💡 **Conexão para a prova:** um banco que financeia empresas com alto risco climático pode ter sua carteira desvalorizada por regulação ambiental futura. Por isso ESG é **risco financeiro**, não só ética.`,
    },
    {
      titulo: "Inclusão Financeira e Desbancarização",
      slug: "inclusao-financeira-e-desbancarizacao",
      ordem: 3,
      resumo: "O Brasil ainda tem milhões de pessoas sem acesso pleno ao sistema financeiro. A inclusão financeira é um objetivo explícito do Banco Central e da Agenda BC#.",
      conteudo: `# Inclusão Financeira e Desbancarização

## O problema da desbancarização

O Brasil ainda tem milhões de pessoas sem acesso pleno ao sistema financeiro. A **inclusão financeira** é um objetivo explícito do Banco Central e da Agenda BC#.

## Definições

- **Desbancarizados:** pessoas sem conta em banco ou com acesso muito limitado

## Ferramentas de inclusão financeira

- **Pix como ferramenta de inclusão:** gratuito, acessível por celular básico, sem necessidade de conta corrente
- **Correspondentes bancários:** lotéricas, farmácias e mercados que oferecem serviços bancários básicos
- **Conta de pagamento:** mais acessível que conta corrente, sem exigências de renda mínima

## Impacto do Pix

💡 **Dado para contexto:** o Pix acelerou a inclusão financeira mais em 1 ano do que qualquer programa dos 20 anos anteriores — é argumento recorrente em questões que pedem o impacto do Pix.`,
    },
    {
      titulo: "Sandbox Regulatório",
      slug: "sandbox-regulatorio",
      ordem: 4,
      resumo: "O sandbox regulatório é um ambiente controlado onde empresas inovadoras podem testar produtos financeiros sem estar sujeitas a toda a regulação vigente.",
      conteudo: `# Sandbox Regulatório

## O que é o Sandbox Regulatório?

O sandbox regulatório é um ambiente controlado onde empresas inovadoras podem **testar produtos financeiros sem estar sujeitas a toda a regulação vigente** — por um período limitado.

## Base legal

- Criado pelo **Banco Central (Resolução BCB 29/2020)** e pela **CVM**
- Permite testar modelos de negócio sem licença completa por até **2 anos**

## Requisitos para participar

A empresa deve ter:
- Modelo inovador
- Controles de risco adequados
- Plano de saída (regularizar ou encerrar a atividade após o sandbox)

## Por que o sandbox existe?

O sandbox resolve um dilema clássico de regulação:
- **Exigir licença completa antes do teste** → desincentiva a inovação
- **Não ter nenhuma regra** → gera risco ao consumidor
- **Sandbox** → o meio-termo regulatório

💡 Para a prova: o sandbox não elimina a regulação — ele a reduz temporariamente para permitir testes controlados, com supervisão do regulador.`,
    },
  ];

  for (const t of b5_topics) {
    await prisma.topico.upsert({
      where: { blocoId_slug: { blocoId: b5.id, slug: t.slug } },
      update: {},
      create: { ...t, blocoId: b5.id },
    });
  }
  console.log(`  ✅ Bloco 5: ${b5_topics.length} tópicos`);

  // ─────────────────────────────────────────────
  // QUIZ FINAL — 10 questões estilo concurso bancário
  // Associados ao primeiro tópico de cada bloco para distribuição
  // ─────────────────────────────────────────────
  console.log("\n  🧠 Criando Quiz Final (10 questões)...");

  // Busca os tópicos para associar os quizzes
  const topicoPix = await prisma.topico.findFirst({ where: { blocoId: b1.id, slug: "pix-arquitetura-e-modalidades" } });
  const topicoOpenFinance = await prisma.topico.findFirst({ where: { blocoId: b1.id, slug: "open-finance-as-4-fases" } });
  const topicoDrex = await prisma.topico.findFirst({ where: { blocoId: b1.id, slug: "drex-real-digital-cbdc" } });
  const topicoFintechs = await prisma.topico.findFirst({ where: { blocoId: b2.id, slug: "fintechs-conceito-e-categorias" } });
  const topicoCripto = await prisma.topico.findFirst({ where: { blocoId: b3.id, slug: "criptomoedas-e-regulacao-brasileira" } });
  const topicoAgendaBC = await prisma.topico.findFirst({ where: { blocoId: b5.id, slug: "agenda-bc-os-4-pilares" } });
  const topicoCadastro = await prisma.topico.findFirst({ where: { blocoId: b4.id, slug: "cadastro-positivo" } });
  const topicoSeguranca = await prisma.topico.findFirst({ where: { blocoId: b4.id, slug: "seguranca-cibernetica-resolucao-bcb-4893" } });
  const topicoBaaS = await prisma.topico.findFirst({ where: { blocoId: b2.id, slug: "banking-as-a-service-baas" } });
  const topicoESG = await prisma.topico.findFirst({ where: { blocoId: b5.id, slug: "esg-no-mercado-financeiro" } });

  const quizData = [
    {
      topicoId: topicoPix!.id,
      pergunta: "Qual órgão opera diretamente a infraestrutura do Pix no Brasil?",
      explicacao: "O Pix é operado diretamente pelo Banco Central, por meio do SPI (Sistema de Pagamentos Instantâneos). Isso é diferente do TED, que passa por câmaras privadas.",
      opcoes: [
        { texto: "Febraban", correta: false },
        { texto: "Banco Central do Brasil", correta: true },
        { texto: "Conselho Monetário Nacional", correta: false },
        { texto: "B3", correta: false },
      ],
    },
    {
      topicoId: topicoOpenFinance!.id,
      pergunta: "O Open Finance avançou do conceito de Open Banking ao incluir quais novos segmentos?",
      explicacao: "O Open Finance expandiu o escopo do Open Banking para incluir dados e transações de seguros, previdência complementar, câmbio e investimentos — não só bancários.",
      opcoes: [
        { texto: "Apenas crédito e câmbio", correta: false },
        { texto: "Somente investimentos", correta: false },
        { texto: "Seguros, previdência, câmbio e investimentos", correta: true },
        { texto: "Apenas seguros e previdência", correta: false },
      ],
    },
    {
      topicoId: topicoDrex!.id,
      pergunta: "O que diferencia o Drex (Real Digital) de uma criptomoeda como o Bitcoin?",
      explicacao: "O Drex é uma CBDC — moeda digital de banco central, com emissão controlada e garantia estatal, equivalente ao Real físico. O Bitcoin é descentralizado, sem controle estatal e volátil.",
      opcoes: [
        { texto: "O Drex usa blockchain e o Bitcoin não", correta: false },
        { texto: "O Drex é emitido e controlado pelo Banco Central; o Bitcoin é descentralizado", correta: true },
        { texto: "O Drex é volátil e o Bitcoin estável", correta: false },
        { texto: "Não há diferença prática entre os dois", correta: false },
      ],
    },
    {
      topicoId: topicoFintechs!.id,
      pergunta: "Qual é a principal diferença entre uma Fintech e um Banco Digital?",
      explicacao: "Banco digital é apenas uma categoria dentro do universo de fintechs. Uma fintech de maquininha, um app de câmbio ou uma seguradora digital são fintechs — mas não são bancos digitais.",
      opcoes: [
        { texto: "Não há diferença conceitual", correta: false },
        { texto: "Todo banco digital é uma fintech, mas nem toda fintech é banco digital", correta: true },
        { texto: "Toda fintech é obrigatoriamente um banco digital", correta: false },
        { texto: "Bancos digitais não são regulados pelo Banco Central", correta: false },
      ],
    },
    {
      topicoId: topicoCripto!.id,
      pergunta: "Qual lei estabeleceu o marco regulatório das criptomoedas no Brasil?",
      explicacao: "A Lei 14.478/2022 é o marco legal dos criptoativos no Brasil. Ela define 'ativo virtual', cria a figura das PSAVs e estabelece regras de prevenção à lavagem.",
      opcoes: [
        { texto: "Lei 13.709/2018", correta: false },
        { texto: "Lei 9.613/1998", correta: false },
        { texto: "Lei 14.478/2022", correta: true },
        { texto: "Lei 12.865/2013", correta: false },
      ],
    },
    {
      topicoId: topicoAgendaBC!.id,
      pergunta: "Quais são os 4 pilares da Agenda BC# do Banco Central?",
      explicacao: "A Agenda BC# tem 4 pilares: Inclusão (ampliar acesso), Competitividade (reduzir concentração), Transparência (mais informação ao consumidor) e Educação financeira. Mnemônico: ICTE.",
      opcoes: [
        { texto: "Pix, Open Finance, Drex, Sandbox", correta: false },
        { texto: "Inclusão, Competitividade, Transparência, Educação financeira", correta: true },
        { texto: "Regulação, Supervisão, Fiscalização, Controle", correta: false },
        { texto: "Segurança, Inovação, Sustentabilidade, Crédito", correta: false },
      ],
    },
    {
      topicoId: topicoCadastro!.id,
      pergunta: "O que é o Cadastro Positivo e qual sua principal mudança em 2019?",
      explicacao: "O Cadastro Positivo registra histórico de pagamentos em dia. Em 2019, passou a ser opt-out — todos são incluídos automaticamente, a menos que solicitem exclusão.",
      opcoes: [
        { texto: "Banco de dados de devedores; passou a ser opt-in", correta: false },
        { texto: "Banco de dados de bons pagadores; passou a ser opt-out (adesão automática)", correta: true },
        { texto: "Lista de empresas sancionadas; passou a ser pública", correta: false },
        { texto: "Registro de fintechs; passou a ser obrigatório", correta: false },
      ],
    },
    {
      topicoId: topicoSeguranca!.id,
      pergunta: "Qual Resolução obriga instituições financeiras a terem política estruturada de segurança cibernética?",
      explicacao: "A Resolução BCB 4.893/2021 estabelece requisitos para a política de segurança cibernética e para a contratação de serviços de processamento e armazenamento de dados de instituições financeiras.",
      opcoes: [
        { texto: "CMN 4.945/2021", correta: false },
        { texto: "BCB 4.893/2021", correta: true },
        { texto: "Lei 13.709/2018", correta: false },
        { texto: "CVM 175/2022", correta: false },
      ],
    },
    {
      topicoId: topicoBaaS!.id,
      pergunta: "O que é Banking as a Service (BaaS)?",
      explicacao: "BaaS permite que empresas não-financeiras (varejistas, apps) ofereçam serviços bancários usando a licença e infraestrutura de uma instituição regulada, sem precisar elas mesmas ser bancos.",
      opcoes: [
        { texto: "Um serviço de atendimento bancário 24h", correta: false },
        { texto: "Modelo em que uma instituição licenciada disponibiliza infraestrutura para não-bancos oferecerem produtos financeiros", correta: true },
        { texto: "Plataforma de open banking para compartilhar dados", correta: false },
        { texto: "Sistema de pagamentos do Banco Central", correta: false },
      ],
    },
    {
      topicoId: topicoESG!.id,
      pergunta: "Qual das afirmações sobre o ESG no mercado financeiro está CORRETA?",
      explicacao: "A Resolução CMN 4.945/2021 tornou a política de responsabilidade socioambiental obrigatória para instituições financeiras. ESG é risco financeiro — não apenas pauta ética ou de marketing.",
      opcoes: [
        { texto: "ESG é apenas uma iniciativa voluntária sem impacto regulatório", correta: false },
        { texto: "A Resolução CMN 4.945/2021 obriga bancos a ter política de responsabilidade socioambiental", correta: true },
        { texto: "ESG é tratado pelo Banco Central como tema de marketing institucional", correta: false },
        { texto: "Green bonds são isentos de regulação da CVM", correta: false },
      ],
    },
  ];

  for (let i = 0; i < quizData.length; i++) {
    const q = quizData[i];
    await prisma.quiz.create({
      data: {
        pergunta: q.pergunta,
        explicacao: q.explicacao,
        ordem: i + 1,
        topicoId: q.topicoId,
        opcoes: {
          create: q.opcoes.map((o, idx) => ({ texto: o.texto, correta: o.correta, ordem: idx })),
        },
      },
    });
  }
  console.log(`  ✅ Quiz: ${quizData.length} questões`);

  // ─────────────────────────────────────────────
  // FLASHCARDS — 12 cards do HTML original
  // ─────────────────────────────────────────────
  console.log("\n  🃏 Criando Flashcards (12 cards)...");

  const flashcardsData = [
    { topicoId: topicoPix!.id, frente: "O que é o SPI e qual sua relação com o Pix?", verso: "O SPI (Sistema de Pagamentos Instantâneos) é a infraestrutura tecnológica operada pelo Banco Central que suporta todas as transações Pix. É o 'motor' por trás do Pix.", ordem: 1 },
    { topicoId: topicoOpenFinance!.id, frente: "Qual é a principal diferença entre Open Banking e Open Finance?", verso: "Open Banking abrange dados bancários. Open Finance expande para seguros, previdência, câmbio e investimentos — é o Open Banking evoluído.", ordem: 2 },
    { topicoId: topicoDrex!.id, frente: "O que é uma CBDC?", verso: "Central Bank Digital Currency — moeda digital emitida e controlada por um banco central. O Drex é a CBDC do Brasil. Diferente de criptomoeda: é centralizada e estável.", ordem: 3 },
    { topicoId: topicoOpenFinance!.id, frente: "Cite as 4 fases do Open Finance.", verso: "Fase 1: dados das instituições. Fase 2: dados dos clientes. Fase 3: iniciação de pagamentos e crédito. Fase 4: expansão para seguros e investimentos.", ordem: 4 },
    { topicoId: topicoFintechs!.id, frente: "O que é uma Instituição de Pagamento (IP)?", verso: "Empresa regulada pelo Banco Central que oferece serviços de pagamento SEM SER BANCO. Não capta depósitos nem concede crédito da forma tradicional. Ex: emissores de cartão, credenciadoras.", ordem: 5 },
    { topicoId: topicoAgendaBC!.id, frente: "Quais são os 4 pilares da Agenda BC#?", verso: "Inclusão · Competitividade · Transparência · Educação financeira. Mnemônico: ICTE.", ordem: 6 },
    { topicoId: topicoCadastro!.id, frente: "O que é o Cadastro Positivo e como funciona?", verso: "Banco de dados de bons pagadores. Desde 2019 é opt-out — todos são incluídos automaticamente. Permite melhores condições de crédito para quem paga em dia.", ordem: 7 },
    { topicoId: topicoBaaS!.id, frente: "Quais são as 3 fases da lavagem de dinheiro?", verso: "1. Colocação: inserir o dinheiro sujo no sistema. 2. Ocultação: disfarçar a origem. 3. Integração: reinserir como dinheiro 'limpo' na economia.", ordem: 8 },
    { topicoId: topicoBaaS!.id, frente: "O que é Banking as a Service (BaaS)?", verso: "Modelo em que uma instituição licenciada disponibiliza sua infraestrutura para não-bancos oferecerem produtos financeiros. Base técnica do Embedded Finance.", ordem: 9 },
    { topicoId: (await prisma.topico.findFirst({ where: { blocoId: b3.id, slug: "stablecoins-e-riscos" } }))!.id, frente: "O que é uma stablecoin e qual o risco do modelo algorítmico?", verso: "Criptomoeda atrelada a ativo estável (ex: dólar). O modelo algorítmico usa código para manter paridade — pode colapsar, como o TerraLUNA em 2022 (US$40 bilhões destruídos).", ordem: 10 },
    { topicoId: topicoSeguranca!.id, frente: "O que regula a Resolução BCB 4.893/2021?", verso: "Obriga instituições financeiras a terem política formal de segurança cibernética, plano de resposta a incidentes e testes periódicos de vulnerabilidade.", ordem: 11 },
    { topicoId: (await prisma.topico.findFirst({ where: { blocoId: b5.id, slug: "sandbox-regulatorio" } }))!.id, frente: "O que é o Sandbox Regulatório do Banco Central?", verso: "Ambiente controlado para testar inovações financeiras sem licença completa por até 2 anos (Res. BCB 29/2020). Permite inovar com regras reduzidas sob supervisão.", ordem: 12 },
  ];

  for (const fc of flashcardsData) {
    await prisma.flashcard.create({ data: fc });
  }
  console.log(`  ✅ Flashcards: ${flashcardsData.length} cards`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log("   - 1 Matéria: Atualidades do Mercado Financeiro");
  console.log("   - 5 Blocos: Nova Infraestrutura | Fintechs | Ativos Digitais | IA/Dados | ESG");
  console.log("   - 15 Tópicos com conteúdo completo");
  console.log("   - 10 Questões de quiz (estilo concurso bancário)");
  console.log("   - 12 Flashcards");
  console.log("\n🚀 Rode: npx prisma db push && npm run db:seed");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
