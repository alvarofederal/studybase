/**
 * seed-kb-quiz-extra.mjs
 *
 * Enriquecimento do conteúdo de Conhecimentos Bancários.
 * Adiciona questões de quiz e flashcards extras — sem tocar nos existentes.
 * Estilo Cesgranrio / FCC — focado em BB, CEF e BRB.
 *
 * Execute com:  node prisma/seed-kb-quiz-extra.mjs
 */

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
// NOVOS QUIZZES
// ═══════════════════════════════════════════════════════════════
const quizExtra = [

  // ────────────────────────────────────────────────────────────
  // BLOCO 1 — SISTEMA FINANCEIRO NACIONAL
  // ────────────────────────────────────────────────────────────

  // Tópico: estrutura-sfn-3-niveis
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
    pergunta: "Qual das seguintes afirmações sobre os três níveis do SFN está CORRETA?",
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

  // Tópico: cmn-conselho-monetario-nacional
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cmn-conselho-monetario-nacional",
    pergunta: "Qual das alternativas representa uma atribuição do CMN — Conselho Monetário Nacional?",
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
    pergunta: "O CMN é composto por quantos membros? Quais são eles?",
    explicacao: "O CMN tem 3 membros: Ministro da Fazenda (presidente do CMN), Ministro do Planejamento e Orçamento, e o Presidente do Banco Central. Essa composição garante coordenação entre política fiscal e política monetária.",
    opcoes: [
      { texto: "5 membros: ministros e diretores do BCB", correta: false },
      { texto: "3 membros: Ministro da Fazenda, Ministro do Planejamento e Presidente do BCB", correta: true },
      { texto: "7 membros: representantes do governo, empresários e trabalhadores", correta: false },
      { texto: "2 membros: Ministro da Fazenda e Presidente do BCB", correta: false },
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
    pergunta: "A meta de inflação do Brasil é definida por qual órgão/entidade?",
    explicacao: "A meta de inflação (regime de metas para a inflação) é definida pelo CMN, com base no IPCA. O Banco Central é responsável por CUMPRIR essa meta, usando os instrumentos de política monetária (principalmente a taxa Selic).",
    opcoes: [
      { texto: "Banco Central do Brasil, por meio do Copom", correta: false },
      { texto: "Ministério da Fazenda, unilateralmente", correta: false },
      { texto: "CMN — Conselho Monetário Nacional", correta: true },
      { texto: "IBGE, com base nos dados de inflação coletados", correta: false },
    ],
  },

  // Tópico: banco-central-funcoes
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "banco-central-funcoes",
    pergunta: "A LC 179/2021 conferiu autonomia operacional ao Banco Central. Qual a principal consequência dessa mudança?",
    explicacao: "Com a LC 179/2021, o BCB passou a ter autonomia operacional: os diretores têm mandatos fixos e não coincidentes com o mandato presidencial. O objetivo é isolar a política monetária de pressões políticas de curto prazo, preservando a credibilidade.",
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
    explicacao: "O BCB é o 'banco dos bancos' porque é o depositário compulsório dos bancos (recebe o recolhimento compulsório) e emprestador de última instância (redesconto). Bancos não têm conta no BCB como clientes comuns — são as reservas e o compulsório.",
    opcoes: [
      { texto: "O BCB oferece crédito e serviços financeiros ao público em geral", correta: false },
      { texto: "O BCB mantém reservas dos bancos e empresta a eles em caso de necessidade", correta: true },
      { texto: "O BCB concede crédito subsidiado a bancos públicos", correta: false },
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
      { texto: "Banco Nacional de Desenvolvimento Econômico e Social (BNDES)", correta: false },
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

  // Tópico: cvm-susep-previc
  {
    blocoSlug: "sistema-financeiro-nacional",
    topicoSlug: "cvm-susep-previc",
    pergunta: "A CVM — Comissão de Valores Mobiliários — tem como principal atribuição:",
    explicacao: "A CVM regula e fiscaliza o mercado de valores mobiliários (ações, debêntures, fundos de investimento etc.). Ela protege investidores contra irregularidades, autoriza emissões e fiscaliza companhias abertas.",
    opcoes: [
      { texto: "Regulamentar as taxas de juros praticadas no mercado interbancário", correta: false },
      { texto: "Regular e fiscalizar o mercado de valores mobiliários", correta: true },
      { texto: "Supervisionar planos de previdência complementar fechada", correta: false },
      { texto: "Estabelecer normas para seguros e capitalização", correta: false },
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
    explicacao: "Corretoras de valores que atuam no mercado de capitais (ações, debêntures, fundos etc.) são supervisionadas pela CVM. O BCB supervisiona as instituições do sistema bancário/financeiro (bancos, cooperativas de crédito etc.).",
    opcoes: [
      { texto: "Banco Central do Brasil", correta: false },
      { texto: "CMN — Conselho Monetário Nacional", correta: false },
      { texto: "CVM — Comissão de Valores Mobiliários", correta: true },
      { texto: "Susep — Superintendência de Seguros Privados", correta: false },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // BLOCO 2 — BANCO CENTRAL E POLÍTICA MONETÁRIA
  // ────────────────────────────────────────────────────────────

  // Tópico: taxa-selic
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "A taxa Selic é a taxa de juros básica da economia brasileira. Ela é formada a partir de:",
    explicacao: "A Selic é formada no mercado de títulos públicos: é a taxa média ponderada das operações de financiamento lastreadas em títulos do Tesouro Nacional, no mercado interbancário (overnight). O Copom define a META Selic; o mercado aproxima a taxa efetiva dessa meta via open market.",
    opcoes: [
      { texto: "Negociações entre bancos usando títulos públicos como garantia (overnight)", correta: true },
      { texto: "Deliberação do Ministério da Fazenda sobre as condições fiscais", correta: false },
      { texto: "Taxa média dos depósitos em poupança do sistema bancário", correta: false },
      { texto: "Taxa de câmbio do dólar no mercado interbancário", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "Quando o Copom reduz a taxa Selic, o efeito esperado na economia é:",
    explicacao: "Selic menor → crédito mais barato → mais consumo e investimento → aquecimento da economia. O risco é o aumento da inflação. Por isso o BCB reduz a Selic quando a inflação está controlada e quer estimular a atividade.",
    opcoes: [
      { texto: "Redução da liquidez e contração do crédito", correta: false },
      { texto: "Estímulo ao consumo e ao investimento pelo barateamento do crédito", correta: true },
      { texto: "Valorização do real frente ao dólar por atração de capitais estrangeiros", correta: false },
      { texto: "Aumento da rentabilidade de títulos prefixados no Tesouro Direto", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O Sistema Especial de Liquidação e de Custódia (Selic) é utilizado para:",
    explicacao: "O Selic (sistema) é a infraestrutura eletrônica do BCB para registro, custódia e liquidação de títulos públicos federais. É nele que os títulos do Tesouro Nacional são negociados. O nome da taxa Selic vem desse sistema.",
    opcoes: [
      { texto: "Processar transferências entre correntistas de diferentes bancos (TED/Pix)", correta: false },
      { texto: "Registrar, custodiar e liquidar operações com títulos públicos federais", correta: true },
      { texto: "Compensar cheques e boletos bancários", correta: false },
      { texto: "Controlar o câmbio de moeda estrangeira no mercado interbancário", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "taxa-selic",
    pergunta: "O Copom se reúne a cada 45 dias. Em quanto tempo, no máximo, ele se reúne por ano?",
    explicacao: "Com reuniões a cada 45 dias, o Copom realiza 8 reuniões por ano (365 ÷ 45 ≈ 8,1). Cada reunião dura 2 dias. Ao final, divulga a decisão sobre a meta Selic e, posteriormente, publica a ata detalhando os fundamentos.",
    opcoes: [
      { texto: "6 reuniões por ano", correta: false },
      { texto: "8 reuniões por ano", correta: true },
      { texto: "12 reuniões por ano", correta: false },
      { texto: "4 reuniões por ano", correta: false },
    ],
  },

  // Tópico: deposito-compulsorio
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "O depósito compulsório é recolhido ao Banco Central sobre qual base de cálculo?",
    explicacao: "O compulsório é calculado sobre os depósitos captados pelos bancos (depósitos à vista, a prazo, poupança). Cada modalidade tem alíquotas diferentes definidas pelo BCB. O objetivo é controlar o multiplicador bancário do crédito.",
    opcoes: [
      { texto: "Sobre o patrimônio líquido de cada instituição financeira", correta: false },
      { texto: "Sobre os depósitos captados pelos bancos (à vista, a prazo, poupança)", correta: true },
      { texto: "Sobre o volume total de empréstimos concedidos no mês", correta: false },
      { texto: "Sobre as reservas internacionais mantidas no Banco Central", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "O Banco Central reduz o percentual do depósito compulsório sobre depósitos à vista. O efeito direto dessa medida é:",
    explicacao: "Reduzir o compulsório libera mais recursos nos bancos → mais dinheiro disponível para emprestar → expansão do crédito e da base monetária. É uma medida expansionista, usada para estimular a economia em momentos de baixa atividade.",
    opcoes: [
      { texto: "Redução da liquidez do sistema bancário", correta: false },
      { texto: "Contração do crédito disponível no mercado", correta: false },
      { texto: "Expansão da capacidade de empréstimo dos bancos", correta: true },
      { texto: "Aumento da taxa Selic efetiva no interbancário", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "deposito-compulsorio",
    pergunta: "Entre os instrumentos de política monetária, o depósito compulsório se distingue do open market por ser:",
    explicacao: "O compulsório age de forma estrutural e tem efeito mais lento — quando o BCB muda a alíquota, leva semanas para o sistema se ajustar. O open market é diário e muito mais preciso/ágil. O redesconto é pontual (por banco). Compulsório = arma pesada.",
    opcoes: [
      { texto: "Mais ágil e de efeito imediato sobre a liquidez diária", correta: false },
      { texto: "Um instrumento de emergência para bancos em crise", correta: false },
      { texto: "Um instrumento de efeito estrutural, mais lento e de amplo alcance", correta: true },
      { texto: "Exclusivamente usado para operações cambiais", correta: false },
    ],
  },

  // Tópico: open-market-redesconto
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "O Banco Central vende títulos públicos no mercado aberto (open market). Qual o efeito imediato sobre a liquidez do sistema?",
    explicacao: "Quando o BCB vende títulos, os bancos pagam por eles → dinheiro sai dos bancos para o BCB → liquidez do sistema diminui (operação contracionista). O BCB usa isso para evitar que a Selic caia abaixo da meta.",
    opcoes: [
      { texto: "Aumento da liquidez, com expansão da base monetária", correta: false },
      { texto: "Redução da liquidez, pois dinheiro migra dos bancos para o BCB", correta: true },
      { texto: "Aumento das reservas internacionais do país", correta: false },
      { texto: "Redução da taxa de câmbio pelo aumento da oferta de moeda", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Por que o open market é considerado o instrumento mais ágil de política monetária?",
    explicacao: "O open market pode ser operado todos os dias úteis, inclusive várias vezes por dia, com efeito imediato na liquidez. O compulsório leva semanas. O redesconto é reativo (banco precisa pedir). Open market é proativo, preciso e reversível.",
    opcoes: [
      { texto: "Porque exige apenas a publicação de resolução, sem necessidade de negociação", correta: false },
      { texto: "Porque altera diretamente a meta Selic sem passar pelo Copom", correta: false },
      { texto: "Porque pode ser operado diariamente com efeito imediato e reversível sobre a liquidez", correta: true },
      { texto: "Porque não afeta os bancos comerciais, apenas as reservas do BCB", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "O redesconto bancário é caracterizado como 'empréstimo de última instância'. Isso significa que:",
    explicacao: "O redesconto é chamado de 'última instância' porque os bancos só o buscam quando não conseguem recursos no mercado interbancário. É um sinal de estresse. O BCB cobra uma taxa de redesconto geralmente superior à Selic para desincentivar o uso corriqueiro.",
    opcoes: [
      { texto: "Os bancos recorrem ao BCB antes de tentar captar recursos no interbancário", correta: false },
      { texto: "O BCB é o único credor disponível para bancos em dificuldades sistêmicas", correta: false },
      { texto: "Os bancos recorrem ao BCB somente após esgotarem as fontes de mercado", correta: true },
      { texto: "O redesconto é automático e gratuito para bancos com patrimônio suficiente", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Se o BCB eleva a taxa de redesconto acima da taxa Selic, os bancos tendem a:",
    explicacao: "Taxa de redesconto acima da Selic significa que o BCB cobra mais caro do que o custo de se financiar no mercado interbancário. Racional: os bancos preferem o interbancário (mais barato). Só usam o redesconto em situação de emergência quando o mercado não os atende.",
    opcoes: [
      { texto: "Recorrer mais ao BCB, por ser mais seguro", correta: false },
      { texto: "Preferir o mercado interbancário por ter custo menor", correta: true },
      { texto: "Reduzir os empréstimos a clientes para acumular reservas", correta: false },
      { texto: "Solicitar intervenção do CMN para reduzir a taxa", correta: false },
    ],
  },
  {
    blocoSlug: "banco-central-politica-monetaria",
    topicoSlug: "open-market-redesconto",
    pergunta: "Nas operações compromissadas (repo), o BCB compra títulos com compromisso de revenda. Qual é o efeito dessa operação?",
    explicacao: "Na operação compromissada de compra (repo), o BCB injeta liquidez temporariamente: compra títulos dos bancos com compromisso de vender de volta em data futura. É expansionista e temporária — muito usada para ajuste fino da Selic.",
    opcoes: [
      { texto: "Redução da liquidez pela retirada de moeda do sistema", correta: false },
      { texto: "Injeção temporária de liquidez no sistema bancário", correta: true },
      { texto: "Aumento permanente da base monetária", correta: false },
      { texto: "Redução da taxa de câmbio pela maior oferta de dólares", correta: false },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // BLOCO 3 — PRODUTOS E SERVIÇOS BANCÁRIOS
  // ────────────────────────────────────────────────────────────

  // Tópico: captacao-cdb-lci-lca-poupanca
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "Um investidor pessoa física aplica R$ 50.000 em LCA por 120 dias. Qual tributação incidirá no resgate?",
    explicacao: "A LCA (Letra de Crédito do Agronegócio) é ISENTA de Imposto de Renda para pessoa física, independentemente do prazo. O investidor recebe o valor integral do rendimento sem desconto de IR. Essa é a vantagem principal em relação ao CDB.",
    opcoes: [
      { texto: "22,5% sobre o rendimento (prazo inferior a 180 dias)", correta: false },
      { texto: "20% sobre o rendimento (prazo entre 181 e 360 dias)", correta: false },
      { texto: "Isento de IR para pessoa física", correta: true },
      { texto: "15% de IR retido na fonte no momento do resgate", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "O FGC garante depósitos e investimentos em instituições financeiras. Qual é o limite por CPF por instituição?",
    explicacao: "O FGC cobre até R$ 250.000 por CPF por instituição financeira. Existe ainda um teto global de R$ 1.000.000 por CPF a cada 4 anos. Investir em bancos menores acima de R$ 250 mil por banco expõe o excedente ao risco da instituição.",
    opcoes: [
      { texto: "R$ 100.000 por CPF por instituição", correta: false },
      { texto: "R$ 250.000 por CPF por instituição", correta: true },
      { texto: "R$ 500.000 por CPF por instituição", correta: false },
      { texto: "R$ 1.000.000 por CPF por instituição", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "A poupança remunera o investidor no 'dia de aniversário'. O que isso significa?",
    explicacao: "O rendimento da poupança é creditado no mesmo dia do mês em que o depósito foi feito. Se depositou no dia 10, recebe no dia 10 do mês seguinte. Se sacar antes do aniversário, não recebe os juros daquele período — perde a remuneração proporcional.",
    opcoes: [
      { texto: "A rentabilidade é calculada diariamente e creditada no último dia útil do mês", correta: false },
      { texto: "O rendimento é creditado mensalmente no mesmo dia do depósito inicial", correta: true },
      { texto: "O investidor recebe o rendimento apenas ao final do ano calendário", correta: false },
      { texto: "A poupança remunera com liquidez diária, como o Tesouro Selic", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "captacao-cdb-lci-lca-poupanca",
    pergunta: "Qual das seguintes diferenças entre LCI e LCA está CORRETA?",
    explicacao: "LCI tem lastro em créditos imobiliários; LCA tem lastro em créditos do agronegócio. Ambas são isentas de IR para PF, cobertas pelo FGC, emitidas por bancos. A diferença essencial é o lastro (o setor que financia).",
    opcoes: [
      { texto: "A LCI é tributada pelo IR; a LCA é isenta", correta: false },
      { texto: "A LCI tem lastro em créditos imobiliários; a LCA tem lastro no agronegócio", correta: true },
      { texto: "A LCA não é coberta pelo FGC; a LCI é coberta", correta: false },
      { texto: "A LCI pode ser emitida por qualquer empresa; a LCA apenas por bancos", correta: false },
    ],
  },

  // Tópico: credito-tipos-caracteristicas
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "No leasing financeiro, ao final do contrato, o arrendatário:",
    explicacao: "No leasing financeiro, o objetivo do contrato é a aquisição do bem. Ao final, o arrendatário exerce a opção de compra pelo valor residual garantido (VRG), que geralmente é simbólico. O leasing operacional, ao contrário, é voltado para uso — a devolução do bem é mais comum.",
    opcoes: [
      { texto: "Devolve o bem ao arrendador obrigatoriamente", correta: false },
      { texto: "Pode adquirir o bem pelo valor residual garantido (VRG)", correta: true },
      { texto: "Perde o bem pois não há opção de compra no leasing financeiro", correta: false },
      { texto: "Recebe o bem de graça, pois as parcelas já cobriram o valor integral", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "O cheque especial é o crédito mais caro disponível ao consumidor. Desde 2020, o BCB limitou sua taxa a:",
    explicacao: "O BCB regulamentou em 2020 que a taxa do cheque especial não pode ultrapassar 8% ao mês. Apesar disso, continua sendo um dos créditos mais caros — qualquer necessidade de emergência é mais barata via crédito pessoal ou consignado.",
    opcoes: [
      { texto: "5% ao mês", correta: false },
      { texto: "8% ao mês", correta: true },
      { texto: "12% ao mês", correta: false },
      { texto: "15% ao mês", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "O CDC — Crédito Direto ao Consumidor — é geralmente utilizado para:",
    explicacao: "CDC é uma modalidade de crédito para o consumidor financiar a compra de bens duráveis (eletrodomésticos, veículos, eletrônicos). O bem adquirido pode servir como garantia da operação. É diferente do crédito pessoal (sem destinação específica).",
    opcoes: [
      { texto: "Financiar operações de comércio exterior de empresas", correta: false },
      { texto: "Complementar o limite do cheque especial sem garantias", correta: false },
      { texto: "Financiar a aquisição de bens de consumo duráveis", correta: true },
      { texto: "Substituir o FGTS como fundo de garantia trabalhista", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "Qual é o limite máximo de comprometimento da renda no crédito consignado para servidores públicos federais?",
    explicacao: "Para servidores públicos federais, o comprometimento no consignado é de até 35% da remuneração líquida (dos quais 5% podem ser para cartão de crédito consignado). Esse limite existe para proteger a subsistência do trabalhador.",
    opcoes: [
      { texto: "25% da remuneração bruta", correta: false },
      { texto: "30% da remuneração líquida", correta: false },
      { texto: "35% da remuneração líquida", correta: true },
      { texto: "50% da remuneração bruta", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "credito-tipos-caracteristicas",
    pergunta: "Na alienação fiduciária, o bem financiado fica registrado em nome de quem durante o contrato?",
    explicacao: "Na alienação fiduciária (muito usada no crédito imobiliário e em financiamento de veículos), o CREDOR (banco) fica com a propriedade fiduciária do bem durante o financiamento. O devedor tem apenas a posse. Se inadimplir, o banco pode retomar o bem sem ação judicial.",
    opcoes: [
      { texto: "Do devedor (comprador), que tem a propriedade plena desde o início", correta: false },
      { texto: "Do credor (banco), que detém a propriedade fiduciária durante o contrato", correta: true },
      { texto: "Do cartório de registro de imóveis, como depositário neutro", correta: false },
      { texto: "Do governo, por se tratar de bem sujeito ao SFH", correta: false },
    ],
  },

  // Tópico: servicos-bancarios-pix-ted-doc-cambio
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "O Pix é gratuito obrigatoriamente para:",
    explicacao: "O BCB determinou que o Pix é GRATUITO para pessoa física (enviante e recebedor). Pessoas jurídicas podem ser cobradas pelas instituições. Essa regra é uma obrigação regulatória do BCB, não uma opção dos bancos.",
    opcoes: [
      { texto: "Todas as pessoas físicas e jurídicas, sem exceção", correta: false },
      { texto: "Apenas pessoas físicas na condição de pagadoras", correta: false },
      { texto: "Pessoas físicas (enviantes e recebedoras), obrigatoriamente", correta: true },
      { texto: "Apenas MEIs e microempresas com faturamento abaixo de R$ 100 mil", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "Qual é a infraestrutura que processa as transferências via TED?",
    explicacao: "O TED passa pelo STR — Sistema de Transferência de Reservas, do BCB. É uma transferência em tempo real em dias úteis. O Pix usa o SPI (Sistema de Pagamentos Instantâneos). O DOC usa a Compe. São sistemas diferentes.",
    opcoes: [
      { texto: "SPI — Sistema de Pagamentos Instantâneos", correta: false },
      { texto: "Compe — Câmara de Compensação de Cheques e Outros Papéis", correta: false },
      { texto: "STR — Sistema de Transferência de Reservas", correta: true },
      { texto: "Selic — Sistema Especial de Liquidação e Custódia", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "O DOC tem como limite máximo de valor por operação:",
    explicacao: "O DOC tem limite máximo de R$ 4.999,99. Para valores iguais ou superiores a R$ 5.000, é obrigatório usar TED, Pix ou outro meio. Com a chegada do Pix (mais rápido, gratuito e sem limite), o DOC se tornou praticamente obsoleto.",
    opcoes: [
      { texto: "R$ 1.999,99", correta: false },
      { texto: "R$ 2.999,99", correta: false },
      { texto: "R$ 4.999,99", correta: true },
      { texto: "R$ 9.999,99", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "Os correspondentes bancários (ex: lotéricas, supermercados) são regulamentados pelo BCB e permitem:",
    explicacao: "Correspondentes bancários são empresas contratadas por instituições financeiras para prestar serviços bancários em seu nome (pagamentos, depósitos, saques, empréstimos). São fundamentais para a inclusão financeira em municípios sem agência. A responsabilidade perante o cliente é da instituição contratante.",
    opcoes: [
      { texto: "Captar recursos do público como se fossem bancos independentes", correta: false },
      { texto: "Prestar serviços bancários em nome de uma instituição financeira, ampliando o acesso", correta: true },
      { texto: "Emitir cartões de crédito com limite próprio, sem vínculo com um banco", correta: false },
      { texto: "Operar câmbio de moeda estrangeira sem autorização do BCB", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    pergunta: "Em relação ao câmbio, a diferença entre a taxa de compra e a taxa de venda praticada pelos bancos é chamada de:",
    explicacao: "O spread cambial é a diferença entre o preço que o banco paga ao comprar moeda estrangeira e o preço que cobra ao vender. É uma das fontes de receita dos bancos nas operações de câmbio. Quanto maior o spread, maior o custo para o cliente.",
    opcoes: [
      { texto: "Ágio cambial", correta: false },
      { texto: "Spread cambial", correta: true },
      { texto: "Cupom cambial", correta: false },
      { texto: "Hedge cambial", correta: false },
    ],
  },

  // Tópico: seguros-previdencia-pgbl-vgbl
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "Na tabela regressiva de IR da previdência privada, a menor alíquota (10%) é atingida após quanto tempo de acumulação?",
    explicacao: "Na tabela regressiva de IR para previdência privada (PGBL e VGBL), a alíquota começa em 35% (até 2 anos) e vai caindo progressivamente, chegando a 10% para recursos acumulados há mais de 10 anos. Incentiva o investimento de longo prazo.",
    opcoes: [
      { texto: "Após 5 anos de acumulação", correta: false },
      { texto: "Após 8 anos de acumulação", correta: false },
      { texto: "Após 10 anos de acumulação", correta: true },
      { texto: "Após 15 anos de acumulação", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "Um contribuinte isento de IR decide investir em previdência complementar. Qual plano é mais indicado?",
    explicacao: "O PGBL só faz sentido para quem declara IR no modelo completo e quer usar a dedução de até 12% da renda bruta. Quem é isento de IR não tem nada a deduzir. Para esse perfil, o VGBL é melhor: IR incide só sobre o rendimento, sem a tributação sobre o principal.",
    opcoes: [
      { texto: "PGBL, pois oferece maior benefício fiscal para qualquer contribuinte", correta: false },
      { texto: "VGBL, pois o IR incide apenas sobre o rendimento, não sobre o principal", correta: true },
      { texto: "Ambos são equivalentes para isentos de IR", correta: false },
      { texto: "PGBL, pois isentos de IR se beneficiam da alíquota zero no resgate", correta: false },
    ],
  },
  {
    blocoSlug: "produtos-servicos-bancarios",
    topicoSlug: "seguros-previdencia-pgbl-vgbl",
    pergunta: "O VGBL é classificado tecnicamente como:",
    explicacao: "O VGBL é classificado juridicamente como seguro de VIDA (não como previdência), o que justifica seu regime tributário diferente: IR incide apenas sobre os rendimentos. Isso explica também por que não é dedutível — seguros de vida não são dedutíveis na declaração de IR.",
    opcoes: [
      { texto: "Plano de previdência aberta, com as mesmas regras do PGBL", correta: false },
      { texto: "Seguro de vida com cobertura por sobrevivência", correta: true },
      { texto: "Fundo de investimento de renda variável com tributação diferenciada", correta: false },
      { texto: "Depósito a prazo com correção pelo IPCA", correta: false },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // BLOCO 4 — MERCADO DE CAPITAIS E TÍTULOS PÚBLICOS
  // ────────────────────────────────────────────────────────────

  // Tópico: b3-cvm-estrutura-mercado-capitais
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "Uma empresa realiza seu IPO (Initial Public Offering). Essa operação ocorre em qual mercado?",
    explicacao: "O IPO é a primeira emissão pública de ações — a empresa vende ações ao público pela primeira vez. Isso acontece no MERCADO PRIMÁRIO, onde os recursos vão para a empresa emissora. Após o IPO, as ações passam a ser negociadas no mercado secundário (B3).",
    opcoes: [
      { texto: "Mercado secundário, pois as ações já estão listadas na B3", correta: false },
      { texto: "Mercado primário, pois é a primeira emissão da empresa", correta: true },
      { texto: "Mercado de balcão não organizado, sem intermediação", correta: false },
      { texto: "Mercado futuro, pois o preço é definido com antecedência", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "A CVM tem como uma de suas competências proteger os investidores contra:",
    explicacao: "Insider trading (uso de informação privilegiada) e manipulação de mercado são crimes contra o mercado de capitais, investigados e punidos pela CVM. Quem negocia ações com base em informações que o mercado ainda não tem tem vantagem ilegal.",
    opcoes: [
      { texto: "Variações cambiais e riscos de crédito no sistema bancário", correta: false },
      { texto: "Inadimplência em operações de crédito consignado", correta: false },
      { texto: "Insider trading e manipulação de preços no mercado de capitais", correta: true },
      { texto: "Falência de instituições seguradoras e de capitalização", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "Debêntures são títulos emitidos por:",
    explicacao: "Debêntures são títulos de dívida emitidos por sociedades anônimas (S.A.) para captar recursos. São uma forma de empréstimo com o mercado — a empresa paga juros e devolve o principal. Não confundir com CDB (emitido por bancos) ou títulos públicos (Tesouro Nacional).",
    opcoes: [
      { texto: "Bancos comerciais para captar recursos dos correntistas", correta: false },
      { texto: "Sociedades anônimas para captar recursos de investidores", correta: true },
      { texto: "O Tesouro Nacional para financiar o déficit público", correta: false },
      { texto: "Cooperativas de crédito para seus associados", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "No mercado secundário de ações, o investidor que compra ações de outro investidor na B3 faz com que os recursos sejam transferidos para:",
    explicacao: "No mercado secundário, as negociações são entre investidores. O dinheiro vai do comprador para o VENDEDOR (o investidor que detinha as ações). A empresa emissora não recebe nada — ela só captou recursos no mercado primário (IPO ou emissão secundária).",
    opcoes: [
      { texto: "A empresa emissora das ações, que usa para reinvestimento", correta: false },
      { texto: "O investidor vendedor das ações", correta: true },
      { texto: "A B3, como taxa de liquidação da operação", correta: false },
      { texto: "A CVM, para fundo de proteção ao investidor", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    pergunta: "O Novo Mercado da B3 exige que as empresas listadas:",
    explicacao: "O Novo Mercado é o mais rigoroso segmento de governança da B3. Exige: apenas ações ON (sem PN), tag along de 100% para todos os acionistas, mínimo de 25% de free float e Conselho de Administração com ao menos 5 membros, 20% independentes.",
    opcoes: [
      { texto: "Tenham capital aberto com ao menos 50% de ações PN em circulação", correta: false },
      { texto: "Tenham apenas ações ON, com tag along de 100% e free float mínimo de 25%", correta: true },
      { texto: "Apresentem lucro por três anos consecutivos antes da listagem", correta: false },
      { texto: "Contratem obrigatoriamente auditoria do BCB para suas demonstrações", correta: false },
    ],
  },

  // Tópico: acoes-on-pn-direitos
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Os dividendos recebidos por pessoa física no Brasil são tributados pelo IR?",
    explicacao: "Os dividendos recebidos por pessoa física são ISENTOS de IR no Brasil (ao contrário da maioria dos países). Já os JCP — Juros sobre Capital Próprio — têm IR de 15% retido na fonte. Ambos são formas de remunerar o acionista, mas com tratamento fiscal diferente.",
    opcoes: [
      { texto: "Sim, com alíquota de 15% retida na fonte", correta: false },
      { texto: "Sim, com alíquota progressiva da tabela do IR", correta: false },
      { texto: "Não, os dividendos são isentos de IR para pessoa física", correta: true },
      { texto: "Apenas os dividendos de ações preferenciais são isentos", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "O tag along garante aos acionistas minoritários o direito de:",
    explicacao: "O tag along ('direito de saída conjunta') garante que, se o controlador vender sua participação, os minoritários podem vender suas ações nas mesmas condições (ou percentual delas). Na Lei das S.A., é de 80% para ações ON. No Novo Mercado, é 100% para todos.",
    opcoes: [
      { texto: "Receber dividendos prioritários antes dos acionistas controladores", correta: false },
      { texto: "Vender suas ações pelo mesmo preço (ou percentual) pago ao controlador em caso de venda do controle", correta: true },
      { texto: "Bloquear a venda do controle acionário da empresa", correta: false },
      { texto: "Converter ações PN em ON automaticamente em caso de mudança de controle", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Qual é o sufixo de ticker (código) usado para ações PREFERENCIAIS no Brasil?",
    explicacao: "As ações preferenciais usam o sufixo 4 (ex: PETR4, BBAS4) ou 11 para units. As ordinárias usam o sufixo 3 (ex: PETR3, VALE3). Essa convenção ajuda o investidor a identificar rapidamente o tipo de ação.",
    opcoes: [
      { texto: "Sufixo 3 (ex: BBAS3)", correta: false },
      { texto: "Sufixo 4 (ex: BBAS4)", correta: true },
      { texto: "Sufixo 1 (ex: BBAS1)", correta: false },
      { texto: "Sufixo 5 (ex: BBAS5)", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "acoes-on-pn-direitos",
    pergunta: "Em caso de liquidação de uma companhia, a ordem de pagamento aos acionistas é:",
    explicacao: "Na liquidação, paga-se primeiro as dívidas (credores), depois os acionistas. Entre os acionistas, as ações PN têm prioridade sobre as ON no recebimento do valor. As ON recebem por último — por isso têm o direito de voto como compensação.",
    opcoes: [
      { texto: "ON recebem antes das PN, pois têm direito a voto", correta: false },
      { texto: "PN recebem antes das ON, pois têm preferência patrimonial", correta: true },
      { texto: "ON e PN recebem simultaneamente, na proporção de participação", correta: false },
      { texto: "Os credores e acionistas são tratados igualmente na liquidação", correta: false },
    ],
  },

  // Tópico: titulos-publicos-tesouro-direto
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "Um investidor compra LTN (Tesouro Prefixado) e, antes do vencimento, a taxa Selic sobe muito. O que acontece com o preço de mercado do título?",
    explicacao: "Quando a taxa de juros sobe, o preço dos títulos prefixados CAIR (relação inversa). O investidor que vender antes do vencimento terá perda — o mercado descontará o título a uma taxa maior. Se segurar até o vencimento, recebe a taxa contratada integralmente.",
    opcoes: [
      { texto: "O preço sobe, pois a taxa contratada fica mais atrativa", correta: false },
      { texto: "O preço cai, pois o mercado desconta o título a taxas maiores", correta: true },
      { texto: "O preço não muda, pois é prefixado", correta: false },
      { texto: "O preço sobe automaticamente para acompanhar a nova Selic", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "O Tesouro Selic (LFT) é recomendado para reserva de emergência porque:",
    explicacao: "O Tesouro Selic tem volatilidade mínima de preço. Como sua rentabilidade acompanha a Selic diariamente, não há risco de perda ao vender antes do vencimento (diferente dos prefixados). É o mais seguro para resgate a qualquer momento.",
    opcoes: [
      { texto: "Protege contra inflação melhor que o Tesouro IPCA+", correta: false },
      { texto: "Tem rentabilidade prefixada, garantindo valor certo no resgate", correta: false },
      { texto: "Tem mínima volatilidade de preço, podendo ser resgatado sem perdas expressivas", correta: true },
      { texto: "É isento de IR, ao contrário dos outros títulos do Tesouro", correta: false },
    ],
  },
  {
    blocoSlug: "mercado-de-capitais-titulos-publicos",
    topicoSlug: "titulos-publicos-tesouro-direto",
    pergunta: "O Tesouro Direto foi criado em 2002 com o objetivo de:",
    explicacao: "O Tesouro Direto foi criado em parceria entre o Tesouro Nacional e a B3 (então Bovespa) para democratizar o acesso aos títulos públicos — antes restritos a grandes investidores. Permite compras a partir de R$ 30, via internet.",
    opcoes: [
      { texto: "Permitir que o governo federal emita títulos no exterior", correta: false },
      { texto: "Substituir os depósitos em poupança como forma de captação governamental", correta: false },
      { texto: "Democratizar o acesso de pessoas físicas aos títulos públicos pela internet", correta: true },
      { texto: "Criar um mercado de balcão para negociação de ações de empresas estatais", correta: false },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // BLOCO 5 — REGULAÇÃO, ÉTICA E TEMAS TRANSVERSAIS
  // ────────────────────────────────────────────────────────────

  // Tópico: sigilo-bancario-lc-105-2001
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "Uma CPI (Comissão Parlamentar de Inquérito) solicita a quebra de sigilo bancário de um investigado. Isso é legalmente possível sem autorização judicial?",
    explicacao: "Sim. CPIs têm poderes constitucionais investigativos equivalentes aos de autoridades judiciais. Podem decretar a quebra de sigilo bancário, fiscal e telefônico diretamente, sem necessidade de ordem judicial prévia. Esse entendimento é consolidado pelo STF.",
    opcoes: [
      { texto: "Não, pois somente o Poder Judiciário pode quebrar o sigilo bancário", correta: false },
      { texto: "Não, pois CPIs só investigam crimes de responsabilidade de autoridades", correta: false },
      { texto: "Sim, pois CPIs têm poderes de investigação sem necessidade de autorização judicial", correta: true },
      { texto: "Sim, mas apenas mediante aprovação do Senado Federal", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "O sigilo bancário protege informações de clientes. Em qual situação o banco é PROIBIDO de revelar dados do cliente?",
    explicacao: "O banco não pode revelar dados de clientes a particulares ou à imprensa em hipótese alguma. O sigilo pode ser quebrado apenas por determinação de autoridades competentes (Judiciário, CPI, Receita Federal). A quebra indevida é crime.",
    opcoes: [
      { texto: "Quando solicitado por CPI em investigação parlamentar", correta: false },
      { texto: "Quando determinado por juiz em processo judicial", correta: false },
      { texto: "Quando solicitado por veículo de imprensa para reportagem de interesse público", correta: true },
      { texto: "Quando requisitado pela Receita Federal para fins tributários", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "De acordo com a LC 105/2001, as informações protegidas pelo sigilo bancário incluem:",
    explicacao: "O sigilo bancário cobre todas as operações ativas e passivas (depósitos, empréstimos, investimentos, saldos, movimentações) e os serviços prestados pelas instituições financeiras. Qualquer dado que identifique operação financeira de um cliente é protegido.",
    opcoes: [
      { texto: "Apenas saldos de conta corrente acima de R$ 10.000", correta: false },
      { texto: "Operações ativas e passivas, serviços prestados e transações financeiras em geral", correta: true },
      { texto: "Somente empréstimos e financiamentos, excluindo depósitos", correta: false },
      { texto: "Exclusivamente dados de pessoa física, não de pessoa jurídica", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "sigilo-bancario-lc-105-2001",
    pergunta: "O Open Finance (Sistema Financeiro Aberto) tem relação com o sigilo bancário porque:",
    explicacao: "O Open Finance é um sistema regulado pelo BCB que permite o compartilhamento de dados financeiros entre instituições com o CONSENTIMENTO do cliente. Não viola o sigilo bancário — o cliente autoriza expressamente o compartilhamento, o que o exclui da proteção do sigilo.",
    opcoes: [
      { texto: "Elimina o sigilo bancário para facilitar a concorrência entre bancos", correta: false },
      { texto: "Permite o compartilhamento de dados com o consentimento expresso do titular", correta: true },
      { texto: "Autoriza o BCB a acessar dados de clientes sem necessidade de consentimento", correta: false },
      { texto: "Restringe o acesso a dados bancários apenas aos bancos públicos", correta: false },
    ],
  },

  // Tópico: lavagem-de-dinheiro-lei-9613
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Um banco identifica que um cliente realiza depósitos em espécie fracionados em valores abaixo de R$ 2.000 em várias agências diferentes. Essa prática é conhecida como:",
    explicacao: "O fracionamento de depósitos (smurf ou smurfing) é a prática de dividir grandes quantias em pequenos depósitos para evitar a comunicação obrigatória ao COAF. É uma técnica clássica da fase de COLOCAÇÃO na lavagem de dinheiro. Bancos devem identificar esse padrão.",
    opcoes: [
      { texto: "Ocultação por cascata internacional", correta: false },
      { texto: "Integração por empresa laranja", correta: false },
      { texto: "Smurfing (fracionamento) — técnica da fase de colocação", correta: true },
      { texto: "Hedge cambial ilícito", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Ao comunicar uma operação suspeita ao COAF, o funcionário ou a instituição:",
    explicacao: "A comunicação ao COAF é sigilosa — o cliente NÃO pode ser informado de que foi reportado. Comunicar ao cliente que foi denunciado ao COAF é crime. A comunicação é feita sem aviso prévio ao investigado para preservar a eficácia da investigação.",
    opcoes: [
      { texto: "Deve informar o cliente sobre a comunicação, garantindo o contraditório", correta: false },
      { texto: "Está proibido de divulgar a comunicação ao cliente investigado", correta: true },
      { texto: "Deve obter autorização judicial antes de reportar ao COAF", correta: false },
      { texto: "Pode comunicar ao cliente, desde que não revele os detalhes da suspeita", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "Na terceira fase da lavagem de dinheiro (integração), o criminoso tipicamente:",
    explicacao: "Na integração, o dinheiro já passou pela colocação e ocultação e aparece como legítimo. O criminoso o reinveste na economia formal: imóveis de luxo, negócios aparentemente legais, salários fictícios. É a fase mais difícil de detectar.",
    opcoes: [
      { texto: "Deposita o dinheiro em espécie em várias contas bancárias", correta: false },
      { texto: "Realiza transferências internacionais para dificultar o rastreamento", correta: false },
      { texto: "Reinveste o dinheiro na economia formal como se fosse renda lícita", correta: true },
      { texto: "Converte o dinheiro em criptomoedas para anonimizar a origem", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "lavagem-de-dinheiro-lei-9613",
    pergunta: "A política 'Conheça seu Cliente' (KYC — Know Your Customer) é uma obrigação de compliance dos bancos que visa:",
    explicacao: "KYC (Know Your Customer) é a obrigação dos bancos de identificar, verificar e monitorar seus clientes. O objetivo é conhecer a origem dos recursos, o perfil de risco e detectar operações incompatíveis com a capacidade financeira declarada — prevenindo lavagem de dinheiro.",
    opcoes: [
      { texto: "Oferecer produtos personalizados para aumentar a receita de cada cliente", correta: false },
      { texto: "Identificar e monitorar clientes para prevenir lavagem de dinheiro e outros crimes financeiros", correta: true },
      { texto: "Avaliar o risco de crédito para definir o limite de financiamento", correta: false },
      { texto: "Compartilhar dados de clientes entre instituições para reduzir fraudes", correta: false },
    ],
  },

  // Tópico: fgc-fundo-garantidor-creditos
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "O FGC é uma entidade de natureza:",
    explicacao: "O FGC é uma entidade PRIVADA e sem fins lucrativos. É mantido pelas próprias instituições financeiras associadas, que contribuem mensalmente com um percentual dos depósitos. Não é entidade pública nem governamental.",
    opcoes: [
      { texto: "Pública, vinculada ao Ministério da Fazenda", correta: false },
      { texto: "Pública, vinculada ao Banco Central do Brasil", correta: false },
      { texto: "Privada, sem fins lucrativos, mantida pelas instituições financeiras", correta: true },
      { texto: "Mista, com participação do governo federal e dos bancos privados", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Fundos de investimento NÃO são cobertos pelo FGC porque:",
    explicacao: "Fundos de investimento têm patrimônio próprio, separado do banco que os administra. Se o banco quebrar, o fundo continua existindo — seu patrimônio não integra a massa falida do banco. Por isso, não precisam (e não são) cobertos pelo FGC.",
    opcoes: [
      { texto: "São considerados investimentos de risco e o FGC só cobre renda fixa", correta: false },
      { texto: "Têm patrimônio segregado do banco — se o banco quebrar, o fundo sobrevive", correta: true },
      { texto: "O FGC só cobre investimentos com prazo inferior a 2 anos", correta: false },
      { texto: "Fundos são regulados pela CVM, não pelo BCB", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Um investidor distribui R$ 250.000 em CDB no Banco A e R$ 250.000 em CDB no Banco B. Qual o total coberto pelo FGC?",
    explicacao: "O limite de R$ 250.000 é POR CPF POR INSTITUIÇÃO. Como são bancos diferentes, cada saldo tem cobertura integral. Total coberto: R$ 500.000. Essa estratégia de diversificar entre instituições é válida para maximizar a cobertura do FGC.",
    opcoes: [
      { texto: "R$ 250.000 no total (um único teto por CPF)", correta: false },
      { texto: "R$ 375.000 (75% do total)", correta: false },
      { texto: "R$ 500.000 (R$ 250.000 em cada banco)", correta: true },
      { texto: "R$ 0, pois o valor total ultrapassa o teto global", correta: false },
    ],
  },
  {
    blocoSlug: "regulacao-etica-temas-transversais",
    topicoSlug: "fgc-fundo-garantidor-creditos",
    pergunta: "Qual dos seguintes produtos NÃO é coberto pelo FGC?",
    explicacao: "Debêntures são títulos emitidos por sociedades anônimas (não por bancos) e negociados no mercado de capitais — não são cobertos pelo FGC. CDB, LCI, LCA e poupança são todos emitidos por bancos e cobertos. Ações também não são cobertas.",
    opcoes: [
      { texto: "CDB emitido por banco de médio porte", correta: false },
      { texto: "Caderneta de poupança em banco privado", correta: false },
      { texto: "Debêntures de empresa do setor elétrico", correta: true },
      { texto: "LCA emitida por banco autorizado pelo BCB", correta: false },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// NOVOS FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcardsExtra = [

  // ── Bloco 1: SFN ──
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Quais são os órgãos normativos do SFN e o que cada um regula?",
    verso: "CMN → Mercado financeiro (bancos, crédito, câmbio, moeda)\nCNSP → Seguros, capitalização e previdência aberta (PGBL/VGBL)\nCNPC → Previdência complementar fechada (fundos de pensão)" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Qual entidade supervisora corresponde a cada órgão normativo?",
    verso: "CMN → BCB + CVM (mercado financeiro e capitais)\nCNSP → Susep (seguros e previdência aberta)\nCNPC → Previc (fundos de pensão)" },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "estrutura-sfn-3-niveis",
    frente: "Qual é a diferença entre banco múltiplo e banco comercial?",
    verso: "Banco múltiplo: opera várias carteiras em uma única pessoa jurídica (comercial, investimento, crédito imobiliário etc.).\nBanco comercial: foca em depósitos à vista, crédito de curto prazo e serviços correntes. Pode captar depósitos à vista — o que cooperativas e financeiras não podem." },

  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "O CMN fixa metas ou executa políticas monetárias?",
    verso: "O CMN apenas FIXA DIRETRIZES E METAS (ex: meta de inflação). Quem EXECUTA é o Banco Central. CMN = regra. BCB = execução. Jamais confundir." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "O CMN pode punir um banco por prática irregular?",
    verso: "NÃO. O CMN não tem poder de fiscalização nem de punição. Quem fiscaliza e pune bancos é o Banco Central. A CVM pune irregularidades no mercado de capitais. CMN = órgão puramente normativo." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cmn-conselho-monetario-nacional",
    frente: "Qual índice de preços é usado na meta de inflação definida pelo CMN?",
    verso: "O IPCA — Índice Nacional de Preços ao Consumidor Amplo, calculado pelo IBGE. O CMN define a meta; o BCB é responsável por cumpri-la usando instrumentos de política monetária (principalmente a Selic)." },

  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "O que mudou com a LC 179/2021 (autonomia do BCB)?",
    verso: "O BCB ganhou AUTONOMIA OPERACIONAL: diretores têm mandatos fixos de 4 anos, não coincidentes com o mandato presidencial. O objetivo é insular a política monetária de pressões políticas de curto prazo e aumentar a credibilidade do BCB." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "banco-central-funcoes",
    frente: "Qual a diferença entre 'banco do governo' e 'banco dos bancos'?",
    verso: "BANCO DO GOVERNO: o BCB gere as reservas internacionais e é o agente financeiro do Tesouro Nacional.\nBANCO DOS BANCOS: o BCB recebe o compulsório dos bancos e é emprestador de última instância (redesconto). Ambas são funções do BCB." },

  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc",
    frente: "O que é insider trading e quem pune?",
    verso: "Insider trading = uso de informação privilegiada (não pública) para negociar valores mobiliários. É crime e infração administrativa punida pela CVM (administrativamente) e pelo Poder Judiciário (penalmente). Pena: reclusão de 1 a 5 anos + multa." },
  { blocoSlug: "sistema-financeiro-nacional", topicoSlug: "cvm-susep-previc",
    frente: "Qual entidade regula a Funcef (fundo de pensão da Caixa Econômica Federal)?",
    verso: "A Funcef é um fundo de pensão FECHADO dos funcionários da CEF. Fundos fechados são supervisionados pela PREVIC (Superintendência Nacional de Previdência Complementar), vinculada ao CNPC." },

  // ── Bloco 2: Política Monetária ──
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Qual é a diferença entre a Selic meta e a Selic over?",
    verso: "SELIC META: definida pelo Copom a cada 45 dias — é o objetivo de política monetária.\nSELIC OVER (efetiva): taxa média real das operações overnight no mercado interbancário. O BCB usa open market para manter a Selic over próxima à meta." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "Como a Selic afeta o câmbio?",
    verso: "Selic alta atrai capital estrangeiro (maior rentabilidade em R$) → maior demanda por reais → real se valoriza (dólar cai).\nSelic baixa → menos atrativo → fuga de capital → real se desvaloriza (dólar sobe).\nEsse é o canal de transmissão cambial da política monetária." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "taxa-selic",
    frente: "O que é o CDI e qual sua relação com a Selic?",
    verso: "CDI (Certificado de Depósito Interbancário) é a taxa dos empréstimos entre bancos (overnight). Fica muito próximo da Selic over — costuma ser 0,1 p.p. abaixo. CDBs são indexados a % do CDI (ex: 100% do CDI ≈ Selic)." },

  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "O depósito compulsório é remunerado?",
    verso: "DEPENDE da modalidade:\n• Sobre depósitos à vista: geralmente NÃO remunerado (o banco 'imobiliza' o recurso).\n• Sobre depósitos a prazo e poupança: geralmente REMUNERADO pela Selic.\nQuando não remunerado, o compulsório tem custo de oportunidade maior para o banco." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "deposito-compulsorio",
    frente: "O que é o multiplicador bancário e como o compulsório o afeta?",
    verso: "Multiplicador bancário: cada real depositado gera mais de um real em crédito (bancos emprestam o que recebem, que volta ao sistema como novo depósito).\nCompulsório ALTO → multiplicador MENOR (bancos retêm mais).\nCompulsório BAIXO → multiplicador MAIOR (mais crédito circula)." },

  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "Compare os 3 instrumentos de política monetária: velocidade e alcance.",
    verso: "OPEN MARKET: mais ágil (diário), mais preciso, reversível → ajuste fino.\nCOMPULSÓRIO: menos ágil (semanas), impacto estrutural amplo → ajuste pesado.\nREDESCONTO: imediato mas reativo (banco pede), emergencial → tapa-buraco pontual." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "O que é operação compromissada no contexto do open market?",
    verso: "É a compra (ou venda) de títulos com COMPROMISSO de reverter a operação em data futura.\nBCB COMPRA com compromisso de vender = repo = injeção temporária de liquidez.\nBCB VENDE com compromisso de comprar = reverse repo = retirada temporária de liquidez." },
  { blocoSlug: "banco-central-politica-monetaria", topicoSlug: "open-market-redesconto",
    frente: "Por que o redesconto é chamado de 'janela de liquidez'?",
    verso: "'Janela de liquidez' porque é uma porta sempre aberta: qualquer banco pode bater e pedir emprestado ao BCB mediante entrega de títulos como garantia. Mas a taxa é punitiva (acima da Selic) para desestimular o uso corriqueiro." },

  // ── Bloco 3: Produtos e Serviços ──
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "Como calcular a taxa equivalente de uma LCI vs CDB?",
    verso: "Para comparar: taxa líquida do CDB = taxa bruta × (1 - alíquota IR).\nEx: CDB 100% CDI com IR 15% → rentabilidade líquida = 85% do CDI.\nSe LCI pagar 87% do CDI → LCI é melhor (isenta de IR).\nSempre compare líquido × líquido." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "captacao-cdb-lci-lca-poupanca",
    frente: "O que é o RDB e como se compara ao CDB?",
    verso: "RDB (Recibo de Depósito Bancário) é similar ao CDB: emitido por bancos, com IR regressivo, coberto pelo FGC.\nDiferença principal: o RDB é INTRANSFERÍVEL e INEGOCIÁVEL antes do vencimento. O CDB pode ser cedido/transferido em alguns casos." },

  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que diferencia o leasing operacional do financeiro para o cliente?",
    verso: "LEASING FINANCEIRO: objetivo é COMPRAR ao final. Parcelas maiores. VRG baixo.\nLEASING OPERACIONAL: objetivo é USAR e DEVOLVER. Empresa cuida da manutenção. Parcelas menores. Muito usado por frotas corporativas.\nMnemônico: Financeiro = Futuro dono. Operacional = só Opera." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que é alienação fiduciária e quem fica com a propriedade?",
    verso: "Na alienação fiduciária, o CREDOR (banco) fica com a propriedade do bem durante o financiamento. O devedor tem a posse direta. Se inadimplir, o banco pode retomar o bem via processo extrajudicial (muito mais rápido que hipoteca)." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "Qual é a hierarquia de custo do crédito do mais caro ao mais barato?",
    verso: "1. Cheque especial (até 8% a.m.)\n2. Cartão rotativo (teto 100% da dívida)\n3. Crédito pessoal sem garantia\n4. CDC (bem como garantia)\n5. Leasing\n6. Consignado (desconto em folha)\n7. Crédito imobiliário (imóvel em garantia)" },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "credito-tipos-caracteristicas",
    frente: "O que é o SFH e como se diferencia do SFI?",
    verso: "SFH (Sistema Financeiro da Habitação): crédito imobiliário com recursos do FGTS e poupança. Tem teto de valor do imóvel e taxa de juros regulada (até 12% a.a.).\nSFI (Sistema Financeiro Imobiliário): sem teto e taxas livres. Para imóveis acima do limite do SFH." },

  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "O que é a chave Pix e quais tipos existem?",
    verso: "Chave Pix é um dado que identifica a conta do recebedor. Tipos:\n• CPF ou CNPJ\n• Número de celular\n• E-mail\n• Chave aleatória (EVP — sequência gerada automaticamente)\nCada pessoa pode ter até 5 chaves por conta (PF) ou 20 (PJ)." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "Quais são os sistemas de liquidação do BCB e o que cada um processa?",
    verso: "STR: TED e operações de grande valor entre bancos (tempo real).\nSPI: Pix (tempo real, 24/7).\nCompe: DOC, cheques e boletos (liquidação D+1).\nSelic: títulos públicos federais." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "servicos-bancarios-pix-ted-doc-cambio",
    frente: "O que é o Pix Agendado e o Pix Cobrança?",
    verso: "Pix Agendado: o pagador programa o Pix para uma data futura (similar ao agendamento de TED).\nPix Cobrança (QR Code Dinâmico): o cobrador gera um QR code com valor e dados específicos — usado por lojas e e-commerce para cobranças com prazo e juros automáticos." },

  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl",
    frente: "PGBL e VGBL: qual tem dedução no IR e qual tem tributação apenas sobre o rendimento?",
    verso: "PGBL: DEDUZ até 12% da renda bruta na declaração completa. Mas no resgate, IR incide sobre o TOTAL (principal + rendimento).\nVGBL: NÃO deduz. No resgate, IR incide apenas sobre o RENDIMENTO.\nA dedução do PGBL é um diferimento — você paga o IR depois." },
  { blocoSlug: "produtos-servicos-bancarios", topicoSlug: "seguros-previdencia-pgbl-vgbl",
    frente: "O que é portabilidade em previdência privada?",
    verso: "Portabilidade permite transferir os recursos de um plano para outro (ou de uma seguradora para outra) SEM pagar IR no momento da transferência. Permite trocar de fundo, de seguradora ou de modalidade (PGBL → PGBL ou VGBL → VGBL). Não é permitido PGBL → VGBL por portabilidade." },

  // ── Bloco 4: Mercado de Capitais ──
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é o mercado de balcão e como se diferencia do mercado de bolsa?",
    verso: "BOLSA (B3): ambiente de negociação centralizado, com pregão eletrônico, transparência de preços e padronização.\nBALCÃO: negociação direta entre as partes (OTC — over the counter), com menos transparência. Pode ser organizado (supervisão da B3) ou não organizado. Debêntures e CDBs costumam ser negociados no balcão." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é underwriting (subscrição) e quem realiza?",
    verso: "Underwriting é o processo pelo qual bancos de investimento e corretoras auxiliam empresas a emitir ações ou debêntures (mercado primário). O banco pode garantir a venda (underwriting firme) ou apenas distribuir o que conseguir (melhores esforços)." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "b3-cvm-estrutura-mercado-capitais",
    frente: "O que é free float e qual seu requisito no Novo Mercado?",
    verso: "Free float é a parcela das ações disponível para negociação pelo público (não está nas mãos do controlador).\nNo Novo Mercado da B3, o requisito mínimo de free float é de 25% do capital total." },

  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "O que é JCP (Juros sobre Capital Próprio) e como é tributado?",
    verso: "JCP é uma forma de remunerar o acionista, dedutível do lucro tributável da empresa (reduz o IR corporativo). Para o acionista PF, sofre retenção de IR de 15% na fonte. Diferente dos dividendos (isentos). A empresa usa JCP para otimizar a carga tributária." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "O que é desdobramento (split) de ações?",
    verso: "Split (desdobramento): a empresa divide cada ação em várias (ex: 1 ação vira 4). O preço cai proporcionalmente. O patrimônio do acionista NÃO muda — tem mais ações a preço menor. Objetivo: aumentar a liquidez das ações ao reduzir o valor unitário." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "acoes-on-pn-direitos",
    frente: "O que é grupamento (inplit) de ações?",
    verso: "Inplit (grupamento): o inverso do split. Várias ações se tornam uma só (ex: 10 ações viram 1). O preço sobe proporcionalmente. Patrimônio do acionista inalterado. Usado para elevar o preço unitário da ação (evitar aspecto de 'penny stock')." },

  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Qual a relação entre taxa de juros e preço dos títulos prefixados?",
    verso: "RELAÇÃO INVERSA: quando a taxa de juros (Selic) SOBE, o preço dos títulos prefixados CAIR. Quando a taxa CAI, o preço SOBE.\nPor isso, o investidor que comprou LTN (Tesouro Prefixado) tende a ganhar se a Selic cair e perder (se vender antes) se a Selic subir." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Qual título público é mais indicado para quem acredita que a inflação vai subir?",
    verso: "NTN-B (Tesouro IPCA+). Paga IPCA + taxa prefixada. Se a inflação subir, o IPCA sobe e o rendimento acompanha. Garante ganho real positivo independentemente da inflação." },
  { blocoSlug: "mercado-de-capitais-titulos-publicos", topicoSlug: "titulos-publicos-tesouro-direto",
    frente: "Qual o tratamento tributário dos títulos do Tesouro Direto?",
    verso: "IR regressivo por prazo (igual ao CDB):\n• Até 180 dias: 22,5%\n• 181–360 dias: 20%\n• 361–720 dias: 17,5%\n• Acima de 720 dias: 15%\nIOF nos primeiros 30 dias. Imposto retido na fonte pela instituição." },

  // ── Bloco 5: Regulação ──
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "A Receita Federal pode acessar dados bancários sem autorização judicial?",
    verso: "SIM, desde 2016 (STF — RE 601.314). A Receita Federal pode acessar dados bancários diretamente para fiscalização tributária. O STF considerou constitucional, pois a LC 105/2001 autoriza e há controle administrativo suficiente." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "O Ministério Público precisa de autorização judicial para quebrar sigilo bancário?",
    verso: "SIM. O MP não tem poder autônomo de quebrar sigilo bancário — precisa de autorização judicial. Diferente da CPI (quebra direta) e da Receita Federal (acesso para fins tributários)." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "sigilo-bancario-lc-105-2001",
    frente: "O que é o Open Finance e qual sua base legal?",
    verso: "Open Finance (Sistema Financeiro Aberto) é o compartilhamento padronizado de dados e serviços financeiros entre instituições autorizadas pelo BCB, mediante CONSENTIMENTO do cliente. Base: Resolução BCB nº 1. Permite portabilidade de dados e estimula a concorrência." },

  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "Quem é obrigado a comunicar operações suspeitas ao COAF?",
    verso: "Bancos e todas as instituições financeiras, além de: imobiliárias, joalherias, leiloeiras, cartórios, contadores, advogados (em operações financeiras), concessionárias de veículos de luxo, bingos e cassinos. Obrigação ampla — não só bancos." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "A Lei 9.613/98 era originalmente uma lista de crimes antecedentes. O que mudou com a Lei 12.683/12?",
    verso: "A Lei 12.683/2012 acabou com o rol taxativo de crimes antecedentes. Antes, só havia lavagem se o dinheiro viesse de crimes específicos (tráfico, terrorismo etc.). Após 2012, QUALQUER infração penal pode ser crime antecedente à lavagem." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "lavagem-de-dinheiro-lei-9613",
    frente: "O COAF investiga crimes? Qual é sua função exata?",
    verso: "NÃO. O COAF é uma Unidade de Inteligência Financeira (UIF). Recebe, analisa e compartilha informações sobre operações suspeitas com órgãos investigativos (Polícia, MP). Quem investiga são a Polícia Federal e o MP. O COAF alimenta a investigação com dados financeiros." },

  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "Como funciona o teto global do FGC de R$ 1 milhão?",
    verso: "Além do limite de R$ 250k por instituição, existe um teto global de R$ 1.000.000 por CPF em um período de 4 anos. Esse teto impede que grandes investidores usem o FGC como seguro ilimitado ao distribuir recursos entre muitas instituições." },
  { blocoSlug: "regulacao-etica-temas-transversais", topicoSlug: "fgc-fundo-garantidor-creditos",
    frente: "Títulos públicos são cobertos pelo FGC?",
    verso: "NÃO. Títulos públicos (Tesouro Direto, LTN, NTN-B, LFT) têm risco SOBERANO — o emissor é o governo federal. O FGC protege contra risco de crédito de instituições privadas. O risco do Tesouro Nacional é considerado o mais baixo da economia brasileira." },
];

// ═══════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("🚀 Enriquecimento de Conhecimentos Bancários — quiz + flashcards extras\n");

  // Monta mapa topicoId por "blocoSlug::topicoSlug"
  const topicoMap = {};

  const blocos = await prisma.bloco.findMany({
    include: { topicos: true, materia: { select: { slug: true } } },
  });

  for (const bloco of blocos) {
    for (const topico of bloco.topicos) {
      topicoMap[`${bloco.slug}::${topico.slug}`] = topico.id;
    }
  }

  // ── Quizzes ──
  let quizCount = 0;
  for (const q of quizExtra) {
    const topicoId = topicoMap[`${q.blocoSlug}::${q.topicoSlug}`];
    if (!topicoId) {
      console.warn(`  ⚠️  Tópico não encontrado: ${q.blocoSlug}::${q.topicoSlug}`);
      continue;
    }

    // Evita duplicata exata pela pergunta
    const exists = await prisma.quiz.findFirst({ where: { topicoId, pergunta: q.pergunta } });
    if (exists) {
      console.log(`  ⏭️  Quiz já existe: "${q.pergunta.slice(0, 60)}..."`);
      continue;
    }

    const ordemAtual = await prisma.quiz.count({ where: { topicoId } });
    await prisma.quiz.create({
      data: {
        pergunta: q.pergunta,
        explicacao: q.explicacao,
        ordem: ordemAtual + 1,
        topicoId,
        opcoes: {
          create: q.opcoes.map((o, i) => ({ texto: o.texto, correta: o.correta, ordem: i })),
        },
      },
    });
    quizCount++;
  }
  console.log(`\n  🧠 ${quizCount} novas questões de quiz criadas`);

  // ── Flashcards ──
  let fcCount = 0;
  for (const fc of flashcardsExtra) {
    const topicoId = topicoMap[`${fc.blocoSlug}::${fc.topicoSlug}`];
    if (!topicoId) {
      console.warn(`  ⚠️  Tópico não encontrado: ${fc.blocoSlug}::${fc.topicoSlug}`);
      continue;
    }

    // Evita duplicata exata pela frente
    const exists = await prisma.flashcard.findFirst({ where: { topicoId, frente: fc.frente } });
    if (exists) {
      console.log(`  ⏭️  Flashcard já existe: "${fc.frente.slice(0, 60)}..."`);
      continue;
    }

    const ordemAtual = await prisma.flashcard.count({ where: { topicoId } });
    await prisma.flashcard.create({
      data: {
        frente: fc.frente,
        verso: fc.verso,
        dica: fc.dica ?? null,
        ordem: ordemAtual + 1,
        topicoId,
      },
    });
    fcCount++;
  }
  console.log(`  🃏 ${fcCount} novos flashcards criados`);

  // Totais finais
  const totalQuiz = await prisma.quiz.count();
  const totalFc = await prisma.flashcard.count();
  console.log(`\n✅ Enriquecimento concluído!`);
  console.log(`   Total no banco: ${totalQuiz} questões · ${totalFc} flashcards\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
