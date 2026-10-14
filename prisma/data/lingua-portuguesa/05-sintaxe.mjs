// Bloco 5 — Sintaxe (cap. 17–26 e 31 da gramática-base)
export default {
  nome: "Sintaxe",
  slug: "sintaxe",
  descricao: "Termos da oração, período simples e composto, coordenação, subordinação, orações reduzidas e as palavras QUE, SE e COMO.",
  ordem: 5,
  topicos: [
    {
      titulo: "Frase, Oração, Período e Termos Essenciais",
      slug: "termos-essenciais",
      resumo: "Frase tem sentido completo; oração tem verbo; período é uma ou mais orações. Termos essenciais: sujeito (simples, composto, oculto, indeterminado, inexistente) e predicado (verbal, nominal, verbo-nominal). Identifique o verbo e depois o sujeito.",
      conteudo: `# Frase, Oração, Período e Termos Essenciais

## Frase × oração × período

- **Frase:** enunciado com sentido completo, com ou sem verbo (*Silêncio! · Que calor!*).
- **Oração:** enunciado com **verbo** (ou locução verbal).
- **Período:** **simples** (uma oração) ou **composto** (duas ou mais).

> 💡 Cada **verbo ou locução verbal** = uma oração.

## Sujeito

Pergunte ao verbo: **quem / o que** + verbo?

| Tipo | Característica | Exemplo |
|---|---|---|
| **Simples** | um só núcleo | **O candidato** estudou. |
| **Composto** | mais de um núcleo | **Pedro e Maria** estudam. |
| **Desinencial (oculto)** | identificado pela desinência verbal | Estudamos muito. (nós) |
| **Indeterminado** | existe, mas não se identifica | **Bateram** à porta. · **Precisa-se** de professores. |
| **Oração sem sujeito** | **não há** sujeito | **Choveu** muito. · **Há** problemas. · **Faz** dois anos. · **É** tarde. |

### Sujeito indeterminado (2 formas)

1. Verbo na **3ª pessoa do plural**, sem referente: *Falaram mal de você.*
2. Verbo **intransitivo, transitivo indireto ou de ligação + se**, na **3ª pessoa do singular**: *Vive-se bem aqui. · Precisa-se de funcionários. · Fala-se de política.*

### Oração sem sujeito (verbos impessoais)

- **Fenômenos da natureza:** *chover, ventar, amanhecer*.
- **Haver** no sentido de **existir** ou **tempo decorrido**: *Há muitas dúvidas. · Há dois anos.*
- **Fazer** (tempo ou clima): *Faz dez anos. · Fazia frio.*
- **Ser** (tempo, hora, distância): *É tarde. · São duas horas.*

## Predicado

| Tipo | Núcleo | Exemplo |
|---|---|---|
| **Verbal** | verbo significativo | O aluno **estudou**. |
| **Nominal** | **predicativo do sujeito** (verbo de ligação) | O aluno **está cansado**. |
| **Verbo-nominal** | verbo significativo **+** predicativo | O aluno **chegou cansado**. |

**Verbos de ligação:** *ser, estar, ficar, permanecer, continuar, parecer, tornar-se, andar, viver* (quando indicam estado).

## Transitividade

| Tipo | Complemento | Exemplo |
|---|---|---|
| **VI** | nenhum | A criança **chorou**. |
| **VTD** | objeto direto (sem preposição) | Li **o livro**. |
| **VTI** | objeto indireto (com preposição) | Obedeço **ao chefe**. |
| **VTDI** | OD + OI | Entreguei **o livro ao aluno**. |
| **VL** | predicativo | Ele **é** médico. |

> ⚠️ O verbo pode mudar de transitividade conforme o contexto: *Ela **fez** o bolo (VTD). · **Faz** frio (impessoal).*
`,
      fc: [
        ["Duas formas de sujeito indeterminado?", "(1) Verbo na 3ª pessoa do plural sem referente (Bateram à porta). (2) VI, VTI ou VL + se, na 3ª do singular (Precisa-se de professores)."],
        ["Verbos impessoais (oração sem sujeito)?", "Fenômenos da natureza (chover), haver = existir/tempo decorrido, fazer (tempo/clima) e ser (tempo, hora, distância)."],
        ["Predicado verbo-nominal?", "Tem dois núcleos: verbo significativo + predicativo (O aluno chegou cansado)."],
      ],
      mc: [
        ["Em ‘Precisa-se de professores’, o sujeito é:", ["simples.", "composto.", "indeterminado.", "inexistente."], 2, "VTI + se na 3ª do singular: sujeito indeterminado (o ‘se’ é índice de indeterminação).", "MEDIO"],
        ["Assinale a oração sem sujeito.", ["Os alunos chegaram cedo.", "Há muitos candidatos inscritos.", "Bateram à porta.", "Vive-se bem aqui."], 1, "Haver = existir é impessoal: oração sem sujeito.", "MEDIO"],
        ["‘O diretor chegou cansado’ apresenta predicado:", ["verbal.", "nominal.", "verbo-nominal.", "de ligação."], 2, "Verbo significativo (chegou) + predicativo (cansado).", "MEDIO"],
      ],
      ce: [
        ["Em ‘Faz dois anos que ele viajou’, o verbo ‘fazer’ é impessoal e a oração é sem sujeito.", "C", "Fazer indicando tempo decorrido é impessoal."],
        ["Em ‘Fala-se muito de política aqui’, o sujeito é indeterminado e o verbo permanece no singular.", "C", "VTI + se: sujeito indeterminado."],
        ["O predicado nominal tem como núcleo o verbo de ligação.", "E", "O núcleo é o predicativo do sujeito; o verbo de ligação apenas liga."],
        ["‘Choveu bastante ontem’ é oração sem sujeito.", "C", "Verbo que indica fenômeno da natureza."],
      ],
    },
    {
      titulo: "Termos Integrantes e Acessórios",
      slug: "termos-integrantes-acessorios",
      resumo: "Integrantes: objeto direto, objeto indireto, complemento nominal e agente da passiva. Acessórios: adjunto adnominal, adjunto adverbial, aposto e vocativo. A diferença entre complemento nominal e adjunto adnominal é a ‘menina dos olhos’ das bancas.",
      conteudo: `# Termos Integrantes e Acessórios

## Termos integrantes (completam o sentido)

| Termo | Completa | Exemplo |
|---|---|---|
| **Objeto direto (OD)** | verbo, **sem** preposição | Li **o relatório**. |
| **Objeto indireto (OI)** | verbo, **com** preposição | Obedeço **ao regulamento**. |
| **Complemento nominal (CN)** | **substantivo abstrato, adjetivo ou advérbio** | Tenho medo **de barata**. |
| **Agente da passiva** | verbo na voz passiva | O texto foi lido **pelo aluno**. |

### Pronomes oblíquos como objeto

*Vi-**o*** (OD), *Obedeço-**lhe*** (OI), *Dei-**lhe** o livro* (OI).

## Termos acessórios (não são indispensáveis)

| Termo | Função | Exemplo |
|---|---|---|
| **Adjunto adnominal (AA)** | caracteriza/determina o **substantivo** | **Aquele** aluno **dedicado** passou. |
| **Adjunto adverbial** | circunstância do verbo, adjetivo ou advérbio | Estudou **ontem**, **com afinco**. |
| **Aposto** | explica/resume outro termo (entre vírgulas) | Brasília, **a capital**, é planejada. |
| **Vocativo** | chama/interpela, isolado por vírgula | **Pedro**, venha cá. |

## ⭐ Complemento nominal × adjunto adnominal

Ambos podem ser introduzidos por **preposição** e ligados a um **substantivo**. Distinguem-se assim:

| | Complemento nominal | Adjunto adnominal |
|---|---|---|
| Liga-se a | substantivo **abstrato** (derivado de verbo/ação) | substantivo qualquer |
| Papel do termo | **paciente** (recebe a ação) | **agente** ou posse/qualidade |
| Exemplo | A **construção** da ponte · **medo** de barata · **respeito** à lei | **Casa** de Pedro · **resposta** do aluno (agente) · chuva de verão |

**Dica:** se o termo **pratica** a ação ou é **dono** → adjunto adnominal; se **sofre** a ação → complemento nominal. *"O **amor** da mãe"* é ambíguo: da mãe (agente = AA) ou *à* mãe (paciente = CN).

## Aposto × vocativo × predicativo

- **Aposto:** explica um termo (*Machado, **o Bruxo do Cosme Velho**, ...*).
- **Vocativo:** chama o interlocutor; **não** tem relação sintática com o verbo.
- **Predicativo do objeto:** *Considero-o **honesto**.* (qualifica o objeto, com verbo transitivo).
`,
      fc: [
        ["Complemento nominal × adjunto adnominal?", "Complemento nominal completa substantivo abstrato/adjetivo/advérbio e tem sentido de paciente (medo de barata). Adjunto adnominal caracteriza/determina o substantivo (agente, posse, qualidade: casa de Pedro, resposta do aluno)."],
        ["O que é vocativo?", "Termo que chama ou interpela o interlocutor, isolado por vírgula e sem relação sintática com o verbo: ‘Pedro, venha cá’."],
        ["Qual a diferença entre OD e OI?", "OD completa o verbo sem preposição obrigatória; OI completa o verbo com preposição obrigatória."],
      ],
      mc: [
        ["Em ‘Tenho medo de barata’, a expressão ‘de barata’ exerce a função de:", ["adjunto adnominal.", "complemento nominal.", "objeto indireto.", "agente da passiva."], 1, "‘Medo’ é substantivo abstrato e ‘barata’ é o objeto do medo (paciente): complemento nominal.", "MEDIO"],
        ["Em ‘A casa de Pedro é grande’, ‘de Pedro’ é:", ["complemento nominal.", "objeto indireto.", "adjunto adnominal.", "adjunto adverbial."], 2, "Indica posse (agente/dono): adjunto adnominal.", "MEDIO"],
        ["Em ‘Brasília, a capital do país, é planejada’, o termo ‘a capital do país’ é:", ["aposto.", "vocativo.", "predicativo.", "adjunto adverbial."], 0, "Explica ‘Brasília’ e vem isolado por vírgulas: aposto.", "FACIL"],
      ],
      ce: [
        ["Em ‘O respeito às leis é essencial’, a expressão ‘às leis’ funciona como complemento nominal.", "C", "‘Respeito’ é nome abstrato e ‘as leis’ recebem o respeito: complemento nominal."],
        ["O vocativo mantém relação sintática com o verbo da oração.", "E", "O vocativo é independente do verbo."],
        ["Em ‘Entreguei o livro ao aluno’, ‘ao aluno’ é objeto indireto.", "C", "VTDI: OD (o livro) + OI (ao aluno)."],
        ["O adjunto adverbial só pode modificar verbos.", "E", "Também modifica adjetivos e outros advérbios."],
      ],
    },
    {
      titulo: "Orações Coordenadas",
      slug: "oracoes-coordenadas",
      resumo: "Coordenadas são independentes sintaticamente. Assindéticas não têm conjunção; sindéticas têm (aditivas, adversativas, alternativas, conclusivas, explicativas). Hoje as bancas cobram principalmente as relações semânticas de coordenação.",
      conteudo: `# Orações Coordenadas

## Coordenação × subordinação

- **Coordenadas:** orações **independentes** entre si (mesmo nível).
- **Subordinadas:** uma oração **depende** da outra (exerce função sintática nela).

Período composto por **coordenação**: *Estudou muito **e** foi aprovado.*

## Classificação

| Tipo | Conjunção | Exemplo |
|---|---|---|
| **Assindética** | **sem** conjunção (justaposta, vírgula ou ponto e vírgula) | Cheguei, vi, venci. |
| **Sindética aditiva** | e, nem, não só… mas também | Estudou e passou. · Não estuda **nem** trabalha. |
| **Sindética adversativa** | mas, porém, contudo, todavia, entretanto, no entanto | Estudou, **mas** não passou. |
| **Sindética alternativa** | ou, ora… ora, quer… quer, seja… seja | Ou estuda ou trabalha. |
| **Sindética conclusiva** | logo, portanto, por isso, por conseguinte, pois (posposto) | Estudou; **portanto**, passou. |
| **Sindética explicativa** | que, porque, pois (anteposto) | Corra, **que** está tarde. |

## Valores semânticos (o que a banca cobra)

- **Aditiva:** soma de informações — também pode ter sentido de **consequência** ou **oposição** em contexto (*"Trabalha e não ganha"* = adversativa).
- **Adversativa:** oposição. Mas pode ser **mobile** (*porém, contudo, todavia, no entanto* podem ficar no meio: *"Não passou, entretanto, desistiu"*).
- **Alternativa:** exclusão (*ou…ou*) ou alternância (*ora…ora*).
- **Conclusiva × explicativa:** a conclusiva traz a **consequência**; a explicativa traz a **razão** da oração anterior.

> 💡 **Teste:** na explicativa, a primeira oração costuma ter **verbo no imperativo ou verbo de ordem** (*Corra, pois…*). Na conclusiva, a segunda oração é a **consequência** (*Está tarde; devemos, pois, partir*).

## Pontuação

- Orações coordenadas **sindéticas** (exceto as aditivas com **e** de mesmo sujeito) vêm **separadas por vírgula**: *Estudou, mas não passou.*
- Antes de **e** com sujeitos diferentes: vírgula é recomendável (*A banca elaborou a prova, e os candidatos a resolveram*).
`,
      fc: [
        ["Tipos de orações coordenadas sindéticas?", "Aditivas, adversativas, alternativas, conclusivas e explicativas."],
        ["Conclusiva × explicativa?", "Conclusiva traz a consequência do que foi dito antes (portanto, logo); explicativa traz a razão do que foi dito (que, porque, pois antes do verbo)."],
        ["Oração assindética?", "Oração coordenada sem conjunção, ligada por vírgula, ponto e vírgula ou dois-pontos: ‘Cheguei, vi, venci’."],
      ],
      mc: [
        ["‘Estudou bastante, porém não foi aprovado.’ A segunda oração é coordenada sindética:", ["aditiva.", "adversativa.", "conclusiva.", "explicativa."], 1, "‘Porém’ = oposição.", "FACIL"],
        ["‘Está tarde; devemos, pois, partir.’ A oração ‘devemos, pois, partir’ é:", ["explicativa.", "adversativa.", "alternativa.", "conclusiva."], 3, "‘Pois’ posposto ao verbo, entre vírgulas, é conclusivo.", "MEDIO"],
        ["‘Corra, que o ônibus já vai sair.’ A segunda oração é coordenada:", ["aditiva.", "explicativa.", "alternativa.", "conclusiva."], 1, "‘Que’ introduz a razão da ordem: explicativa.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Trabalha muito e não ganha nada’, a conjunção ‘e’, apesar de aditiva, estabelece relação de oposição entre as orações.", "C", "Em contexto, o ‘e’ pode ter valor adversativo."],
        ["As conjunções adversativas ‘porém’, ‘contudo’ e ‘todavia’ não podem ocupar posição intermediária na oração.", "E", "Podem ocupar posição intermediária, entre vírgulas."],
        ["Orações coordenadas assindéticas são ligadas por conjunção coordenativa.", "E", "Assindéticas não têm conjunção."],
        ["Em ‘Ou você estuda ou você reprova’, as orações expressam alternância ou exclusão.", "C", "Alternativa."],
      ],
    },
    {
      titulo: "Orações Subordinadas Substantivas e Adjetivas",
      slug: "subordinadas-substantivas-adjetivas",
      resumo: "Substantivas fazem papel de substantivo (sujeito, objeto, predicativo, aposto, complemento nominal). Adjetivas funcionam como adjetivo: restritivas (sem vírgula) limitam o antecedente; explicativas (com vírgulas) apenas explicam.",
      conteudo: `# Orações Subordinadas Substantivas e Adjetivas

## Substantivas (equivalem a um substantivo)

Conjunções integrantes: **que, se**. Dica: troque a oração por **"isso"**.

| Tipo | Função da oração | Exemplo |
|---|---|---|
| **Subjetiva** | sujeito | **É importante** que você estude. (Isso é importante.) |
| **Objetiva direta** | objeto direto | Quero **que você estude**. (Quero isso.) |
| **Objetiva indireta** | objeto indireto | Duvido **de que ele venha**. |
| **Completiva nominal** | complemento nominal | Tenho certeza **de que passarei**. |
| **Predicativa** | predicativo do sujeito | O problema é **que ele não estuda**. |
| **Apositiva** | aposto | Desejo apenas **isto**: **que sejam felizes**. |

> 💡 A **subjetiva** costuma vir após *é preciso/importante/necessário, convém, parece, sabe-se que, ficou claro que*; **não** leva vírgula entre ela e a principal.

## Adjetivas (equivalem a um adjetivo)

Introduzidas por **pronome relativo** (*que, o qual, quem, cujo, onde, quanto*).

### ⭐ Restritiva × explicativa

| | **Restritiva** | **Explicativa** |
|---|---|---|
| Pontuação | **sem** vírgula | **entre vírgulas** |
| Função | **restringe** o antecedente (só uma parte) | **explica**, generaliza (todo o conjunto) |
| Exemplo | Os alunos **que estudaram** passaram. | Os alunos, **que estudaram**, passaram. |
| Sentido | só **parte** dos alunos passou | **todos** estudaram e **todos** passaram |

> 💡 A vírgula **muda o sentido**. Na prova: *"A retirada das vírgulas altera/mantém o sentido?"* — altera: de explicativa passa a restritiva (e vice-versa).

## Como reconhecer

- **Adjetiva:** o **que** é pronome relativo → pode ser substituído por *o qual*.
- **Substantiva:** o **que** é conjunção integrante → não pode ser substituído por *o qual*.
- *"As provas **que** fiz foram boas"* (adjetiva: *as quais fiz*) × *"Sei **que** as provas foram boas"* (substantiva: *sei isso*).

## Pontuação

- **Nunca** separar a oração **subjetiva** nem a **objetiva direta** da principal por vírgula (*~~Quero, que você estude~~*).
- **Explicativa**: sempre entre vírgulas (ou uma, se no final).
`,
      fc: [
        ["Oração adjetiva restritiva × explicativa?", "Restritiva (sem vírgula) restringe o antecedente: só parte do grupo. Explicativa (entre vírgulas) apenas acrescenta uma explicação a todo o grupo."],
        ["Como identificar uma oração substantiva?", "Pode ser trocada por ‘isso’ e é iniciada por conjunção integrante (que, se). Exerce função de sujeito, objeto, predicativo, complemento nominal ou aposto."],
        ["‘É importante que você estude’: que tipo de oração é ‘que você estude’?", "Subordinada substantiva subjetiva: funciona como sujeito de ‘é importante’ (isso é importante)."],
      ],
      mc: [
        ["Em ‘Os alunos que estudaram foram aprovados’, a oração destacada é:", ["adjetiva explicativa.", "adjetiva restritiva.", "substantiva objetiva direta.", "adverbial causal."], 1, "Sem vírgula e com ‘que’ relativo: restringe o grupo de alunos.", "MEDIO"],
        ["‘Os alunos, que estudaram, foram aprovados.’ O sentido do período é:", ["apenas parte dos alunos estudou e foi aprovada.", "todos os alunos estudaram e foram aprovados.", "ninguém foi aprovado.", "os alunos estudaram porque foram aprovados."], 1, "Com vírgulas, a oração é explicativa e se refere a todos os alunos.", "MEDIO"],
        ["‘Tenho certeza de que ele virá.’ A oração ‘de que ele virá’ é subordinada substantiva:", ["subjetiva.", "objetiva direta.", "completiva nominal.", "predicativa."], 2, "Completa o substantivo abstrato ‘certeza’: completiva nominal.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Os funcionários que faltaram serão punidos’, todos os funcionários faltaram.", "E", "Sem vírgula é restritiva: apenas alguns faltaram."],
        ["Em ‘É necessário que todos participem’, a oração subordinada exerce a função de sujeito.", "C", "Subordinada substantiva subjetiva."],
        ["A retirada das vírgulas em ‘Os servidores, que chegaram atrasados, foram advertidos’ não altera o sentido do período.", "E", "Sem vírgulas, a oração torna-se restritiva e o sentido muda."],
        ["Em ‘O problema é que ele não estuda’, a oração destacada é subordinada substantiva predicativa.", "C", "Funciona como predicativo do sujeito ‘o problema’."],
      ],
    },
    {
      titulo: "Orações Subordinadas Adverbiais e Reduzidas",
      slug: "subordinadas-adverbiais-reduzidas",
      resumo: "Adverbiais exprimem circunstâncias (causa, consequência, condição, concessão, comparação, conformidade, finalidade, proporção, tempo). Reduzidas não têm conjunção e usam infinitivo, gerúndio ou particípio. Cai muito a reescritura: reduzida ↔ desenvolvida.",
      conteudo: `# Orações Subordinadas Adverbiais e Reduzidas

## Adverbiais

Funcionam como **adjunto adverbial** da principal (conjunções já vistas no tópico *Conjunção*).

| Tipo | Exemplo |
|---|---|
| **Causal** | **Como estava cansado**, dormiu cedo. |
| **Consecutiva** | Estava **tão** cansado **que** dormiu cedo. |
| **Condicional** | **Se estudar**, passará. |
| **Concessiva** | **Embora estudasse**, não passou. |
| **Comparativa** | Estuda **como um atleta treina**. |
| **Conformativa** | Fez tudo **conforme combinamos**. |
| **Final** | Estuda **para que passe**. |
| **Proporcional** | **À medida que estudava**, aprendia. |
| **Temporal** | **Quando chegou**, todos saíram. |

> 💡 **Pontuação:** adverbial **anteposta** à principal leva **vírgula**: *"Como chovia, ficamos."*

## Orações reduzidas

Não têm conjunção (ou pronome relativo) e têm verbo em **forma nominal**:

| Forma | Exemplo | Desenvolvida |
|---|---|---|
| **Infinitivo** | **Ao chegar**, avise. | Quando chegar, avise. (temporal) |
| **Gerúndio** | **Estudando**, passará. | Se estudar, passará. (condicional) |
| **Particípio** | **Terminada a prova**, saímos. | Assim que terminou a prova, saímos. |

### ⭐ Reescritura (o que mais cai)

*Ao chegar → Quando chegar* · *Por estudar muito → Porque estudou muito* · *Apesar de estudar → Embora estudasse* · *Sem estudar → Se não estudar / Sem que estude* · *Estudando assim → Se estudar assim / Quando estuda*.

## Orações intercaladas e período misto

- **Intercalada:** interrompe outra oração (entre vírgulas, travessões, parênteses): *"O prazo, **disse o diretor**, termina amanhã."*
- **Período misto:** mistura coordenação e subordinação: *Estudou muito e, **embora cansado**, fez a prova.*
`,
      fc: [
        ["Como reescrever ‘Ao chegar’ com oração desenvolvida?", "‘Quando chegar’ (oração temporal)."],
        ["Reduzidas: formas verbais usadas?", "Infinitivo, gerúndio e particípio, sem conjunção nem pronome relativo."],
        ["Pontuação da adverbial anteposta?", "Leva vírgula: ‘Quando chegou, todos saíram’."],
      ],
      mc: [
        ["‘Apesar de estudar muito, não passou.’ A oração reduzida expressa:", ["causa.", "concessão.", "condição.", "finalidade."], 1, "‘Apesar de’ = embora: concessão.", "MEDIO"],
        ["‘Terminada a prova, os candidatos saíram.’ Sua forma desenvolvida mais adequada é:", ["Embora terminasse a prova.", "Assim que terminou a prova.", "Para terminar a prova.", "Porque não terminou a prova."], 1, "Particípio com valor temporal: assim que terminou.", "MEDIO"],
        ["‘Estava tão cansado que dormiu.’ A oração destacada é adverbial:", ["causal.", "consecutiva.", "comparativa.", "final."], 1, "‘Tão… que’: consequência.", "FACIL"],
      ],
      ce: [
        ["‘Ao chegar, avise-me’ pode ser reescrito como ‘Quando chegar, avise-me’, sem alteração de sentido.", "C", "Reduzida de infinitivo = temporal."],
        ["Em ‘Estudando, passará’, a oração reduzida de gerúndio pode exprimir condição.", "C", "= Se estudar, passará."],
        ["A oração adverbial concessiva pode ser introduzida por ‘porque’.", "E", "‘Porque’ introduz causal; concessiva usa embora, ainda que, mesmo que…"],
        ["As orações reduzidas são introduzidas por conjunção subordinativa.", "E", "Não têm conjunção; têm verbo em forma nominal."],
      ],
    },
    {
      titulo: "QUE, SE e COMO: Classificação",
      slug: "que-se-como",
      resumo: "Quem domina o ‘que’ (relativo × integrante), o ‘se’ (apassivador, índice de indeterminação, reflexivo, conjunção) e o ‘como’ (comparativo, causal, conformativo) acerta muita questão. O CEBRASPE adora o ‘se’.",
      conteudo: `# QUE, SE e COMO: Classificação

> O autor da gramática-base indica o **CEBRASPE** (para o **se**) e a **FGV** (para o **que**) como grandes cobradoras.

## O QUE

| Classificação | Teste | Exemplo |
|---|---|---|
| **Pronome relativo** | pode trocar por *o qual* | O livro **que** li (o qual li) é ótimo. |
| **Conjunção integrante** | *isso* substitui a oração | Sei **que** ele chegou. (Sei isso.) |
| **Conjunção coordenativa explicativa** | = *pois, porque* | Venha logo, **que** é tarde. |
| **Conjunção subordinativa causal/consecutiva/comparativa** | | Chorou **que** nem criança. (comparativa) · Falou tanto **que** ficou rouco. (consecutiva) |
| **Advérbio de intensidade** | = *quão, como* | **Que** lindo! |
| **Partícula de realce** (*é que, foi… que*) | pode ser retirada | **Foi ontem que** ele chegou. (Foi ontem ele chegou.) |
| **Pronome interrogativo/exclamativo** | | **Que** horas são? |

## O SE (mais cobrado pelo CEBRASPE)

| Função | Como reconhecer | Exemplo |
|---|---|---|
| **Pronome apassivador** | VTD + **se** + **sujeito paciente**; verbo concorda com ele; passa à passiva analítica | **Vendem-se** casas. (Casas são vendidas.) |
| **Índice de indeterminação do sujeito** | VI/VTI/VL + **se**; verbo na 3ª do **singular** | **Precisa-se** de professores. · **Vive-se** bem. |
| **Pronome reflexivo** | sujeito pratica e recebe; equivale a *a si mesmo* | Ele **se** feriu. |
| **Pronome recíproco** | ação mútua (sujeito plural) | Eles **se** abraçaram. |
| **Parte integrante do verbo** (verbo pronominal) | não tem função sintática | Arrependeu-**se**. · Queixou-**se**. |
| **Partícula expletiva (de realce)** | pode ser retirada | Foi-**se** embora. |
| **Conjunção integrante** | introduz oração substantiva | Perguntou **se** viria. |
| **Conjunção condicional** | = *caso* | **Se** chover, não irei. |

> ⚠️ **"Vendem-se casas" × "Precisa-se de casas"**: o primeiro é VTD (passiva sintética: verbo concorda com *casas*); o segundo é VTI (sujeito indeterminado: verbo **sempre no singular**).

## O COMO

| Função | Exemplo |
|---|---|
| **Comparativa** | Estuda **como** um atleta treina. |
| **Causal** (início de período) | **Como** estava cansado, dormiu. |
| **Conformativa** (= conforme) | **Como** disse o diretor, o prazo acabou. |
| **Advérbio interrogativo/exclamativo** | **Como** vai? · **Como** é lindo! |
`,
      fc: [
        ["‘Vendem-se casas’ × ‘Precisa-se de casas’: qual a função do ‘se’ em cada uma?", "Vendem-se: pronome apassivador (VTD, verbo concorda com o sujeito paciente ‘casas’). Precisa-se: índice de indeterminação do sujeito (VTI, verbo no singular)."],
        ["Como diferenciar ‘que’ pronome relativo de ‘que’ conjunção integrante?", "O relativo pode ser trocado por ‘o qual/a qual’ e retoma um termo anterior; a integrante pode ser trocada por ‘isso’ e introduz oração substantiva."],
        ["‘Como’ conformativo?", "Equivale a ‘conforme’: ‘Como disse o diretor, o prazo acabou’."],
      ],
      mc: [
        ["Em ‘Aluga-se um apartamento’, o ‘se’ é:", ["índice de indeterminação do sujeito.", "pronome apassivador.", "pronome reflexivo.", "conjunção condicional."], 1, "Alugar é VTD; ‘um apartamento’ é o sujeito paciente: ‘Um apartamento é alugado’.", "FACIL"],
        ["Em ‘Precisa-se de novos funcionários’, o ‘se’ é:", ["pronome apassivador.", "índice de indeterminação do sujeito.", "pronome reflexivo.", "parte integrante do verbo."], 1, "VTI + se: sujeito indeterminado; verbo no singular.", "MEDIO"],
        ["No trecho ‘Foi ontem que ele chegou’, o ‘que’ é:", ["pronome relativo.", "conjunção integrante.", "partícula de realce.", "conjunção causal."], 2, "É a expressão de realce ‘foi… que’, que pode ser retirada sem alterar a estrutura básica da oração.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Vendem-se casas’, o verbo está no plural porque concorda com o sujeito paciente ‘casas’.", "C", "Se apassivador: concordância com o sujeito paciente."],
        ["Em ‘Trata-se de questões importantes’, o verbo deveria ir ao plural para concordar com ‘questões’.", "E", "‘Tratar-se de’ é VTI com sujeito indeterminado: fica no singular."],
        ["Em ‘Perguntei se ele viria’, o ‘se’ é conjunção integrante.", "C", "Introduz oração subordinada substantiva objetiva direta."],
        ["Em ‘Como estava cansado, dormiu’, ‘como’ introduz oração adverbial causal.", "C", "‘Como’ no início de período, com valor de causa."],
      ],
    },
  ],
};
