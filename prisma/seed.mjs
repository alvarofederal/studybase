import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Carrega .env (necessário porque seed roda fora do Next.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Prisma 7 requer driver adapter — PrismaMariaDb cria o pool internamente a partir do config
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

// ─── CONTEÚDO EXTRAÍDO DO index-atualizades-sistema-financeiro.html ───

const blocos = [
  {
    nome: "Nova Infraestrutura Financeira",
    slug: "nova-infraestrutura-financeira",
    descricao: "Como o dinheiro circula hoje no Brasil?",
    ordem: 1,
    topicos: [
      {
        titulo: "Pix — Arquitetura e Modalidades",
        slug: "pix-arquitetura-e-modalidades",
        ordem: 1,
        resumo: "O Pix não é simplesmente 'TED rápido'. É operado diretamente pelo Banco Central, funciona 24/7 e é gratuito para pessoas físicas por regulação.",
        conteudo: `# Pix — Arquitetura e Modalidades

O Pix não é simplesmente "TED rápido". Ele é operado diretamente pelo **Banco Central**, funciona **24 horas por dia, 7 dias por semana**, incluindo feriados, e é obrigatoriamente gratuito para pessoas físicas por determinação regulatória.

## Modalidades do Pix

- **Pix Cobrança:** substitui o boleto bancário com QR Code dinâmico
- **Pix Saque e Pix Troco:** permite sacar dinheiro em estabelecimentos comerciais
- **Pix Automático:** substitui o débito automático para cobranças recorrentes
- **Chaves Pix:** CPF/CNPJ, e-mail, telefone ou chave aleatória

## Impacto estratégico

O Pix forçou a gratuidade de transferências e quebrou barreiras de entrada para novas instituições, intensificando a concorrência bancária.

> 💡 **Ponto-chave:** O Pix criou uma nova infraestrutura — não é só velocidade. É operado pelo BCB por meio do **SPI (Sistema de Pagamentos Instantâneos)**.`,
      },
      {
        titulo: "Open Finance — As 4 Fases",
        slug: "open-finance-as-4-fases",
        ordem: 2,
        resumo: "O Open Finance é a evolução do Open Banking. Sua lógica central: os dados financeiros pertencem ao cliente, não ao banco.",
        conteudo: `# Open Finance — As 4 Fases

O Open Finance é a evolução do Open Banking. Sua lógica central: **os dados financeiros pertencem ao cliente**, não ao banco. Isso permite portabilidade de histórico e acesso a melhores condições de crédito.

## As 4 Fases

- **Fase 1:** Compartilhamento de dados das próprias instituições (produtos e serviços)
- **Fase 2:** Compartilhamento de dados cadastrais e transacionais dos clientes
- **Fase 3:** Iniciação de pagamentos e propostas de crédito via terceiros
- **Fase 4:** Expansão para seguros, previdência, câmbio e investimentos

## Open Banking vs Open Finance

**Open Banking** focava em dados bancários. **Open Finance** abrange todo o ecossistema financeiro — seguros, investimentos, câmbio, previdência.

> 💡 **Para a prova:** Open Finance é uma política antimonopólio. O cliente leva seu histórico a outro banco e consegue crédito melhor. Entender a lógica resolve questões difíceis.`,
      },
      {
        titulo: "Drex — Real Digital (CBDC)",
        slug: "drex-real-digital-cbdc",
        ordem: 3,
        resumo: "O Drex é a moeda digital do Banco Central do Brasil (CBDC). Diferente das criptomoedas, é emitido e controlado pelo Estado.",
        conteudo: `# Drex — Real Digital (CBDC)

O Drex é a moeda digital do Banco Central do Brasil (CBDC — Central Bank Digital Currency). Diferente das criptomoedas, é emitido e controlado pelo Estado.

## Características

- Operado em **blockchain permissionada** — acesso controlado, não público
- Equivale ao Real físico: 1 Drex = R$ 1,00 garantido pelo BCB
- Permite **contratos inteligentes** (smart contracts) em transações financeiras
- Não é aberto ao público diretamente — passa por bancos e instituições autorizadas

## Drex ≠ Criptomoeda

| | Drex | Bitcoin |
|--|------|---------|
| Emissor | Banco Central | Descentralizado |
| Controle | Estatal | Sem controle central |
| Estabilidade | Estável (= R$) | Volátil |
| Tecnologia | Blockchain permissionada | Blockchain pública |

> 💡 **Diferença crucial para a prova:** Drex ≠ criptomoeda. O Drex é centralizado, garantido pelo BCB e estável.`,
      },
      {
        titulo: "SPB — Sistema de Pagamentos Brasileiro",
        slug: "spb-sistema-de-pagamentos-brasileiro",
        ordem: 4,
        resumo: "O SPB é o conjunto de entidades, sistemas e procedimentos que processam as transferências de fundos no Brasil.",
        conteudo: `# SPB — Sistema de Pagamentos Brasileiro

O SPB é o conjunto de entidades, sistemas e procedimentos que processam as transferências de fundos no Brasil. Foi modernizado em 2002 e o Pix é sua evolução mais recente.

## Principais sistemas

- **STR (Sistema de Transferência de Reservas):** liquidação em tempo real, operado pelo BCB
- **SITRAF:** câmara de transferência de fundos (TED)
- **SPI (Sistema de Pagamentos Instantâneos):** infraestrutura que suporta o Pix

## Relação com o Pix

O SPI é a infraestrutura tecnológica do Pix, assim como o STR é a infraestrutura do TED. O Banco Central opera ambos diretamente.

> 💡 **Para a prova:** o SPI ≠ STR. O SPI foi criado especificamente para o Pix e opera em tempo real, 24/7.`,
      },
    ],
  },
  {
    nome: "Fintechs e Novos Modelos",
    slug: "fintechs-e-novos-modelos",
    descricao: "Quem está desafiando os bancos tradicionais?",
    ordem: 2,
    topicos: [
      {
        titulo: "Fintechs — Conceito e Categorias",
        slug: "fintechs-conceito-e-categorias",
        ordem: 1,
        resumo: "Fintech é qualquer empresa que usa tecnologia para oferecer serviços financeiros de forma mais eficiente, acessível ou barata.",
        conteudo: `# Fintechs — Conceito e Categorias

Fintech (Financial Technology) é qualquer empresa que usa tecnologia para oferecer serviços financeiros de forma mais eficiente, acessível ou barata que os players tradicionais.

## Categorias de Fintechs

- **Fintechs de pagamento:** processadoras, carteiras digitais (ex: PicPay)
- **Fintechs de crédito:** SCDs (Sociedades de Crédito Direto), plataformas P2P
- **Fintechs de investimento:** plataformas de corretagem digital
- **Insurtechs:** seguradoras digitais
- **Regtechs:** tecnologia para conformidade regulatória

## Erro clássico a evitar

Fintech ≠ banco digital. **Banco digital é UMA categoria de fintech.** Há fintechs que nunca serão bancos — como uma maquininha ou um app de câmbio.

> 💡 **Exemplo real:** o Mercado Pago é a maior fintech da América Latina mas não é banco digital — é uma instituição de pagamento.`,
      },
      {
        titulo: "Instituições de Pagamento (IPs)",
        slug: "instituicoes-de-pagamento",
        ordem: 2,
        resumo: "As IPs são reguladas pelo Banco Central mas NÃO são bancos. Não captam depósitos nem concedem crédito da forma tradicional.",
        conteudo: `# Instituições de Pagamento (IPs)

As IPs são reguladas pelo Banco Central mas **NÃO são bancos**. Elas não captam depósitos nem concedem crédito da forma tradicional — mas podem realizar pagamentos e manter recursos de clientes.

## Tipos de IPs

- **Emissor de instrumento de pagamento pós-pago:** emite cartão de crédito
- **Emissor de moeda eletrônica:** mantém conta de pagamento (ex: carteira digital)
- **Credenciador:** opera maquininhas de cartão
- **Iniciador de pagamento:** inicia Pix sem deter os recursos

## Conta de pagamento vs conta corrente

A conta de pagamento não tem incidência de IOF nas transferências e não oferece crédito. Os recursos ficam **segregados** (protegidos em caso de falência da IP).

> 💡 **Para a prova:** a conta de pagamento é mais acessível (sem exigência de renda) mas tem menos funcionalidades que a conta corrente bancária.`,
      },
      {
        titulo: "Banking as a Service (BaaS)",
        slug: "banking-as-a-service",
        ordem: 3,
        resumo: "BaaS é o modelo em que uma instituição financeira licenciada disponibiliza sua infraestrutura para que outras empresas ofereçam produtos financeiros.",
        conteudo: `# Banking as a Service (BaaS)

BaaS é o modelo em que uma instituição financeira licenciada disponibiliza sua infraestrutura regulatória para que outras empresas (não-financeiras) ofereçam produtos financeiros sob sua própria marca.

## Como funciona na prática

- Um varejista oferece crédito **sem ser banco** — usando a licença de um banco parceiro
- Um app de mobilidade oferece cartão de crédito — infraestrutura de um emissor
- Permite que marcas não-financeiras criem experiências financeiras integradas

## BaaS vs Embedded Finance

**BaaS** é a infraestrutura (o "motor"). **Embedded Finance** é a experiência do usuário (o "carro"). Sem BaaS, não existe Embedded Finance.

> 💡 **Conexão importante:** o BaaS reduziu drasticamente o custo de entrada no mercado financeiro — hoje uma startup pode oferecer conta e cartão sem precisar de licença bancária própria.`,
      },
      {
        titulo: "Big Techs no Mercado Financeiro",
        slug: "big-techs-no-mercado-financeiro",
        ordem: 4,
        resumo: "Empresas como Google, Amazon, Apple e Meta estão entrando no mercado financeiro global. O BCB e o Cade monitoram esse movimento.",
        conteudo: `# Big Techs no Mercado Financeiro

Empresas como Google, Amazon, Apple e Meta estão entrando no mercado financeiro global. No Brasil, o Banco Central e o Cade (antitruste) monitoram esse movimento de perto.

## Riscos e preocupações

- **Risco de concentração:** Big Techs já têm bilhões de usuários e dados comportamentais valiosos
- **Google Pay, Apple Pay:** carteiras digitais integradas ao ecossistema
- **Mercado Pago:** maior fintech da América Latina, ligada ao Mercado Livre
- O BCB exigiu interoperabilidade do WhatsApp Pay por questão competitiva

## Caso WhatsApp Pay (emblemático para provas)

O BCB **suspendeu o serviço em 2020** e exigiu aprovação formal para garantir interoperabilidade — não foi por "falta de segurança". O motivo foi competitividade e proteção do sistema de pagamentos.

> 💡 **Para prova:** o caso do WhatsApp Pay exemplifica como o BCB usa seu poder regulatório para garantir competição, mesmo contra grandes plataformas globais.`,
      },
    ],
  },
  {
    nome: "Ativos Digitais",
    slug: "ativos-digitais",
    descricao: "O que são esses novos produtos financeiros?",
    ordem: 3,
    topicos: [
      {
        titulo: "Criptomoedas e Regulação Brasileira",
        slug: "criptomoedas-e-regulacao-brasileira",
        ordem: 1,
        resumo: "A Lei 14.478/2022 é o marco legal das criptomoedas no Brasil. Cria um ambiente regulatório para as PSAVs.",
        conteudo: `# Criptomoedas e Regulação Brasileira

A **Lei 14.478/2022** é o marco legal das criptomoedas no Brasil. Ela não proíbe nem fomenta — cria um ambiente regulatório para as prestadoras de serviços de ativos virtuais (PSAVs).

## Conceitos fundamentais

- **Blockchain:** registro distribuído e imutável de transações
- **Bitcoin:** reserva de valor digital, oferta limitada a 21 milhões
- **Altcoins:** todas as criptomoedas que não são Bitcoin
- **Supervisão:** Banco Central supervisiona as exchanges no Brasil
- **Tributação:** Receita Federal — ganhos acima de R$35k/mês são tributados

## O que a Lei 14.478/2022 fez

Define "ativo virtual" e exige que as PSAVs tenham **autorização para operar no Brasil**, com regras de prevenção à lavagem de dinheiro.

> 💡 **Ponto de prova:** a supervisão das exchanges é do **Banco Central** (não da CVM). A CVM cuida dos tokens que são valores mobiliários.`,
      },
      {
        titulo: "Tokenização de Ativos",
        slug: "tokenizacao-de-ativos",
        ordem: 2,
        resumo: "Tokenizar um ativo é representá-lo digitalmente em blockchain, criando um token que pode ser negociado, fracionado e transferido com agilidade.",
        conteudo: `# Tokenização de Ativos

Tokenizar um ativo é representá-lo digitalmente em blockchain — criando um "token" que pode ser negociado, fracionado e transferido com muito mais agilidade que o ativo original.

## Exemplos práticos

- **Imóvel tokenizado:** um imóvel de R$1M pode ser dividido em 1.000 tokens de R$1.000
- **Recebível tokenizado:** uma nota fiscal pode ser tokenizada para antecipação
- **Drex e tokenização:** o Real Digital viabiliza liquidação instantânea de ativos tokenizados
- CVM e Banco Central estão desenvolvendo regulação conjunta para o tema

## O que a tokenização NÃO faz

A tokenização **não cria novos ativos** — ela cria novas formas de negociar ativos existentes, com mais liquidez, menor custo e maior fracionamento.

> 💡 **Conexão com Drex:** o Drex é o meio de pagamento ideal para liquidar tokens — uma transação de imóvel tokenizado pode ser liquidada em segundos com o Real Digital.`,
      },
      {
        titulo: "Stablecoins e Riscos",
        slug: "stablecoins-e-riscos",
        ordem: 3,
        resumo: "Stablecoins são criptomoedas atreladas a um ativo estável (geralmente o dólar), criadas para eliminar a volatilidade das criptomoedas.",
        conteudo: `# Stablecoins e Riscos

Stablecoins são criptomoedas atreladas a um ativo estável (geralmente o dólar), criadas para eliminar a volatilidade típica das criptomoedas.

## Principais stablecoins

- **USDT (Tether):** maior stablecoin, lastreada em dólar
- **USDC:** stablecoin regulada, com auditoria de reservas
- **Caso TerraLUNA (2022):** colapso de uma stablecoin algorítmica que destruiu US$40 bilhões
- Reguladores globais passaram a exigir lastro real e auditoria após o caso Terra

## Stablecoin lastreada vs algorítmica

| | Lastreada | Algorítmica |
|--|-----------|-------------|
| Paridade | Reservas reais em dólar | Código/algoritmo |
| Risco | Baixo | Alto (pode colapsar) |
| Exemplo | USDC, USDT | TerraLUNA (falhou) |

> 💡 **Para a prova:** stablecoin algorítmica ≠ stablecoin lastreada. O caso TerraLUNA (2022) é o principal exemplo de colapso — US$40 bilhões destruídos em dias.`,
      },
    ],
  },
  {
    nome: "IA, Dados e Crédito",
    slug: "ia-dados-e-credito",
    descricao: "Como a tecnologia mudou a relação banco-cliente?",
    ordem: 4,
    topicos: [
      {
        titulo: "LGPD no Sistema Financeiro",
        slug: "lgpd-no-sistema-financeiro",
        ordem: 1,
        resumo: "A Lei Geral de Proteção de Dados (Lei 13.709/2018) impacta diretamente bancos e fintechs, que trabalham com dados sensíveis em larga escala.",
        conteudo: `# LGPD no Sistema Financeiro

A Lei Geral de Proteção de Dados (Lei 13.709/2018) impacta diretamente bancos e fintechs, que trabalham com dados sensíveis em larga escala.

## Pontos-chave da LGPD

- **ANPD:** Autoridade Nacional de Proteção de Dados — fiscaliza o cumprimento
- **Consentimento:** o titular deve consentir com o tratamento dos seus dados
- **Bases legais:** além do consentimento, há outras (execução de contrato, legítimo interesse)
- **Direitos do titular:** acesso, correção, exclusão, portabilidade dos dados
- Open Finance e LGPD se complementam — o cliente autoriza o compartilhamento

## Conexão LGPD + Open Finance

Open Finance **SEM LGPD seria impossível** — é a LGPD que garante que o compartilhamento de dados seja feito com consentimento e finalidade definida.

> 💡 **Para provas:** a ANPD é o órgão que fiscaliza a LGPD. O Banco Central tem competência própria para regular o uso de dados no sistema financeiro.`,
      },
      {
        titulo: "Cadastro Positivo",
        slug: "cadastro-positivo",
        ordem: 2,
        resumo: "O Cadastro Positivo registra o histórico de pagamentos em dia. Desde 2019, a adesão é automática (opt-out).",
        conteudo: `# Cadastro Positivo

O Cadastro Positivo registra o histórico de pagamentos em dia de pessoas físicas e jurídicas. Desde 2019, a adesão é **automática (opt-out)** — ou seja, todos estão incluídos automaticamente.

## Como funciona

- Gerenciado pelos bureaus de crédito: Serasa, SPC, Boa Vista, Quod
- Permite que bons pagadores tenham **acesso a crédito mais barato**
- Beneficia especialmente os **desbancarizados** sem histórico em banco
- O score de crédito melhora com dados positivos, não apenas negativos

## A mudança de 2019

Antes do Cadastro Positivo, o sistema de crédito brasileiro era apenas **"negativo"** — você só aparecia se tivesse dívida. Isso prejudicava quem sempre pagou em dia mas não tinha histórico bancário.

> 💡 **Opt-out vs opt-in:** desde 2019 é opt-out (todos incluídos automaticamente, você sai se quiser). Antes era opt-in (você precisava se cadastrar ativamente).`,
      },
      {
        titulo: "Inteligência Artificial nos Bancos",
        slug: "inteligencia-artificial-nos-bancos",
        ordem: 3,
        resumo: "A IA está transformando todas as funções bancárias — do relacionamento com clientes à análise de risco sistêmico.",
        conteudo: `# Inteligência Artificial nos Bancos

A IA está transformando todas as funções bancárias — do relacionamento com clientes à análise de risco sistêmico.

## Aplicações nos bancos

- **Análise de crédito:** modelos de machine learning analisam centenas de variáveis simultaneamente
- **Detecção de fraudes:** IA identifica padrões anômalos em tempo real
- **Chatbots e assistentes:** atendimento 24/7, resolução de demandas simples
- **Personalização:** ofertas de produtos baseadas em comportamento do cliente
- **Riscos:** viés algorítmico pode discriminar grupos vulneráveis no crédito

## Ponto de atenção regulatória

O Banco Central e o CMN estão desenvolvendo diretrizes para uso ético de IA, especialmente para evitar **discriminação algorítmica em concessões de crédito**.

> 💡 **Para prova:** o risco de viés algorítmico é real — modelos de crédito podem reproduzir ou amplificar discriminações históricas se não forem auditados.`,
      },
      {
        titulo: "Segurança Cibernética — Resolução BCB 4.893",
        slug: "seguranca-cibernetica-resolucao-bcb-4893",
        ordem: 4,
        resumo: "A Resolução BCB 4.893/2021 obriga todas as instituições financeiras a terem uma política de segurança cibernética estruturada.",
        conteudo: `# Segurança Cibernética — Resolução BCB 4.893/2021

A Resolução BCB 4.893/2021 obriga todas as instituições financeiras a terem uma política de segurança cibernética estruturada.

## Exigências da resolução

- Política formal de segurança cibernética
- Plano de resposta a incidentes
- Testes regulares de vulnerabilidade

## Principais ameaças

- **Engenharia social:** manipulação psicológica para obter dados (phishing, vishing)
- **SIM Swap:** clonagem de chip celular para interceptar SMS de autenticação

## Responsabilidade do banco

O banco tem **responsabilidade objetiva** por falhas de segurança em seus sistemas. Se o cliente foi vítima de phishing sofisticado sem negligência própria, o banco pode responder.

> 💡 **Para provas:** o banco NÃO se isenta de responsabilidade apenas porque o cliente "entregou" os dados sob engenharia social sofisticada. A responsabilidade é analisada caso a caso.`,
      },
    ],
  },
  {
    nome: "ESG e Agenda BC#",
    slug: "esg-e-agenda-bc",
    descricao: "Para onde o mercado financeiro está indo?",
    ordem: 5,
    topicos: [
      {
        titulo: "Agenda BC# — Os 4 Pilares",
        slug: "agenda-bc-os-4-pilares",
        ordem: 1,
        resumo: "A Agenda BC# é o programa estratégico do Banco Central, lançado em 2019. Ela explica POR QUE o Pix, o Open Finance e o Drex existem.",
        conteudo: `# Agenda BC# — Os 4 Pilares

A Agenda BC# é o programa estratégico do Banco Central do Brasil, lançado em 2019. Ela explica **POR QUE** o Pix, o Open Finance e o Drex existem. Quem entende a Agenda BC# conecta todos os temas.

## Os 4 Pilares (ICTE)

- **Inclusão:** ampliar o acesso ao sistema financeiro para desbancarizados
- **Competitividade:** reduzir concentração bancária, facilitar entrada de novos players
- **Transparência:** mais informação ao consumidor sobre tarifas, produtos e riscos
- **Educação financeira:** capacitar a população para decisões financeiras conscientes

## Conexões com outros temas

| Pilar | Medidas relacionadas |
|-------|---------------------|
| Inclusão | Pix (gratuito), conta de pagamento, correspondentes bancários |
| Competitividade | Open Finance, Pix (interoperável), sandbox regulatório |
| Transparência | Open Finance, LGPD, Cadastro Positivo |
| Educação | Programa Vida + Financeira do BCB |

> 💡 **Mnemônico:** ICTE — Inclusão, Competitividade, Transparência, Educação. Esta sigla já caiu diretamente em provas do BB e CEF.`,
      },
      {
        titulo: "ESG no Mercado Financeiro",
        slug: "esg-no-mercado-financeiro",
        ordem: 2,
        resumo: "ESG deixou de ser pauta de sustentabilidade para se tornar critério financeiro. O risco climático agora é tratado como risco de crédito.",
        conteudo: `# ESG no Mercado Financeiro

ESG (Environmental, Social, Governance) deixou de ser pauta de sustentabilidade para se tornar critério financeiro. O risco climático agora é tratado como risco de crédito.

## Regulação e instrumentos

- **Resolução CMN 4.945/2021:** obriga bancos a ter política de responsabilidade socioambiental
- **Green Bonds:** títulos de dívida emitidos para financiar projetos sustentáveis
- **Crédito verde:** linhas com taxas menores para projetos de baixo impacto ambiental
- **Mercado de carbono:** Brasil avança em regulação para créditos de carbono
- **Análise de risco climático:** carteiras bancárias devem mapear exposição a ativos "stranded"

## Por que ESG é risco financeiro

Um banco que financia empresas com alto risco climático pode ter sua carteira desvalorizada por regulação ambiental futura. Por isso ESG é **risco financeiro**, não só ética.

> 💡 **Para a prova:** a Resolução CMN 4.945/2021 tornou a política de responsabilidade socioambiental OBRIGATÓRIA. ESG não é voluntário para bancos — é regulatório.`,
      },
      {
        titulo: "Inclusão Financeira e Desbancarização",
        slug: "inclusao-financeira-e-desbancarizacao",
        ordem: 3,
        resumo: "O Brasil ainda tem milhões sem acesso pleno ao sistema financeiro. A inclusão é objetivo explícito do Banco Central.",
        conteudo: `# Inclusão Financeira e Desbancarização

O Brasil ainda tem milhões de pessoas sem acesso pleno ao sistema financeiro. A inclusão financeira é um objetivo explícito do Banco Central e da Agenda BC#.

## Conceitos e instrumentos

- **Desbancarizados:** pessoas sem conta em banco ou com acesso muito limitado
- **Pix como ferramenta de inclusão:** gratuito, acessível por celular básico, sem necessidade de conta corrente
- **Correspondentes bancários:** lotéricas, farmácias e mercados que oferecem serviços bancários básicos
- **Conta de pagamento:** mais acessível que conta corrente, sem exigências de renda mínima

## Impacto do Pix na inclusão

O Pix acelerou a inclusão financeira mais em 1 ano do que qualquer programa dos 20 anos anteriores. É argumento recorrente em questões que pedem o impacto do Pix.

> 💡 **Para provas:** correspondentes bancários são regulados pelo Banco Central e podem oferecer serviços como depósito, saque, pagamento de contas e acesso ao Pix.`,
      },
      {
        titulo: "Sandbox Regulatório",
        slug: "sandbox-regulatorio",
        ordem: 4,
        resumo: "Ambiente controlado onde empresas inovadoras podem testar produtos financeiros sem estar sujeitas a toda a regulação vigente.",
        conteudo: `# Sandbox Regulatório

O sandbox regulatório é um ambiente controlado onde empresas inovadoras podem testar produtos financeiros sem estar sujeitas a toda a regulação vigente — por um período limitado.

## Como funciona

- Criado pelo Banco Central (Resolução BCB 29/2020) e pela CVM
- Permite testar modelos de negócio sem licença completa por **até 2 anos**
- A empresa deve ter: modelo inovador, controles de risco e plano de saída
- Após o sandbox, a empresa regulariza ou encerra a atividade

## Por que existe o sandbox

O sandbox resolve um dilema clássico de regulação:
- Exigir licença completa antes do teste **desincentiva a inovação**
- Não ter nenhuma regra gera **risco ao consumidor**
- O sandbox é o **meio-termo regulado**

> 💡 **Para a prova:** o sandbox é instrumento de fomento à inovação com supervisão. A empresa não está isenta de regras — está sujeita a regras adaptadas por um período definido.`,
      },
    ],
  },
];

// ─── QUIZ (10 questões do HTML) ───
const quizData = [
  {
    pergunta: "Qual órgão opera diretamente a infraestrutura do Pix no Brasil?",
    explicacao: "O Pix é operado diretamente pelo Banco Central, por meio do SPI (Sistema de Pagamentos Instantâneos). Isso é diferente do TED, que passa por câmaras privadas.",
    blocoSlug: "nova-infraestrutura-financeira",
    topicoSlug: "pix-arquitetura-e-modalidades",
    opcoes: [
      { texto: "Febraban", correta: false },
      { texto: "Banco Central do Brasil", correta: true },
      { texto: "Conselho Monetário Nacional", correta: false },
      { texto: "B3", correta: false },
    ],
  },
  {
    pergunta: "O Open Finance avançou do conceito de Open Banking ao incluir quais novos segmentos?",
    explicacao: "O Open Finance expandiu o escopo do Open Banking para incluir dados e transações de seguros, previdência complementar, câmbio e investimentos — não só bancários.",
    blocoSlug: "nova-infraestrutura-financeira",
    topicoSlug: "open-finance-as-4-fases",
    opcoes: [
      { texto: "Apenas crédito e câmbio", correta: false },
      { texto: "Somente investimentos", correta: false },
      { texto: "Seguros, previdência, câmbio e investimentos", correta: true },
      { texto: "Apenas seguros e previdência", correta: false },
    ],
  },
  {
    pergunta: "O que diferencia o Drex (Real Digital) de uma criptomoeda como o Bitcoin?",
    explicacao: "O Drex é uma CBDC — moeda digital de banco central, com emissão controlada e garantia estatal, equivalente ao Real físico. O Bitcoin é descentralizado, sem controle estatal e volátil.",
    blocoSlug: "nova-infraestrutura-financeira",
    topicoSlug: "drex-real-digital-cbdc",
    opcoes: [
      { texto: "O Drex usa blockchain e o Bitcoin não", correta: false },
      { texto: "O Drex é emitido e controlado pelo Banco Central; o Bitcoin é descentralizado", correta: true },
      { texto: "O Drex é volátil e o Bitcoin estável", correta: false },
      { texto: "Não há diferença prática entre os dois", correta: false },
    ],
  },
  {
    pergunta: "Qual é a principal diferença entre uma Fintech e um Banco Digital?",
    explicacao: "Banco digital é apenas uma categoria dentro do universo de fintechs. Uma fintech de maquininha, um app de câmbio ou uma seguradora digital são fintechs — mas não são bancos digitais.",
    blocoSlug: "fintechs-e-novos-modelos",
    topicoSlug: "fintechs-conceito-e-categorias",
    opcoes: [
      { texto: "Não há diferença conceitual", correta: false },
      { texto: "Todo banco digital é uma fintech, mas nem toda fintech é banco digital", correta: true },
      { texto: "Toda fintech é obrigatoriamente um banco digital", correta: false },
      { texto: "Bancos digitais não são regulados pelo Banco Central", correta: false },
    ],
  },
  {
    pergunta: "Qual lei estabeleceu o marco regulatório das criptomoedas no Brasil?",
    explicacao: "A Lei 14.478/2022 é o marco legal dos criptoativos no Brasil. Ela define 'ativo virtual', cria a figura das PSAVs e estabelece regras de prevenção à lavagem.",
    blocoSlug: "ativos-digitais",
    topicoSlug: "criptomoedas-e-regulacao-brasileira",
    opcoes: [
      { texto: "Lei 13.709/2018", correta: false },
      { texto: "Lei 9.613/1998", correta: false },
      { texto: "Lei 14.478/2022", correta: true },
      { texto: "Lei 12.865/2013", correta: false },
    ],
  },
  {
    pergunta: "Quais são os 4 pilares da Agenda BC# do Banco Central?",
    explicacao: "A Agenda BC# tem 4 pilares: Inclusão, Competitividade, Transparência e Educação financeira. Mnemônico: ICTE.",
    blocoSlug: "esg-e-agenda-bc",
    topicoSlug: "agenda-bc-os-4-pilares",
    opcoes: [
      { texto: "Pix, Open Finance, Drex, Sandbox", correta: false },
      { texto: "Inclusão, Competitividade, Transparência, Educação financeira", correta: true },
      { texto: "Regulação, Supervisão, Fiscalização, Controle", correta: false },
      { texto: "Segurança, Inovação, Sustentabilidade, Crédito", correta: false },
    ],
  },
  {
    pergunta: "O que é o Cadastro Positivo e qual sua principal mudança em 2019?",
    explicacao: "O Cadastro Positivo registra histórico de pagamentos em dia. Em 2019, passou a ser opt-out — todos são incluídos automaticamente, a menos que solicitem exclusão.",
    blocoSlug: "ia-dados-e-credito",
    topicoSlug: "cadastro-positivo",
    opcoes: [
      { texto: "Banco de dados de devedores; passou a ser opt-in", correta: false },
      { texto: "Banco de dados de bons pagadores; passou a ser opt-out (adesão automática)", correta: true },
      { texto: "Lista de empresas sancionadas; passou a ser pública", correta: false },
      { texto: "Registro de fintechs; passou a ser obrigatório", correta: false },
    ],
  },
  {
    pergunta: "Qual Resolução obriga instituições financeiras a terem política estruturada de segurança cibernética?",
    explicacao: "A Resolução BCB 4.893/2021 estabelece requisitos para a política de segurança cibernética e para a contratação de serviços de processamento e armazenamento de dados.",
    blocoSlug: "ia-dados-e-credito",
    topicoSlug: "seguranca-cibernetica-resolucao-bcb-4893",
    opcoes: [
      { texto: "CMN 4.945/2021", correta: false },
      { texto: "BCB 4.893/2021", correta: true },
      { texto: "Lei 13.709/2018", correta: false },
      { texto: "CVM 175/2022", correta: false },
    ],
  },
  {
    pergunta: "O que é Banking as a Service (BaaS)?",
    explicacao: "BaaS permite que empresas não-financeiras (varejistas, apps) ofereçam serviços bancários usando a licença e infraestrutura de uma instituição regulada, sem precisar elas mesmas ser bancos.",
    blocoSlug: "fintechs-e-novos-modelos",
    topicoSlug: "banking-as-a-service",
    opcoes: [
      { texto: "Um serviço de atendimento bancário 24h", correta: false },
      { texto: "Modelo em que uma instituição licenciada disponibiliza infraestrutura para não-bancos oferecerem produtos financeiros", correta: true },
      { texto: "Plataforma de open banking para compartilhar dados", correta: false },
      { texto: "Sistema de pagamentos do Banco Central", correta: false },
    ],
  },
  {
    pergunta: "Qual das afirmações sobre o ESG no mercado financeiro está CORRETA?",
    explicacao: "A Resolução CMN 4.945/2021 tornou a política de responsabilidade socioambiental obrigatória para instituições financeiras. ESG é risco financeiro — não apenas pauta ética ou de marketing.",
    blocoSlug: "esg-e-agenda-bc",
    topicoSlug: "esg-no-mercado-financeiro",
    opcoes: [
      { texto: "ESG é apenas uma iniciativa voluntária sem impacto regulatório", correta: false },
      { texto: "A Resolução CMN 4.945/2021 obriga bancos a ter política de responsabilidade socioambiental", correta: true },
      { texto: "ESG é tratado pelo Banco Central como tema de marketing institucional", correta: false },
      { texto: "Green bonds são isentos de regulação da CVM", correta: false },
    ],
  },
];

// ─── FLASHCARDS (12 cards do HTML) ───
const flashcardsData = [
  { blocoSlug: "nova-infraestrutura-financeira", topicoSlug: "pix-arquitetura-e-modalidades", frente: "O que é o SPI e qual sua relação com o Pix?", verso: "O SPI (Sistema de Pagamentos Instantâneos) é a infraestrutura tecnológica operada pelo Banco Central que suporta todas as transações Pix. É o 'motor' por trás do Pix." },
  { blocoSlug: "nova-infraestrutura-financeira", topicoSlug: "open-finance-as-4-fases", frente: "Qual é a principal diferença entre Open Banking e Open Finance?", verso: "Open Banking abrange dados bancários. Open Finance expande para seguros, previdência, câmbio e investimentos — é o Open Banking evoluído." },
  { blocoSlug: "nova-infraestrutura-financeira", topicoSlug: "drex-real-digital-cbdc", frente: "O que é uma CBDC?", verso: "Central Bank Digital Currency — moeda digital emitida e controlada por um banco central. O Drex é a CBDC do Brasil. Diferente de criptomoeda: é centralizada e estável." },
  { blocoSlug: "nova-infraestrutura-financeira", topicoSlug: "open-finance-as-4-fases", frente: "Cite as 4 fases do Open Finance.", verso: "Fase 1: dados das instituições. Fase 2: dados dos clientes. Fase 3: iniciação de pagamentos e crédito. Fase 4: expansão para seguros e investimentos." },
  { blocoSlug: "fintechs-e-novos-modelos", topicoSlug: "instituicoes-de-pagamento", frente: "O que é uma Instituição de Pagamento (IP)?", verso: "Empresa regulada pelo Banco Central que oferece serviços de pagamento SEM ser banco. Não capta depósitos nem concede crédito da forma tradicional. Ex: emissores de cartão, credenciadoras." },
  { blocoSlug: "esg-e-agenda-bc", topicoSlug: "agenda-bc-os-4-pilares", frente: "Quais são os 4 pilares da Agenda BC#?", verso: "Inclusão · Competitividade · Transparência · Educação financeira. Mnemônico: ICTE." },
  { blocoSlug: "ia-dados-e-credito", topicoSlug: "cadastro-positivo", frente: "O que é o Cadastro Positivo e como funciona?", verso: "Banco de dados de bons pagadores. Desde 2019 é opt-out — todos são incluídos automaticamente. Permite melhores condições de crédito para quem paga em dia." },
  { blocoSlug: "esg-e-agenda-bc", topicoSlug: "inclusao-financeira-e-desbancarizacao", frente: "Quais são as 3 fases da lavagem de dinheiro?", verso: "1. Colocação: inserir o dinheiro sujo no sistema. 2. Ocultação: disfarçar a origem. 3. Integração: reinserir como dinheiro 'limpo' na economia." },
  { blocoSlug: "fintechs-e-novos-modelos", topicoSlug: "banking-as-a-service", frente: "O que é Banking as a Service (BaaS)?", verso: "Modelo em que uma instituição licenciada disponibiliza sua infraestrutura para não-bancos oferecerem produtos financeiros. Base técnica do Embedded Finance." },
  { blocoSlug: "ativos-digitais", topicoSlug: "stablecoins-e-riscos", frente: "O que é uma stablecoin e qual o risco do modelo algorítmico?", verso: "Criptomoeda atrelada a ativo estável (ex: dólar). O modelo algorítmico usa código para manter paridade — pode colapsar, como o TerraLUNA em 2022 (US$ 40 bilhões destruídos)." },
  { blocoSlug: "ia-dados-e-credito", topicoSlug: "seguranca-cibernetica-resolucao-bcb-4893", frente: "O que regula a Resolução BCB 4.893/2021?", verso: "Obriga instituições financeiras a terem política formal de segurança cibernética, plano de resposta a incidentes e testes periódicos de vulnerabilidade." },
  { blocoSlug: "esg-e-agenda-bc", topicoSlug: "sandbox-regulatorio", frente: "O que é o Sandbox Regulatório do Banco Central?", verso: "Ambiente controlado para testar inovações financeiras sem licença completa por até 2 anos (Res. BCB 29/2020). Permite inovar com regras reduzidas sob supervisão." },
];

// ─────────────────────────────────────────────
// SEED PRINCIPAL
// ─────────────────────────────────────────────
async function main() {
  console.log("🌱 Iniciando seed — Atualidades do Mercado Financeiro...\n");

  const materia = await prisma.materia.upsert({
    where: { slug: "atualidades-mercado-financeiro" },
    update: {},
    create: {
      nome: "Atualidades do Mercado Financeiro",
      slug: "atualidades-mercado-financeiro",
      descricao: "Aprenda em 20 horas o que transforma o sistema financeiro hoje. Estude por blocos, faça quizzes e acompanhe seu progresso em tempo real.",
      icone: "📈",
      cor: "cyan",
      ordem: 1,
    },
  });
  console.log(`✅ Matéria: ${materia.nome}\n`);

  // Mapa de topicoId por chave blocoSlug::topicoSlug
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
  for (const [idx, fc] of flashcardsData.entries()) {
    const topicoId = topicoMap[`${fc.blocoSlug}::${fc.topicoSlug}`];
    if (!topicoId) { console.warn(`  ⚠️  Tópico não encontrado para flashcard: ${fc.topicoSlug}`); continue; }
    await prisma.flashcard.create({
      data: { frente: fc.frente, verso: fc.verso, ordem: idx + 1, topicoId },
    });
    fcCount++;
  }
  console.log(`  🃏 ${fcCount} flashcards criados`);

  console.log("\n🎉 Seed concluído!");
  console.log("   1 matéria · 5 blocos · 15 tópicos · 10 quizzes · 12 flashcards");
  console.log("\n📌 Acesse: http://localhost:3000/estudo/atualidades-mercado-financeiro");
}

main()
  .catch((e) => { console.error("❌ Erro:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
