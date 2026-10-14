// Bloco 6 — Pontuação, Concordância, Regência e Crase (cap. 27–30 da gramática-base)
export default {
  nome: "Pontuação, Concordância, Regência e Crase",
  slug: "pontuacao-concordancia-regencia-crase",
  descricao: "Vírgula e demais sinais, concordância verbal e nominal, regência verbal e nominal, crase.",
  ordem: 6,
  topicos: [
    {
      titulo: "Pontuação: Vírgula e Demais Sinais",
      slug: "pontuacao",
      resumo: "A vírgula é o que precisa estar ‘de cor e salteado’. Usa-se para separar termos deslocados, apostos, vocativos, orações adjetivas explicativas e adverbiais antepostas; jamais entre sujeito e verbo, verbo e complemento. O sentido muda com a vírgula.",
      conteudo: `# Pontuação: Vírgula e Demais Sinais

## Vírgula — usos obrigatórios

| Caso | Exemplo |
|---|---|
| **Enumeração** (elementos de mesma função) | Comprei pão, leite, ovos e café. |
| **Aposto** | Brasília, **a capital do país**, é planejada. |
| **Vocativo** | **Pedro**, venha cá. |
| **Oração adjetiva explicativa** | Os candidatos, **que estudaram**, passaram. |
| **Adjunto adverbial deslocado** (longo ou intercalado) | **Na manhã de ontem**, chegou o edital. |
| **Oração adverbial anteposta** | **Quando chegou**, todos saíram. |
| **Conjunção adversativa** (mas, porém…) | Estudou, **mas** não passou. |
| **Conjunção conclusiva/explicativa posposta** | Devemos, **pois**, partir. |
| **Elipse (omissão) de verbo** | Eu estudo português; ela, matemática. |
| **Local e data** | Brasília, 5 de maio de 2026. |
| **Termos intercalados** | O prazo, **disse o diretor**, termina amanhã. |

## Vírgula — usos PROIBIDOS

- ❌ **Entre sujeito e verbo:** *~~Os candidatos aprovados, serão chamados.~~*
- ❌ **Entre verbo e complemento (OD/OI):** *~~O diretor disse, que viria.~~*
- ❌ **Entre nome e complemento nominal/adjunto.**
- ❌ **Antes de oração substantiva** (subjetiva, objetiva direta).
- ❌ **Antes de oração adjetiva restritiva.**

> 💡 **Vírgulas duplas:** um termo intercalado entre sujeito e verbo vai entre **duas** vírgulas; **uma só** vírgula entre eles é erro.

## O sentido muda

- *Os alunos que estudaram passaram* (só os que estudaram) × *Os alunos, que estudaram, passaram* (todos).
- *Vamos comer, Maria* (chamamos Maria) × *Vamos comer Maria* (canibalismo!).

## Outros sinais

| Sinal | Usos principais |
|---|---|
| **Ponto e vírgula** | itens de enumeração longos; orações coordenadas extensas; antes de *porém/contudo* com pausa maior |
| **Dois-pontos** | enumeração, explicação, citação, esclarecimento |
| **Travessão** | diálogo; isolar termo explicativo (substitui vírgulas); ênfase |
| **Aspas** | citação, ironia, estrangeirismo, termo em destaque |
| **Parênteses** | informação acessória |
| **Reticências** | omissão, suspensão do pensamento |
`,
      fc: [
        ["Onde NÃO se usa vírgula?", "Entre sujeito e verbo, verbo e complemento, nome e complemento nominal, e antes de oração substantiva ou adjetiva restritiva."],
        ["Por que se usa vírgula antes de ‘mas’?", "Conjunção adversativa: sempre vem precedida de vírgula (ou ponto e vírgula)."],
        ["Como a vírgula muda o sentido em ‘Os alunos, que estudaram, passaram’?", "Torna a oração explicativa: todos os alunos estudaram e passaram; sem as vírgulas (restritiva), só os que estudaram passaram."],
      ],
      mc: [
        ["Assinale a frase pontuada corretamente.", ["Os candidatos aprovados, serão convocados.", "Os candidatos aprovados serão convocados.", "O diretor afirmou, que haverá prova.", "Quando chegou todos saíram."], 1, "Não se separa sujeito de verbo (A), nem verbo de complemento (C). Em D falta a vírgula depois da adverbial anteposta.", "FACIL"],
        ["Em ‘Brasília, a capital do país, é planejada’, as vírgulas isolam:", ["um vocativo.", "um aposto.", "uma oração subordinada adverbial.", "um adjunto adverbial."], 1, "‘A capital do país’ explica ‘Brasília’: aposto.", "FACIL"],
        ["Em qual alternativa a vírgula está empregada INDEVIDAMENTE?", ["Pedro, venha cá.", "Estudou, mas não passou.", "O resultado, ainda não foi divulgado.", "Eu estudo inglês; ela, francês."], 2, "Uma única vírgula separa sujeito de verbo; só caberia com dupla vírgula (‘O resultado, ainda, não…’) ou sem vírgula.", "MEDIO"],
      ],
      ce: [
        ["Em ‘A prova que foi aplicada ontem foi difícil’, o acréscimo de vírgulas antes e depois de ‘que foi aplicada ontem’ preserva o sentido do período.", "E", "Com vírgulas, a oração passa de restritiva a explicativa e o sentido muda."],
        ["A vírgula que separa o sujeito do verbo, como em ‘Os servidores, trabalham muito’, é incorreta.", "C", "Não se separa sujeito de verbo por vírgula única."],
        ["A conjunção adversativa ‘mas’ deve ser precedida de vírgula.", "C", "Regra geral."],
        ["Em ‘Eu gosto de café; ela, de chá’, a vírgula marca a omissão do verbo.", "C", "Elipse (zeugma) do verbo."],
      ],
    },
    {
      titulo: "Concordância Verbal",
      slug: "concordancia-verbal",
      resumo: "O verbo concorda com o sujeito em número e pessoa. Cai muito: sujeito distante do verbo, sujeito oracional, se apassivador × indeterminação, verbos impessoais, porcentagens, ‘mais de um’, ‘a maioria de’, pronome relativo.",
      conteudo: `# Concordância Verbal

> **Método:** sublinhe o verbo e **vá à caça do sujeito** — principalmente quando ele está longe do verbo.

## Regras

### 1. Sujeito coletivo e partitivo

- Coletivo simples → **singular**: *A multidão gritou.*
- Coletivo/partitivo + especificador (*a maioria de, a maior parte de, grande número de, um grupo de*) → **singular** (concorda com o núcleo) **ou plural** (concorda com o especificador): *A maioria dos alunos **foi** / **foram** aprovada(os).*

### 2. Sujeito composto

- **Antes** do verbo → **plural**: *Pedro e Maria **chegaram**.*
- **Depois** do verbo → plural **ou** concorda com o mais próximo: *Chegaram / Chegou Pedro e Maria.*
- Ligado por **ou** → **singular** se há **exclusão** (só um pode ser) ou **retificação**; **plural** se a ideia é de soma/alternância entre ambos.
- Ligado por **nem… nem** → plural (preferível).

### 3. Pronome relativo *que*

Concorda com o **antecedente**: *Fui **eu que fiz** · Somos **nós que fizemos** · Ele é um dos que **mais estudam*** (plural preferido).

### 4. *Mais de um*, *cerca de*, *perto de*

Concordam com o **numeral**: *Mais de um aluno **faltou**.* · *Mais de cinco alunos **faltaram**.* Se há **reciprocidade** ou repetição, plural: *Mais de um irmão **se abraçaram**.*

### 5. Porcentagens e frações

O verbo concorda com o **número** (ou com o especificador): *20% dos alunos **faltaram** / 1% dos alunos **faltou** / Apenas 1/3 das pessoas **sabe** (ou **sabem**).* Com **determinante** (*os 30%*), concorda com o numeral: *Os 30% **não sabem**.*

### 6. Verbos impessoais

- **Haver** (existir/tempo) e **fazer** (tempo) → **singular**: *Há problemas. · Faz dois anos.*
- Com **auxiliar** acompanhando o impessoal, o auxiliar também fica no singular: *Deve **haver** problemas.* (mas *Devem **existir** problemas*, pois *existir* é pessoal).

### 7. Verbos *bater, dar, soar* (horas)

Concordam com o número de horas: *Deram duas horas.* Mas: *O relógio **deu** duas horas.*

### 8. Partícula **se**

- **Apassivadora** (VTD): verbo concorda com o sujeito paciente — *Vendem-se casas.*
- **Indeterminação** (VI/VTI/VL): verbo no **singular** — *Precisa-se de funcionários.*

### 9. Locução com *dever/poder/costumar* + **se** + infinitivo

*Devem-se resolver as questões* (locução verbal; passiva) **ou** *Deve-se resolver as questões* (sujeito oracional): atenção ao que a questão pede.

### 10. Sujeito oracional

Verbo no **singular**: *Convém **que** todos cheguem cedo.* (o sujeito é a oração *que todos cheguem cedo*).

## Pegadinhas clássicas

- **Sujeito distante** do verbo: *O candidato, apesar das dificuldades enfrentadas ao longo de meses, **conseguiu*** (e não ~~conseguiram~~).
- **Nome próprio plural:** com artigo → plural: *Os Estados Unidos **são** grandes*; sem artigo → singular: *Estados Unidos **é** grande*; *Minas Gerais **é** bela*.
- **"que" × "quem":** com **que**, o verbo concorda com o antecedente (*Fui eu **que fiz***); com **quem**, vai para a **3ª pessoa do singular** (*Fui eu **quem fez***). O CEBRASPE já considerou **errada** a concordância com o pronome reto após *quem* (*fui eu quem criei*).
`,
      fc: [
        ["Concordância com ‘mais de um’?", "Singular: ‘Mais de um aluno faltou’. Plural se houver reciprocidade (‘Mais de um irmão se abraçaram’) ou a expressão for repetida."],
        ["‘Haver’ no sentido de existir: singular ou plural?", "Sempre singular (impessoal): ‘Há problemas’. Com auxiliar, o auxiliar também fica no singular: ‘Deve haver problemas’."],
        ["Diferença de ‘Vendem-se casas’ e ‘Precisa-se de casas’?", "Vendem-se: se apassivador (VTD), verbo concorda com o sujeito paciente. Precisa-se: se indeterminador (VTI), verbo sempre no singular."],
      ],
      mc: [
        ["Assinale a frase com concordância verbal CORRETA.", ["Fazem dez anos que ele partiu.", "Houveram muitos problemas na prova.", "Mais de um candidato recorreu da decisão.", "Vende-se casas na praia."], 2, "‘Mais de um’ exige singular (recorreu). ‘Faz’, ‘Houve’ (impessoais) e ‘Vendem-se’ seriam as formas corretas nas demais.", "MEDIO"],
        ["‘Os cartazes, apesar de todas as tentativas de retirada ao longo do mês, ______ no local.’", ["permaneceu", "permaneceram", "permanecia", "permanecera"], 1, "O sujeito é ‘os cartazes’ (plural); a oração intercalada afasta-o do verbo.", "MEDIO"],
        ["Assinale a alternativa com concordância adequada.", ["Deve haver soluções para o problema.", "Devem haver soluções para o problema.", "Podem haver soluções para o problema.", "Deveriam haver soluções para o problema."], 0, "‘Haver’ impessoal: o auxiliar fica no singular.", "MEDIO"],
      ],
      ce: [
        ["Na frase ‘Fazem dois anos que me formei’, a concordância está de acordo com a norma-padrão.", "E", "‘Fazer’ indicando tempo é impessoal: ‘Faz dois anos’."],
        ["Em ‘Precisa-se de novos servidores’, o verbo não vai ao plural porque o ‘se’ é índice de indeterminação do sujeito.", "C", "VTI + se: singular."],
        ["Em ‘A maioria dos candidatos foi aprovada’, é também admissível ‘A maioria dos candidatos foram aprovados’.", "C", "Coletivo partitivo + especificador: singular ou plural."],
        ["Em ‘Os 30% dos eleitores não compareceram’, o verbo concorda com o numeral precedido de determinante.", "C", "Com determinante, concorda com o numeral."],
      ],
    },
    {
      titulo: "Concordância Nominal",
      slug: "concordancia-nominal",
      resumo: "Adjetivo, artigo, numeral e pronome concordam com o substantivo. Atenção a palavras que mudam conforme a classe: meio, bastante, só, menos, anexo, incluso, mesmo, próprio, obrigado, quite, possível e à expressão ‘é proibido/necessário’.",
      conteudo: `# Concordância Nominal

Regra geral: **adjetivo, artigo, numeral e pronome concordam em gênero e número** com o substantivo a que se referem.

## Adjetivo com vários substantivos

| Posição | Regra | Exemplo |
|---|---|---|
| **Posposto** | plural **ou** concorda com o mais próximo | Estudei língua e literatura **portuguesas** / **portuguesa**. |
| **Anteposto** | concorda com o mais próximo | **Bela** casa e jardim. · **Belos** campos e cidades. |

## ⭐ Palavras que variam ou não

| Palavra | Regra | Exemplo |
|---|---|---|
| **anexo, incluso, quite, leso** | adjetivos: **variam** | Seguem **anexas** as cópias. · Estamos **quites**. |
| **em anexo** | locução adverbial: **invariável** | Seguem **em anexo** as cópias. |
| **mesmo, próprio** | adjetivos: variam | Elas **mesmas** decidiram. · Eles **próprios** vieram. |
| **obrigado** | concorda com **quem fala** | Ela disse: "**Obrigada**." |
| **meio** | advérbio = invariável / numeral = varia | Ela está **meio** cansada. · **Meia** hora. |
| **bastante** | adj. = varia / adv. = invariável | **Bastantes** alunos · **bastante** cansados. |
| **só** | adj. (sozinho) varia / adv. (apenas) invariável | Elas estavam **sós**. · **Só** elas vieram. |
| **menos** | **sempre invariável** | Há **menos** pessoas. |
| **possível** | concorda com o **artigo** | **As** mais claras **possíveis** · **O** mais cedo **possível** |

## É proibido, é necessário, é bom, é preciso

- **Sem determinante** (artigo, pronome): predicativo **invariável** — *É **proibido** entrada. · É **necessário** paciência.*
- **Com determinante**: concorda — *É **proibida** a entrada. · São **necessárias** as provas.*

## Outros casos

- **Adjetivo composto** → só o último varia (*luso-brasileiros*).
- **Cores com substantivo** → invariáveis (*azul-marinho*).
- **Ambos** exige artigo: *ambos **os** lados*.

> 💡 O autor da gramática-base indica que **adjetivo na concordância nominal** é cobrado pelo CEBRASPE, ESAF e FCC.
`,
      fc: [
        ["‘Anexo’ varia?", "Como adjetivo, varia: ‘Seguem anexas as cópias’. Na locução ‘em anexo’, é invariável: ‘Seguem em anexo as cópias’."],
        ["‘É proibido entrada’ ou ‘É proibida a entrada’?", "Sem determinante, o adjetivo fica invariável (É proibido entrada); com determinante (artigo), concorda: É proibida a entrada. As duas formas são corretas nos respectivos contextos."],
        ["‘O mais cedo possível’ ou ‘as mais claras possíveis’?", "‘Possível’ concorda com o artigo: o mais cedo possível; as mais claras possíveis."],
      ],
      mc: [
        ["Assinale a frase com concordância nominal CORRETA.", ["Seguem anexo as cópias solicitadas.", "Seguem anexas as cópias solicitadas.", "Elas mesmo decidiram.", "Há menas pessoas aqui."], 1, "‘Anexo’ (adjetivo) concorda com ‘cópias’: anexas. ‘Mesmas’ e ‘menos’ nas demais.", "MEDIO"],
        ["Assinale a alternativa em que o termo destacado está INCORRETAMENTE flexionado.", ["Estamos quites com a empresa.", "As alunas ficaram meio nervosas.", "Elas mesmas resolveram.", "Elas são bastantes inteligentes."], 3, "‘Bastante’ advérbio (modifica o adjetivo ‘inteligentes’): invariável.", "MEDIO"],
        ["‘É ______ a entrada de pessoas estranhas.’ A forma correta é:", ["proibido", "proibida", "proibidas", "proibidos"], 1, "Com determinante (a entrada), o predicativo concorda: proibida.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Seguem anexas as cópias’, o termo ‘anexas’ concorda com ‘cópias’, em gênero e número.", "C", "Adjetivo: varia."],
        ["Em ‘É necessário paciência’, o adjetivo permanece invariável por não haver determinante antes do substantivo.", "C", "Sem artigo/pronome, fica no masculino singular."],
        ["Na frase ‘Há menas pessoas’, ‘menas’ é a forma feminina de ‘menos’.", "E", "‘Menos’ é invariável."],
        ["Em ‘Ela disse: ‘Obrigada’’, a flexão feminina decorre da concordância com a pessoa que agradece.", "C", "‘Obrigado/obrigada’ concorda com quem fala."],
      ],
    },
    {
      titulo: "Regência Verbal e Nominal",
      slug: "regencia",
      resumo: "Regência é a relação de dependência entre o verbo/nome e seu complemento (com ou sem preposição). Dominar assistir a, aspirar a, visar a, preferir a, obedecer a, implicar, informar e a preposição antes do pronome relativo (a que, de que, em que).",
      conteudo: `# Regência Verbal e Nominal

> A **regência verbal** é a mais cobrada das duas. Preste atenção na **preposição antes do pronome relativo**.

## Regência verbal — os campeões

| Verbo | Regência | Exemplo |
|---|---|---|
| **Assistir** (ver, presenciar) | **a** | Assisti **ao** filme. |
| **Assistir** (ajudar, dar assistência) | direto | O médico assistiu **o** paciente. |
| **Aspirar** (almejar) | **a** | Aspiro **a** um cargo melhor. |
| **Aspirar** (inalar) | direto | Aspirou **o** perfume. |
| **Visar** (almejar) | **a** | Visa **ao** sucesso. |
| **Visar** (mirar; dar visto) | direto | Visou **o** alvo. |
| **Preferir** | **a** (nunca *do que*/*mais*) | Prefiro café **a** chá. |
| **Obedecer/desobedecer** | **a** | Obedeço **à** lei. |
| **Implicar** (acarretar) | direto | A medida implica **custos**. |
| **Implicar** (antipatizar) | **com** | Implicou **com** o colega. |
| **Namorar** | direto | Namora **a** vizinha. |
| **Chegar / ir** | **a** | Cheguei **ao** trabalho. |
| **Morar / residir** | **em** | Moro **em** Brasília. |
| **Simpatizar** | **com** | Simpatizo **com** ele. |
| **Responder** | **a** | Respondeu **à** pergunta. |
| **Referir-se / aludir** | **a** | Refiro-me **ao** edital. |
| **Esquecer / lembrar** (não pronominal) | direto | Esqueci **o** nome. |
| **Esquecer-se / lembrar-se** (pronominal) | **de** | Esqueci-me **do** nome. |
| **Pagar / perdoar** | coisa (direto), pessoa (**a**) | Paguei **a** dívida **ao** credor. |
| **Informar / avisar** | pessoa (direto) + **de/sobre** coisa | Informei **os alunos do** prazo. · Informei-**lhes** o prazo. |
| **Agradecer** | coisa (direto), pessoa (**a**) | Agradeci **o** presente **a** ele. |
| **Custar** (ser difícil) | sujeito = a coisa; **a** pessoa | Custa **ao** aluno estudar. |
| **Proceder** (iniciar) | **a** | Procedeu **à** leitura. |
| **Atender** | **a** ou direto | Atendeu **ao** (ou **o**) telefone. |
| **Satisfazer** (agradar) | **a** | A proposta satisfez **ao** cliente. |

## Preposição antes do pronome relativo

A preposição é a **exigida pelo verbo/nome** que vem **depois** do relativo:

- *O filme **a que** assisti* (assistir **a**).
- *O cargo **a que** aspiro* (aspirar **a**).
- *O livro **de que** preciso* (precisar **de**).
- *A pessoa **com quem** falei* (falar **com**).
- *O local **em que** (ou **onde**) moro* (morar **em**).
- *O candidato **a cuja** vaga me refiro* (cujo + preposição).

> ❌ *"O filme que assisti"* · ❌ *"O livro que preciso"* — faltam as preposições.

## Regência nominal

| Nome | Preposição | Nome | Preposição |
|---|---|---|---|
| **capaz** | de | **obediência** | a |
| **apto** | a / para | **medo** | de |
| **compatível** | com | **paixão** | por |
| **contemporâneo** | a / de | **preferência** | por |
| **dúvida** | acerca de / sobre | **respeito** | a / por |
| **devoção** | a / para / por | **residente** | em |
| **alheio** | a / de | **insensível** | a |
| **avesso** | a | **impróprio** | para |
`,
      fc: [
        ["‘Assistir’ no sentido de ver: com ou sem preposição?", "Com a preposição ‘a’: ‘Assisti ao filme’. Pronome relativo: ‘o filme a que assisti’. No sentido de ajudar, é transitivo direto."],
        ["Como se constrói ‘preferir’?", "Preferir X a Y (nunca ‘do que’ nem ‘mais’): ‘Prefiro café a chá’."],
        ["Qual a regência de ‘aspirar’ no sentido de almejar?", "Transitivo indireto com ‘a’: ‘Aspiro a um cargo’; relativo: ‘o cargo a que aspiro’."],
      ],
      mc: [
        ["Assinale a alternativa em que a regência está CORRETA.", ["O filme que assisti foi ótimo.", "O livro que preciso está aqui.", "A casa em que moro é antiga.", "O cargo que aspiro exige concurso."], 2, "‘Morar em’: a casa em que moro. As demais omitem as preposições a (assistir), de (precisar) e a (aspirar).", "MEDIO"],
        ["Está corretamente empregada a regência verbal em:", ["Prefiro mais estudar do que dormir.", "Prefiro estudar a dormir.", "Prefiro estudar do que dormir.", "Prefiro mais estudar a dormir."], 1, "‘Preferir… a’, sem ‘mais’ nem ‘do que’.", "MEDIO"],
        ["‘O médico ______ o paciente com cuidado.’ Com o sentido de ‘ajudar’, a forma adequada é:", ["assistiu ao", "assistiu o", "assistiu de", "assistiu em"], 1, "Assistir = ajudar é transitivo direto.", "DIFICIL"],
      ],
      ce: [
        ["Em ‘O cargo a que aspiro exige concurso’, a preposição ‘a’ antes do relativo decorre da regência do verbo ‘aspirar’.", "C", "Aspirar (almejar) rege a."],
        ["O verbo ‘implicar’, com o sentido de ‘acarretar’, é transitivo direto: ‘A medida implica custos’.", "C", "Implicar = acarretar: transitivo direto."],
        ["Na norma-padrão, é correto dizer ‘Prefiro café do que chá’.", "E", "Preferir X a Y; não ‘do que’."],
        ["‘Esqueci-me do nome’ e ‘Esqueci o nome’ são construções corretas, com regências distintas.", "C", "Pronominal rege de; não pronominal é direto."],
      ],
    },
    {
      titulo: "Crase",
      slug: "crase",
      resumo: "Crase é a fusão da preposição a com o artigo a(s) ou o a inicial de aquele(s), aquela(s), aquilo, a qual. Só ocorre antes de palavra feminina (determinada) e com termo que exija a. Macete: ‘vou a, volto da → crase’.",
      conteudo: `# Crase

> **Crase = preposição *a* + artigo *a(s)*** (ou + o *a* de *aquele, aquela, aquilo, a qual*).

## Como saber

1. O termo **regente** (verbo/nome) exige a preposição **a**? (*ir **a**, obedecer **a***)
2. A palavra seguinte é **feminina** e admite artigo **a**?

**Macete:** troque por palavra **masculina**: se aparecer *ao*, há crase. *"Fui **à** escola" → "Fui **ao** colégio."*

**Macete dos lugares:** *"Vou **a** / volto **da** → crase. Vou **a** / volto **de** → sem crase."*
*Vou **à** Bahia (volto **da** Bahia) · Vou **a** Roma (volto **de** Roma).*

## Crase obrigatória

| Caso | Exemplos |
|---|---|
| **Locuções adverbiais femininas** | à noite, à tarde, às vezes, às pressas, à vista, à toa |
| **Locuções prepositivas femininas** | à procura de, à custa de, à beira de, à espera de, em relação **à**, graças **à** |
| **Locuções conjuntivas femininas** | à medida que, à proporção que |
| **Horas** (determinadas) | às 8h, à meia-noite, à uma hora |
| **Sentido de "à moda de"** | Fez um prato **à** Lampião (à moda de). |
| **Antes de *aquele, aquela, aquilo*** | Refiro-me **àquele** edital. · **Àquilo** não respondeu. |
| **Antes de *a qual*** | A cidade **à qual** me refiro. |

## Crase PROIBIDA

| Caso | Exemplos |
|---|---|
| **Antes de palavra masculina** | a pé, a cavalo, a bordo, a lápis |
| **Antes de verbo** | Começou **a** chorar. |
| **Antes de pronome pessoal, de tratamento e demonstrativos** (exceto aquele/aquilo) | a ela, a Vossa Excelência, a esta, a essa |
| **Antes de indefinidos** | a alguém, a toda, a qualquer, a cada |
| **Antes de numeral cardinal** | a 100 km, a duas pessoas |
| **Palavras repetidas** | cara **a** cara, gota **a** gota, frente **a** frente |
| **Nomes de cidades sem artigo** | Vou **a** Brasília / **a** Roma |

## Casos especiais

- **Casa** e **terra** (sentido de firme/oposto a bordo): sem artigo → sem crase — *Voltei **a** casa. · Chegou **a** terra.* Com determinante: *Voltei **à** casa dos meus pais.*
- **Distância:** *Ele ficou **a** distância* (indeterminada) · *Fica **à** distância de 100 m* (determinada).
- **Pronomes possessivos femininos:** crase **facultativa** — *Refiro-me **a**(**à**) minha mãe.*
- **Nomes próprios femininos de pessoa:** crase **facultativa** — *Entreguei o livro **a**(**à**) Maria.*
- **Até a:** facultativa — *Foi **até a**(**à**) praça.*
- **Senhora, senhorita, dona:** crase — *Fale **à** senhora.*

> 💡 **Plural sem artigo = sem crase:** *Fiz referência **a** funcionárias.* (não há artigo; só preposição). Com artigo: *Fiz referência **às** funcionárias.*
`,
      fc: [
        ["Macete da crase com lugares?", "‘Vou a / volto da → crase’; ‘vou a / volto de → sem crase’. Ex.: Vou à Bahia (volto da Bahia); Vou a Roma (volto de Roma)."],
        ["Crase proibida antes de quê?", "Palavra masculina, verbo, pronome pessoal/de tratamento/demonstrativo (exceto aquele/aquilo), indefinidos, numeral cardinal e palavras repetidas."],
        ["Crase com horas?", "Obrigatória com horas determinadas: às 8h, à meia-noite, à uma hora."],
      ],
      mc: [
        ["Assinale a alternativa em que o uso da crase está CORRETO.", ["Refiro-me à você.", "Começou à chorar.", "Cheguei às oito horas.", "Fez a prova à lápis."], 2, "Com horas determinadas, ocorre crase (às oito horas). ‘A você’ (pronome), ‘a chorar’ (verbo) e ‘a lápis’ (masculino) não levam crase.", "FACIL"],
        ["Assinale a frase em que a crase NÃO deve ser empregada.", ["Vou à Bahia.", "Refiro-me àquele edital.", "Entregue o documento à senhora.", "Fiz referência à funcionários."], 3, "Antes de palavra no plural sem artigo (‘funcionários’, masculino plural), não há crase.", "MEDIO"],
        ["Em ‘O cargo ______ qual me refiro exige experiência’, completa-se corretamente com:", ["a", "à", "há", "ah"], 1, "‘Referir-se a’ + ‘a qual’ = à qual.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Voltei a casa cedo’, não há crase porque ‘casa’, sem determinante, no sentido de lar, dispensa o artigo.", "C", "‘Casa’ sem determinante: sem artigo, sem crase."],
        ["A crase é facultativa antes de pronome possessivo feminino, como em ‘Referi-me a (à) minha mãe’.", "C", "Possessivo feminino: facultativa."],
        ["Emprega-se crase antes de verbos no infinitivo, como em ‘Começou à estudar’.", "E", "Nunca antes de verbo."],
        ["Em ‘Vou à Bahia’, a crase justifica-se porque ‘volto da Bahia’.", "C", "Macete: vou a / volto da → crase."],
      ],
    },
  ],
};
