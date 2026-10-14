// Bloco 3 — Semântica, Formação de Palavras e Estilística (cap. 4, 6 e 32 da gramática-base)
export default {
  nome: "Semântica, Formação de Palavras e Estilística",
  slug: "semantica-formacao-estilistica",
  descricao: "Sinonímia, paronímia, polissemia, denotação; derivação e composição; figuras e vícios de linguagem.",
  ordem: 3,
  topicos: [
    {
      titulo: "Semântica e Lexicologia",
      slug: "semantica-lexicologia",
      resumo: "Relações de sentido entre palavras: sinonímia, antonímia, homonímia, paronímia, polissemia, hiperonímia. Denotação é o sentido literal; conotação, o figurado. Parônimos são o campo minado das provas.",
      conteudo: `# Semântica e Lexicologia

## Relações entre palavras

| Relação | Definição | Exemplo |
|---|---|---|
| **Sinonímia** | sentidos semelhantes | começar / iniciar |
| **Antonímia** | sentidos opostos | belo / feio |
| **Homonímia** | mesma grafia e/ou som, sentidos diferentes | **homógrafas** (gosto/gôsto), **homófonas** (cem/sem), **homônimas perfeitas** (manga fruta/manga da camisa) |
| **Paronímia** | grafia/som parecidos, sentidos diferentes | ratificar/retificar |
| **Polissemia** | uma palavra, vários sentidos relacionados | "pé" da mesa, "pé" do rei |
| **Hiperonímia / hiponímia** | geral ↔ específico | animal → cachorro |
| **Merônimo / holônimo** | parte ↔ todo | dedo → mão |

> 💡 **Sinônimo perfeito praticamente não existe**: o contexto é que dita a troca. Em reescrita, troque a palavra e confira se o **sentido** e a **correção** se mantêm.

## Parônimos mais cobrados

| Par | Diferença |
|---|---|
| **ratificar** × **retificar** | confirmar × corrigir |
| **cumprimento** × **comprimento** | saudação/ato de cumprir × extensão |
| **infringir** × **infligir** | violar (lei) × aplicar (pena) |
| **emergir** × **imergir** | vir à tona × mergulhar |
| **eminente** × **iminente** | ilustre × prestes a acontecer |
| **discriminar** × **descriminar** | diferenciar × tirar o caráter de crime |
| **deferir** × **diferir** | conceder × distinguir/adiar |
| **tráfego** × **tráfico** | trânsito × comércio ilegal |
| **soar** × **suar** | produzir som × transpirar |
| **estada** × **estadia** | permanência de pessoa × permanência de veículo/prazo |
| **flagrante** × **fragrante** | evidente/ato × perfumado |
| **vultoso** × **vultuoso** | de grande valor × inchado (rosto) |

## Denotação × conotação

- **Denotação:** sentido literal, dicionarizado — *"O gato está na sala."*
- **Conotação:** sentido figurado, construído pelo contexto — *"Fulano é uma raposa."*

## Ambiguidade

Frase com **dois sentidos possíveis**, geralmente por má construção: *"Vi o ladrão com o binóculo."* (quem tinha o binóculo?). Em prova, é defeito de redação a ser corrigido.

## Intertextualidade

Diálogo entre textos: **citação** (reprodução entre aspas), **paráfrase** (reescrita que mantém o sentido), **paródia** (reescrita que **inverte/ironiza**), **alusão** (referência indireta), **epígrafe** (trecho no início), **plágio** (apropriação sem crédito).
`,
      fc: [
        ["Ratificar × retificar?", "Ratificar = confirmar, validar. Retificar = corrigir, tornar reto."],
        ["Infringir × infligir?", "Infringir = violar, descumprir (lei, norma). Infligir = aplicar (pena, castigo, derrota)."],
        ["Paráfrase × paródia?", "Paráfrase reescreve mantendo o sentido original; paródia reescreve invertendo ou satirizando o original."],
      ],
      mc: [
        ["Preencha: ‘O juiz ______ a decisão do tribunal anterior, confirmando-a.’", ["retificou", "ratificou", "emergiu", "infligiu"], 1, "Ratificar = confirmar.", "FACIL"],
        ["Quem ______ a lei está sujeito a sanções; o juiz poderá ______ a pena prevista.", ["infringe / infligir", "inflige / infringir", "infringe / infringir", "inflige / infligir"], 0, "Infringir = violar; infligir = aplicar (pena).", "MEDIO"],
        ["Em ‘Vi o ladrão com o binóculo’, o problema de redação é:", ["pleonasmo.", "ambiguidade.", "cacofonia.", "hipérbole."], 1, "Dois sentidos possíveis: quem tem o binóculo, quem vê ou o ladrão?", "FACIL"],
      ],
      ce: [
        ["Paráfrase e paródia são sinônimos, pois ambas reescrevem um texto mantendo seu sentido original.", "E", "A paródia inverte ou satiriza o sentido original."],
        ["‘Eminente’ significa ilustre, e ‘iminente’, prestes a acontecer; as duas palavras são parônimas.", "C", "Parônimos: parecidos na forma, diferentes no sentido."],
        ["‘Estada’ aplica-se a permanência de pessoas em um local, e ‘estadia’, a permanência de veículos ou prazo para carga/descarga.", "C", "Distinção tradicional entre estada e estadia."],
        ["A polissemia caracteriza-se pela existência de palavras distintas com a mesma grafia e sentidos sem relação entre si.", "E", "Isso é homonímia. Polissemia = uma só palavra com sentidos relacionados."],
      ],
    },
    {
      titulo: "Estrutura e Formação de Palavras",
      slug: "formacao-de-palavras",
      resumo: "Derivação (prefixal, sufixal, parassintética, regressiva, imprópria) × composição (justaposição, aglutinação). Radical + afixos + desinências + vogal temática. Derivação e composição são o que mais cai.",
      conteudo: `# Estrutura e Formação de Palavras

## Elementos mórficos

| Elemento | Função | Exemplo (*infelizmente*) |
|---|---|---|
| **Radical** | núcleo de significado | **feliz** |
| **Prefixo** | antes do radical | **in**-feliz |
| **Sufixo** | depois do radical | feliz-**mente** |
| **Desinência** | marca de gênero/número/pessoa/tempo | cantá-**vamos** |
| **Vogal temática** | liga o radical às desinências | cant-**a**-r |
| **Vocábulos cognatos** | mesma raiz | feliz, felicidade, infeliz |

## Processos de formação

### Derivação (um só radical)

| Tipo | Como é | Exemplo |
|---|---|---|
| **Prefixal** | prefixo + radical | **des**fazer, **in**feliz |
| **Sufixal** | radical + sufixo | feliz**mente**, pedr**eiro** |
| **Prefixal e sufixal** | os dois, em etapas independentes | **in**feliz**mente** |
| **Parassintética** | prefixo **e** sufixo ao mesmo tempo; retirar um deles perde a palavra | **a**manhec**er**, **en**tarde**cer**, **em**pobre**cer** |
| **Regressiva** | *redução* de verbo a substantivo (sem sufixo) | ajudar → **ajuda**; atacar → **ataque** |
| **Imprópria (conversão)** | muda a classe sem mudar a forma | o **jantar**, o **porquê**, um **não** |

### Composição (dois ou mais radicais)

- **Justaposição:** elementos mantêm a forma e a tonicidade — *guarda-chuva, passatempo, girassol*.
- **Aglutinação:** perdem fonema/tonicidade — *aguardente (água + ardente), planalto (plano + alto), fidalgo (filho + de + algo)*.

### Outros processos

- **Onomatopeia:** imita som — *tique-taque, zum-zum*.
- **Abreviação:** *moto, foto, pneu*.
- **Siglas:** *ONU, CGU* (sigla se lê como palavra ou soletrada).
- **Hibridismo:** radicais de línguas diferentes — *automóvel (grego + latim), sociologia*.
- **Neologismo:** palavra nova (*deletar, tuitar*).
- **Estrangeirismo:** palavra de outro idioma (*shopping, mouse*).

> 💡 **Teste da parassíntese:** se a palavra só existe com prefixo **e** sufixo juntos, é parassintética. *Entardecer* não existe sem *en-* nem sem *-ecer*; *infelizmente* existe como *infeliz* e como *felizmente*: é prefixal **e** sufixal.
`,
      fc: [
        ["Como identificar derivação parassintética?", "Prefixo e sufixo são acrescentados ao mesmo tempo ao radical; sem um deles a palavra não existe (entardecer, amanhecer, empobrecer)."],
        ["Justaposição × aglutinação?", "Justaposição: os elementos preservam a forma e a pronúncia (guarda-chuva, passatempo). Aglutinação: há perda de fonema ou da tonicidade (aguardente, planalto, fidalgo)."],
        ["O que é derivação regressiva?", "Formação de substantivo a partir do verbo por redução, sem sufixo: ajudar → ajuda; atacar → ataque; pescar → pesca."],
      ],
      mc: [
        ["A palavra ‘entardecer’ forma-se por:", ["derivação prefixal.", "derivação sufixal.", "derivação parassintética.", "composição por aglutinação."], 2, "O prefixo en- e o sufixo -ecer agregam-se simultaneamente a ‘tarde’.", "MEDIO"],
        ["Assinale a palavra formada por derivação regressiva.", ["infelizmente", "embarque", "desleal", "girassol"], 1, "‘Embarque’ vem do verbo embarcar, por redução: derivação regressiva. ‘Infelizmente’: prefixal e sufixal; ‘desleal’: prefixal; ‘girassol’: composição.", "MEDIO"],
        ["Em ‘Hoje o jantar foi ótimo’, a palavra ‘jantar’ é formada por:", ["derivação imprópria (conversão).", "derivação regressiva.", "derivação parassintética.", "onomatopeia."], 0, "O verbo ‘jantar’ passou a substantivo sem mudar a forma: conversão.", "MEDIO"],
      ],
      ce: [
        ["Em ‘aguardente’ ocorre composição por aglutinação, pois há perda de fonema na junção dos radicais.", "C", "água + ardente → aguardente: aglutinação."],
        ["‘Infelizmente’ é exemplo de derivação parassintética, porque contém prefixo e sufixo.", "E", "Existem ‘infeliz’ e ‘felizmente’ isoladamente: é derivação prefixal e sufixal, não parassintética."],
        ["Em ‘guarda-chuva’, a composição ocorre por justaposição, já que os elementos preservam sua forma e sua tonicidade.", "C", "Justaposição."],
        ["Nas formas verbais ‘cantávamos’ e ‘cantaremos’, ‘-mos’ indica desinência de número e pessoa.", "C", "-mos: 1ª pessoa do plural."],
      ],
    },
    {
      titulo: "Estilística: Figuras e Vícios de Linguagem",
      slug: "figuras-vicios-linguagem",
      resumo: "Metáfora, comparação, metonímia, antítese, paradoxo, ironia, hipérbole, eufemismo, prosopopeia, elipse e zeugma são as figuras mais cobradas. Vícios: ambiguidade, cacofonia, pleonasmo vicioso, barbarismo, solecismo.",
      conteudo: `# Estilística: Figuras e Vícios de Linguagem

## Figuras de palavras (tropos)

| Figura | O que faz | Exemplo |
|---|---|---|
| **Metáfora** | comparação **implícita** | "Ele é uma raposa." |
| **Comparação** | comparação **explícita** (como, tal qual) | "Ele é astuto como uma raposa." |
| **Metonímia** | troca por relação de proximidade (autor/obra, continente/conteúdo, parte/todo) | "Li Machado de Assis." · "Tomei um copo." |
| **Catacrese** | metáfora desgastada, sem outro nome | "pé da mesa", "braço da cadeira" |
| **Sinestesia** | mistura de sentidos | "voz **doce**", "cheiro **azedo**" |
| **Antonomásia** | apelido no lugar do nome | "o Rei do Futebol" |

## Figuras de pensamento

| Figura | O que faz | Exemplo |
|---|---|---|
| **Antítese** | ideias **opostas** | "Amor é fogo que arde sem se ver" |
| **Paradoxo** | ideias **contraditórias** que revelam verdade | "Sei que nada sei." |
| **Ironia** | diz o contrário do que quer dizer | "Que dia **ótimo**!" (chovendo) |
| **Hipérbole** | exagero | "Chorou rios de lágrimas." |
| **Eufemismo** | suaviza | "Ele nos deixou." (morreu) |
| **Prosopopeia / personificação** | dá vida a seres inanimados | "O vento sussurrou." |
| **Gradação** | progressão de intensidade | "Chegou, viu, venceu." |

## Figuras de sintaxe

- **Elipse:** omissão de termo subentendido — *"Estudei muito; (eu) passei."*
- **Zeugma:** omissão de verbo já citado — *"Ele prefere café; ela, chá."*
- **Pleonasmo (literário):** reforço de ideia — *"Vi com meus olhos."*
- **Anáfora (figura):** repetição no começo de versos/frases.
- **Silepse:** concordância com a ideia (de gênero, número ou pessoa) — *"A gente fomos."* (uso literário).

## Vícios de linguagem

| Vício | O que é | Exemplo |
|---|---|---|
| **Ambiguidade** | duplo sentido por má construção | "Vi o ladrão com o binóculo." |
| **Cacofonia** | som desagradável ou palavra indesejada pela junção de sílabas | "ela tinha" (latinha), "uma mão" (mamão), "por cada" |
| **Pleonasmo vicioso** | redundância desnecessária | "subir **para cima**", "elo de **ligação**", "encarar **de frente**" |
| **Barbarismo** | erro de grafia, pronúncia ou flexão de uma palavra | "pobrema", "adevogado", "mendingo" |
| **Solecismo** | erro de sintaxe (concordância, regência, colocação) | "Fazem dois anos." |
| **Neologismo** | palavra nova | "deletar" |
| **Estrangeirismo** | palavra de outra língua | "deadline" |

> 💡 Na prova, **metáfora** e **elipse** são as campeãs. Atenção a **metonímia** (parte pelo todo, autor pela obra) e **ironia**, que dependem do contexto.
`,
      fc: [
        ["Metáfora × comparação?", "Metáfora: comparação implícita, sem conectivo (‘Ele é uma raposa’). Comparação: explícita, com conectivo (‘Ele é astuto como uma raposa’)."],
        ["Antítese × paradoxo?", "Antítese aproxima ideias opostas (fogo/gelo). Paradoxo reúne ideias contraditórias que, juntas, revelam uma verdade (‘Sei que nada sei’)."],
        ["Exemplo de pleonasmo vicioso?", "Redundância desnecessária: subir para cima, descer para baixo, elo de ligação, encarar de frente, hemorragia de sangue."],
      ],
      mc: [
        ["‘Li Machado de Assis durante as férias.’ A figura empregada é:", ["metáfora.", "metonímia.", "hipérbole.", "eufemismo."], 1, "Autor pela obra: metonímia.", "FACIL"],
        ["‘Que belo dia!’, dito durante uma tempestade, ilustra:", ["eufemismo.", "ironia.", "catacrese.", "prosopopeia."], 1, "Diz-se o contrário do que se pensa: ironia.", "FACIL"],
        ["Em ‘Ele prefere café; ela, chá’, ocorre:", ["zeugma.", "pleonasmo.", "anáfora.", "paradoxo."], 0, "Omite-se o verbo ‘prefere’, já enunciado: zeugma (elipse de verbo).", "MEDIO"],
      ],
      ce: [
        ["Na expressão ‘o pé da mesa’, há catacrese, pois o termo ‘pé’ é empregado em sentido figurado por falta de nome específico.", "C", "Catacrese = metáfora desgastada, sem substituto."],
        ["A expressão ‘subir para cima’ configura pleonasmo vicioso.", "C", "Redundância sem ganho expressivo."],
        ["‘Ele nos deixou’, no sentido de ‘morreu’, constitui hipérbole.", "E", "É eufemismo (suavização)."],
        ["‘Voz suave’ e ‘cheiro azedo’ exemplificam sinestesia, por combinarem sensações de domínios sensoriais distintos.", "C", "Sinestesia mistura sentidos (audição + tato; olfato + paladar)."],
      ],
    },
  ],
};
