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
  // BLOCO 1 — A BASE FILOSÓFICA
  // ─────────────────────────────────────────────────────────────
  {
    nome: "A Base Filosófica",
    slug: "base-filosofica",
    descricao: "Por que o Direito Administrativo existe? Regime jurídico e princípios fundamentais (LIMPE).",
    ordem: 1,
    topicos: [
      {
        titulo: "Regime Jurídico-Administrativo",
        slug: "regime-juridico-administrativo",
        ordem: 1,
        resumo: "O Estado só pode fazer o que a lei autoriza — essa é a ideia central que conecta todo o Direito Administrativo. O regime jurídico-administrativo é o conjunto de princípios e regras que governam a Administração Pública.",
        conteudo: `# Regime Jurídico-Administrativo

## A Ideia Central

> **O Estado não pode fazer o que quer — ele só pode fazer o que a lei autoriza.**

Essa frase resume o **princípio da legalidade** e é o fio que conecta todo o Direito Administrativo. Diferente do particular, que pode fazer tudo o que a lei não proíbe, a Administração Pública só age quando há previsão legal.

## O que é o Regime Jurídico-Administrativo?

É o conjunto de **princípios e regras especiais** que regem a Administração Pública e a diferenciam dos sujeitos privados. Esse regime é marcado por dois vetores opostos que convivem em equilíbrio:

### Os Dois Super-Princípios

| Super-Princípio | Sentido | Fundamento |
|----------------|---------|------------|
| **Supremacia do interesse público** sobre o privado | O Estado pode impor restrições ao particular quando o interesse coletivo exige (ex: desapropriação) | Prerrogativas da Administração |
| **Indisponibilidade do interesse público** | O agente público não pode abrir mão ou negociar o interesse público como se fosse seu | Sujeições da Administração |

### Como eles se equilibram?

- A **supremacia** dá ao Estado poderes especiais (expropriar, multar, intervir).
- A **indisponibilidade** impede que esses poderes sejam usados em benefício próprio.

Juntos, explicam por que a Administração tem cláusulas exorbitantes nos contratos (supremacia) mas não pode vender um bem público sem licitação (indisponibilidade).

## Direito Público vs. Direito Privado

| Critério | Direito Privado | Direito Público |
|----------|----------------|----------------|
| Liberdade de agir | Pode tudo que a lei não proíbe | Só pode o que a lei permite |
| Finalidade | Interesse próprio | Interesse público |
| Sujeição a controle | Limitada | Ampla (controle interno, externo, judicial) |
`,
      },
      {
        titulo: "Princípios do LIMPE — Art. 37 da CF/88",
        slug: "principios-limpe",
        ordem: 2,
        resumo: "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência são os cinco princípios constitucionais expressos da Administração Pública. Eles fundamentam a invalidade de atos e os limites do poder.",
        conteudo: `# Princípios do LIMPE — Art. 37 da CF/88

O art. 37 da Constituição Federal elenca os cinco princípios **expressos** que regem toda a Administração Pública direta e indireta.

## L — Legalidade

A Administração só pode agir com base em lei. Se não há lei autorizando, não há ação legítima.

- **Para o particular**: pode fazer tudo que a lei não proíbe.
- **Para o agente público**: pode fazer apenas o que a lei permite.

> Questão recorrente: um servidor que age sem lei autorizadora viola o princípio da **legalidade**.

## I — Impessoalidade

A Administração age em nome do **interesse público**, nunca em nome do agente. Proíbe:

- Perseguições ou favoritismos pessoais.
- Promoção pessoal do agente às custas do serviço público.

> Atenção: a publicidade de obras e serviços do governo **não pode conter nome, símbolo ou imagem** de servidor ou governante (art. 37, §1º CF). Isso é impessoalidade.

## M — Moralidade

Não basta ser legal — tem que ser **ético e honesto**. A Administração deve agir com lealdade, boa-fé e probidade.

- Atos imorais são **anuláveis** mesmo que formalmente legais.
- Fundamento da Lei de Improbidade Administrativa (Lei 8.429/92).

## P — Publicidade

Os atos administrativos devem ser **transparentes e acessíveis** ao público. A publicidade é, em regra, condição de eficácia do ato.

**Exceções legítimas à publicidade:**
- Segurança nacional.
- Investigações policiais em andamento.
- Intimidade do indivíduo (dados pessoais).

## E — Eficiência

Inserido pela EC 19/1998 (Reforma Administrativa). Exige que a Administração alcance os **melhores resultados com o menor custo**, de forma ágil e de qualidade.

- Base da avaliação de desempenho dos servidores.
- Fundamenta a possibilidade de exoneração por insuficiência (aprovação em estágio probatório).

## Resumo dos Princípios

| Princípio | Palavra-chave | Viola quando... |
|-----------|--------------|----------------|
| Legalidade | Lei | Age sem previsão legal |
| Impessoalidade | Imparcialidade | Favorece ou persegue pessoa |
| Moralidade | Ética | Age de má-fé ou desonestamente |
| Publicidade | Transparência | Oculta ato sem motivo legítimo |
| Eficiência | Resultado | Age com desperdício ou lentidão excessiva |

> **Dica de concurso**: princípios implícitos (razoabilidade, proporcionalidade, autotutela) também aparecem nas provas, mas não estão no art. 37.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 2 — AGENTES E ESTRUTURA DO ESTADO
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Agentes e Estrutura do Estado",
    slug: "agentes-estrutura-estado",
    descricao: "Quem age e como o Estado é organizado? Administração direta, indireta e agentes públicos.",
    ordem: 2,
    topicos: [
      {
        titulo: "Agentes Públicos — Tipos e Diferenças",
        slug: "agentes-publicos",
        ordem: 1,
        resumo: "Agente público é todo aquele que exerce função pública, mesmo que transitoriamente e sem remuneração. Há três grandes categorias: servidores estatutários, empregados públicos (CLT) e particulares em colaboração.",
        conteudo: `# Agentes Públicos — Tipos e Diferenças

## Conceito Amplo

**Agente público** é toda pessoa física que exerce, ainda que transitoriamente ou sem remuneração, por eleição, nomeação, designação, contratação ou qualquer forma de investidura, função pública.

## As Três Grandes Categorias

### 1. Servidores Estatutários
- Regidos por **estatuto** (lei específica de cada ente).
- Relação legal e estatutária — **não contratual**.
- Têm **estabilidade** após o estágio probatório (3 anos).
- Exemplos: servidores federais (Lei 8.112/90), estaduais e municipais.

### 2. Empregados Públicos
- Regidos pela **CLT** — contrato de emprego.
- Atuam em entidades da **administração indireta** com personalidade de direito privado (empresas públicas e sociedades de economia mista).
- **Não têm estabilidade** como os estatutários (Súmula 390/TST).

### 3. Particulares em Colaboração com o Poder Público
- Exercem função pública **sem vínculo profissional permanente**.
- Exemplos:
  - Mesários eleitorais
  - Jurados do Tribunal do Júri
  - Concessionários e permissionários de serviço público

## Quadro Comparativo

| Critério | Estatutário | Empregado Público | Particular em Colaboração |
|----------|------------|-------------------|--------------------------|
| Regime | Estatuto | CLT | Nenhum (função específica) |
| Vínculo | Legal | Contratual | Eventual |
| Estabilidade | Sim (após 3 anos) | Não | Não |
| Onde atua | Adm. Direta + Autarquias | Empresas Públicas + SEM | Qualquer esfera |

> **Atenção**: Todo agente público, de qualquer categoria, pode praticar ato de improbidade e é sujeito a mandado de segurança.
`,
      },
      {
        titulo: "Organização Administrativa — Direta e Indireta",
        slug: "organizacao-administrativa",
        ordem: 2,
        resumo: "A Administração Pública se divide em Direta (órgãos sem personalidade jurídica própria: ministérios, secretarias) e Indireta (entidades com personalidade jurídica: autarquias, fundações públicas, empresas públicas e SEM).",
        conteudo: `# Organização Administrativa — Direta e Indireta

## Administração Direta

Conjunto de **órgãos** que compõem a estrutura da União, Estados, DF e Municípios.

- **Não têm personalidade jurídica própria** — agem em nome do ente federativo.
- Exemplos: Ministérios, Secretarias, Presidência da República, Câmara dos Deputados.
- Relação entre órgãos: **hierarquia** (subordinação).

## Administração Indireta

Conjunto de **entidades** criadas pelo Estado com **personalidade jurídica própria** para desempenhar atividades específicas.

A relação com a Administração Direta é de **tutela** (ou supervisão), não de hierarquia.

### As 4 Entidades da Administração Indireta

#### 1. Autarquias
- Criadas por **lei específica**.
- Personalidade jurídica de **direito público**.
- Exemplos: INSS, IBAMA, Banco Central (é autarquia especial), ANATEL.
- Gozam de imunidade tributária e seus bens são públicos (impenhoráveis).

#### 2. Fundações Públicas
- Criadas por lei, com **patrimônio destinado a uma finalidade específica**.
- Podem ter personalidade de direito público (autárquica) ou privado.
- Exemplos: IBGE, FUNAI, Fundação Oswaldo Cruz (Fiocruz).

#### 3. Empresas Públicas
- Capital **100% público** (pode ser de vários entes públicos).
- Personalidade jurídica de **direito privado**.
- Qualquer forma societária (LTDA, SA etc.).
- Exemplos: Correios (ECT), Caixa Econômica Federal, BNDES.

#### 4. Sociedades de Economia Mista (SEM)
- Capital **misto** (público + privado), com controle acionário do Estado.
- Sempre constituídas como **Sociedade Anônima (S.A.)**.
- Exemplos: Petrobras, Banco do Brasil, Embraer (quando ainda era SEM).

## Quadro Comparativo

| Entidade | Personalidade | Capital | Forma societária |
|----------|--------------|---------|-----------------|
| Autarquia | Direito Público | 100% público | — |
| Fundação Pública | Público ou Privado | 100% público | — |
| Empresa Pública | Direito Privado | 100% público | Qualquer |
| Soc. Economia Mista | Direito Privado | Misto | Só S.A. |

> **Pegadinha clássica**: Banco do Brasil é SEM (não empresa pública), pois tem ações na bolsa. Caixa Econômica Federal é empresa pública (capital 100% da União).
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 3 — OS ATOS ADMINISTRATIVOS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Os Atos Administrativos",
    slug: "atos-administrativos",
    descricao: "O coração do Direito Administrativo. Conceito, 5 elementos, atributos, vícios e discricionariedade.",
    ordem: 3,
    topicos: [
      {
        titulo: "Conceito, Elementos e Atributos do Ato Administrativo",
        slug: "conceito-elementos-atributos-ato",
        ordem: 1,
        resumo: "O ato administrativo tem 5 elementos essenciais (COMFIMO): Competência, Objeto, Motivo, Finalidade e Forma. Qualquer vício em um deles contamina o ato. Os atributos (presunção de legitimidade, imperatividade, autoexecutoriedade) diferenciam o ato administrativo do ato privado.",
        conteudo: `# Conceito, Elementos e Atributos do Ato Administrativo

## Conceito

**Ato administrativo** é toda manifestação unilateral de vontade da Administração Pública que, sob o regime de direito público, produz efeitos jurídicos imediatos, sujeita ao controle judicial.

## Os 5 Elementos (COMFIMO)

Mnemônico: **CO**mpetência · **F**inalidade · **F**orma · **M**otivo · **O**bjeto

### 1. Competência
Poder legal atribuído ao agente para praticar o ato. É **irrenunciável** e **improrrogável** — o agente não pode abrir mão da sua competência nem exercer competência alheia.

### 2. Finalidade
O resultado que a lei quer que o ato alcance — sempre o **interesse público**. Ato que desvia da finalidade pública é **desvio de finalidade** (vício de legalidade).

### 3. Forma
Modo pelo qual o ato se exterioriza. Em regra, os atos administrativos devem ser **escritos**, mas pode haver atos verbais (ordens) ou simbólicos (sinalização de trânsito).

### 4. Motivo
A situação de fato e de direito que justifica a prática do ato. Está ligada à **Teoria dos Motivos Determinantes**: se o agente declara um motivo, fica vinculado a ele — se o motivo for falso, o ato é nulo, mesmo que pudesse ser praticado por outro motivo válido.

### 5. Objeto
O efeito jurídico imediato produzido pelo ato. Deve ser **lícito, possível, determinado ou determinável**.

## Os Atributos do Ato Administrativo

| Atributo | Significado | Exceção |
|---------|------------|---------|
| **Presunção de legitimidade** | O ato é presumido válido até prova em contrário (presunção relativa — juris tantum) | Sempre pode ser contestado |
| **Imperatividade** | O ato é imposto unilateralmente, sem necessidade de concordância do destinatário | Atos que ampliam direitos (ex: licença) não precisam de imperatividade |
| **Autoexecutoriedade** | A Administração executa o ato sem precisar do Judiciário | Só existe quando a lei autoriza ou em situação urgente |

> **Atenção**: nem todos os atos têm todos os atributos. Atos enunciativos (certidões) não têm imperatividade nem autoexecutoriedade.
`,
      },
      {
        titulo: "Discricionariedade vs. Vinculação e Vícios do Ato",
        slug: "discricionariedade-vinculacao-vicios",
        ordem: 2,
        resumo: "Atos vinculados não deixam margem de escolha ao agente. Atos discricionários permitem um juízo de conveniência e oportunidade — mas sempre dentro dos limites legais. O ato discricionário não é livre: está sujeito ao controle de legalidade e dos princípios.",
        conteudo: `# Discricionariedade vs. Vinculação e Vícios do Ato

## Ato Vinculado

A lei **determina exatamente** como o ato deve ser praticado — o agente não tem escolha. Preenchidos os requisitos legais, a Administração **é obrigada** a praticar o ato.

> Exemplo: Licença para construir. Se o particular apresenta o projeto conforme as normas, a Prefeitura é obrigada a conceder — não pode negar por "não querer".

## Ato Discricionário

A lei deixa ao agente uma **margem de escolha** quanto à conveniência e oportunidade (mérito administrativo). O agente decide **se** e **como** praticar o ato, dentro dos limites legais.

> Exemplo: Autorização para porte de arma. A Administração pode ou não conceder, analisando o caso concreto.

### Discricionariedade NÃO é liberdade total

O ato discricionário ainda está sujeito a:
- Controle de **legalidade** pelo Judiciário (forma, competência, finalidade).
- Princípios da **razoabilidade** e **proporcionalidade**.
- **Teoria dos motivos determinantes**.

O Judiciário **não pode** substituir o mérito administrativo (conveniência/oportunidade), mas pode anular o ato por vício de legalidade ou abuso de poder.

## Vícios do Ato Administrativo

| Elemento viciado | Nome do vício | Consequência |
|-----------------|--------------|-------------|
| Competência | Excesso de poder | Nulidade |
| Finalidade | Desvio de finalidade (desvio de poder) | Nulidade |
| Forma | Forma inadequada | Nulidade (ou saneável, se a lei admitir) |
| Motivo | Motivo falso ou inexistente | Nulidade (pela Teoria dos Motivos Determinantes) |
| Objeto | Objeto ilícito ou impossível | Nulidade |

## Anulação vs. Revogação

| | Anulação | Revogação |
|--|---------|----------|
| **Fundamento** | Vício de **legalidade** | Inconveniência ou inoportunidade |
| **Quem pode fazer** | Administração **e** Judiciário | Só a **Administração** |
| **Efeito** | **Ex tunc** (retroage — desfaz tudo) | **Ex nunc** (não retroage — vale do futuro) |
| **Direitos adquiridos** | Não gera (salvo boa-fé) | Respeita os já constituídos |

> **Pegadinha clássica**: O Judiciário **anula** (por ilegalidade), mas **não revoga** (mérito é da Administração).
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 4 — PODERES, CONTRATOS E BENS
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Poderes, Contratos e Bens Públicos",
    slug: "poderes-contratos-bens",
    descricao: "Os 4 poderes administrativos, licitação, contratos administrativos e classificação dos bens públicos.",
    ordem: 4,
    topicos: [
      {
        titulo: "Poderes Administrativos",
        slug: "poderes-administrativos",
        ordem: 1,
        resumo: "Os quatro poderes administrativos são instrumentos para o Estado atingir o interesse público: hierárquico (organizar a estrutura), disciplinar (punir), regulamentar (normatizar) e de polícia (limitar liberdades individuais).",
        conteudo: `# Poderes Administrativos

Os poderes administrativos são **instrumentos** atribuídos ao Estado para que ele possa cumprir sua função de satisfazer o interesse público. São **poderes-deveres** — o agente não pode deixar de exercê-los quando necessário.

## 1. Poder Hierárquico

Permite à Administração organizar sua estrutura interna, **ordenar**, **controlar** e **corrigir** os atos dos subordinados.

**Decorrências do poder hierárquico:**
- Dar ordens (e ser obedecido).
- Fiscalizar o cumprimento das ordens.
- Delegar e avocar competências.
- Rever e anular atos de subordinados.

> **Atenção**: só existe dentro da **mesma pessoa jurídica**. Entre Ministério e autarquia vinculada, há **tutela**, não hierarquia.

## 2. Poder Disciplinar

Permite punir internamente os **agentes públicos** e os **particulares** que mantêm vínculo especial com a Administração (ex: contratados).

- Fundamenta advertências, suspensões, demissões.
- Pressupõe processo administrativo com contraditório e ampla defesa.
- É **discricionário** na dosimetria da pena (dentro dos limites legais).

## 3. Poder Regulamentar (ou Normativo)

Permite à Administração editar **atos normativos** (decretos, portarias, resoluções) para dar fiel execução às leis.

- Não pode criar direitos ou obrigações **além** do que a lei estabelece (senão viola a legalidade).
- Presidente expede **decretos regulamentares** (art. 84, IV CF).
- Agências reguladoras têm poder normativo **delegado**.

## 4. Poder de Polícia

Permite à Administração **limitar ou condicionar** direitos e liberdades individuais em benefício do interesse coletivo.

**Exemplos práticos:**
- Fiscalização sanitária de restaurantes.
- Licença para construir.
- Interdição de estabelecimento irregular.
- Multas de trânsito.

**Atributos do poder de polícia:**
- **Discricionariedade** (margem de escolha nos limites legais).
- **Autoexecutoriedade** (executa sem precisar do Judiciário).
- **Coercibilidade** (impõe-se ao particular).

> **Distinção importante**: poder de polícia é **preventivo** (licenças, autorizações) e **repressivo** (multas, interdições).
`,
      },
      {
        titulo: "Licitação e Contratos Administrativos",
        slug: "licitacao-contratos-administrativos",
        ordem: 2,
        resumo: "Licitação é o procedimento pelo qual a Administração seleciona a proposta mais vantajosa. Contratos administrativos se diferenciam dos privados pelas cláusulas exorbitantes — poderes que o Estado tem e o particular não.",
        conteudo: `# Licitação e Contratos Administrativos

## Licitação

**Conceito**: Procedimento administrativo formal pelo qual a Administração seleciona a proposta **mais vantajosa** para celebrar contratos, obedecendo aos princípios da isonomia e da competitividade.

**Base legal**: Lei 14.133/2021 (Nova Lei de Licitações) — substituiu a antiga Lei 8.666/93.

### Finalidades da licitação
1. Garantir **isonomia** entre os concorrentes.
2. Selecionar a proposta mais **vantajosa** para a Administração.
3. Promover o **desenvolvimento nacional sustentável**.

### Principais modalidades (Lei 14.133/2021)

| Modalidade | Uso típico |
|-----------|------------|
| **Pregão** | Bens e serviços comuns (ex: material de escritório) |
| **Concorrência** | Obras, serviços e contratos de maior complexidade |
| **Concurso** | Trabalho técnico, científico ou artístico |
| **Leilão** | Alienação de bens públicos ou concessões |
| **Diálogo Competitivo** | Objeto inovador e complexo (novidade na lei nova) |

> **Atenção**: A concorrência e o pregão são as modalidades mais cobradas em concursos.

## Contratos Administrativos

São contratos em que uma das partes é a Administração Pública, regidos **predominantemente pelo direito público**.

### Cláusulas Exorbitantes (o que diferencia dos contratos privados)

São prerrogativas que a Administração tem no contrato e que seriam abusivas em contratos entre particulares:

| Cláusula exorbitante | O que permite |
|---------------------|---------------|
| Alteração unilateral | Modificar o objeto ou as condições sem concordância do contratado |
| Rescisão unilateral | Encerrar o contrato por razões de interesse público |
| Fiscalização | Acompanhar e fiscalizar a execução |
| Aplicação de sanções | Multar e até suspender o contratado |
| Ocupação provisória | Assumir bens, pessoal e serviços em caso de emergência |

### Equilíbrio econômico-financeiro

Em contrapartida às cláusulas exorbitantes, a Administração deve manter o equilíbrio inicial do contrato. Se ela alterar unilateralmente o contrato, deve compensar financeiramente o contratado.
`,
      },
      {
        titulo: "Bens Públicos",
        slug: "bens-publicos",
        ordem: 3,
        resumo: "Bens públicos são bens de domínio do Estado. Classificam-se em: de uso comum do povo, de uso especial e dominicais. São imprescritíveis (não se adquire por usucapião) e inalienáveis (em regra).",
        conteudo: `# Bens Públicos

## Conceito e Classificação

**Bens públicos** são todos os bens pertencentes às pessoas jurídicas de direito público (União, Estados, Municípios, Autarquias e Fundações Públicas de direito público).

### Classificação (art. 99 do Código Civil)

| Tipo | Conceito | Exemplos |
|------|----------|---------|
| **Uso comum do povo** | Usados por todos, sem necessidade de consentimento especial | Praças, ruas, rios, mares, praias |
| **Uso especial** | Usados pela Administração para execução de serviços públicos | Prédios de repartições, viaturas, equipamentos |
| **Dominicais** | Não têm destinação pública imediata; compõem o patrimônio disponível do Estado | Terrenos da União sem destinação, dívidas ativas |

## Características dos Bens Públicos

### 1. Inalienabilidade (relativa)
- Bens de **uso comum** e **uso especial** são **inalienáveis enquanto afetados** à destinação pública.
- Bens **dominicais** podem ser alienados, observadas as condições legais.

### 2. Impenhorabilidade
Bens públicos **não podem ser penhorados** para satisfazer dívidas da Administração. O credor deve executar por meio de precatório (art. 100 CF).

### 3. Imprescritibilidade
Bens públicos **não se adquirem por usucapião** — independentemente do tempo de posse, o particular não se torna dono.

> **Súmula 340/STF**: Desde a vigência do Código Civil, os bens dominicais, como os demais bens públicos, não podem ser adquiridos por usucapião.

### 4. Não oneração
Bens públicos **não podem ser objeto de hipoteca ou penhor**.

## Afetação e Desafetação

- **Afetação**: destinação do bem a uma finalidade pública (ex: construir um hospital em terreno da União).
- **Desafetação**: retirada da destinação pública (ex: fechar o hospital e disponibilizar o terreno para venda). Torna o bem dominical e possibilita a alienação.
`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // BLOCO 5 — CONTROLE E RESPONSABILIDADE
  // ─────────────────────────────────────────────────────────────
  {
    nome: "Controle e Responsabilidade do Estado",
    slug: "controle-responsabilidade-estado",
    descricao: "E quando o Estado erra? Controle interno, externo e judicial. Responsabilidade civil objetiva e mandado de segurança.",
    ordem: 5,
    topicos: [
      {
        titulo: "Controle da Administração Pública",
        slug: "controle-administracao-publica",
        ordem: 1,
        resumo: "O controle da Administração pode ser interno (dentro do próprio órgão), externo (Legislativo + TCU) ou judicial (Judiciário analisa legalidade). A autotutela permite à Administração anular seus próprios atos ilegais.",
        conteudo: `# Controle da Administração Pública

## Por que o controle existe?

Pelo princípio da **indisponibilidade do interesse público**, os agentes não podem agir livremente. O controle é o mecanismo que garante que a Administração aja de acordo com a lei e com o interesse coletivo.

## Tipos de Controle

### 1. Controle Interno
Exercido pela própria Administração sobre seus atos.

- **Autotutela**: a Administração pode anular (vício de legalidade) ou revogar (conveniência) seus próprios atos, **sem precisar do Judiciário**.

> **Súmula 473/STF**: "A Administração pode anular seus próprios atos, quando eivados de vícios que os tornam ilegais, porque deles não se originam direitos; ou revogá-los, por motivo de conveniência ou oportunidade, respeitados os direitos adquiridos..."

- Exercido por órgãos como Controladoria-Geral da União (CGU) e corregedorias.

### 2. Controle Externo
Exercido pelo **Poder Legislativo**, com auxílio do **Tribunal de Contas da União (TCU)**.

| Órgão | Função |
|-------|--------|
| **TCU** | Fiscaliza contas da União; julga contas dos administradores; aplica sanções e determinações |
| **Legislativo** | Sustação de contratos ilegais; julgamento político (CPI, impeachment) |

> **Atenção**: O TCU **não é** órgão do Judiciário. É órgão de controle externo auxiliar do Legislativo. Suas decisões **não têm** caráter jurisdicional (salvo em matéria de suas próprias competências).

### 3. Controle Judicial
O Judiciário controla a **legalidade** dos atos administrativos — nunca o mérito (conveniência/oportunidade).

**Instrumentos de controle judicial:**
- **Mandado de segurança**: direito líquido e certo violado por ato ilegal ou abusivo de autoridade pública.
- **Ação popular**: qualquer cidadão pode anular ato lesivo ao patrimônio público.
- **Ação civil pública**: Ministério Público e outros legitimados defendem interesses difusos e coletivos.
- **Habeas corpus** / **Habeas data**: proteção da liberdade e acesso a dados pessoais.
`,
      },
      {
        titulo: "Responsabilidade Civil do Estado",
        slug: "responsabilidade-civil-estado",
        ordem: 2,
        resumo: "O Estado responde objetivamente pelos danos causados por seus agentes — não é preciso provar culpa, apenas o dano e o nexo de causalidade (teoria do risco administrativo, art. 37, §6º CF). O agente responde subjetivamente em ação regressiva.",
        conteudo: `# Responsabilidade Civil do Estado

## Fundamento Constitucional

**Art. 37, §6º da CF/88:**

> "As pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa."

## A Teoria do Risco Administrativo

O Brasil adota a **teoria do risco administrativo**: a responsabilidade do Estado é **objetiva** — basta provar:

1. **Conduta** do agente público (ação ou omissão).
2. **Dano** sofrido pelo particular.
3. **Nexo de causalidade** entre a conduta e o dano.

Não é necessário provar **culpa ou dolo** do agente.

### Por que objetiva?

Porque o Estado age em nome de todos, e os riscos de sua atividade devem ser distribuídos igualmente pela coletividade — não podem recair apenas sobre a vítima.

## Excludentes de Responsabilidade

Mesmo com responsabilidade objetiva, o Estado pode se eximir provando:

| Excludente | Exemplo |
|-----------|---------|
| **Culpa exclusiva da vítima** | Pedestre atravessa com sinal aberto e é atropelado por viatura |
| **Fato de terceiro** | Vandalismo por terceiros sem ligação com o Estado |
| **Força maior** | Tornado destrói imóvel próximo a obra pública |

> **Atenção**: Culpa concorrente da vítima **não exclui**, apenas reduz a responsabilidade do Estado.

## Ação Regressiva

Após indenizar a vítima, o Estado pode acionar o agente que causou o dano em **ação regressiva** — mas aí a responsabilidade é **subjetiva** (precisa provar dolo ou culpa do agente).

## Responsabilidade por Omissão

Quando o dano decorre de **omissão** do Estado, parte da doutrina defende responsabilidade **subjetiva** (necessita provar culpa do serviço — *faute du service*).

> Exemplo: o Estado sabia de um bueiro aberto e não consertou; pedestre cai. Há responsabilidade, mas discute-se se é objetiva ou subjetiva.
`,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════
const quizData = [
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "regime-juridico-administrativo",
    pergunta: "Qual é a principal diferença entre o regime jurídico do particular e o da Administração Pública quanto ao princípio da legalidade?",
    opcoes: [
      "O particular pode fazer tudo que a lei não proíbe; a Administração só pode fazer o que a lei autoriza.",
      "O particular só pode fazer o que a lei autoriza; a Administração pode fazer tudo que a lei não proíbe.",
      "Ambos seguem o mesmo princípio: só podem agir com expressa autorização legal.",
      "A Administração tem mais liberdade que o particular por ser o representante do Estado.",
    ],
    respostaCorreta: 0,
    explicacao: "Essa é a diferença central do princípio da legalidade no Direito Administrativo: para o particular, vigora a autonomia privada (pode tudo que a lei não veda); para a Administração, vigora a legalidade estrita (só pode o que a lei expressamente autoriza).",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "regime-juridico-administrativo",
    pergunta: "Os dois 'super-princípios' que marcam o regime jurídico-administrativo são:",
    opcoes: [
      "Legalidade e Moralidade.",
      "Supremacia do interesse público e Indisponibilidade do interesse público.",
      "Publicidade e Eficiência.",
      "Hierarquia e Disciplina.",
    ],
    respostaCorreta: 1,
    explicacao: "A supremacia do interesse público justifica as prerrogativas da Administração (poderes especiais), enquanto a indisponibilidade impede que o agente abra mão ou negocie o interesse coletivo como se fosse seu. Juntos, formam o eixo do regime jurídico-administrativo.",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "principios-limpe",
    pergunta: "Um servidor público que usa verbas do governo para fazer publicidade de obra com seu próprio nome e foto viola principalmente qual princípio?",
    opcoes: [
      "Eficiência, pois desperdiça recursos públicos.",
      "Legalidade, pois não há lei autorizando esse tipo de publicidade.",
      "Impessoalidade, pois a publicidade deve ser do serviço público, não do agente.",
      "Moralidade, pois é um ato de vaidade pessoal.",
    ],
    respostaCorreta: 2,
    explicacao: "O art. 37, §1º da CF/88 veda expressamente que a publicidade institucional contenha nomes, símbolos ou imagens de autoridades ou servidores, pois a obra é do Estado, não do agente. Esse é o princípio da impessoalidade em sua dimensão de proibição da autopromoção.",
  },
  {
    blocoSlug: "agentes-estrutura-estado",
    topicoSlug: "organizacao-administrativa",
    pergunta: "Sobre a diferença entre Empresa Pública e Sociedade de Economia Mista, é correto afirmar:",
    opcoes: [
      "A Empresa Pública tem capital 100% público e pode adotar qualquer forma societária; a SEM tem capital misto e é sempre S.A.",
      "A Empresa Pública tem capital misto e é sempre S.A.; a SEM tem capital 100% público.",
      "Ambas têm capital 100% público e adotam obrigatoriamente a forma de S.A.",
      "A Empresa Pública tem personalidade jurídica de direito público; a SEM tem personalidade de direito privado.",
    ],
    respostaCorreta: 0,
    explicacao: "Empresa Pública: capital 100% público + qualquer forma societária (ex.: Caixa Econômica Federal é LTDA). SEM: capital misto com controle público + obrigatoriamente S.A. (ex.: Banco do Brasil, Petrobras). Ambas têm personalidade jurídica de direito privado.",
  },
  {
    blocoSlug: "agentes-estrutura-estado",
    topicoSlug: "organizacao-administrativa",
    pergunta: "O Banco Central do Brasil é uma:",
    opcoes: [
      "Empresa pública federal, pois atua no mercado financeiro.",
      "Sociedade de economia mista, pois parte de seu capital é privado.",
      "Autarquia especial, pois tem personalidade jurídica de direito público e regime especial de autonomia.",
      "Fundação pública, pois foi instituída para gerir o patrimônio monetário do país.",
    ],
    respostaCorreta: 2,
    explicacao: "O Banco Central é uma autarquia especial — tem personalidade jurídica de direito público, goza de autonomia reforçada (mandatos fixos dos diretores) e se vincula ao CMN. Não é empresa, pois não explora atividade econômica com fins lucrativos.",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "conceito-elementos-atributos-ato",
    pergunta: "Um prefeito exonera um servidor alegando 'interesse público', mas as provas revelam que a exoneração ocorreu porque o servidor testemunhou contra o prefeito num processo. Qual vício de ato administrativo está presente?",
    opcoes: [
      "Incompetência, pois o prefeito não tinha atribuição para exonerar.",
      "Vício de forma, pois a exoneração deveria seguir rito especial.",
      "Desvio de finalidade (desvio de poder), pois o ato foi praticado com finalidade diversa do interesse público.",
      "Vício de objeto, pois a exoneração é ato ilícito em qualquer circunstância.",
    ],
    respostaCorreta: 2,
    explicacao: "O desvio de finalidade (ou desvio de poder) ocorre quando o agente usa um poder legítimo para atingir um fim que não é o interesse público — no caso, vingança pessoal. O ato é formalmente correto (prefeito tem competência para exonerar), mas viciado na finalidade.",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "discricionariedade-vinculacao-vicios",
    pergunta: "Qual das afirmativas sobre a Teoria dos Motivos Determinantes está correta?",
    opcoes: [
      "Se o agente declara um motivo para o ato, fica vinculado a ele; se o motivo for falso, o ato é nulo, mesmo que houvesse outro motivo válido.",
      "O ato só é nulo se o agente não declarar nenhum motivo.",
      "A teoria se aplica apenas a atos vinculados, não a atos discricionários.",
      "O Judiciário não pode apreciar a veracidade do motivo declarado pelo agente.",
    ],
    respostaCorreta: 0,
    explicacao: "Pela Teoria dos Motivos Determinantes, ao declarar um motivo, o agente se vincula a ele. A constatação de que o motivo é falso ou inexistente contamina o ato de nulidade — mesmo que existisse outro motivo legítimo que poderia ter sido invocado.",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "poderes-administrativos",
    pergunta: "O poder de polícia administrativa se distingue da polícia judiciária porque:",
    opcoes: [
      "A polícia administrativa atua sobre pessoas suspeitas de crimes; a judiciária atua sobre atividades lícitas.",
      "A polícia administrativa limita ou condiciona direitos individuais em prol do interesse coletivo; a judiciária reprime infrações penais e auxilia o processo criminal.",
      "Apenas a polícia judiciária pode aplicar multas e sanções.",
      "A polícia administrativa não tem autoexecutoriedade; a judiciária tem.",
    ],
    respostaCorreta: 1,
    explicacao: "O poder de polícia administrativa atua sobre atividades lícitas (fiscalização sanitária, licenças, multas de trânsito) condicionando o exercício de direitos ao interesse coletivo. A polícia judiciária (Polícia Civil, Federal) atua na repressão criminal, auxiliando o sistema de Justiça Penal.",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "licitacao-contratos-administrativos",
    pergunta: "As cláusulas exorbitantes dos contratos administrativos são assim chamadas porque:",
    opcoes: [
      "Impõem preços acima do mercado ao contratado.",
      "São prerrogativas que seriam abusivas em contratos entre particulares, mas são legítimas quando o Estado contrata.",
      "Permitem ao contratado rescindir o contrato sem ônus a qualquer momento.",
      "Exigem garantias excessivas do particular contratado.",
    ],
    respostaCorreta: 1,
    explicacao: "As cláusulas exorbitantes 'exorbitam' (vão além) do que seria aceito num contrato privado — alterar ou rescindir unilateralmente, fiscalizar, aplicar sanções diretamente são poderes que só a Administração Pública tem, justificados pela supremacia do interesse público.",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "bens-publicos",
    pergunta: "Uma família ocupa um terreno da União há 30 anos. Podem adquiri-lo por usucapião?",
    opcoes: [
      "Sim, pois 30 anos supera qualquer prazo de usucapião previsto no Código Civil.",
      "Sim, mas apenas se o terreno for classificado como bem dominical.",
      "Não, pois bens públicos são imprescritíveis — não podem ser adquiridos por usucapião.",
      "Sim, desde que a ocupação seja de boa-fé e com moradia habitual.",
    ],
    respostaCorreta: 2,
    explicacao: "Pela Súmula 340 do STF e pelo art. 102 do Código Civil, bens públicos não se adquirem por usucapião, independentemente do tempo de posse e da categoria do bem (uso comum, uso especial ou dominical). Essa é a imprescritibilidade dos bens públicos.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "responsabilidade-civil-estado",
    pergunta: "A teoria adotada pelo Brasil para a responsabilidade civil do Estado é a do risco administrativo. Isso significa que:",
    opcoes: [
      "O Estado sempre responde pelos danos, sem possibilidade de exclusão da responsabilidade.",
      "O particular precisa provar culpa ou dolo do agente para obter indenização.",
      "O Estado responde objetivamente pelo dano (sem necessidade de provar culpa), mas pode se eximir provando culpa exclusiva da vítima, força maior ou fato de terceiro.",
      "A responsabilidade é sempre subjetiva, analisando a culpa do serviço público.",
    ],
    respostaCorreta: 2,
    explicacao: "A teoria do risco administrativo (art. 37, §6º CF) impõe responsabilidade objetiva: basta provar conduta, dano e nexo causal. Não é, porém, teoria do risco integral — o Estado pode se eximir comprovando culpa exclusiva da vítima, fato de terceiro ou força maior.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "controle-administracao-publica",
    pergunta: "O Tribunal de Contas da União (TCU) é um órgão:",
    opcoes: [
      "Do Poder Judiciário, com competência para julgar causas de improbidade administrativa.",
      "Do Poder Executivo, subordinado ao Ministério da Fazenda.",
      "Auxiliar do Poder Legislativo, com função de fiscalizar as contas da União.",
      "Independente dos três poderes, com autonomia plena de atuação.",
    ],
    respostaCorreta: 2,
    explicacao: "O TCU é órgão auxiliar do Congresso Nacional no exercício do controle externo (art. 71 CF). Não integra o Poder Judiciário nem o Executivo. Suas decisões em matéria de contas têm caráter administrativo, não jurisdicional.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "controle-administracao-publica",
    pergunta: "Qual é a diferença fundamental entre anulação e revogação de ato administrativo?",
    opcoes: [
      "Anulação por conveniência (efeito ex nunc); revogação por ilegalidade (efeito ex tunc).",
      "Anulação por ilegalidade (efeito ex tunc); revogação por conveniência (efeito ex nunc). O Judiciário pode anular, mas não revogar.",
      "Anulação e revogação têm o mesmo fundamento; diferem apenas nos efeitos temporais.",
      "Só o Judiciário pode anular; só a Administração pode revogar, sendo vedado ao Judiciário rever qualquer ato.",
    ],
    respostaCorreta: 1,
    explicacao: "Anulação: fundamento na ilegalidade, efeito retroativo (ex tunc), pode ser feita pela Administração (autotutela) ou pelo Judiciário. Revogação: fundamento na inconveniência/inoportunidade (mérito), efeito prospectivo (ex nunc), só a Administração pode revogar — o Judiciário não pode substituir o mérito administrativo.",
  },
];

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════════════
const flashcardsData = [
  // Bloco 1 — Base Filosófica
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "regime-juridico-administrativo",
    frente: "O que é o princípio da legalidade para a Administração Pública?",
    verso: "A Administração só pode fazer o que a lei expressamente autoriza. Diferente do particular, que pode fazer tudo o que a lei não proíbe.",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "regime-juridico-administrativo",
    frente: "Quais são os dois 'super-princípios' do regime jurídico-administrativo?",
    verso: "1) Supremacia do interesse público (dá ao Estado prerrogativas especiais). 2) Indisponibilidade do interesse público (impede o agente de abrir mão ou negociar o interesse coletivo).",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "principios-limpe",
    frente: "O que significa a sigla LIMPE?",
    verso: "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência — os cinco princípios expressos da Administração Pública, previstos no art. 37 da CF/88.",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "principios-limpe",
    frente: "O princípio da impessoalidade proíbe o que nas publicidades governamentais?",
    verso: "Proíbe que publicidades de obras e serviços públicos contenham nome, símbolo ou imagem de servidores ou autoridades, evitando a promoção pessoal às custas do erário (art. 37, §1º CF).",
  },
  {
    blocoSlug: "base-filosofica",
    topicoSlug: "principios-limpe",
    frente: "Qual é o principal fundamento do princípio da eficiência e quando foi inserido na Constituição?",
    verso: "Exige que a Administração alcance os melhores resultados com o menor custo, de forma ágil. Foi inserido pela EC 19/1998 (Reforma Administrativa).",
  },

  // Bloco 2 — Agentes e Estrutura
  {
    blocoSlug: "agentes-estrutura-estado",
    topicoSlug: "agentes-publicos",
    frente: "Qual a diferença entre servidor estatutário e empregado público?",
    verso: "Estatutário: regido por estatuto (lei), relação legal, tem estabilidade (ex.: servidores federais pela Lei 8.112/90). Empregado público: regido pela CLT, relação contratual, sem estabilidade como os estatutários.",
  },
  {
    blocoSlug: "agentes-estrutura-estado",
    topicoSlug: "organizacao-administrativa",
    frente: "Qual a diferença entre Empresa Pública e Sociedade de Economia Mista?",
    verso: "Empresa Pública: capital 100% público, qualquer forma societária (ex.: Caixa Econômica Federal). SEM: capital misto com controle público, obrigatoriamente S.A. (ex.: Banco do Brasil, Petrobras).",
  },
  {
    blocoSlug: "agentes-estrutura-estado",
    topicoSlug: "organizacao-administrativa",
    frente: "O que diferencia a autarquia das demais entidades da Administração Indireta?",
    verso: "A autarquia tem personalidade jurídica de direito público (as demais têm direito privado), é criada por lei específica, goza de imunidade tributária e seus bens são públicos (impenhoráveis e imprescritíveis).",
  },

  // Bloco 3 — Atos Administrativos
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "conceito-elementos-atributos-ato",
    frente: "Quais são os 5 elementos do ato administrativo? (mnemônico)",
    verso: "COMFIMO: Competência, Objeto, Motivo, Finalidade, Forma. O vício em qualquer deles contamina o ato.",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "conceito-elementos-atributos-ato",
    frente: "O que é a Teoria dos Motivos Determinantes?",
    verso: "Se o agente declara um motivo para o ato, fica vinculado a ele. Se o motivo for falso ou inexistente, o ato é nulo — mesmo que houvesse outro motivo válido que poderia ter sido invocado.",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "conceito-elementos-atributos-ato",
    frente: "Quais são os três atributos do ato administrativo?",
    verso: "1) Presunção de legitimidade (é presumido válido até prova em contrário — juris tantum). 2) Imperatividade (impõe-se unilateralmente). 3) Autoexecutoriedade (executa sem o Judiciário, quando previsto em lei ou em urgência).",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "discricionariedade-vinculacao-vicios",
    frente: "Qual é a diferença entre ato vinculado e ato discricionário?",
    verso: "Vinculado: a lei determina exatamente como agir — o agente não tem escolha. Discricionário: a lei deixa margem de conveniência e oportunidade (mérito administrativo) — o agente pode escolher dentro dos limites legais.",
  },
  {
    blocoSlug: "atos-administrativos",
    topicoSlug: "discricionariedade-vinculacao-vicios",
    frente: "O Judiciário pode rever o mérito do ato discricionário?",
    verso: "Não. O Judiciário controla a legalidade (competência, forma, finalidade, motivo, objeto), mas não pode substituir o juízo de conveniência e oportunidade (mérito) do administrador.",
  },

  // Bloco 4 — Poderes, Contratos e Bens
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "poderes-administrativos",
    frente: "Quais são os 4 poderes administrativos?",
    verso: "1) Hierárquico (organizar e controlar subordinados). 2) Disciplinar (punir agentes e contratados). 3) Regulamentar (editar normas para executar leis). 4) De polícia (limitar liberdades individuais em prol do coletivo).",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "poderes-administrativos",
    frente: "O poder disciplinar se aplica apenas a servidores públicos?",
    verso: "Não. Aplica-se também a particulares que mantêm vínculo especial com a Administração, como contratados e concessionários. Pressupõe processo administrativo com contraditório e ampla defesa.",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "licitacao-contratos-administrativos",
    frente: "O que são cláusulas exorbitantes nos contratos administrativos?",
    verso: "Prerrogativas da Administração que seriam abusivas em contratos privados: alterar ou rescindir unilateralmente, fiscalizar, aplicar sanções e ocupar provisoriamente bens do contratado. Derivam da supremacia do interesse público.",
  },
  {
    blocoSlug: "poderes-contratos-bens",
    topicoSlug: "bens-publicos",
    frente: "Bens dominicais podem ser adquiridos por usucapião?",
    verso: "Não. A Súmula 340/STF e o art. 102 do CC determinam que nenhum bem público — incluindo os dominicais — pode ser adquirido por usucapião. São imprescritíveis.",
  },

  // Bloco 5 — Controle e Responsabilidade
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "controle-administracao-publica",
    frente: "O que é a autotutela administrativa?",
    verso: "É o poder-dever da Administração de rever seus próprios atos: anular os ilegais (vício de legalidade) e revogar os inconvenientes (mérito), sem precisar do Judiciário. Previsto na Súmula 473/STF.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "controle-administracao-publica",
    frente: "O TCU pertence a qual Poder e qual é sua principal função?",
    verso: "O TCU é órgão auxiliar do Poder Legislativo (Congresso Nacional). Fiscaliza as contas da União, julga contas dos administradores e aplica sanções — mas suas decisões têm caráter administrativo, não jurisdicional.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "responsabilidade-civil-estado",
    frente: "Para responsabilizar o Estado por um dano, o que o particular precisa provar?",
    verso: "Pela teoria do risco administrativo (responsabilidade objetiva): apenas conduta do agente, dano e nexo de causalidade. Não precisa provar culpa ou dolo do agente.",
  },
  {
    blocoSlug: "controle-responsabilidade-estado",
    topicoSlug: "responsabilidade-civil-estado",
    frente: "Quais são as excludentes de responsabilidade civil do Estado?",
    verso: "Culpa exclusiva da vítima, fato de terceiro e força maior. A culpa concorrente não exclui — apenas reduz a indenização. A teoria do risco administrativo (diferente do risco integral) admite essas excludentes.",
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Iniciando seed — Direito Administrativo...\n");

  // Upsert da Matéria
  const materia = await prisma.materia.upsert({
    where: { slug: "direito-administrativo" },
    update: {},
    create: {
      nome: "Direito Administrativo",
      slug: "direito-administrativo",
      descricao:
        "Regime jurídico-administrativo, princípios LIMPE, atos administrativos, poderes, licitação, contratos e responsabilidade civil do Estado.",
      icone: "⚖️",
      cor: "violet",
      ordem: 3,
    },
  });
  console.log(`✅ Matéria: ${materia.nome}`);

  // Mapa de tópicos para associar quizzes e flashcards
  const topicoMap = {};

  // Upsert de Blocos e Tópicos
  for (const blocoData of blocos) {
    const bloco = await prisma.bloco.upsert({
      where: { materiaId_slug: { slug: blocoData.slug, materiaId: materia.id } },
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
        where: { blocoId_slug: { slug: topicoData.slug, blocoId: bloco.id } },
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

  // Quizzes
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

  // Flashcards
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

  console.log("\n🎉 Seed de Direito Administrativo concluído com sucesso!");
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
