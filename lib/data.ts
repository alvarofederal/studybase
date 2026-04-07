/**
 * Dados estáticos para desenvolvimento sem banco de dados.
 * Em produção, esses dados virão do Prisma + MySQL.
 */

export type Opcao = { id: string; texto: string; correta: boolean; ordem: number };
export type Quiz = { id: string; pergunta: string; explicacao: string | null; opcoes: Opcao[]; ordem: number };
export type Flashcard = { id: string; frente: string; verso: string; dica: string | null; ordem: number };
export type Topico = { id: string; titulo: string; slug: string; conteudo: string; resumo: string | null; ordem: number; quizzes: Quiz[]; flashcards: Flashcard[] };
export type Bloco = { id: string; nome: string; slug: string; descricao: string | null; ordem: number; topicos: Topico[] };
export type Materia = { id: string; nome: string; slug: string; icone: string | null; descricao: string | null; ativa: boolean; blocos: Bloco[] };

export const MATERIAS: Materia[] = [
  {
    id: "m1",
    nome: "Atualidades do Mercado Financeiro",
    slug: "atualidades-mercado-financeiro",
    icone: "🏦",
    descricao: "Conteúdo essencial sobre inovações financeiras, fintechs, regulação digital, ESG e a Agenda BC# para concursos bancários.",
    ativa: true,
    blocos: [
      {
        id: "b1",
        nome: "⚡ Bloco 1 — Nova Infraestrutura Financeira",
        slug: "nova-infraestrutura-financeira",
        descricao: "Pix, Open Finance, Drex e SPB. Meta: 4h",
        ordem: 1,
        topicos: [
          {
            id: "t1",
            titulo: "Pix — Arquitetura e Modalidades",
            slug: "pix-arquitetura-e-modalidades",
            ordem: 1,
            resumo: "O Pix é operado diretamente pelo Banco Central, funciona 24/7 e é gratuito por regulação. Criou nova infraestrutura — não é só velocidade.",
            conteudo: `# Pix — Arquitetura e Modalidades

## O que é o Pix?

O Pix **não é simplesmente "TED rápido"**. É operado diretamente pelo **Banco Central**, funciona **24h/7 dias**, incluindo feriados, e é obrigatoriamente gratuito para pessoas físicas.

## Modalidades

- **Pix Cobrança:** substitui o boleto bancário com QR Code dinâmico
- **Pix Saque e Pix Troco:** permite sacar em estabelecimentos comerciais
- **Pix Automático:** substitui o débito automático para cobranças recorrentes
- **Chaves Pix:** CPF/CNPJ, e-mail, telefone ou chave aleatória

## Infraestrutura

O Pix é suportado pelo **SPI (Sistema de Pagamentos Instantâneos)**, operado diretamente pelo Banco Central.

## Ponto-chave

💡 **Impacto estratégico:** O Pix forçou a gratuidade de transferências e quebrou barreiras de entrada para novas instituições, intensificando a concorrência bancária.`,
            quizzes: [
              { id: "q1", ordem: 1, pergunta: "Qual órgão opera diretamente a infraestrutura do Pix no Brasil?", explicacao: "O Pix é operado diretamente pelo Banco Central, por meio do SPI. Diferente do TED, que passa por câmaras privadas.", opcoes: [{ id: "o1", texto: "Febraban", correta: false, ordem: 0 }, { id: "o2", texto: "Banco Central do Brasil", correta: true, ordem: 1 }, { id: "o3", texto: "Conselho Monetário Nacional", correta: false, ordem: 2 }, { id: "o4", texto: "B3", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f1", ordem: 1, frente: "O que é o SPI e qual sua relação com o Pix?", verso: "O SPI (Sistema de Pagamentos Instantâneos) é a infraestrutura tecnológica operada pelo Banco Central que suporta todas as transações Pix. É o 'motor' por trás do Pix.", dica: null },
            ],
          },
          {
            id: "t2",
            titulo: "Open Finance — As 4 Fases",
            slug: "open-finance-as-4-fases",
            ordem: 2,
            resumo: "O Open Finance é a evolução do Open Banking. Os dados financeiros pertencem ao cliente, não ao banco.",
            conteudo: `# Open Finance — As 4 Fases

## O que é?

Sua lógica central: **os dados financeiros pertencem ao cliente**, não ao banco. Isso permite portabilidade de histórico e acesso a melhores condições de crédito.

## As 4 Fases

- **Fase 1:** Dados das próprias instituições (produtos e serviços)
- **Fase 2:** Dados cadastrais e transacionais dos clientes
- **Fase 3:** Iniciação de pagamentos e propostas de crédito via terceiros
- **Fase 4:** Expansão para seguros, previdência, câmbio e investimentos

## Open Banking vs Open Finance

Open Banking = só bancário. Open Finance = bancário + seguros + previdência + câmbio + investimentos.

## Ponto-chave

💡 **É uma política antimonopólio.** O cliente leva seu histórico a outro banco e consegue crédito melhor.`,
            quizzes: [
              { id: "q2", ordem: 2, pergunta: "O Open Finance avançou do Open Banking ao incluir quais novos segmentos?", explicacao: "O Open Finance expandiu para seguros, previdência complementar, câmbio e investimentos — não só bancários.", opcoes: [{ id: "o5", texto: "Apenas crédito e câmbio", correta: false, ordem: 0 }, { id: "o6", texto: "Somente investimentos", correta: false, ordem: 1 }, { id: "o7", texto: "Seguros, previdência, câmbio e investimentos", correta: true, ordem: 2 }, { id: "o8", texto: "Apenas seguros e previdência", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f2", ordem: 2, frente: "Qual é a principal diferença entre Open Banking e Open Finance?", verso: "Open Banking abrange dados bancários. Open Finance expande para seguros, previdência, câmbio e investimentos — é o Open Banking evoluído.", dica: null },
              { id: "f3", ordem: 4, frente: "Cite as 4 fases do Open Finance.", verso: "Fase 1: dados das instituições. Fase 2: dados dos clientes. Fase 3: iniciação de pagamentos e crédito. Fase 4: expansão para seguros e investimentos.", dica: null },
            ],
          },
          {
            id: "t3",
            titulo: "Drex — Real Digital (CBDC)",
            slug: "drex-real-digital-cbdc",
            ordem: 3,
            resumo: "O Drex é a moeda digital do Banco Central do Brasil (CBDC). Diferente das criptomoedas, é emitido e controlado pelo Estado.",
            conteudo: `# Drex — Real Digital (CBDC)

## O que é?

O Drex é a **moeda digital do Banco Central do Brasil** (CBDC — Central Bank Digital Currency). Diferente das criptomoedas, é emitido e controlado pelo Estado.

## Características

- Operado em **blockchain permissionada** — acesso controlado, não público
- Equivale ao Real físico: **1 Drex = R$ 1,00** garantido pelo BCB
- Permite **contratos inteligentes** (smart contracts)
- Não é aberto ao público diretamente — passa por bancos autorizados

## Ponto-chave

💡 **Drex ≠ criptomoeda.** Criptomoeda é descentralizada, sem controle estatal e volátil. O Drex é centralizado, garantido pelo BCB e estável.`,
            quizzes: [
              { id: "q3", ordem: 3, pergunta: "O que diferencia o Drex do Bitcoin?", explicacao: "O Drex é uma CBDC — emissão controlada e garantia estatal. O Bitcoin é descentralizado, sem controle estatal e volátil.", opcoes: [{ id: "o9", texto: "O Drex usa blockchain e o Bitcoin não", correta: false, ordem: 0 }, { id: "o10", texto: "O Drex é emitido e controlado pelo Banco Central; o Bitcoin é descentralizado", correta: true, ordem: 1 }, { id: "o11", texto: "O Drex é volátil e o Bitcoin estável", correta: false, ordem: 2 }, { id: "o12", texto: "Não há diferença prática", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f4", ordem: 3, frente: "O que é uma CBDC?", verso: "Central Bank Digital Currency — moeda digital emitida e controlada por um banco central. O Drex é a CBDC do Brasil. Diferente de criptomoeda: é centralizada e estável.", dica: null },
            ],
          },
          {
            id: "t4",
            titulo: "SPB — Sistema de Pagamentos Brasileiro",
            slug: "spb-sistema-de-pagamentos-brasileiro",
            ordem: 4,
            resumo: "O SPB é o conjunto de entidades e sistemas que processam transferências de fundos no Brasil.",
            conteudo: `# SPB — Sistema de Pagamentos Brasileiro

## O que é?

O SPB processa todas as transferências de fundos no Brasil. Foi modernizado em 2002 e o **Pix é sua evolução mais recente**.

## Principais sistemas

- **STR:** liquidação em tempo real, operado pelo BCB
- **SITRAF:** câmara de transferência de fundos (TED)
- **SPI:** infraestrutura que suporta o Pix (operado pelo BCB)

## Ponto-chave

💡 O SPI é a infraestrutura do Pix, assim como o STR é a infraestrutura das transferências de grande valor. O Banco Central opera ambos diretamente.`,
            quizzes: [],
            flashcards: [],
          },
        ],
      },
      {
        id: "b2",
        nome: "🚀 Bloco 2 — Fintechs e Novos Modelos",
        slug: "fintechs-e-novos-modelos",
        descricao: "Fintechs, IPs, BaaS, Big Techs. Meta: 4h",
        ordem: 2,
        topicos: [
          {
            id: "t5",
            titulo: "Fintechs — Conceito e Categorias",
            slug: "fintechs-conceito-e-categorias",
            ordem: 1,
            resumo: "Fintech é qualquer empresa que usa tecnologia para oferecer serviços financeiros. Banco digital é apenas uma categoria.",
            conteudo: `# Fintechs — Conceito e Categorias

## O que é uma Fintech?

**Fintech (Financial Technology)** é qualquer empresa que usa tecnologia para oferecer serviços financeiros de forma mais eficiente, acessível ou barata.

## Categorias

- **Pagamento:** processadoras, carteiras digitais (ex: PicPay)
- **Crédito:** SCDs (Sociedade de Crédito Direto), plataformas P2P
- **Investimento:** corretoras digitais
- **Insurtechs:** seguradoras digitais
- **Regtechs:** tecnologia para conformidade regulatória

## Erro clássico

💡 **Fintech ≠ banco digital.** Banco digital é UMA categoria de fintech. Uma maquininha ou app de câmbio são fintechs — mas não são bancos digitais.`,
            quizzes: [
              { id: "q4", ordem: 4, pergunta: "Qual é a principal diferença entre uma Fintech e um Banco Digital?", explicacao: "Banco digital é apenas uma categoria dentro do universo de fintechs. Uma fintech de maquininha são fintechs — mas não são bancos digitais.", opcoes: [{ id: "o13", texto: "Não há diferença conceitual", correta: false, ordem: 0 }, { id: "o14", texto: "Todo banco digital é uma fintech, mas nem toda fintech é banco digital", correta: true, ordem: 1 }, { id: "o15", texto: "Toda fintech é obrigatoriamente um banco digital", correta: false, ordem: 2 }, { id: "o16", texto: "Bancos digitais não são regulados pelo BCB", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f5", ordem: 5, frente: "O que é uma Instituição de Pagamento (IP)?", verso: "Empresa regulada pelo BCB que oferece serviços de pagamento SEM SER BANCO. Não capta depósitos nem concede crédito da forma tradicional.", dica: null },
            ],
          },
          {
            id: "t6",
            titulo: "Banking as a Service (BaaS)",
            slug: "banking-as-a-service-baas",
            ordem: 2,
            resumo: "BaaS: uma instituição licenciada disponibiliza infraestrutura para não-bancos oferecerem produtos financeiros.",
            conteudo: `# Banking as a Service (BaaS)

## O que é?

Uma **instituição financeira licenciada disponibiliza sua infraestrutura** para que outras empresas ofereçam produtos financeiros sob sua própria marca.

## Exemplos

- Varejista oferece crédito sem ser banco — usando licença de banco parceiro
- App de mobilidade oferece cartão — infraestrutura de um emissor

## BaaS vs Embedded Finance

**BaaS** = infraestrutura (licença + tecnologia). **Embedded Finance** = experiência do usuário final.

## Ponto-chave

💡 BaaS é a base técnica do Embedded Finance. Sem o BaaS, não existe o Embedded Finance.`,
            quizzes: [
              { id: "q5", ordem: 9, pergunta: "O que é Banking as a Service (BaaS)?", explicacao: "BaaS permite que empresas não-financeiras ofereçam serviços bancários usando licença e infraestrutura de uma instituição regulada.", opcoes: [{ id: "o17", texto: "Serviço de atendimento bancário 24h", correta: false, ordem: 0 }, { id: "o18", texto: "Modelo em que uma instituição licenciada disponibiliza infraestrutura para não-bancos oferecerem produtos financeiros", correta: true, ordem: 1 }, { id: "o19", texto: "Plataforma de open banking para compartilhar dados", correta: false, ordem: 2 }, { id: "o20", texto: "Sistema de pagamentos do Banco Central", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f6", ordem: 8, frente: "Quais são as 3 fases da lavagem de dinheiro?", verso: "1. Colocação: inserir o dinheiro sujo no sistema. 2. Ocultação: disfarçar a origem. 3. Integração: reinserir como dinheiro 'limpo' na economia.", dica: null },
              { id: "f7", ordem: 9, frente: "O que é Banking as a Service (BaaS)?", verso: "Modelo em que uma instituição licenciada disponibiliza sua infraestrutura para não-bancos oferecerem produtos financeiros. Base técnica do Embedded Finance.", dica: null },
            ],
          },
        ],
      },
      {
        id: "b3",
        nome: "🔗 Bloco 3 — Ativos Digitais",
        slug: "ativos-digitais",
        descricao: "Criptomoedas, tokenização, stablecoins. Meta: 3h",
        ordem: 3,
        topicos: [
          {
            id: "t7",
            titulo: "Criptomoedas e Regulação Brasileira",
            slug: "criptomoedas-e-regulacao-brasileira",
            ordem: 1,
            resumo: "A Lei 14.478/2022 é o marco legal das criptomoedas no Brasil, criando as PSAVs.",
            conteudo: `# Criptomoedas e Regulação Brasileira

## Marco Legal — Lei 14.478/2022

A **Lei 14.478/2022** não proíbe nem fomenta — cria um **ambiente regulatório** para as PSAVs (Prestadoras de Serviços de Ativos Virtuais).

## Conceitos

- **Blockchain:** registro distribuído e imutável
- **Bitcoin:** reserva de valor, oferta limitada a 21 milhões
- **Altcoins:** todas as criptos que não são Bitcoin
- **Supervisão:** Banco Central supervisiona as exchanges no Brasil
- **Tributação:** ganhos acima de R$35k/mês são tributados pela Receita

## Ponto-chave

💡 A Lei 14.478/2022 define "ativo virtual" e exige autorização e regras de prevenção à lavagem de dinheiro para as PSAVs.`,
            quizzes: [
              { id: "q6", ordem: 5, pergunta: "Qual lei estabeleceu o marco regulatório das criptomoedas no Brasil?", explicacao: "A Lei 14.478/2022 define 'ativo virtual', cria as PSAVs e estabelece regras de prevenção à lavagem.", opcoes: [{ id: "o21", texto: "Lei 13.709/2018", correta: false, ordem: 0 }, { id: "o22", texto: "Lei 9.613/1998", correta: false, ordem: 1 }, { id: "o23", texto: "Lei 14.478/2022", correta: true, ordem: 2 }, { id: "o24", texto: "Lei 12.865/2013", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f8", ordem: 10, frente: "O que é uma stablecoin e qual o risco do modelo algorítmico?", verso: "Criptomoeda atrelada a ativo estável (ex: dólar). O modelo algorítmico usa código para manter paridade — pode colapsar, como o TerraLUNA em 2022 (US$40 bilhões destruídos).", dica: null },
            ],
          },
        ],
      },
      {
        id: "b4",
        nome: "🤖 Bloco 4 — IA, Dados e Crédito",
        slug: "ia-dados-e-credito",
        descricao: "LGPD, Cadastro Positivo, IA nos bancos, segurança cibernética. Meta: 5h",
        ordem: 4,
        topicos: [
          {
            id: "t8",
            titulo: "LGPD no Sistema Financeiro",
            slug: "lgpd-no-sistema-financeiro",
            ordem: 1,
            resumo: "A Lei 13.709/2018 impacta diretamente bancos e fintechs que trabalham com dados sensíveis em larga escala.",
            conteudo: `# LGPD no Sistema Financeiro

## A Lei

A **LGPD (Lei 13.709/2018)** impacta diretamente bancos e fintechs. A **ANPD** fiscaliza.

## Direitos do titular

- Acesso, correção, exclusão, portabilidade dos dados

## Ponto-chave

💡 Open Finance SEM LGPD seria impossível — é a LGPD que garante que o compartilhamento de dados seja feito com **consentimento** e finalidade definida.`,
            quizzes: [],
            flashcards: [],
          },
          {
            id: "t9",
            titulo: "Cadastro Positivo",
            slug: "cadastro-positivo",
            ordem: 2,
            resumo: "Registra histórico de pagamentos em dia. Desde 2019, a adesão é automática (opt-out).",
            conteudo: `# Cadastro Positivo

## O que é?

Registra o **histórico de pagamentos em dia**. Desde 2019, é **opt-out** — todos são incluídos automaticamente.

## Gerenciado por

Serasa, SPC, Boa Vista, Quod.

## Ponto-chave

💡 Antes, o sistema era apenas "negativo" — você só aparecia se tivesse dívida. O Cadastro Positivo beneficia quem sempre pagou em dia mas não tinha histórico bancário.`,
            quizzes: [
              { id: "q7", ordem: 7, pergunta: "O que é o Cadastro Positivo e qual sua principal mudança em 2019?", explicacao: "Em 2019, passou a ser opt-out — todos são incluídos automaticamente.", opcoes: [{ id: "o25", texto: "Banco de dados de devedores; passou a ser opt-in", correta: false, ordem: 0 }, { id: "o26", texto: "Banco de dados de bons pagadores; passou a ser opt-out (adesão automática)", correta: true, ordem: 1 }, { id: "o27", texto: "Lista de empresas sancionadas; passou a ser pública", correta: false, ordem: 2 }, { id: "o28", texto: "Registro de fintechs; passou a ser obrigatório", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f9", ordem: 7, frente: "O que é o Cadastro Positivo e como funciona?", verso: "Banco de dados de bons pagadores. Desde 2019 é opt-out — todos são incluídos automaticamente. Permite melhores condições de crédito para quem paga em dia.", dica: null },
            ],
          },
          {
            id: "t10",
            titulo: "Segurança Cibernética — Resolução BCB 4.893/2021",
            slug: "seguranca-cibernetica-resolucao-bcb-4893",
            ordem: 3,
            resumo: "A Resolução BCB 4.893/2021 obriga todas as instituições financeiras a terem política estruturada de segurança cibernética.",
            conteudo: `# Segurança Cibernética — Resolução BCB 4.893/2021

## A Resolução

Obriga instituições financeiras a terem **política formal de segurança cibernética**, plano de resposta a incidentes e testes regulares.

## Principais ameaças

- **Engenharia social:** phishing, vishing
- **SIM Swap:** clonagem de chip para interceptar SMS
- **Ransomware:** sequestro de dados

## Ponto-chave

💡 **Para provas:** o banco tem **responsabilidade objetiva** por falhas de segurança. Se o cliente foi vítima de phishing sofisticado sem negligência própria, o banco pode responder.`,
            quizzes: [
              { id: "q8", ordem: 8, pergunta: "Qual Resolução obriga instituições financeiras a terem política estruturada de segurança cibernética?", explicacao: "A Resolução BCB 4.893/2021 estabelece requisitos para política de segurança cibernética.", opcoes: [{ id: "o29", texto: "CMN 4.945/2021", correta: false, ordem: 0 }, { id: "o30", texto: "BCB 4.893/2021", correta: true, ordem: 1 }, { id: "o31", texto: "Lei 13.709/2018", correta: false, ordem: 2 }, { id: "o32", texto: "CVM 175/2022", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f10", ordem: 11, frente: "O que regula a Resolução BCB 4.893/2021?", verso: "Obriga instituições financeiras a terem política formal de segurança cibernética, plano de resposta a incidentes e testes periódicos de vulnerabilidade.", dica: null },
            ],
          },
        ],
      },
      {
        id: "b5",
        nome: "🌱 Bloco 5 — ESG e Agenda BC#",
        slug: "esg-e-agenda-bc",
        descricao: "ESG, Agenda BC#, inclusão financeira, sandbox. Meta: 4h",
        ordem: 5,
        topicos: [
          {
            id: "t11",
            titulo: "Agenda BC# — Os 4 Pilares",
            slug: "agenda-bc-os-4-pilares",
            ordem: 1,
            resumo: "A Agenda BC# é o programa estratégico do BCB lançado em 2019. Explica por que Pix, Open Finance e Drex existem.",
            conteudo: `# Agenda BC# — Os 4 Pilares

## O que é?

Programa estratégico do BCB, lançado em 2019. Explica **POR QUE** o Pix, o Open Finance e o Drex existem.

## Os 4 Pilares (ICTE)

- **Inclusão:** ampliar acesso ao sistema financeiro para desbancarizados
- **Competitividade:** reduzir concentração bancária, facilitar novos players
- **Transparência:** mais informação ao consumidor
- **Educação financeira:** capacitar a população para decisões conscientes

## Mnemônico

💡 **ICTE** — Inclusão, Competitividade, Transparência, Educação. O Pix serve à Competitividade e Inclusão. O Open Finance serve à Competitividade e Transparência.`,
            quizzes: [
              { id: "q9", ordem: 6, pergunta: "Quais são os 4 pilares da Agenda BC#?", explicacao: "ICTE: Inclusão, Competitividade, Transparência, Educação financeira.", opcoes: [{ id: "o33", texto: "Pix, Open Finance, Drex, Sandbox", correta: false, ordem: 0 }, { id: "o34", texto: "Inclusão, Competitividade, Transparência, Educação financeira", correta: true, ordem: 1 }, { id: "o35", texto: "Regulação, Supervisão, Fiscalização, Controle", correta: false, ordem: 2 }, { id: "o36", texto: "Segurança, Inovação, Sustentabilidade, Crédito", correta: false, ordem: 3 }] },
            ],
            flashcards: [
              { id: "f11", ordem: 6, frente: "Quais são os 4 pilares da Agenda BC#?", verso: "Inclusão · Competitividade · Transparência · Educação financeira. Mnemônico: ICTE.", dica: null },
            ],
          },
          {
            id: "t12",
            titulo: "ESG no Mercado Financeiro",
            slug: "esg-no-mercado-financeiro",
            ordem: 2,
            resumo: "ESG deixou de ser pauta de sustentabilidade para se tornar critério financeiro. O risco climático é risco de crédito.",
            conteudo: `# ESG no Mercado Financeiro

## ESG como risco financeiro

ESG (Environmental, Social, Governance) é **critério financeiro**. O risco climático agora é tratado como risco de crédito.

## Marco regulatório

- **Resolução CMN 4.945/2021:** obriga bancos a ter política de responsabilidade socioambiental

## Produtos ESG

- **Green Bonds:** títulos para financiar projetos sustentáveis
- **Crédito verde:** taxas menores para projetos de baixo impacto

## Ponto-chave

💡 Um banco que financia empresas com alto risco climático pode ter sua carteira desvalorizada. Por isso ESG é **risco financeiro**, não só ética.`,
            quizzes: [
              { id: "q10", ordem: 10, pergunta: "Qual afirmação sobre ESG no mercado financeiro está CORRETA?", explicacao: "A Resolução CMN 4.945/2021 tornou a política de responsabilidade socioambiental obrigatória. ESG é risco financeiro.", opcoes: [{ id: "o37", texto: "ESG é apenas uma iniciativa voluntária sem impacto regulatório", correta: false, ordem: 0 }, { id: "o38", texto: "A Resolução CMN 4.945/2021 obriga bancos a ter política de responsabilidade socioambiental", correta: true, ordem: 1 }, { id: "o39", texto: "ESG é tratado pelo BCB como tema de marketing", correta: false, ordem: 2 }, { id: "o40", texto: "Green bonds são isentos de regulação da CVM", correta: false, ordem: 3 }] },
            ],
            flashcards: [],
          },
          {
            id: "t13",
            titulo: "Sandbox Regulatório",
            slug: "sandbox-regulatorio",
            ordem: 3,
            resumo: "Ambiente controlado para testar inovações financeiras sem licença completa, por período limitado.",
            conteudo: `# Sandbox Regulatório

## O que é?

Ambiente controlado para testar **inovações financeiras sem licença completa** por até 2 anos.

## Base legal

- **BCB (Resolução 29/2020)** e **CVM** criaram seus próprios sandboxes

## Por que existe?

💡 O sandbox resolve o dilema: licença completa antes do teste desincentiva a inovação; sem regra nenhuma gera risco ao consumidor. O sandbox é o meio-termo.`,
            quizzes: [],
            flashcards: [
              { id: "f12", ordem: 12, frente: "O que é o Sandbox Regulatório do Banco Central?", verso: "Ambiente controlado para testar inovações financeiras sem licença completa por até 2 anos (Res. BCB 29/2020). Permite inovar com regras reduzidas sob supervisão.", dica: null },
            ],
          },
        ],
      },
    ],
  },
];

export function getMateriaBySlug(slug: string): Materia | null {
  return MATERIAS.find((m) => m.slug === slug && m.ativa) ?? null;
}

export function getAllMaterias(): Materia[] {
  return MATERIAS.filter((m) => m.ativa);
}
