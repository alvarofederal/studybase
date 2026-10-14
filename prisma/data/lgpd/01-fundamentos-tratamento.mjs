// LGPD (Lei nº 13.709/2018) — Blocos 1 e 2: Fundamentos e Tratamento de Dados
// Base: "Resumo Esquematizado da LGPD" (pasta LIVROS/LGPD) + texto da lei. Redação própria.
export default [
  {
    nome: "Fundamentos e Conceitos",
    slug: "fundamentos-conceitos",
    descricao: "Objetivo, fundamentos, aplicação, exceções, definições do art. 5º e princípios do art. 6º.",
    ordem: 1,
    topicos: [
      {
        titulo: "Objeto, Fundamentos, Aplicação e Exceções (arts. 1º a 4º)",
        slug: "objeto-fundamentos-aplicacao",
        resumo: "A LGPD protege direitos fundamentais de liberdade e privacidade no tratamento de dados pessoais por pessoa natural ou jurídica, de direito público ou privado, inclusive nos meios digitais. Aplica-se com base na territorialidade (operação, oferta ou coleta no Brasil) e tem exceções expressas (art. 4º).",
        conteudo: `# Objeto, Fundamentos, Aplicação e Exceções

## Art. 1º — Objeto

Dispõe sobre o **tratamento de dados pessoais**, inclusive nos **meios digitais**, por **pessoa natural** ou **pessoa jurídica de direito público ou privado**, com o objetivo de proteger os direitos fundamentais de **liberdade** e de **privacidade** e o livre desenvolvimento da **personalidade da pessoa natural**.

> 💡 A LGPD protege **pessoa natural**. Dados de pessoa jurídica **não** são dados pessoais.

## Art. 2º — Fundamentos (7)

1. respeito à **privacidade**;
2. **autodeterminação informativa**;
3. liberdade de **expressão, de informação, de comunicação e de opinião**;
4. inviolabilidade da **intimidade, da honra e da imagem**;
5. **desenvolvimento econômico e tecnológico** e a **inovação**;
6. **livre iniciativa, livre concorrência** e **defesa do consumidor**;
7. **direitos humanos**, livre desenvolvimento da personalidade, **dignidade** e exercício da **cidadania**.

## Art. 3º — Aplicação (territorialidade)

Aplica-se a **qualquer operação de tratamento**, **independentemente do meio, do país de sede** do agente ou **do país onde estejam os dados**, desde que:

| Critério | Resumo |
|---|---|
| **I** | a operação seja realizada **no território nacional** |
| **II** | a atividade tenha por objetivo a **oferta/fornecimento de bens ou serviços** ou o tratamento de dados de **indivíduos localizados no Brasil** |
| **III** | os dados tenham sido **coletados no território nacional** |

Basta **um** dos critérios (são alternativos).

## Art. 4º — A LGPD **não se aplica** ao tratamento de dados:

| Hipótese | Observação |
|---|---|
| **Pessoa natural**, para fins **exclusivamente particulares e não econômicos** | uso doméstico |
| Fins exclusivamente **jornalísticos e artísticos** | |
| Fins exclusivamente **acadêmicos** | **aplicam-se os arts. 7º e 11** |
| **Segurança pública, defesa nacional, segurança do Estado, investigação e repressão de infrações penais** | regidos por **legislação específica** |
| Dados **provenientes de fora do Brasil** | sem comunicação/uso compartilhado com agentes brasileiros nem transferência a outro país, e com **grau de proteção adequado** no país de origem |

> 💡 Nas hipóteses de segurança pública e defesa, o tratamento é regido por lei específica, mas a ANPD **emite opiniões técnicas e recomendações** e pode solicitar relatório de impacto.
`,
        fc: [
          ["Quais são os critérios de aplicação territorial da LGPD (art. 3º)?", "Alternativos: (I) operação realizada no Brasil; (II) oferta de bens/serviços ou tratamento de dados de indivíduos localizados no Brasil; (III) dados coletados no Brasil."],
          ["Em quais casos a LGPD não se aplica (art. 4º)?", "Uso particular e não econômico por pessoa natural; fins jornalísticos/artísticos; acadêmicos (com aplicação dos arts. 7º e 11); segurança pública, defesa nacional, segurança do Estado e persecução penal; dados vindos do exterior sem compartilhamento no Brasil e com proteção adequada."],
          ["Quem a LGPD protege?", "A pessoa natural. Dados de pessoa jurídica não são dados pessoais para a lei."],
        ],
        mc: [
          ["Segundo o art. 3º da LGPD, a lei se aplica ao tratamento de dados quando:", ["apenas o controlador tiver sede no Brasil.", "a operação for realizada no território nacional, ou houver oferta de bens/serviços a indivíduos no Brasil, ou os dados tiverem sido coletados no Brasil.", "os dados estiverem armazenados em servidores localizados no Brasil.", "o titular for brasileiro nato."], 1, "Os critérios do art. 3º são alternativos e independem do país de sede ou de localização dos dados.", "MEDIO"],
          ["A LGPD NÃO se aplica ao tratamento de dados realizado:", ["por empresa privada com fins econômicos.", "por pessoa natural para fins exclusivamente particulares e não econômicos.", "pelo Poder Público no exercício de suas competências legais.", "por órgão de pesquisa."], 1, "Art. 4º, I.", "FACIL"],
          ["Entre os fundamentos da LGPD (art. 2º) NÃO se encontra:", ["a autodeterminação informativa.", "a defesa do consumidor.", "o sigilo comercial como direito absoluto do controlador.", "a inviolabilidade da intimidade, da honra e da imagem."], 2, "Não há ‘sigilo comercial absoluto’ entre os fundamentos; a lei, inclusive, ressalva segredos comercial e industrial em alguns dispositivos.", "MEDIO"],
        ],
        ce: [
          ["A LGPD aplica-se ao tratamento de dados de pessoas jurídicas, por serem sujeitos de direitos.", "E", "A lei protege dados de pessoa natural."],
          ["Aplica-se a LGPD ainda que o controlador tenha sede no exterior, se a atividade de tratamento tiver por objetivo a oferta de serviços a indivíduos localizados no Brasil.", "C", "Art. 3º, II: extraterritorialidade."],
          ["Ao tratamento de dados para fins exclusivamente acadêmicos aplicam-se os arts. 7º e 11 da LGPD.", "C", "Art. 4º, II, ‘b’: a exceção acadêmica mantém as bases legais."],
          ["O tratamento de dados pessoais realizado para fins de segurança pública é integralmente regido pela LGPD.", "E", "Art. 4º, III: será regido por legislação específica."],
        ],
      },
      {
        titulo: "Conceitos e Agentes de Tratamento (art. 5º)",
        slug: "conceitos-agentes",
        resumo: "Dado pessoal (pessoa identificada ou identificável) × dado sensível (lista taxativa) × dado anonimizado. Controlador decide; operador trata em nome do controlador; ambos são agentes de tratamento. Encarregado é o canal de comunicação com titulares e ANPD; não é agente de tratamento.",
        conteudo: `# Conceitos e Agentes de Tratamento (art. 5º)

## Tipos de dado

| Conceito | Definição |
|---|---|
| **Dado pessoal** | informação relacionada a pessoa natural **identificada ou identificável** |
| **Dado pessoal sensível** | dado sobre **origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico**, quando vinculado a uma pessoa natural |
| **Dado anonimizado** | dado relativo a titular que **não possa ser identificado**, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião do tratamento |
| **Banco de dados** | conjunto estruturado de dados pessoais, em um ou vários locais, em suporte eletrônico ou físico |

## Quem é quem

| Figura | Papel |
|---|---|
| **Titular** | pessoa natural a quem se referem os dados |
| **Controlador** | pessoa natural ou jurídica, de **direito público ou privado**, a quem **competem as decisões** referentes ao tratamento |
| **Operador** | pessoa natural ou jurídica, de direito público ou privado, que **realiza o tratamento em nome do controlador** |
| **Encarregado** | pessoa indicada pelo controlador e operador para atuar como **canal de comunicação** entre controlador, titulares e ANPD |
| **Agentes de tratamento** | o **controlador** e o **operador** (o encarregado **não** é agente de tratamento) |
| **ANPD** | órgão responsável por zelar, implementar e fiscalizar o cumprimento da lei |

> 💡 **Macete:** *controlador decide, operador executa, encarregado comunica.*

## Outros conceitos importantes

- **Tratamento:** toda operação com dados pessoais (coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração).
- **Anonimização:** perda da possibilidade de associação, direta ou indireta, a um indivíduo.
- **Consentimento:** manifestação **livre, informada e inequívoca** pela qual o titular concorda com o tratamento para uma **finalidade determinada**.
- **Bloqueio:** **suspensão temporária** de qualquer operação de tratamento, mediante guarda do dado.
- **Eliminação:** **exclusão** de dado ou conjunto de dados armazenados em banco de dados.
- **Transferência internacional:** transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro.
- **Uso compartilhado de dados:** comunicação, difusão, transferência, interconexão ou tratamento compartilhado entre órgãos/entidades públicos ou entre estes e entes privados (e entre privados).
- **Relatório de impacto à proteção de dados pessoais (RIPD):** documentação com a descrição dos processos de tratamento que possam gerar **riscos às liberdades civis e aos direitos fundamentais**, bem como as medidas e salvaguardas de mitigação.
- **Órgão de pesquisa:** órgão ou entidade da administração pública ou **pessoa jurídica de direito privado sem fins lucrativos** legalmente constituída sob as leis brasileiras, com sede no País, que inclua em sua missão institucional **pesquisa básica ou aplicada** de caráter histórico, científico, tecnológico ou estatístico.
`,
        fc: [
          ["Controlador × operador × encarregado?", "Controlador: toma as decisões sobre o tratamento. Operador: trata os dados em nome do controlador. Encarregado: canal de comunicação entre controlador, titulares e ANPD. Só controlador e operador são agentes de tratamento."],
          ["Dado pessoal sensível: quais são?", "Origem racial/étnica, convicção religiosa, opinião política, filiação a sindicato ou organização religiosa/filosófica/política, saúde, vida sexual, dado genético ou biométrico (vinculado a uma pessoa natural)."],
          ["Anonimização × bloqueio × eliminação?", "Anonimização: o dado perde a associação a um indivíduo. Bloqueio: suspensão temporária do tratamento, com guarda do dado. Eliminação: exclusão do dado do banco de dados."],
        ],
        mc: [
          ["O agente a quem competem as decisões referentes ao tratamento de dados pessoais é o:", ["operador.", "encarregado.", "controlador.", "titular."], 2, "Art. 5º, VI.", "FACIL"],
          ["Assinale o dado que NÃO é classificado, por si só, como dado pessoal sensível.", ["Opinião política.", "Dado genético.", "Endereço residencial.", "Filiação a sindicato."], 2, "O endereço é dado pessoal, mas não consta do rol de dados sensíveis.", "MEDIO"],
          ["São agentes de tratamento, nos termos da LGPD:", ["controlador e operador.", "controlador e encarregado.", "operador e encarregado.", "controlador, operador e encarregado."], 0, "Art. 5º, IX: agentes de tratamento = controlador + operador.", "MEDIO"],
        ],
        ce: [
          ["O encarregado integra o conceito legal de agentes de tratamento, ao lado do controlador e do operador.", "E", "Art. 5º, IX: apenas controlador e operador."],
          ["O dado biométrico, quando vinculado a uma pessoa natural, é considerado dado pessoal sensível.", "C", "Art. 5º, II."],
          ["O controlador pode ser pessoa natural ou jurídica, de direito público ou privado.", "C", "Art. 5º, VI."],
          ["O dado anonimizado é sempre considerado dado pessoal, ainda que o titular não possa ser identificado.", "E", "Em regra, dado anonimizado não é dado pessoal (art. 12), salvo reversão do processo."],
        ],
      },
      {
        titulo: "Princípios (art. 6º)",
        slug: "principios",
        resumo: "O tratamento observa a boa-fé e dez princípios: finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação e responsabilização e prestação de contas. Saber a definição de cada um é o que as bancas cobram.",
        conteudo: `# Princípios (art. 6º)

O tratamento deve observar a **boa-fé** e os seguintes **10 princípios**:

| Princípio | Ideia central (como a lei define) |
|---|---|
| **I — Finalidade** | propósitos **legítimos, específicos, explícitos e informados** ao titular, **sem tratamento posterior incompatível** |
| **II — Adequação** | compatibilidade do tratamento com as **finalidades informadas**, conforme o **contexto** |
| **III — Necessidade** | **limitação ao mínimo necessário**; dados **pertinentes, proporcionais e não excessivos** |
| **IV — Livre acesso** | consulta **facilitada e gratuita** sobre a **forma e a duração** do tratamento e a integralidade dos dados |
| **V — Qualidade dos dados** | **exatidão, clareza, relevância e atualização**, conforme a necessidade e para o cumprimento da finalidade |
| **VI — Transparência** | informações **claras, precisas e facilmente acessíveis** sobre o tratamento e os agentes (respeitados segredos comercial e industrial) |
| **VII — Segurança** | medidas **técnicas e administrativas** aptas a proteger contra acessos não autorizados e situações acidentais ou ilícitas |
| **VIII — Prevenção** | medidas para **prevenir a ocorrência de danos** |
| **IX — Não discriminação** | impossibilidade de tratamento para fins **discriminatórios ilícitos ou abusivos** |
| **X — Responsabilização e prestação de contas** | demonstração da adoção de medidas **eficazes e capazes de comprovar** o cumprimento das normas (*accountability*) |

## Mnemônico

> **F**inalidade · **A**dequação · **N**ecessidade · **L**ivre acesso · **Q**ualidade · **T**ransparência · **S**egurança · **P**revenção · **N**ão discriminação · **R**esponsabilização

## Como a banca testa

- **Finalidade × adequação × necessidade:** *para que* coletar (finalidade) → *combina com o que foi informado?* (adequação) → *coletei só o mínimo?* (necessidade).
- **Livre acesso × transparência:** livre acesso = o **titular consulta seus dados**; transparência = informações claras sobre o **tratamento e os agentes**.
- **Segurança × prevenção:** segurança protege **contra acessos e incidentes**; prevenção busca **evitar danos** de forma geral.
- **Accountability** = não basta cumprir; é preciso **demonstrar** que cumpre.

> 💡 Um erro comum é achar que o princípio da necessidade proíbe tratar dados. Ele **limita ao mínimo indispensável** à finalidade.
`,
        fc: [
          ["Princípio da necessidade?", "Limita o tratamento ao mínimo necessário para a finalidade, abrangendo dados pertinentes, proporcionais e não excessivos."],
          ["Princípio da responsabilização e prestação de contas (accountability)?", "O agente deve demonstrar a adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados."],
          ["Livre acesso × transparência?", "Livre acesso: consulta facilitada e gratuita do titular sobre forma, duração e integralidade dos seus dados. Transparência: informações claras e acessíveis sobre o tratamento e os agentes."],
        ],
        mc: [
          ["O princípio que impõe a coleta apenas dos dados estritamente pertinentes e não excessivos para a finalidade é o da:", ["adequação.", "necessidade.", "transparência.", "prevenção."], 1, "Necessidade = mínimo necessário.", "FACIL"],
          ["A garantia de consulta facilitada e gratuita pelo titular sobre a forma e a duração do tratamento corresponde ao princípio do:", ["livre acesso.", "segurança.", "qualidade dos dados.", "não discriminação."], 0, "Art. 6º, IV.", "FACIL"],
          ["A impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos refere-se ao princípio da:", ["prevenção.", "finalidade.", "não discriminação.", "segurança."], 2, "Art. 6º, IX.", "FACIL"],
        ],
        ce: [
          ["O princípio da finalidade exige propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades.", "C", "Art. 6º, I."],
          ["O princípio da qualidade dos dados assegura ao titular exatidão, clareza, relevância e atualização dos dados.", "C", "Art. 6º, V."],
          ["O princípio da adequação trata da limitação do tratamento ao mínimo necessário.", "E", "Isso é necessidade. Adequação = compatibilidade com as finalidades informadas."],
          ["A LGPD enumera dez princípios, além da exigência de boa-fé.", "C", "Art. 6º, caput e incisos I a X."],
        ],
      },
    ],
  },
  {
    nome: "Tratamento de Dados Pessoais",
    slug: "tratamento-dados-pessoais",
    descricao: "Bases legais, consentimento, legítimo interesse, dados sensíveis, anonimizados, de crianças e término do tratamento.",
    ordem: 2,
    topicos: [
      {
        titulo: "Bases Legais do Tratamento (arts. 7º a 10)",
        slug: "bases-legais",
        resumo: "O art. 7º traz 10 hipóteses legais para tratar dados pessoais (consentimento é apenas uma delas). O consentimento (art. 8º) deve ser livre, informado e inequívoco, ter finalidade determinada, ser revogável e provado pelo controlador. O legítimo interesse (art. 10) exige dados estritamente necessários e transparência.",
        conteudo: `# Bases Legais do Tratamento (arts. 7º a 10)

> **Regra:** todo tratamento precisa de uma **base legal**. O **consentimento é só uma** das dez.

## Art. 7º — As 10 hipóteses

| # | Base legal | Ideia |
|---|---|---|
| I | **Consentimento** do titular | |
| II | **Obrigação legal ou regulatória** pelo controlador | |
| III | **Administração pública**: políticas públicas previstas em leis, regulamentos, contratos, convênios | tratamento e uso compartilhado |
| IV | **Estudos por órgão de pesquisa** | **anonimização**, sempre que possível |
| V | **Execução de contrato** ou procedimentos preliminares, a pedido do titular | |
| VI | **Exercício regular de direitos** em processo judicial, administrativo ou arbitral | |
| VII | **Proteção da vida** ou da **incolumidade física** (titular ou terceiro) | |
| VIII | **Tutela da saúde**, **exclusivamente** em procedimento por profissionais de saúde, serviços de saúde ou autoridade sanitária | |
| IX | **Legítimo interesse** do controlador ou de terceiro | exceto prevalência de direitos e liberdades do titular |
| X | **Proteção do crédito** | |

> 💡 Ordem para decorar: consentimento → obrigação legal → administração pública → estudos → contrato → exercício de direitos → proteção da vida → tutela da saúde → legítimo interesse → proteção do crédito.

## Art. 8º — Consentimento

- Fornecido **por escrito** ou **por outro meio** que demonstre a manifestação de vontade.
- Se por escrito: **cláusula destacada** das demais.
- **Ônus da prova** é do **controlador**.
- É **vedado** o tratamento mediante **vício de consentimento**.
- Deve se referir a **finalidades determinadas**; **autorizações genéricas são nulas**.
- Pode ser **revogado a qualquer momento**, por **procedimento gratuito e facilitado**.
- Mudança de finalidade, forma ou duração do tratamento, ou da identificação do controlador → **informação específica** ao titular, que pode revogar se discordar.

## Art. 9º — Acesso do titular às informações

Informações **claras, adequadas e ostensivas** sobre: **finalidade específica**, **forma e duração**, **identificação e contato do controlador**, **uso compartilhado**, **responsabilidades dos agentes** e **direitos do titular**. Se o consentimento for **condição para o fornecimento de produto/serviço**, o titular deve ser informado disso **com destaque**.

## Art. 10 — Legítimo interesse

Somente para **finalidades legítimas**, **consideradas a partir de situações concretas**, como: **apoio e promoção de atividades do controlador** e **proteção do exercício regular de direitos do titular** ou prestação de serviços que o beneficiem.

- Somente os dados **estritamente necessários**.
- Adotar medidas de **transparência**.
- A **ANPD** pode solicitar **relatório de impacto** ao controlador.

## Dados tornados públicos (art. 7º, §§ 3º e 4º)

- Dados de **acesso público** devem ser tratados considerando a **finalidade, a boa-fé e o interesse público**.
- É **dispensada a exigência do consentimento** para dados **manifestamente públicos pelo titular**, resguardados os direitos do titular e os princípios.
`,
        fc: [
          ["Quantas bases legais há no art. 7º? Cite algumas.", "Dez: consentimento, obrigação legal/regulatória, administração pública, estudos por órgão de pesquisa, execução de contrato, exercício regular de direitos, proteção da vida, tutela da saúde, legítimo interesse e proteção do crédito."],
          ["Requisitos do consentimento (art. 8º)?", "Livre, informado e inequívoco; por escrito (cláusula destacada) ou outro meio; finalidades determinadas (autorizações genéricas são nulas); ônus da prova do controlador; revogável a qualquer momento, de forma gratuita e facilitada."],
          ["Legítimo interesse: condições (art. 10)?", "Finalidades legítimas a partir de situações concretas, apenas dados estritamente necessários, transparência ao titular, e possibilidade de a ANPD pedir relatório de impacto."],
        ],
        mc: [
          ["Sobre o consentimento para tratamento de dados pessoais, é correto afirmar:", ["Autorizações genéricas são válidas.", "O ônus da prova de que o consentimento foi obtido é do titular.", "Pode ser revogado a qualquer momento, mediante procedimento gratuito e facilitado.", "Só é válido se obtido por escrito."], 2, "Art. 8º, §5º. O ônus da prova é do controlador; autorizações genéricas são nulas; pode ser por outro meio.", "MEDIO"],
          ["O tratamento de dados pessoais com base no legítimo interesse (art. 10):", ["dispensa qualquer medida de transparência.", "pode abranger todos os dados disponíveis do titular.", "deve limitar-se aos dados estritamente necessários para a finalidade pretendida.", "só é possível por órgão público."], 2, "Art. 10, §1º.", "MEDIO"],
          ["Assinale a hipótese que NÃO consta do art. 7º como base legal de tratamento.", ["Proteção do crédito.", "Tutela da saúde.", "Interesse comercial exclusivo do controlador, independentemente do titular.", "Execução de contrato."], 2, "Não existe base legal de ‘interesse comercial exclusivo’; o legítimo interesse tem limites.", "MEDIO"],
        ],
        ce: [
          ["O consentimento é a única base legal que autoriza o tratamento de dados pessoais.", "E", "O art. 7º traz dez hipóteses."],
          ["Se o consentimento for fornecido por escrito, deverá constar de cláusula destacada das demais cláusulas contratuais.", "C", "Art. 8º, §1º."],
          ["Cabe ao titular provar que o consentimento não foi obtido em conformidade com a lei.", "E", "Art. 8º, §2º: o ônus da prova é do controlador."],
          ["O tratamento para a proteção do crédito é hipótese legal prevista no art. 7º.", "C", "Art. 7º, X."],
        ],
      },
      {
        titulo: "Dados Sensíveis, Anonimizados e de Crianças e Adolescentes (arts. 11 a 14)",
        slug: "sensiveis-anonimizados-criancas",
        resumo: "Dados sensíveis exigem consentimento específico e destacado, ou hipóteses taxativas sem consentimento (legítimo interesse e proteção do crédito não estão entre elas). Dado anonimizado, em regra, não é dado pessoal. Crianças exigem consentimento específico de ao menos um dos pais ou responsável.",
        conteudo: `# Dados Sensíveis, Anonimizados e de Crianças e Adolescentes

## Dados sensíveis (art. 11)

Só podem ser tratados:

**I — com consentimento**, de forma **específica e destacada**, para **finalidades específicas**; ou

**II — sem consentimento**, quando **indispensável** para:

| Alínea | Hipótese |
|---|---|
| a | **cumprimento de obrigação legal ou regulatória** pelo controlador |
| b | tratamento **compartilhado** de dados necessários à execução, pela administração pública, de **políticas públicas** |
| c | **estudos por órgão de pesquisa** (anonimização, sempre que possível) |
| d | **exercício regular de direitos** (inclusive em contrato e em processo) |
| e | **proteção da vida** ou da incolumidade física |
| f | **tutela da saúde** (por profissionais/serviços de saúde ou autoridade sanitária) |
| g | **prevenção à fraude e segurança do titular**, nos processos de **identificação e autenticação** de cadastro em sistemas eletrônicos |

> ⚠️ **Pegadinha clássica:** **legítimo interesse** e **proteção do crédito** **não** são hipóteses para dados **sensíveis**.

- É **vedada** a comunicação ou o uso compartilhado de dados **sensíveis referentes à saúde** entre controladores com o objetivo de obter **vantagem econômica** (salvo hipóteses de portabilidade, assistência à saúde e outras previstas em lei).

## Dados anonimizados (art. 12)

- **Não** são considerados dados pessoais, **salvo** quando:
  - o processo de anonimização for **revertido** com meios próprios; ou
  - puder ser revertido com **esforços razoáveis**.
- Podem ser considerados dados pessoais os utilizados para formação do **perfil comportamental** de determinada pessoa natural, se **identificada**.
- Determinação de "razoável": fatores **objetivos** como **custo e tempo** necessários e **tecnologias disponíveis**.
- A **ANPD** pode dispor sobre padrões e técnicas de anonimização.

## Estudos em saúde pública (art. 13)

Órgãos de pesquisa podem ter acesso a bases de dados pessoais, **exclusivamente dentro do órgão** e **estritamente para a finalidade**, em **ambiente controlado e seguro**, com **anonimização ou pseudonimização** e práticas de segurança. **Vedada** a transferência a terceiros. Divulgação de resultados **sem revelar dados pessoais**.

## Crianças e adolescentes (art. 14)

- O tratamento deve ser realizado em seu **melhor interesse**.
- **Crianças:** consentimento **específico e em destaque** dado por **pelo menos um dos pais ou pelo responsável legal**.
- É possível **coletar sem consentimento** quando for para **contatar os pais/responsável** ou para a **proteção da criança**, **uma única vez**, **sem armazenamento**, e **nunca repassar a terceiros** sem consentimento.
- Os controladores devem **manter pública** a informação sobre os tipos de dados coletados, a forma de uso e os direitos.
- **Jogos e aplicações** de internet **não podem condicionar** a participação ao fornecimento de **dados além dos estritamente necessários**.
- As informações devem ser fornecidas de maneira **simples, clara e acessível**, de modo a proporcionar a informação **necessária aos pais** e adequada ao entendimento da criança.
`,
        fc: [
          ["Hipóteses de tratamento de dados sensíveis sem consentimento?", "Obrigação legal; políticas públicas (compartilhado); estudos por órgão de pesquisa; exercício regular de direitos; proteção da vida; tutela da saúde; prevenção à fraude e segurança do titular em cadastros eletrônicos."],
          ["Legítimo interesse serve para dados sensíveis?", "Não. Nem legítimo interesse nem proteção do crédito estão entre as hipóteses do art. 11 para dados sensíveis."],
          ["Consentimento para tratar dados de crianças?", "Específico e em destaque, dado por pelo menos um dos pais ou pelo responsável legal."],
        ],
        mc: [
          ["O tratamento de dados pessoais sensíveis, sem consentimento do titular, é possível quando indispensável para:", ["atender ao legítimo interesse do controlador.", "a proteção do crédito.", "o cumprimento de obrigação legal ou regulatória pelo controlador.", "a formação de cadastro de marketing."], 2, "Art. 11, II, ‘a’. Legítimo interesse e proteção do crédito não se aplicam a dados sensíveis.", "MEDIO"],
          ["Em regra, os dados anonimizados:", ["são dados pessoais.", "não são considerados dados pessoais para os fins da LGPD.", "dependem sempre de consentimento.", "são dados sensíveis."], 1, "Art. 12, caput, salvo reversão do processo de anonimização.", "FACIL"],
          ["Para o tratamento de dados pessoais de crianças, o consentimento deve ser dado por:", ["qualquer pessoa maior de idade.", "pelo menos um dos pais ou pelo responsável legal, de forma específica e em destaque.", "a própria criança, a partir de 12 anos.", "o encarregado."], 1, "Art. 14, §1º.", "FACIL"],
        ],
        ce: [
          ["A LGPD permite o tratamento de dados pessoais sensíveis com fundamento no legítimo interesse do controlador.", "E", "O art. 11 não inclui o legítimo interesse."],
          ["Dados anonimizados podem ser considerados dados pessoais quando o processo de anonimização puder ser revertido com esforços razoáveis.", "C", "Art. 12, caput."],
          ["É permitida a coleta de dados de crianças sem consentimento dos pais quando necessária para contatá-los ou para a proteção da criança, desde que utilizados uma única vez e sem armazenamento.", "C", "Art. 14, §3º."],
          ["Os jogos e aplicações de internet podem condicionar a participação de crianças ao fornecimento de dados pessoais além dos estritamente necessários.", "E", "Art. 14, §4º: vedado."],
        ],
      },
      {
        titulo: "Término do Tratamento e Eliminação dos Dados (arts. 15 e 16)",
        slug: "termino-eliminacao",
        resumo: "O tratamento termina quando a finalidade é alcançada ou os dados deixam de ser necessários, ao fim do período previsto, por comunicação do titular (revogação) ou por determinação da ANPD em caso de violação. Depois do término, os dados são eliminados, salvo hipóteses autorizadas de conservação.",
        conteudo: `# Término do Tratamento e Eliminação dos Dados

## Art. 15 — Quando termina o tratamento

O tratamento **termina** nas seguintes hipóteses:

| # | Hipótese |
|---|---|
| **I** | **verificação de que a finalidade foi alcançada** ou de que os dados **deixaram de ser necessários ou pertinentes** ao alcance da finalidade específica |
| **II** | **fim do período de tratamento** |
| **III** | **comunicação do titular**, inclusive no exercício do direito de **revogação do consentimento** (art. 8º, §5º), resguardado o interesse público |
| **IV** | **determinação da ANPD**, quando houver **violação ao disposto nesta Lei** |

## Art. 16 — Eliminação

Os dados pessoais serão **eliminados após o término de seu tratamento**, **no âmbito e nos limites técnicos das atividades**. É **autorizada a conservação** para as seguintes finalidades:

| # | Conservação autorizada |
|---|---|
| **I** | **cumprimento de obrigação legal ou regulatória** pelo controlador |
| **II** | **estudo por órgão de pesquisa**, garantida, sempre que possível, a **anonimização** |
| **III** | **transferência a terceiro**, desde que respeitados os requisitos de tratamento da lei |
| **IV** | **uso exclusivo do controlador**, **vedado seu acesso por terceiro**, e desde que **anonimizados** os dados |

## Pontos de atenção

- **Revogação do consentimento** = hipótese de término (art. 15, III), mas **não** apaga automaticamente o que já foi tratado licitamente.
- A **eliminação** é a regra; a **conservação** é a **exceção** e precisa de **fundamento legal**.
- A LGPD fala em **eliminar**; **bloqueio** (suspensão temporária) é outra figura (art. 5º, XIII) e pode ser sanção (art. 52, V) ou direito do titular (art. 18, IV).

> 💡 Compare: **art. 15** = "quando termina?" (4 hipóteses); **art. 16** = "e depois?" (eliminar, salvo 4 exceções).
`,
        fc: [
          ["Hipóteses de término do tratamento (art. 15)?", "Finalidade alcançada ou dados desnecessários; fim do período de tratamento; comunicação do titular (inclusive revogação do consentimento); determinação da ANPD por violação à lei."],
          ["Hipóteses de conservação após o término (art. 16)?", "Obrigação legal/regulatória; estudo por órgão de pesquisa (com anonimização); transferência a terceiro (respeitados os requisitos); uso exclusivo do controlador, sem acesso de terceiros e com dados anonimizados."],
          ["Regra geral após o término do tratamento?", "Eliminação dos dados, nos limites técnicos das atividades; a conservação é exceção, só nas hipóteses legais."],
        ],
        mc: [
          ["Constitui hipótese de término do tratamento de dados pessoais:", ["o aumento do faturamento do controlador.", "a verificação de que a finalidade foi alcançada.", "a mudança de endereço do titular.", "a nomeação de um novo encarregado."], 1, "Art. 15, I.", "FACIL"],
          ["Após o término do tratamento, os dados pessoais devem ser:", ["conservados indefinidamente.", "eliminados, autorizada a conservação apenas nas hipóteses legais.", "transferidos obrigatoriamente à ANPD.", "bloqueados definitivamente."], 1, "Art. 16, caput.", "FACIL"],
          ["Assinale a hipótese de conservação autorizada pelo art. 16 da LGPD.", ["Uso comercial livre pelo controlador.", "Cumprimento de obrigação legal ou regulatória pelo controlador.", "Venda a terceiros.", "Preferência do operador."], 1, "Art. 16, I.", "MEDIO"],
        ],
        ce: [
          ["A comunicação do titular, inclusive no exercício do direito de revogação do consentimento, é hipótese de término do tratamento.", "C", "Art. 15, III."],
          ["A ANPD pode determinar o término do tratamento quando houver violação à LGPD.", "C", "Art. 15, IV."],
          ["Após o término do tratamento, é vedada em qualquer hipótese a conservação dos dados pessoais.", "E", "Art. 16 prevê quatro hipóteses de conservação."],
          ["A conservação dos dados para uso exclusivo do controlador é autorizada, vedado o acesso por terceiro e desde que anonimizados.", "C", "Art. 16, IV."],
        ],
      },
    ],
  },
];
