// LGPD (Lei nº 13.709/2018) — Blocos 3 e 4: Titular, Poder Público e Governança/Fiscalização
export default [
  {
    nome: "Direitos do Titular, Poder Público e Transferência Internacional",
    slug: "titular-poder-publico-transferencia",
    descricao: "Direitos do art. 18, tratamento pelo Poder Público (arts. 23 a 32) e transferência internacional de dados (arts. 33 a 36).",
    ordem: 3,
    topicos: [
      {
        titulo: "Direitos do Titular (arts. 17 a 22)",
        slug: "direitos-do-titular",
        resumo: "O titular pode, a qualquer momento e mediante requisição: confirmar a existência de tratamento, acessar, corrigir, pedir anonimização/bloqueio/eliminação, portabilidade, eliminação dos dados tratados com consentimento, informações sobre compartilhamento, sobre a possibilidade de não consentir e revogar o consentimento. Confirmação e acesso: formato simplificado imediato ou declaração completa em até 15 dias.",
        conteudo: `# Direitos do Titular (arts. 17 a 22)

## Art. 17

Toda pessoa natural tem **assegurada a titularidade de seus dados pessoais** e garantidos os direitos fundamentais de **liberdade, de intimidade e de privacidade**.

## Art. 18 — Direitos (por requisição ao controlador, a qualquer momento)

| # | Direito |
|---|---|
| **I** | **confirmação** da existência de tratamento |
| **II** | **acesso** aos dados |
| **III** | **correção** de dados incompletos, inexatos ou desatualizados |
| **IV** | **anonimização, bloqueio ou eliminação** de dados **desnecessários, excessivos ou tratados em desconformidade** com a lei |
| **V** | **portabilidade** a outro fornecedor de serviço ou produto, mediante requisição expressa, conforme regulamentação da ANPD, observados segredos comercial e industrial |
| **VI** | **eliminação** dos dados pessoais tratados **com o consentimento** do titular (exceto hipóteses do art. 16) |
| **VII** | **informação** das entidades públicas e privadas com as quais o controlador realizou **uso compartilhado** |
| **VIII** | **informação** sobre a possibilidade de **não fornecer consentimento** e sobre as **consequências da negativa** |
| **IX** | **revogação do consentimento** |

Além disso:
- direito de **petição** contra o controlador **perante a ANPD** (§1º);
- direito de **oposição** a tratamento realizado com **dispensa de consentimento**, em caso de descumprimento da lei (§2º);
- o requerimento é atendido **sem custos**, nos prazos e termos do regulamento (§5º).

## Art. 19 — Confirmação e acesso

| Forma | Prazo |
|---|---|
| **Formato simplificado** | **imediatamente** |
| **Declaração clara e completa** (origem dos dados, inexistência de registro, critérios, finalidade) | **até 15 dias**, contados do requerimento |

- Dados em formato que **favoreça o exercício do direito de acesso**; podem ser fornecidos por **meio eletrônico** (seguro e idôneo) ou **impresso**.
- Se o tratamento for baseado em **consentimento ou contrato**, o titular pode solicitar **cópia eletrônica integral** (respeitados segredos comercial e industrial), em formato que permita **utilização subsequente**.

## Art. 20 — Decisões automatizadas

O titular tem direito a **solicitar a revisão de decisões tomadas unicamente com base em tratamento automatizado** de dados pessoais que afetem seus interesses (inclusive definição de **perfil pessoal, profissional, de consumo e de crédito** ou aspectos da personalidade).

- O controlador deve fornecer, **sempre que solicitadas**, **informações claras e adequadas** sobre os **critérios e procedimentos** utilizados, **observados segredos comercial e industrial**.
- Se houver recusa por segredo comercial/industrial, a **ANPD pode realizar auditoria**.

## Arts. 21 e 22

- **Art. 21:** dados referentes ao **exercício regular de direitos** pelo titular **não podem ser utilizados em seu prejuízo**.
- **Art. 22:** a **defesa dos interesses e direitos** dos titulares pode ser exercida **em juízo, individual ou coletivamente**.

> 💡 Atenção: a **portabilidade** **não** inclui dados **já anonimizados** pelo controlador.
`,
        fc: [
          ["Prazos do art. 19 (confirmação e acesso)?", "Formato simplificado: imediatamente. Declaração clara e completa: até 15 dias do requerimento."],
          ["Direito do titular em relação a decisões automatizadas (art. 20)?", "Solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses, e obter informações claras sobre critérios e procedimentos (respeitados segredos comercial e industrial); a ANPD pode auditar."],
          ["O que é o direito de oposição (art. 18, §2º)?", "O titular pode opor-se a tratamento realizado com dispensa de consentimento, em caso de descumprimento da lei."],
        ],
        mc: [
          ["Segundo o art. 19 da LGPD, a declaração clara e completa sobre a origem dos dados e os critérios do tratamento deve ser fornecida em até:", ["imediatamente.", "5 dias.", "15 dias.", "30 dias."], 2, "Art. 19, II: até 15 dias contados da data do requerimento.", "FACIL"],
          ["Constitui direito do titular, previsto no art. 18:", ["alterar a legislação aplicável ao controlador.", "obter a portabilidade dos dados a outro fornecedor de serviço ou produto.", "exigir a demissão do encarregado.", "impedir qualquer tratamento de dados pelo Poder Público."], 1, "Art. 18, V.", "FACIL"],
          ["Quanto às decisões tomadas unicamente com base em tratamento automatizado, o titular tem direito a:", ["vetar a decisão sem justificativa.", "solicitar revisão e obter informações sobre os critérios e procedimentos utilizados.", "receber indenização automática.", "acessar o código-fonte, sem exceção."], 1, "Art. 20, caput e §1º, com ressalva de segredos comercial e industrial.", "MEDIO"],
        ],
        ce: [
          ["Os direitos do titular são exercidos mediante requisição ao controlador, a qualquer momento.", "C", "Art. 18, caput."],
          ["O titular pode peticionar à ANPD contra o controlador em relação aos seus dados.", "C", "Art. 18, §1º."],
          ["A confirmação de existência ou o acesso aos dados pessoais serão providenciados, mediante requisição, exclusivamente em até 15 dias, não havendo possibilidade de resposta imediata.", "E", "Há duas formas: formato simplificado, imediatamente; ou declaração completa, em até 15 dias."],
          ["Dados pessoais referentes ao exercício regular de direitos pelo titular não podem ser utilizados em seu prejuízo.", "C", "Art. 21."],
        ],
      },
      {
        titulo: "Tratamento de Dados pelo Poder Público (arts. 23 a 32)",
        slug: "poder-publico",
        resumo: "Poder Público trata dados para finalidade pública, interesse público e competências legais, com transparência e encarregado. Empresas públicas e sociedades de economia mista em concorrência seguem o regime privado; ao operacionalizar políticas públicas, o regime público. Uso compartilhado e transferência a entes privados são restritos. Multa não se aplica a órgãos públicos.",
        conteudo: `# Tratamento de Dados pelo Poder Público (arts. 23 a 32)

## Art. 23 — Regra geral

As **pessoas jurídicas de direito público** (as da Lei de Acesso à Informação, Lei nº 12.527/2011, art. 1º, parágrafo único) devem tratar dados pessoais:

- para o atendimento de sua **finalidade pública**;
- na **persecução do interesse público**;
- com o objetivo de **executar as competências legais** ou cumprir as **atribuições legais** do serviço público.

**Obrigações:**
- informar as **hipóteses** em que realizam o tratamento (**previsão legal, finalidade, procedimentos e práticas**), em **veículos de fácil acesso**, **preferencialmente em seus sítios eletrônicos**;
- **indicar um encarregado** quando realizarem operações de tratamento.

> 💡 O tratamento pelo Poder Público **não exige consentimento** quando fundado em **políticas públicas** ou **obrigação legal**, mas exige **finalidade pública e transparência**.

## Art. 24 — Empresas públicas e sociedades de economia mista

| Situação | Regime |
|---|---|
| Atuam em **regime de concorrência** (art. 173 CF) | **mesmo tratamento das pessoas jurídicas de direito privado** |
| **Operacionalizam políticas públicas** | **mesmo tratamento dos órgãos e entidades do Poder Público** |

## Art. 25 — Interoperabilidade

Os dados devem ser mantidos em **formato interoperável e estruturado** para o **uso compartilhado**, com vistas à execução de políticas públicas, à prestação de serviços públicos, à descentralização da atividade pública e à **disseminação e acesso das informações** pelo público em geral.

## Art. 26 — Uso compartilhado

- Deve atender a **finalidades específicas** de execução de políticas públicas e atribuição legal, **respeitados os princípios** da LGPD.
- É **vedado** ao Poder Público **transferir a entidades privadas** dados pessoais constantes de bases a que tenha acesso, **exceto**:
  1. **execução descentralizada de atividade pública** que exija a transferência (exclusivamente para essa finalidade);
  2. dados **acessíveis publicamente** (Lei de Acesso à Informação);
  3. quando houver **previsão legal** ou a transferência for respaldada em **contratos, convênios** ou instrumentos congêneres;
  4. na hipótese de a transferência dos dados objetivar **exclusivamente** a **prevenção de fraudes e irregularidades**, ou proteger e resguardar a **segurança e a integridade do titular**.

## Art. 27 — Comunicação a entes privados

A **comunicação ou o uso compartilhado** de dados pessoais de pessoa jurídica de direito público **a pessoa de direito privado** depende de **consentimento do titular**, **exceto**: hipóteses de **dispensa de consentimento**; **uso compartilhado informado** nos termos do art. 23, I; e as exceções do art. 26, §1º.

## Arts. 31 e 32 — Infração e relatório de impacto

- **Art. 31:** havendo **infração** por órgão público, a **ANPD poderá enviar informe** com **medidas cabíveis para fazer cessar a violação**.
- **Art. 32:** a ANPD pode **solicitar a agentes do Poder Público** a **publicação de relatórios de impacto** e **sugerir a adoção de padrões e boas práticas**.

## ⚠️ Sanções e Poder Público (art. 52, §3º)

As sanções de **advertência, publicização, bloqueio, eliminação, suspensão e proibição** podem ser aplicadas a órgãos públicos; **as multas (simples e diária) não**.
`,
        fc: [
          ["Como é tratada uma empresa pública que atua em regime de concorrência (art. 24)?", "Recebe o mesmo tratamento das pessoas jurídicas de direito privado. Se operacionalizar políticas públicas, recebe o tratamento dos órgãos públicos."],
          ["Quando o Poder Público pode transferir dados a entidades privadas (art. 26, §1º)?", "Execução descentralizada de atividade pública; dados publicamente acessíveis; previsão legal ou contratos/convênios; prevenção de fraudes e irregularidades ou proteção da segurança e integridade do titular."],
          ["Poder Público está sujeito a multa da LGPD?", "Não. Podem ser aplicadas as demais sanções (advertência, publicização, bloqueio, eliminação, suspensão, proibição), mas não as multas simples e diária (art. 52, §3º)."],
        ],
        mc: [
          ["Segundo a LGPD, o tratamento de dados pessoais pelas pessoas jurídicas de direito público deve ser realizado:", ["exclusivamente com consentimento do titular.", "para atender a finalidade pública, na persecução do interesse público, com o objetivo de executar competências ou atribuições legais.", "apenas quando houver lucro para o Estado.", "sem necessidade de informar as hipóteses ao titular."], 1, "Art. 23, caput.", "FACIL"],
          ["As empresas públicas e sociedades de economia mista que atuam em regime de concorrência:", ["são tratadas como órgãos públicos para todos os fins.", "têm o mesmo tratamento dispensado às pessoas jurídicas de direito privado.", "estão excluídas da LGPD.", "não precisam indicar encarregado em nenhuma hipótese."], 1, "Art. 24, caput.", "MEDIO"],
          ["Assinale a sanção da LGPD que NÃO se aplica aos órgãos e entidades públicos.", ["Advertência.", "Publicização da infração.", "Multa simples.", "Suspensão do banco de dados."], 2, "Art. 52, §3º: multas não se aplicam ao Poder Público.", "DIFICIL"],
        ],
        ce: [
          ["O Poder Público deve indicar um encarregado quando realizar operações de tratamento de dados pessoais.", "C", "Art. 23, III."],
          ["É vedado ao Poder Público transferir a entidades privadas dados pessoais de bases a que tenha acesso, salvo nas hipóteses do art. 26, §1º.", "C", "Regra e exceções do art. 26."],
          ["A multa simples da LGPD pode ser aplicada a órgãos públicos, nos mesmos termos em que é aplicada a empresas privadas.", "E", "Art. 52, §3º exclui as multas para órgãos públicos."],
          ["A ANPD, ante infração cometida por órgão público, pode enviar informe com medidas para fazer cessar a violação.", "C", "Art. 31."],
        ],
      },
      {
        titulo: "Transferência Internacional de Dados (arts. 33 a 36)",
        slug: "transferencia-internacional",
        resumo: "A transferência internacional só é permitida nos casos do art. 33: país com grau de proteção adequado, garantias oferecidas pelo controlador (cláusulas, normas corporativas, selos), cooperação jurídica, proteção da vida, autorização da ANPD, acordos internacionais, políticas públicas, consentimento específico, e bases do art. 7º II, V e VI.",
        conteudo: `# Transferência Internacional de Dados (arts. 33 a 36)

**Transferência internacional de dados** = transferência de dados pessoais para **país estrangeiro** ou **organismo internacional** do qual o País seja membro (art. 5º, XV).

## Art. 33 — Casos em que é permitida

| # | Hipótese |
|---|---|
| **I** | para países ou organismos internacionais com **grau de proteção de dados pessoais adequado** à LGPD |
| **II** | quando o controlador **oferecer e comprovar garantias** de cumprimento, na forma de: **a) cláusulas contratuais específicas** para determinada transferência; **b) cláusulas-padrão contratuais**; **c) normas corporativas globais**; **d) selos, certificados e códigos de conduta** regularmente emitidos |
| **III** | **cooperação jurídica internacional** entre órgãos públicos de inteligência, investigação e persecução, conforme instrumentos do direito internacional |
| **IV** | **proteção da vida ou da incolumidade física** do titular ou de terceiro |
| **V** | quando a **ANPD autorizar** a transferência |
| **VI** | **compromisso assumido em acordo de cooperação internacional** |
| **VII** | **execução de política pública** ou atribuição legal do serviço público (com publicidade, art. 23, I) |
| **VIII** | **consentimento específico e em destaque** do titular, com **informação prévia** sobre o caráter internacional da operação |
| **IX** | necessidade de atender às hipóteses do art. 7º, **II, V e VI** (obrigação legal/regulatória, execução de contrato, exercício regular de direitos) |

## Art. 34 — Avaliação do nível de proteção

Cabe à **ANPD** avaliar o nível de proteção do país ou organismo, considerando: **normas gerais e setoriais** da legislação em vigor no país de destino; **natureza dos dados**; observância dos **princípios** da LGPD e dos direitos do titular; adoção de **medidas de segurança**; existência de **garantias judiciais e institucionais**; e **outras circunstâncias específicas** da transferência.

## Art. 35 — Cláusulas, normas e selos

A **definição do conteúdo** de cláusulas-padrão contratuais, bem como a **verificação** de cláusulas específicas, normas corporativas globais ou selos/certificados/códigos de conduta, será realizada pela **ANPD**. Podem ser requeridas **informações suplementares** e realizadas **diligências**. As **alterações das garantias** devem ser **comunicadas à ANPD** (art. 36).

> 💡 Para a prova: **"quem avalia o nível de proteção?" → ANPD**; **"quem verifica as cláusulas, normas e selos?" → ANPD**; o **controlador** é quem **oferece e comprova** as garantias.
`,
        fc: [
          ["Quais as garantias que o controlador pode oferecer na transferência internacional (art. 33, II)?", "Cláusulas contratuais específicas; cláusulas-padrão contratuais; normas corporativas globais; selos, certificados e códigos de conduta regularmente emitidos."],
          ["Quem avalia o grau de proteção de dados do país de destino?", "A ANPD (art. 34), considerando, entre outros, legislação do país, natureza dos dados, princípios da LGPD, medidas de segurança e garantias judiciais e institucionais."],
          ["Consentimento na transferência internacional?", "Deve ser específico e em destaque, com informação prévia sobre o caráter internacional da operação, com clara distinção de outras finalidades (art. 33, VIII)."],
        ],
        mc: [
          ["A transferência internacional de dados pessoais é permitida, entre outros casos:", ["sempre que o controlador tiver sede no exterior.", "para países ou organismos internacionais com grau de proteção adequado à LGPD.", "somente mediante autorização individual de cada titular.", "apenas para países da América do Sul."], 1, "Art. 33, I.", "FACIL"],
          ["Compete à ANPD, quanto à transferência internacional:", ["transferir diretamente os dados.", "avaliar o nível de proteção de dados do país ou organismo internacional.", "firmar cláusulas contratuais em nome do controlador.", "emitir consentimento pelo titular."], 1, "Art. 34.", "MEDIO"],
          ["Assinale a garantia que NÃO é prevista no art. 33, II, para a transferência internacional.", ["Cláusulas-padrão contratuais.", "Normas corporativas globais.", "Selos, certificados e códigos de conduta.", "Declaração unilateral do operador, sem verificação."], 3, "Art. 33, II: as garantias são cláusulas específicas, cláusulas-padrão, normas corporativas globais e selos/certificados/códigos de conduta.", "MEDIO"],
        ],
        ce: [
          ["A transferência internacional de dados é permitida quando necessária para a cooperação jurídica internacional entre órgãos públicos de inteligência, investigação e persecução.", "C", "Art. 33, III."],
          ["A transferência internacional exige sempre autorização prévia da ANPD, em qualquer hipótese.", "E", "A autorização da ANPD é apenas uma das hipóteses (art. 33, V)."],
          ["As alterações nas garantias apresentadas como suficientes para a transferência internacional devem ser comunicadas à ANPD.", "C", "Art. 36."],
          ["O consentimento para a transferência internacional pode ser genérico e inserido no corpo de outras cláusulas, sem destaque.", "E", "Deve ser específico e em destaque, com informação prévia."],
        ],
      },
    ],
  },
  {
    nome: "Governança, Segurança e Fiscalização",
    slug: "governanca-seguranca-fiscalizacao",
    descricao: "Controlador, operador, encarregado, responsabilidade civil, segurança, incidentes, boas práticas, sanções e ANPD.",
    ordem: 4,
    topicos: [
      {
        titulo: "Controlador, Operador, Encarregado e Responsabilidade (arts. 37 a 45)",
        slug: "agentes-responsabilidade",
        resumo: "Controlador e operador mantêm registro das operações. O operador segue as instruções do controlador. O encarregado é indicado pelo controlador, tem identidade e contato divulgados publicamente e atua como canal de comunicação. Quem causa dano responde; operador e controladores envolvidos podem responder solidariamente; o ônus da prova pode ser invertido.",
        conteudo: `# Controlador, Operador, Encarregado e Responsabilidade (arts. 37 a 45)

## Registro e relatório de impacto

- **Art. 37:** controlador e operador devem **manter registro das operações de tratamento** que realizarem, **especialmente quando baseado no legítimo interesse**.
- **Art. 38:** a **ANPD** pode determinar ao controlador a elaboração de **relatório de impacto à proteção de dados pessoais** (inclusive de **dados sensíveis**), referente às suas operações. O relatório deve conter, no mínimo: **descrição dos tipos de dados coletados**, **metodologia de coleta e de garantia da segurança das informações** e **análise do controlador quanto a medidas, salvaguardas e mecanismos de mitigação de risco**.

## Art. 39 — Instruções do controlador

O **operador** deve realizar o tratamento segundo as **instruções fornecidas pelo controlador**, que verificará a observância das próprias instruções e das normas.

## Art. 41 — Encarregado

- O **controlador** deve **indicar** o encarregado pelo tratamento de dados pessoais.
- A **identidade e as informações de contato** devem ser divulgadas **publicamente, de forma clara e objetiva**, **preferencialmente no sítio eletrônico** do controlador.
- **Atividades do encarregado:**
  1. **aceitar reclamações e comunicações** dos titulares, prestar esclarecimentos e adotar providências;
  2. **receber comunicações da ANPD** e adotar providências;
  3. **orientar** os funcionários e contratados sobre as práticas de proteção de dados;
  4. executar as demais **atribuições** determinadas pelo controlador ou estabelecidas em normas complementares.
- A **ANPD** pode estabelecer **normas complementares** sobre definição e atribuições, inclusive **hipóteses de dispensa** da indicação.

## Responsabilidade e ressarcimento

| Dispositivo | Regra |
|---|---|
| **Art. 42, caput** | o controlador ou operador que, em razão do tratamento, causar **dano patrimonial, moral, individual ou coletivo**, em violação à legislação, é **obrigado a repará-lo** |
| **Art. 42, §1º, I** | o **operador** responde **solidariamente** quando **descumprir a legislação** ou **não seguir as instruções lícitas do controlador** (equipara-se ao controlador) |
| **Art. 42, §1º, II** | os **controladores diretamente envolvidos** no tratamento que causou o dano respondem **solidariamente** |
| **Art. 42, §2º** | o juiz pode **inverter o ônus da prova** a favor do titular quando houver **verossimilhança**, **hipossuficiência** ou **excessiva onerosidade** da prova |
| **Art. 42, §3º** | ações coletivas de reparação podem ser exercidas **coletivamente em juízo** |
| **Art. 42, §4º** | **direito de regresso** de quem reparar o dano contra os demais responsáveis, na medida de sua participação |

## Art. 43 — Excludentes

Os agentes **só não serão responsabilizados** quando provarem:

1. que **não realizaram** o tratamento que lhes é atribuído;
2. que, embora tenham realizado, **não houve violação** à legislação; ou
3. que o dano é decorrente de **culpa exclusiva do titular** ou **de terceiro**.

## Arts. 44 e 45

- **Art. 44:** o tratamento é **irregular** quando **deixar de observar a legislação** ou **não fornecer a segurança** que o titular dele pode esperar (resultado e riscos, modo de realização, técnicas disponíveis à época).
- **Art. 45:** as hipóteses de violação do direito do titular **no âmbito das relações de consumo** permanecem sujeitas às regras de responsabilidade do **Código de Defesa do Consumidor**.
`,
        fc: [
          ["Quem indica o encarregado e onde se divulga sua identidade?", "O controlador indica o encarregado; identidade e contato são divulgados publicamente, de forma clara e objetiva, preferencialmente no sítio eletrônico do controlador (art. 41)."],
          ["Quando o operador responde solidariamente (art. 42, §1º, I)?", "Quando descumprir as obrigações da legislação de proteção de dados ou não seguir as instruções lícitas do controlador (e então se equipara ao controlador)."],
          ["Excludentes de responsabilidade (art. 43)?", "Provar que não realizou o tratamento; que, embora realizado, não houve violação à legislação; ou que o dano decorreu de culpa exclusiva do titular ou de terceiro."],
        ],
        mc: [
          ["O encarregado pelo tratamento de dados pessoais, nos termos da LGPD, é indicado pelo:", ["titular dos dados.", "controlador.", "operador, de forma exclusiva.", "Poder Judiciário."], 1, "Art. 41, caput.", "FACIL"],
          ["Segundo o art. 42, o juiz poderá inverter o ônus da prova a favor do titular quando:", ["o controlador for pessoa jurídica de direito público.", "for verossímil a alegação, houver hipossuficiência para fins de produção de prova ou a produção for excessivamente onerosa.", "o titular for menor de idade.", "a ANPD assim determinar."], 1, "Art. 42, §2º.", "MEDIO"],
          ["Constitui atividade do encarregado:", ["aplicar multas aos controladores.", "aceitar reclamações e comunicações dos titulares e prestar esclarecimentos.", "autorizar transferências internacionais.", "elaborar o regimento da ANPD."], 1, "Art. 41, §2º, I.", "FACIL"],
        ],
        ce: [
          ["O operador deve realizar o tratamento segundo as instruções fornecidas pelo controlador.", "C", "Art. 39."],
          ["O operador que descumprir as instruções lícitas do controlador responde solidariamente pelos danos, equiparando-se ao controlador.", "C", "Art. 42, §1º, I."],
          ["O agente de tratamento é responsabilizado ainda que prove que o dano decorreu de culpa exclusiva do titular dos dados.", "E", "Art. 43, III: é excludente de responsabilidade."],
          ["Nas relações de consumo, a responsabilidade pela violação de direitos do titular fica sujeita às regras do Código de Defesa do Consumidor.", "C", "Art. 45."],
        ],
      },
      {
        titulo: "Segurança, Incidentes e Boas Práticas (arts. 46 a 51)",
        slug: "seguranca-incidentes-governanca",
        resumo: "Agentes devem adotar medidas de segurança técnicas e administrativas desde a concepção. Incidente com risco ou dano relevante deve ser comunicado à ANPD e ao titular em prazo razoável. Programas de governança em privacidade e regras de boas práticas demonstram accountability.",
        conteudo: `# Segurança, Incidentes e Boas Práticas (arts. 46 a 51)

## Art. 46 — Medidas de segurança

Os agentes de tratamento devem adotar **medidas de segurança, técnicas e administrativas**, aptas a proteger os dados pessoais de **acessos não autorizados** e de **situações acidentais ou ilícitas** de **destruição, perda, alteração, comunicação ou difusão**.

- A **ANPD** pode dispor sobre **padrões técnicos mínimos**.
- As medidas devem ser observadas **desde a fase de concepção do produto ou do serviço até a sua execução** (***privacy by design***).

## Art. 47 — Sigilo

Os agentes de tratamento **ou qualquer outra pessoa** que intervenha em uma das fases do tratamento **obriga-se a garantir a segurança** da informação, **mesmo após o término** do tratamento.

## Art. 48 — Incidente de segurança

O **controlador** deve **comunicar à ANPD e ao titular** a ocorrência de incidente de segurança que possa acarretar **risco ou dano relevante aos titulares**.

- A comunicação deve ser feita em **prazo razoável**, conforme definido pela **ANPD**.
- A comunicação deve mencionar, **no mínimo**:
  1. a **descrição da natureza dos dados** pessoais afetados;
  2. as **informações sobre os titulares** envolvidos;
  3. a **indicação das medidas técnicas e de segurança** utilizadas;
  4. os **riscos** relacionados ao incidente;
  5. os **motivos da demora**, no caso de a comunicação não ter sido imediata; e
  6. as **medidas que foram ou que serão adotadas** para reverter ou mitigar os efeitos.
- A ANPD pode determinar a **ampla divulgação** do fato e **providências** para reverter ou mitigar o incidente.

> 💡 A regulamentação da ANPD sobre comunicação de incidentes (**Resolução CD/ANPD nº 15/2024**) fixou, em regra, o prazo de **três dias úteis** para o controlador comunicar o incidente. **Confira no edital se a questão trata da lei ou do regulamento.**

## Art. 49 — Sistemas

Os sistemas utilizados para tratamento devem ser estruturados de forma a atender aos **requisitos de segurança**, aos **padrões de boas práticas e de governança** e aos **princípios gerais** da lei e às demais normas regulamentares.

## Art. 50 — Boas práticas e governança

Controladores e operadores **podem** formular **regras de boas práticas e de governança**, considerando a **natureza, o escopo, a finalidade e a probabilidade e a gravidade dos riscos** e dos benefícios.

**Programa de governança em privacidade** (entre outros requisitos):
- demonstrar o **comprometimento** do controlador em adotar processos e políticas internas;
- ser aplicável a **todo o conjunto de dados pessoais** sob seu controle;
- ser adaptado à **estrutura, escala e volume** das operações e à **sensibilidade** dos dados;
- estabelecer **políticas e salvaguardas adequadas** com base em avaliação sistemática de impactos e riscos;
- ter o objetivo de estabelecer **relação de confiança** com o titular, com **atuação transparente**;
- estar integrado à **estrutura geral de governança**;
- contar com **planos de resposta a incidentes e remediação**;
- ser **atualizado constantemente**, com base em informações obtidas por **monitoramento contínuo e avaliações periódicas**.

O controlador deve **demonstrar a efetividade** do programa quando **solicitado** pela ANPD ou outra entidade responsável por promover o cumprimento de boas práticas.

## Art. 51 — Padrões técnicos

A **ANPD** estimulará a adoção de **padrões técnicos** que facilitem o **controle pelos titulares** dos seus dados pessoais.
`,
        fc: [
          ["O que a comunicação de incidente de segurança deve conter (art. 48, §1º)?", "Descrição da natureza dos dados afetados; informações sobre os titulares; medidas técnicas e de segurança; riscos; motivos da demora (se não imediata); medidas adotadas ou a adotar para reverter ou mitigar."],
          ["Quando o incidente deve ser comunicado?", "Se puder acarretar risco ou dano relevante aos titulares: comunicação à ANPD e ao titular, em prazo razoável definido pela ANPD."],
          ["O que é o programa de governança em privacidade (art. 50, §2º)?", "Conjunto de processos e políticas internas, adaptado à estrutura e aos riscos do controlador, com avaliação de impactos, transparência, planos de resposta a incidentes e atualização constante, cuja efetividade o controlador deve poder demonstrar."],
        ],
        mc: [
          ["O incidente de segurança que possa acarretar risco ou dano relevante aos titulares deve ser comunicado:", ["somente à ANPD.", "à ANPD e ao titular.", "apenas ao encarregado.", "ao Ministério Público, exclusivamente."], 1, "Art. 48, caput.", "FACIL"],
          ["As medidas de segurança devem ser observadas, nos termos da LGPD:", ["apenas após a ocorrência de incidente.", "desde a fase de concepção do produto ou do serviço até a sua execução.", "somente quando houver tratamento de dados sensíveis.", "unicamente por órgãos públicos."], 1, "Art. 46, §2º (privacy by design).", "MEDIO"],
          ["A obrigação de garantir a segurança da informação prevista na LGPD:", ["extingue-se com o término do tratamento.", "alcança qualquer pessoa que intervenha no tratamento, mesmo após o término deste.", "aplica-se apenas ao controlador.", "é facultativa."], 1, "Art. 47.", "MEDIO"],
        ],
        ce: [
          ["O controlador deve comunicar à ANPD e ao titular a ocorrência de incidente de segurança que possa acarretar risco ou dano relevante aos titulares.", "C", "Art. 48, caput."],
          ["A formulação de regras de boas práticas e de governança é obrigatória para todos os controladores e operadores.", "E", "O art. 50 usa ‘poderão’: é faculdade."],
          ["A comunicação de incidente deve mencionar os motivos da demora, no caso de a comunicação não ter sido imediata.", "C", "Art. 48, §1º, V."],
          ["Compete à ANPD estimular padrões técnicos que facilitem o controle, pelos titulares, de seus dados pessoais.", "C", "Art. 51."],
        ],
      },
      {
        titulo: "Fiscalização e Sanções Administrativas (arts. 52 a 54)",
        slug: "fiscalizacao-sancoes",
        resumo: "Sanções: advertência, multa simples (até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração), multa diária, publicização, bloqueio, eliminação, suspensão do banco de dados (até 6 meses, prorrogável), suspensão da atividade (até 6 meses, prorrogável) e proibição. Somente a ANPD aplica; a multa não se aplica a órgãos públicos.",
        conteudo: `# Fiscalização e Sanções Administrativas (arts. 52 a 54)

## Art. 52 — As sanções (aplicáveis pela ANPD)

| Ordem | Sanção | Detalhe |
|---|---|---|
| **I** | **Advertência** | com **indicação de prazo** para adoção de medidas corretivas |
| **II** | **Multa simples** | **até 2% do faturamento** da pessoa jurídica de direito privado, grupo ou conglomerado **no Brasil**, no **último exercício**, **excluídos os tributos**, **limitada, no total, a R$ 50.000.000,00 por infração** |
| **III** | **Multa diária** | observado o **limite total** do inciso II |
| **IV** | **Publicização da infração** | após **devidamente apurada e confirmada** a ocorrência |
| **V** | **Bloqueio** dos dados pessoais | **até a regularização** |
| **VI** | **Eliminação** dos dados pessoais | a que se refere a infração |
| **X** | **Suspensão parcial do funcionamento do banco de dados** | período **máximo de 6 meses**, **prorrogável** por igual período |
| **XI** | **Suspensão do exercício da atividade de tratamento** | período **máximo de 6 meses**, **prorrogável** por igual período |
| **XII** | **Proibição parcial ou total** do exercício de atividades relacionadas a tratamento de dados | |

> 💡 Os incisos **VII, VIII e IX** foram **vetados** — por isso a numeração salta de VI para X.

## Regras de aplicação

- Sanções aplicadas **após procedimento administrativo** que possibilite a **ampla defesa**, de forma **gradativa, isolada ou cumulativa**, conforme o caso concreto.
- **Parâmetros e critérios:** **gravidade e natureza** das infrações e dos direitos afetados; **boa-fé** do infrator; **vantagem auferida ou pretendida**; **condição econômica**; **reincidência**; **grau do dano**; **cooperação**; adoção reiterada e demonstrada de **mecanismos e procedimentos internos** capazes de minimizar o dano; adoção de **política de boas práticas e governança**; pronta **adoção de medidas corretivas**; **proporcionalidade** entre a gravidade da falta e a intensidade da sanção.
- As sanções **não substituem** a aplicação de outras sanções administrativas, civis ou penais (inclusive do **CDC** e de legislação específica).
- **Vazamentos individuais ou acessos não autorizados:** podem ser objeto de **conciliação direta** entre controlador e titular.
- As sanções de **suspensão** (X e XI) e de **proibição** (XII) só são aplicadas **depois de já ter sido imposta ao menos uma** das sanções dos incisos **II, III, IV, V e VI** para o **mesmo caso concreto**; e, se o controlador estiver sujeito a **outros órgãos com competência sancionatória**, esses devem ser **ouvidos** antes.
- O **produto da arrecadação** das multas é destinado ao **Fundo de Defesa de Direitos Difusos**.

## Art. 52, §3º — Poder Público

As sanções de **advertência, publicização, bloqueio, eliminação, suspensão e proibição** (incisos I, IV, V, VI, X, XI e XII) **podem ser aplicadas a entidades e órgãos públicos**, sem prejuízo da legislação específica (Estatuto dos Servidores, LAI e Lei de Improbidade). **As multas (II e III) não se aplicam.**

## Arts. 53 e 54

- **Art. 53:** a **ANPD** definirá, por **regulamento próprio**, as **metodologias** para o cálculo do valor-base das multas, após **consulta pública** e **publicação prévia**.
- **Art. 54:** o valor da **multa diária** deve observar a **gravidade da falta** e a **extensão do dano**, e ser **fundamentado**, com **intimação** que descreva a **obrigação imposta**, o **prazo razoável** e o **valor** da multa.

> ⚠️ **Vigência:** as sanções dos arts. 52 a 54 só entraram em vigor em **1º de agosto de 2021**.
`,
        fc: [
          ["Limite da multa simples da LGPD?", "Até 2% do faturamento da pessoa jurídica de direito privado, grupo ou conglomerado no Brasil no último exercício, excluídos os tributos, limitada a R$ 50 milhões por infração."],
          ["Prazo máximo das suspensões (banco de dados e atividade de tratamento)?", "6 meses, prorrogável por igual período."],
          ["Quais sanções podem ser aplicadas a órgãos públicos?", "Todas, exceto multa simples e multa diária: advertência, publicização, bloqueio, eliminação, suspensão do banco de dados, suspensão da atividade de tratamento e proibição."],
        ],
        mc: [
          ["A multa simples prevista na LGPD é de até:", ["5% do faturamento bruto global, sem limite.", "2% do faturamento da pessoa jurídica no Brasil no último exercício, limitada a R$ 50 milhões por infração.", "R$ 5 milhões por titular.", "10% do patrimônio líquido."], 1, "Art. 52, II.", "MEDIO"],
          ["A suspensão do exercício da atividade de tratamento de dados, como sanção, tem prazo máximo de:", ["30 dias.", "3 meses, não prorrogável.", "6 meses, prorrogável por igual período.", "2 anos."], 2, "Art. 52, XI.", "MEDIO"],
          ["Quanto à aplicação das sanções da LGPD, é correto afirmar que:", ["substituem as sanções civis e penais.", "podem ser aplicadas de forma gradativa, isolada ou cumulativa, após procedimento administrativo com ampla defesa.", "dispensam procedimento administrativo.", "aplicam-se apenas a pessoas jurídicas de direito público."], 1, "Art. 52, §1º.", "MEDIO"],
        ],
        ce: [
          ["A multa simples da LGPD tem como base o faturamento da pessoa jurídica, grupo ou conglomerado no Brasil, no último exercício, excluídos os tributos.", "C", "Art. 52, II."],
          ["As sanções da LGPD, uma vez aplicadas, afastam a incidência de outras sanções administrativas, civis ou penais, inclusive as do Código de Defesa do Consumidor.", "E", "Art. 52, §2º: não as substituem."],
          ["Vazamentos individuais ou acessos não autorizados podem ser objeto de conciliação direta entre controlador e titular.", "C", "Art. 52, §7º."],
          ["A multa diária pode ser aplicada aos órgãos públicos, observado o limite total de R$ 50 milhões.", "E", "Art. 52, §3º exclui as multas do Poder Público."],
        ],
      },
      {
        titulo: "ANPD e Conselho Nacional (arts. 55-A a 59)",
        slug: "anpd-conselho-nacional",
        resumo: "A ANPD tem autonomia técnica e decisória, é autarquia de natureza especial desde 2022 e é composta por Conselho Diretor (5 diretores, mandato de 4 anos), Conselho Nacional, Corregedoria, Ouvidoria, Procuradoria e unidades. A aplicação de sanções é competência exclusiva da ANPD (art. 55-K). O Conselho Nacional tem 23 representantes.",
        conteudo: `# ANPD e Conselho Nacional (arts. 55-A a 59)

## Natureza e autonomia

- **Art. 55-A:** a ANPD foi criada pela **Lei nº 13.853/2019** como órgão da administração pública federal, integrante da Presidência da República, com **natureza jurídica transitória**. Desde a **Lei nº 14.460/2022**, é **autarquia de natureza especial** (vinculada ao Ministério da Justiça e Segurança Pública).
- **Art. 55-B:** é assegurada **autonomia técnica e decisória** à ANPD.

## Art. 55-C — Estrutura

I — **Conselho Diretor**, órgão máximo de direção;
II — **Conselho Nacional de Proteção de Dados Pessoais e da Privacidade**;
III — **Corregedoria**;
IV — **Ouvidoria**;
V — **órgão de assessoramento jurídico próprio (Procuradoria)**; e
VI — **unidades administrativas e especializadas** necessárias à aplicação da lei.

## Conselho Diretor (art. 55-D)

- Composto por **5 diretores**, incluído o **Diretor-Presidente**.
- Escolhidos pelo **Presidente da República** e por ele nomeados, **após aprovação pelo Senado Federal**.
- **Mandato de 4 anos.**
- **Art. 55-E:** perda do cargo apenas por **renúncia, condenação judicial transitada em julgado ou pena de demissão** decorrente de processo administrativo disciplinar.
- **Art. 55-F:** aplica-se aos diretores o **regime de quarentena** pós-exercício do cargo.

## Competências (art. 55-J — destaques)

- **Zelar** pela proteção dos dados pessoais, nos termos da legislação, e pelo **segredo comercial e industrial**.
- **Elaborar diretrizes** para a **Política Nacional de Proteção de Dados Pessoais e da Privacidade**.
- **Fiscalizar e aplicar sanções**, em caso de tratamento em descumprimento da lei, mediante processo administrativo.
- **Apreciar petições** de titular contra controlador.
- **Promover** o conhecimento das normas e das políticas públicas, e das **medidas de segurança**.
- Estimular a adoção de **padrões** para serviços e produtos; **cooperação** com autoridades de outros países.
- Editar **regulamentos e procedimentos** sobre proteção de dados e **relatórios de impacto**, ouvindo as autoridades e a sociedade (**consulta e audiência públicas**).
- Realizar **auditorias**, e **firmar compromissos** com agentes de tratamento.
- Editar normas simplificadas para **microempresas e startups**.
- Deverá observar a **exigência de mínima intervenção** em relação aos agentes privados.

## ⭐ Art. 55-K — Competência exclusiva

A **aplicação das sanções** previstas na LGPD **compete exclusivamente à ANPD**, e suas competências **prevalecerão**, no que se refere à proteção de dados pessoais, **sobre as competências correlatas de outras entidades ou órgãos da administração pública**. A ANPD **articulará sua atuação** com outros órgãos (por exemplo, Senacon, em matéria de consumo).

## Conselho Nacional de Proteção de Dados Pessoais e da Privacidade (arts. 58-A e 58-B)

- Composto por **23 representantes**, titulares e suplentes, do **Poder Executivo federal**, do **Senado**, da **Câmara**, do **CNJ**, do **CNMP**, do **Comitê Gestor da Internet (CGI.br)**, de **entidades da sociedade civil**, de **instituições científicas, tecnológicas e de inovação**, de **confederações sindicais** representativas das categorias econômicas do setor produtivo, de **entidades representativas do setor empresarial** e **do setor laboral**.
- **Competências (art. 58-B):** propor **diretrizes e subsídios** para a Política Nacional; elaborar **relatórios anuais** de avaliação; sugerir **ações** a serem realizadas pela ANPD; elaborar **estudos e realizar debates e audiências públicas**; e **disseminar** o conhecimento.
`,
        fc: [
          ["Composição do Conselho Diretor da ANPD?", "5 diretores, incluído o Diretor-Presidente, escolhidos e nomeados pelo Presidente da República após aprovação do Senado, com mandato de 4 anos."],
          ["Quem aplica as sanções da LGPD?", "Exclusivamente a ANPD (art. 55-K), cujas competências prevalecem sobre as de outros órgãos no que se refere à proteção de dados pessoais."],
          ["Quantos membros tem o Conselho Nacional de Proteção de Dados Pessoais e da Privacidade?", "23 representantes, titulares e suplentes (art. 58-A)."],
        ],
        mc: [
          ["O Conselho Diretor da ANPD é composto por:", ["3 diretores, com mandato de 2 anos.", "5 diretores, incluído o Diretor-Presidente, com mandato de 4 anos.", "7 diretores, com mandato de 6 anos.", "5 diretores, nomeados livremente, sem aprovação do Senado."], 1, "Art. 55-D.", "MEDIO"],
          ["A aplicação das sanções previstas na LGPD compete:", ["ao Poder Judiciário, exclusivamente.", "exclusivamente à ANPD.", "ao encarregado.", "a qualquer órgão de defesa do consumidor, independentemente da ANPD."], 1, "Art. 55-K.", "FACIL"],
          ["A ANPD é, atualmente, uma:", ["empresa pública.", "autarquia de natureza especial.", "fundação privada.", "sociedade de economia mista."], 1, "Lei nº 14.460/2022 a transformou em autarquia de natureza especial.", "MEDIO"],
        ],
        ce: [
          ["É assegurada à ANPD autonomia técnica e decisória.", "C", "Art. 55-B."],
          ["Os diretores da ANPD são escolhidos pelo Presidente da República e nomeados após aprovação do Senado Federal.", "C", "Art. 55-D, §1º."],
          ["O Conselho Nacional de Proteção de Dados Pessoais e da Privacidade tem poder para aplicar sanções administrativas aos agentes de tratamento.", "E", "A aplicação de sanções é competência exclusiva da ANPD."],
          ["A competência da ANPD prevalece, no que se refere à proteção de dados pessoais, sobre as competências correlatas de outras entidades da administração pública.", "C", "Art. 55-K."],
        ],
      },
      {
        titulo: "Disposições Finais, Vigência e Quadro de Números (arts. 60 a 65)",
        slug: "disposicoes-finais-vigencia",
        resumo: "A LGPD alterou o Marco Civil da Internet, prevê notificação de empresas estrangeiras na pessoa de seu representante no Brasil e não exclui outros direitos. Entrou em vigor de forma escalonada: ANPD em 28/12/2018, sanções em 1º/8/2021 e os demais artigos em 18/9/2020. Este tópico traz um quadro com os números mais cobrados.",
        conteudo: `# Disposições Finais, Vigência e Quadro de Números

## Disposições finais (arts. 60 a 65)

| Artigo | Conteúdo |
|---|---|
| **60** | altera o **Marco Civil da Internet** (Lei nº 12.965/2014): direito à **exclusão definitiva dos dados** fornecidos a aplicação de internet ao término da relação (art. 7º, X) e guarda de registros **sem dados excessivos** (art. 16) |
| **61** | a **empresa estrangeira** é notificada e intimada na pessoa do **agente ou representante** ou responsável por sua filial, agência, sucursal, estabelecimento ou escritório **instalado no Brasil** |
| **62** | a **ANPD** e o **INEP** editarão regulamentos específicos para o acesso a **dados tratados pela União** para cumprimento da Lei de Diretrizes e Bases da Educação (dados educacionais) |
| **63** | a **ANPD** estabelecerá normas sobre a **adequação progressiva** de bancos de dados constituídos até a data de entrada em vigor da lei |
| **64** | os direitos e princípios da lei **não excluem outros** decorrentes do ordenamento jurídico (inclusive **tratados internacionais**) |
| **65** | **vigência** |

## Vigência (escalonada)

| O quê | Quando |
|---|---|
| **Lei nº 13.709/2018** | publicada em **14/08/2018** |
| Artigos sobre a **ANPD e o Conselho Nacional** (55-A a 55-L e 58-A, 58-B) | **28/12/2018** |
| **Sanções administrativas** (arts. 52, 53 e 54) | **1º/08/2021** |
| **Demais artigos** | **18/09/2020** |

## 🗒️ Quadro de números que mais caem

| Tema | Número |
|---|---|
| Princípios (art. 6º) | **10** |
| Fundamentos (art. 2º) | **7** |
| Bases legais (art. 7º) | **10** |
| Direitos do titular (art. 18) | **9** incisos |
| Confirmação/acesso — formato simplificado | **imediato** |
| Confirmação/acesso — declaração completa | **até 15 dias** |
| Multa simples | **até 2% do faturamento no Brasil, máx. R$ 50 milhões/infração** |
| Suspensão (banco de dados / atividade) | **até 6 meses**, prorrogável por igual período |
| Conselho Diretor da ANPD | **5** diretores · mandato de **4 anos** |
| Conselho Nacional | **23** representantes |
| Consentimento de criança | **ao menos um dos pais** ou responsável legal |

## Dicas finais de prova

1. **Consentimento ≠ única base legal.** São dez.
2. **Dados sensíveis:** sem legítimo interesse e sem proteção do crédito.
3. **Poder Público:** sem multa; com encarregado, transparência e finalidade pública.
4. **ANPD:** única competente para aplicar as sanções (art. 55-K).
5. **Operador segue as instruções do controlador**; se desviar, responde solidariamente.
6. **Encarregado não é agente de tratamento.**
7. **Dado anonimizado** só é pessoal se o processo for **reversível com esforços razoáveis**.
`,
        fc: [
          ["Vigência escalonada da LGPD?", "ANPD e Conselho Nacional: 28/12/2018. Demais artigos: 18/9/2020. Sanções administrativas (arts. 52 a 54): 1º/8/2021."],
          ["Como é notificada a empresa estrangeira (art. 61)?", "Na pessoa do agente, representante ou responsável por sua filial, agência, sucursal, estabelecimento ou escritório instalado no Brasil, independentemente de procuração."],
          ["Cite cinco números da LGPD que mais caem.", "10 princípios; 10 bases legais; 15 dias para declaração completa; multa de até 2% limitada a R$ 50 milhões por infração; Conselho Diretor com 5 diretores e mandato de 4 anos; Conselho Nacional com 23 representantes."],
        ],
        mc: [
          ["As sanções administrativas da LGPD (arts. 52 a 54) passaram a ser aplicáveis a partir de:", ["14 de agosto de 2018.", "28 de dezembro de 2018.", "18 de setembro de 2020.", "1º de agosto de 2021."], 3, "Art. 65, I-A.", "DIFICIL"],
          ["A LGPD alterou, entre outras, a seguinte lei:", ["a Lei de Licitações.", "o Marco Civil da Internet.", "o Código Penal.", "a Lei de Improbidade."], 1, "Art. 60 altera a Lei nº 12.965/2014.", "FACIL"],
          ["Quanto à empresa estrangeira, a LGPD prevê que ela será notificada e intimada dos atos processuais:", ["por edital, em qualquer caso.", "na pessoa do agente ou representante de sua filial, agência, sucursal, estabelecimento ou escritório instalado no Brasil.", "somente mediante carta rogatória.", "apenas por intermédio da ANPD no exterior."], 1, "Art. 61.", "MEDIO"],
        ],
        ce: [
          ["Os direitos e princípios da LGPD não excluem outros decorrentes do ordenamento jurídico pátrio relacionados à matéria.", "C", "Art. 64."],
          ["A LGPD entrou em vigor integralmente em uma única data, 18 de setembro de 2020.", "E", "A vigência foi escalonada (ANPD em 2018, demais em 2020, sanções em 2021)."],
          ["A LGPD prevê que a ANPD estabelecerá normas sobre a adequação progressiva de bancos de dados constituídos até a data de entrada em vigor da lei.", "C", "Art. 63."],
          ["Dado anonimizado, ainda que o processo possa ser revertido com esforços razoáveis, jamais será considerado dado pessoal.", "E", "Art. 12: será considerado dado pessoal se a anonimização puder ser revertida."],
        ],
      },
    ],
  },
];
