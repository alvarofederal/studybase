// Bloco 4 — Classes de Palavras (cap. 7–16 da gramática-base)
export default {
  nome: "Classes de Palavras (Morfologia)",
  slug: "classes-de-palavras",
  descricao: "Substantivo, adjetivo, artigo, numeral, pronome (e colocação pronominal), verbo, advérbio, preposição, conjunção e interjeição.",
  ordem: 4,
  topicos: [
    {
      titulo: "Substantivo: Gênero, Número e Plural dos Compostos",
      slug: "substantivo",
      resumo: "O que mais cai é o plural dos substantivos compostos: variam substantivo, adjetivo, numeral e pronome; não variam verbo, advérbio, preposição e interjeição. Cuidado com -ão (ões/ães/ãos) e com palavras que perderam o hífen.",
      conteudo: `# Substantivo: Gênero, Número e Plural dos Compostos

## Classificação

Comum × próprio · concreto × abstrato · simples × composto · primitivo × derivado · coletivo (*cardume, alcateia, elenco*).

## Gênero

| Tipo | Como é | Exemplos |
|---|---|---|
| **Biformes** | masculino e feminino diferentes | menino/menina; **heterônimos**: homem/mulher, bode/cabra |
| **Uniformes — comuns de dois gêneros** | mesma forma, artigo muda | o/a colega, o/a jornalista, o/a cliente |
| **Uniformes — epicenos** | animais; um só gênero + macho/fêmea | a cobra (macho/fêmea), o jacaré |
| **Uniformes — sobrecomuns** | pessoas; um só gênero | a criança, a testemunha, a vítima, o indivíduo |

Alguns que enganam: **o** guaraná, **o** champanhe, **o** dó, **a** alface, **a** cal, **a** dengue, **o** lança-perfume.

## Plural dos terminados em -ÃO

| Final | Regra | Exemplos |
|---|---|---|
| **-ões** (maioria) | | ações, balões, leões |
| **-ães** | | cães, pães, capitães, alemães, escrivães |
| **-ãos** | | mãos, cidadãos, irmãos, cristãos, pagãos, órfãos, grãos, bênçãos |

## Plural por terminação

- **-al, -el, -ol, -ul:** troca *l* por *is* — *jornais, papéis, anzóis, paúis*.
- **-il:** oxítonas → *-is* (*fuzis*); paroxítonas → *-eis* (*répteis, fósseis*).
- **-r, -z:** + *es* — *mulheres, luzes*. (*caráter → caracteres; júnior → juniores*).
- **-s:** oxítonas + *es* (*país → países, mês → meses*); paroxítonas **invariáveis** (*o lápis, os lápis; o atlas, os atlas*).

## ⭐ Plural dos substantivos compostos

**Variam:** substantivo, adjetivo, numeral e pronome.
**Não variam:** verbo, advérbio, preposição, interjeição, conjunção.

| Estrutura | Regra | Exemplos |
|---|---|---|
| subst. + subst. (adição) | ambos variam | tenentes-coronéis, tios-avôs |
| subst. + adj. / adj. + subst. | ambos | cachorros-quentes, baixos-relevos, amores-perfeitos |
| numeral + subst. | ambos | segundas-feiras, meios-fios |
| verbo + subst. | só o substantivo | beija-flores, guarda-chuvas, porta-bandeiras |
| advérbio + adj. | só o adjetivo | abaixo-assinados, alto-falantes |
| subst. + prep. + subst. | só o primeiro | pés de moleque, mulas sem cabeça, bichos de sete cabeças |
| 2º elemento delimita o 1º (semelhança/finalidade) | normalmente só o 1º varia | peixes-espada, bombas-relógio, salários-família |
| origem/gentílico | só o último | afro-brasileiros, nova-iorquinos |
| onomatopeia | só o último | tique-taques, pingue-pongues |
| frases substantivadas | invariável (só o determinante) | os leva e traz, os bumba meu boi |
| prefixo + palavra | prefixo nunca varia | vice-campeões |
| guarda (verbo) + subst. | só o 2º | guarda-roupas · mas **guardas**-civis, guardas-noturnos (subst. + adj.) |
| abreviados grã-, grão-, bel-, dom-, são- | só o outro elemento | grã-duquesas, grão-mestres |

Casos especiais: **os sem-terra, os sem-teto** (invariáveis), **os mapas-múndi, os arcos-íris** (VOLP), **mal-estares, bem-estares**.

> 💡 Em dúvida, desmonte o composto: **que classe tem cada parte?** Só as classes variáveis (substantivo, adjetivo, numeral, pronome) vão ao plural.
`,
      fc: [
        ["Quais classes variam no plural dos compostos?", "Substantivo, adjetivo, numeral e pronome. Não variam: verbo, advérbio, preposição, interjeição e conjunção."],
        ["Plural de substantivo composto verbo + substantivo?", "Só o substantivo varia: beija-flores, guarda-chuvas, porta-bandeiras."],
        ["Qual o plural de ‘guarda-civil’ e de ‘guarda-roupa’?", "Guardas-civis (guarda é substantivo + adjetivo: ambos variam); guarda-roupas (guarda é verbo: só o substantivo varia)."],
      ],
      mc: [
        ["Assinale a alternativa cujo plural está INCORRETO.", ["tenentes-coronéis", "beija-flores", "guarda-civis", "cachorros-quentes"], 2, "‘Guarda-civil’ → guardas-civis (substantivo + adjetivo, ambos variam).", "MEDIO"],
        ["Está corretamente flexionado no plural o composto:", ["os abaixo-assinado", "os abaixo-assinados", "os abaixos-assinados", "os abaixo assinados"], 1, "Advérbio + adjetivo: só o adjetivo varia.", "MEDIO"],
        ["O plural de ‘cidadão’, ‘capitão’ e ‘balão’ é, respectivamente:", ["cidadões, capitães, balões", "cidadãos, capitães, balões", "cidadãos, capitões, balães", "cidadães, capitães, balões"], 1, "-ãos (cidadãos), -ães (capitães) e -ões (balões).", "MEDIO"],
      ],
      ce: [
        ["O plural de ‘bomba-relógio’ pode ser ‘bombas-relógio’, pois o segundo elemento apenas delimita o primeiro, indicando finalidade.", "C", "Nesses compostos normalmente só o primeiro varia."],
        ["O substantivo composto ‘vice-campeão’ faz o plural ‘vices-campeões’, pois o prefixo ‘vice’ também varia.", "E", "Prefixos não variam: vice-campeões."],
        ["As palavras ‘lápis’ e ‘atlas’ são invariáveis no plural: ‘os lápis’ e ‘os atlas’.", "C", "Paroxítonas terminadas em s não variam."],
        ["‘Os sem-terra’ mantêm-se invariáveis no plural, pois se trata de adjetivo composto substantivado.", "C", "Sem-terra, sem-teto: invariáveis."],
      ],
    },
    {
      titulo: "Adjetivo, Artigo e Numeral",
      slug: "adjetivo-artigo-numeral",
      resumo: "Adjetivo: identificar e dominar o valor discursivo; compostos só o último varia; cores com substantivo ficam invariáveis. Artigo define, indefine e substantiva; ‘um’ pode indicar aproximação. Numeral: cardinais, ordinais, multiplicativos e fracionários.",
      conteudo: `# Adjetivo, Artigo e Numeral

## Adjetivo

**Caracteriza** o substantivo; concorda com ele em gênero e número. Pode ser **locução adjetiva** (*de pai = paterno; de boca = bucal/oral; de olho = ocular; de rim = renal; de mãe = materno*).

### Posição e sentido

A **posição** muda o sentido: *homem **grande*** (alto) × *grande **homem*** (ilustre); *pobre **homem*** (digno de pena) × *homem **pobre*** (sem recursos); *certa **notícia*** (alguma) × *notícia **certa*** (segura).

### Adjetivos compostos

- **Só o último varia:** *luso-brasileiros, político-institucionais, verde-claros*.
- **Cor + substantivo** → **invariável**: *azul-marinho, verde-garrafa, amarelo-ouro, cor-de-rosa*.
- Substantivos usados como cor são invariáveis: *camisas **rosa**, tecidos **laranja***.
- **Surdo-mudo** é substantivo/adjetivo com plural *surdos-mudos* (ambos variam).

### Graus

- **Comparativo sintético:** *melhor, pior, maior, menor, superior, inferior* (não existe ~~mais bom~~, ~~mais melhor~~, ~~mais superior~~).
- **Superlativo absoluto sintético** (cai em prova): *paupérrimo (pobre), antiquíssimo (antigo), amicíssimo (amigo), celebérrimo (célebre), nobilíssimo (nobre), ferocíssimo (feroz), sapientíssimo (sábio), dulcíssimo (doce), fidelíssimo (fiel)*.
- Especiais: *bom → ótimo; mau → péssimo; grande → máximo; pequeno → mínimo*.

## Artigo

- **Definidos:** o, a, os, as · **Indefinidos:** um, uma, uns, umas.
- **Valores:** definir o já conhecido; indefinir o novo; **substantivar** (*o jantar, o porquê, um não*); **aproximação** com *uns/umas* (*tem uns 30 anos*); **ênfase** (*Ele é **um** professor!*).
- **Todo o** × **todo:** *todo **o** dia* = o dia inteiro; *todo dia* = cada dia.
- Cuidado: *"o"* nem sempre é artigo — em *"O que eu disse é verdade"* (= *aquilo que*), é **pronome demonstrativo**.

## Numeral

| Tipo | Exemplos |
|---|---|
| **Cardinal** | um, dois, mil |
| **Ordinal** | primeiro, segundo, centésimo |
| **Multiplicativo** | dobro, triplo, quádruplo |
| **Fracionário** | meio, terço, quarto, onze avos |

- Séculos lê-se em ordinal até o décimo (*século X: décimo*) e em cardinal depois (*século XX: vinte*; mas é aceito *vigésimo*).
- **Ambos** é numeral e exige artigo: *ambos **os** lados*.
`,
      fc: [
        ["Como se flexiona adjetivo composto de cor com substantivo (azul-marinho)?", "Fica invariável: camisas azul-marinho, olhos verde-garrafa."],
        ["Qual a diferença de ‘todo dia’ e ‘todo o dia’?", "‘Todo dia’ = cada dia. ‘Todo o dia’ = o dia inteiro."],
        ["Superlativo sintético de ‘pobre’, ‘amigo’, ‘antigo’ e ‘nobre’?", "Paupérrimo, amicíssimo, antiquíssimo, nobilíssimo."],
      ],
      mc: [
        ["Assinale a alternativa em que o superlativo sintético está INCORRETO.", ["paupérrimo (pobre)", "antiquíssimo (antigo)", "amicíssimo (amigo)", "nobelíssimo (nobre)"], 3, "O superlativo sintético de ‘nobre’ é ‘nobilíssimo’.", "DIFICIL"],
        ["Em ‘Ele tem uns trinta anos’, o termo ‘uns’ expressa:", ["indefinição de quantidade exata, indicando aproximação.", "certeza numérica.", "posse.", "dúvida quanto ao gênero."], 0, "O artigo indefinido plural, antes de numeral, expressa aproximação.", "MEDIO"],
        ["Assinale a alternativa em que a flexão do adjetivo composto está correta.", ["camisas azul-marinhos", "camisas azuis-marinho", "camisas azul-marinho", "camisas azuis-marinhos"], 2, "Cor + substantivo = invariável.", "MEDIO"],
      ],
      ce: [
        ["Em ‘Trabalhou todo o dia’, a presença do artigo indica que o trabalho ocorreu durante o dia inteiro.", "C", "‘Todo o dia’ = o dia inteiro."],
        ["A flexão ‘mais melhor’ é admitida na norma culta como reforço do comparativo.", "E", "Melhor já é comparativo sintético: não se usa ‘mais melhor’."],
        ["O adjetivo composto ‘luso-brasileiro’ faz o plural ‘luso-brasileiros’, com flexão apenas no último elemento.", "C", "Adjetivo composto: só o último varia."],
        ["Em ‘O que me preocupa é o prazo’, o primeiro ‘o’ é artigo definido.", "E", "É pronome demonstrativo (= aquilo que)."],
      ],
    },
    {
      titulo: "Pronomes: Emprego e Valor Discursivo",
      slug: "pronomes",
      resumo: "Pessoais (retos/oblíquos), de tratamento, possessivos, demonstrativos, relativos, indefinidos e interrogativos. O que mais cai: relativos (cujo, onde, preposição antes do relativo), demonstrativos (este/esse/aquele) e pessoais (eu × mim).",
      conteudo: `# Pronomes: Emprego e Valor Discursivo

> O autor da gramática-base indica pronome, verbo e conjunção como as classes **mais cobradas**.

## Pessoais

| | Reto (sujeito) | Oblíquo átono | Oblíquo tônico (com prep.) |
|---|---|---|---|
| 1ª sing. | eu | me | mim, comigo |
| 2ª sing. | tu | te | ti, contigo |
| 3ª | ele/ela | o, a, lhe, se | ele, ela, si, consigo |
| 1ª pl. | nós | nos | nós, conosco |

### Eu × mim

- **Eu** é sujeito; **mim** vem depois de preposição.
- **"Para eu fazer"** (e não ~~para mim fazer~~): o pronome é **sujeito** do infinitivo.
- **"Entre mim e você"** (nunca ~~entre eu e você~~): entre é preposição.
- *Segundo eu*, *como eu*, *conforme eu*: usam o reto (não são preposições regidas).

### O/a × lhe

- **o, a, os, as** → objeto **direto** (*Vi-o*).
- **lhe(s)** → objeto **indireto** (*Obedeci-lhe; Entreguei-lhe o livro*).
- Após verbos terminados em **r, s, z**: *-lo, -la* (*comprá-lo*); em **ditongo nasal**: *-no, -na* (*compraram-no*).

## Pronomes de tratamento

Concordam com a **3ª pessoa**: *"Vossa Excelência **precisa** ..."*. Usa-se **Vossa** para falar **com** a pessoa e **Sua** para falar **dela**: *Sua Excelência* **chegou**.

## Demonstrativos

| | Espaço | Tempo | No texto |
|---|---|---|---|
| **este** | perto de quem fala | presente | aquilo que **vem a seguir** (catáfora) |
| **esse** | perto de quem ouve | passado próximo/futuro | aquilo que **já foi dito** (anáfora) |
| **aquele** | longe de ambos | passado remoto | o mais distante |

- **Este** = o mais próximo (o último citado); **aquele** = o mais distante (o primeiro).
- **o, a, os, as** = demonstrativos quando equivalem a *aquele(s), aquilo*: *Fiz **o** que pude*.

## Relativos

| Pronome | Uso |
|---|---|
| **que** | pessoa/coisa; = *o qual* |
| **quem** | só pessoa, **com preposição** |
| **cujo(a)** | posse; concorda com o **possuído**; **não** leva artigo depois |
| **onde** | lugar (= *em que*) |
| **quanto, como, quando** | tudo quanto, o modo como, a hora quando |

### ⭐ Preposição antes do relativo

A preposição exigida pelo **verbo ou nome** vem antes do relativo:

- *O filme **a que** assisti* (assistir **a**).
- *O cargo **a que** aspiro* (aspirar **a**).
- *O livro **de que** preciso* (precisar **de**).
- *A pessoa **com quem** converso.*
- *A cidade **em que** (ou *onde*) nasci* — **onde** só se usa para **lugar**.

## Indefinidos e interrogativos

Indefinidos: *alguém, ninguém, tudo, nada, outrem, cada, algum, nenhum, certo, vários*. Interrogativos: *que? quem? qual? quanto?*
`,
      fc: [
        ["‘Para mim fazer’ ou ‘para eu fazer’?", "Para EU fazer: o pronome é sujeito do infinitivo; ‘mim’ só aparece como complemento de preposição (para mim, entre mim e ti)."],
        ["Este, esse e aquele no texto?", "Este antecipa o que vem a seguir (ou o mais próximo); esse retoma o que já foi dito; aquele indica o mais distante."],
        ["Como funciona ‘cujo’?", "Indica posse, concorda com o possuído (a coisa que vem depois), não admite artigo depois e pode vir com preposição: ‘o autor cuja obra li’, ‘de cujo livro falei’."],
      ],
      mc: [
        ["Assinale a frase correta.", ["Trouxe um livro para mim ler.", "Entre eu e você não há segredos.", "Trouxe um livro para eu ler.", "Isso é para mim e você resolvermos."], 2, "‘Eu’ é sujeito de ‘ler’: para eu ler. Estão incorretas: ‘para mim ler’, ‘entre eu e você’ (o certo é entre mim e você) e ‘para mim e você resolvermos’ (o pronome é sujeito: para eu e você resolvermos).", "MEDIO"],
        ["Assinale a alternativa em que a preposição antes do relativo está correta.", ["O filme que assisti foi ótimo.", "O filme a que assisti foi ótimo.", "O filme o qual assisti foi ótimo.", "O filme de que assisti foi ótimo."], 1, "Assistir (ver) rege ‘a’: o filme a que assisti.", "MEDIO"],
        ["Em ‘O autor cuja obra li ganhou o prêmio’, o pronome ‘cujo’ estabelece relação de:", ["posse entre ‘autor’ e ‘obra’.", "tempo.", "lugar.", "modo."], 0, "‘Cujo’ liga o possuidor (autor) ao possuído (obra).", "FACIL"],
      ],
      ce: [
        ["Na frase ‘Entre mim e você não há mais o que discutir’, o emprego de ‘mim’ está de acordo com a norma-padrão.", "C", "Depois da preposição ‘entre’ usa-se o pronome oblíquo tônico."],
        ["No trecho ‘A casa onde moro é antiga’, o termo ‘onde’ pode ser substituído por ‘em que’ sem prejuízo da correção.", "C", "‘Onde’ = em que, lugar."],
        ["O pronome ‘cujo’ concorda em gênero e número com o termo que o antecede (possuidor).", "E", "Concorda com o possuído, que vem depois."],
        ["Pronomes de tratamento, como ‘Vossa Senhoria’, exigem o verbo na terceira pessoa.", "C", "Concordam com a 3ª pessoa, apesar de se referirem à 2ª."],
      ],
    },
    {
      titulo: "Colocação Pronominal: Próclise, Ênclise e Mesóclise",
      slug: "colocacao-pronominal",
      resumo: "Próclise com palavra atrativa (negação, advérbio sem pausa, relativo, conjunção subordinativa, indefinido, interrogativo). Ênclise quando não há atrativo (início, imperativo afirmativo, gerúndio, infinitivo, após pausa). Mesóclise só no futuro, sem atrativo.",
      conteudo: `# Colocação Pronominal: Próclise, Ênclise e Mesóclise

Trata da **posição dos pronomes oblíquos átonos** (*me, te, se, o, a, lhe, nos, vos, os, as, lhes*) em relação ao verbo.

- **Próclise:** antes do verbo — *Não **se** esqueça.*
- **Ênclise:** depois — *Esqueça-**se**.*
- **Mesóclise:** no meio — *Dar-**lhe**-ei.*

## Próclise (palavra atrativa antes do verbo)

| Atrativo | Exemplo |
|---|---|
| **Negação** (não, nunca, jamais, ninguém, nada, nem) | Não **me** disseram. |
| **Advérbio** sem pausa (já, talvez, só, ainda, sempre, também, aqui) | Agora **se** negam a depor. |
| **Conjunção subordinativa** (que, se, como, quando, embora, porque) | Soube que **me** negariam. |
| **Pronome relativo** (que, quem, cujo, onde) | Duas pessoas que **se** encontravam. |
| **Indefinido** (todos, alguém, tudo, poucos) | Poucos **te** deram a oportunidade. |
| **Interrogativo** (que, quem, qual) | Quem **te** fez a encomenda? |
| **Preposição em + gerúndio** | Em **se** plantando, tudo dá. |
| **Orações optativas/exclamativas** | Deus **te** proteja! |
| **Conjunções alternativas/aditivas** | Ora **me** ajuda, ora não. |

> 💡 **Subordinadas:** em orações subordinadas com verbo flexionado, a banca (inclusive o CEBRASPE) costuma aceitar **só a próclise**: *"enquanto os protestos **se** espalhavam"* — a próclise se justifica pela natureza subordinada, explicitada pela conjunção.

## Ênclise (sem atrativo)

1. **Verbo no início** da oração: *Vou-**me** embora. Disseram-**me** a verdade.*
2. **Imperativo afirmativo:** *Dê-**me** o livro.*
3. **Gerúndio** (sem atrativo): *Saiu, despedindo-**se**.*
4. **Infinitivo impessoal** sem atrativo: *É difícil esquecer-**se**.*
5. **Após pausa** (vírgula), mesmo com palavra atrativa antes: *Agora, negam-**se** a depor.*

## Mesóclise

Só nos **futuros** (do presente e do pretérito), **quando não há atrativo**: *Dar-**lhe**-ei o livro. Far-**se**-ia o possível.*
Com atrativo, volta a próclise: *Não **lhe** darei. Talvez **se** fizesse.*

## Outros pontos

- **Não se inicia frase com pronome átono** na norma culta: ~~*Me disseram*~~ → *Disseram-me*.
- Futuro do presente + o/a: **não** use *~~comprarão-na~~*; use próclise: *a comprarão*.
- **Locução verbal:** o pronome pode ficar depois do auxiliar ou depois do verbo principal: *Vou-**me** embora / Quero ajudar-**te***. Com atrativo, antes do auxiliar: *Não **te** quero ajudar.*
`,
      fc: [
        ["Quando usar mesóclise?", "Somente com o verbo no futuro do presente ou do pretérito e sem palavra atrativa antes: ‘Dar-lhe-ei’, ‘Far-se-ia’. Com atrativo, usa-se próclise (‘Não lhe darei’)."],
        ["Em oração subordinada com verbo flexionado, qual a posição preferida do pronome?", "Próclise (antes do verbo): ‘Soube que me negariam’, ‘enquanto os protestos se espalhavam’."],
        ["Em que casos a ênclise é obrigatória?", "Verbo no início da oração, imperativo afirmativo, gerúndio sem atrativo e após pausa (vírgula)."],
      ],
      mc: [
        ["Assinale a alternativa em que a colocação pronominal está de acordo com a norma-padrão.", ["Me disseram a verdade.", "Disseram-me a verdade.", "Nunca disseram-me a verdade.", "Os alunos que disseram-me chegaram."], 1, "Não se inicia frase com pronome átono; e com ‘nunca’ e ‘que’ há atrativo (próclise).", "FACIL"],
        ["Assinale a frase correta quanto à colocação do pronome.", ["Dar-lhe-ei a resposta amanhã.", "Lhe darei a resposta amanhã.", "Darei-lhe a resposta amanhã.", "Não dar-lhe-ei a resposta."], 0, "Mesóclise é correta no futuro sem atrativo. ‘Não lhe darei’ seria o correto com a negação.", "MEDIO"],
        ["Em ‘Quem lhe contou o segredo?’, a próclise justifica-se pela presença de:", ["pronome interrogativo.", "advérbio de lugar.", "preposição.", "verbo no imperativo."], 0, "‘Quem’ é pronome interrogativo: palavra atrativa.", "FACIL"],
      ],
      ce: [
        ["Em ‘Deus te proteja’, a próclise justifica-se por se tratar de oração optativa.", "C", "Orações que exprimem desejo exigem próclise."],
        ["A forma ‘Eles comprarão-na’ está de acordo com a norma-padrão, pois o pronome ‘na’ sucede o verbo no futuro.", "E", "Com o futuro, usam-se mesóclise (comprá-la-ão) ou próclise (a comprarão); nunca ênclise simples."],
        ["No trecho ‘enquanto os protestos se espalhavam’, a próclise é justificada pela conjunção subordinativa ‘enquanto’.", "C", "Conjunção subordinativa é palavra atrativa."],
        ["Mesmo na presença de palavra atrativa, a pausa (vírgula) entre ela e o verbo permite a ênclise: ‘Agora, negam-se a depor’.", "C", "Pausa interrompe a atração: ênclise."],
      ],
    },
    {
      titulo: "Verbo: Conjugação, Modos e Formas Especiais",
      slug: "verbo-conjugacao",
      resumo: "Modos (indicativo, subjuntivo, imperativo), tempos e formas nominais. Os mais cobrados: ver/vir/ter/pôr/trazer/fazer/dizer no futuro do subjuntivo, particípios duplos e verbos defectivos (reaver, falir).",
      conteudo: `# Verbo: Conjugação, Modos e Formas Especiais

## Estrutura

**Radical + vogal temática (a, e, i) + desinência modo-temporal + desinência número-pessoal.** Três conjugações: *-ar, -er, -ir* (e *pôr*, de 2ª conjugação).

## Modos e tempos

| Modo | Ideia | Tempos |
|---|---|---|
| **Indicativo** | certeza | presente, pret. perfeito, imperfeito, mais-que-perfeito, futuro do presente, futuro do pretérito |
| **Subjuntivo** | dúvida, hipótese, desejo | presente, pret. imperfeito, futuro |
| **Imperativo** | ordem, pedido | afirmativo e negativo |
| **Formas nominais** | | infinitivo (pessoal/impessoal), gerúndio, particípio |

## Verbos mais cobrados

| Verbo | Fut. subj. | Dica |
|---|---|---|
| **ver** | quando eu **vir**, se ele **vir** | vi, viu, vimos → *vir* é do verbo **ver** |
| **vir** | quando eu **vier**, se ele **vier** | vim, veio, viemos; *vindo* |
| **ter** | quando eu **tiver** | tenho, tem, têm |
| **pôr** | se ele **puser** (compor: *compuser*) | pus, pôs, pôs |
| **trazer** | se ele **trouxer** | trouxe, trouxeram |
| **fazer** | se ele **fizer** | fiz, fez |
| **dizer** | se ele **disser** | disse |
| **haver** | se houver | houve |
| **querer** | se quiser | quis |
| **poder** | se puder | pôde, puderam |

> ⚠️ *"Se ele **ver** o resultado..."* ✗ → *"Se ele **vir** o resultado..."* ✓ · *"Quando ele **vim**..."* ✗ → *"Quando ele **vier**..."* ✓.

### Derivados seguem o primitivo
*intervir → interveio, interviermos; manter → mantiver; deter → detiver; prever → previu (pret. perf.) e previr (fut. subj.); rever → reviu e revir*.

## Particípios duplos

Regra geral: **regular** com *ter/haver* (voz ativa), **irregular** com *ser/estar* (voz passiva).

| Verbo | Regular | Irregular |
|---|---|---|
| entregar | entregado | **entregue** |
| aceitar | aceitado | **aceito** |
| eleger | elegido | **eleito** |
| expulsar | expulsado | **expulso** |
| pagar | pagado | **pago** |
| ganhar | ganhado | **ganho** |
| gastar | gastado | **gasto** |

> Ex.: *A empresa **tinha entregado** os documentos; os documentos **foram entregues**.* Com **pagar, ganhar, gastar** o uso consagrado é sempre a forma irregular: *tinha pago, tinha ganho, tinha gasto*.

## Verbos defectivos (faltam formas)

- **Reaver:** conjuga-se como *haver* **só onde há v**: *reavemos, reaveis, reouve*; **não** existe ~~*eu reavejo*~~.
- **Falir:** só formas com *i* — *falimos, falis*; não existe ~~*eu falo*~~.
- **Precaver-se:** *precavemo-nos, precavereis*.

## Verbos MARIO (retomando)

*Odiar, mediar, ansiar, remediar, incendiar*: *odeio, medeio, anseio, remedeio, incendeio*.
`,
      fc: [
        ["‘Se ele ____ o resultado’: ver ou vir?", "‘Se ele VIR o resultado’ (verbo ver, futuro do subjuntivo). ‘Se ele VIER à reunião’ é do verbo vir."],
        ["Futuro do subjuntivo de ‘trazer’, ‘fazer’, ‘dizer’ e ‘pôr’?", "Trouxer, fizer, disser, puser."],
        ["Qual particípio com ‘ter’ e qual com ‘ser’ em verbos de particípio duplo?", "Regular com ter/haver (tinha entregado); irregular com ser/estar (foi entregue). Pagar/ganhar/gastar usam sempre o irregular (tinha pago)."],
      ],
      mc: [
        ["Assinale a alternativa que completa corretamente: ‘Se você ______ a prova com calma, ______ o resultado esperado.’", ["fizer / obterá", "fazer / obterá", "fizesse / obterá", "fazia / obterá"], 0, "Fut. do subjuntivo de fazer: fizer; futuro do presente: obterá.", "MEDIO"],
        ["‘Quando você ______ ao escritório, ______ o contrato.’", ["vir / vê", "vir / verá", "vier / verá", "ver / verá"], 2, "Vir → vier (futuro do subj.); ver → verá.", "MEDIO"],
        ["Os candidatos haviam ______ os documentos, e a lista foi ______ à banca.", ["entregado / entregue", "entregue / entregado", "entregue / entregue", "entregado / entregado"], 0, "Pela regra tradicional, o particípio regular acompanha ter/haver (haviam entregado) e o irregular acompanha ser/estar (foi entregue).", "DIFICIL"],
      ],
      ce: [
        ["Em ‘Se ele vir o resultado, ficará satisfeito’, a forma ‘vir’ pertence ao verbo ‘ver’, flexionado no futuro do subjuntivo.", "C", "Ver: se eu vir, se ele vir."],
        ["O verbo ‘reaver’ conjuga-se como ‘haver’ em todas as formas, razão pela qual é correto dizer ‘eu reavejo’.", "E", "Reaver só tem formas em que o haver tem v: reavemos, reaveis, reouve."],
        ["A forma ‘tinha entregue’ é a recomendada na voz ativa com o auxiliar ‘ter’, enquanto ‘foi entregado’ é a recomendada na voz passiva.", "E", "É o contrário: ‘tinha entregado’ e ‘foi entregue’."],
        ["O futuro do subjuntivo de ‘trazer’ na 3ª pessoa do singular é ‘trouxer’.", "C", "Se ele trouxer."],
      ],
    },
    {
      titulo: "Verbo: Emprego de Tempos e Modos, Correlação e Vozes",
      slug: "verbo-tempos-correlacao-vozes",
      resumo: "O emprego do tempo e do modo e a correlação entre eles caem muito: ‘Se eu tivesse… faria’, ‘Se eu tiver… farei’. Voz ativa, passiva (analítica e sintética) e reflexiva; só verbos transitivos diretos passam à passiva.",
      conteudo: `# Verbo: Emprego de Tempos e Modos, Correlação e Vozes

## Valores dos tempos

| Tempo | Valor | Exemplo |
|---|---|---|
| **Presente** | fato atual, hábito, verdade geral, "presente histórico" | A Terra gira. |
| **Pret. perfeito** | fato concluído | Estudei ontem. |
| **Pret. imperfeito** | fato habitual/duradouro no passado; cortesia | Eu **morava** no Rio. / **Queria** um favor. |
| **Mais-que-perfeito** | passado **anterior** a outro passado | Quando cheguei, ela já **saíra** (ou **tinha saído**). |
| **Futuro do presente** | previsão, certeza | Amanhã **choverá**. |
| **Futuro do pretérito** | hipótese, **cortesia**, futuro em relação ao passado | Eu **faria** o curso. / Disse que **viria**. |

## ⭐ Correlação entre tempos e modos

| Condição (oração com *se*) | Resultado |
|---|---|
| **Pret. imperfeito do subjuntivo** | **Futuro do pretérito** — *Se eu **tivesse** tempo, **viajaria**.* |
| **Pret. mais-que-perfeito do subjuntivo** | Futuro do pretérito composto — *Se eu **tivesse estudado**, **teria passado**.* |
| **Futuro do subjuntivo** | **Futuro do presente** — *Se eu **tiver** tempo, **viajarei**.* |
| **Presente do subjuntivo** (com *caso*, *talvez*, *que*) | *Caso ele **venha**, avise-me.* |

❌ *Se eu **tivesse** tempo, **viajarei**.* (tempos descorrelacionados)
❌ *Se eu **tiver** tempo, **viajaria**.*
❌ *Caso ele **vier**...* → ✔ *Caso ele **venha**...*

> 💡 **Embora, ainda que, mesmo que, talvez, quer… quer** pedem **subjuntivo**; **embora** nunca se usa com indicativo.

## Vozes verbais

| Voz | Característica | Exemplo |
|---|---|---|
| **Ativa** | sujeito **pratica** | A banca **elaborou** a prova. |
| **Passiva analítica** | ser/estar + particípio; sujeito **recebe** | A prova **foi elaborada** pela banca. |
| **Passiva sintética** | verbo transitivo direto + **se** (apassivador) | **Elaborou-se** a prova. / **Elaboraram-se** as provas. |
| **Reflexiva** | sujeito pratica e recebe | Ela **se** penteou. |
| **Recíproca** | ação mútua | Eles **se** abraçaram. |

### Transposição ativa → passiva

1. O **objeto direto** vira **sujeito**.
2. O **sujeito** vira **agente da passiva** (*por/pelo/pela*).
3. O verbo **ser** assume o **tempo** do verbo ativo + **particípio** concordando com o novo sujeito.

*Os candidatos fizeram a prova → A prova foi feita pelos candidatos.*

> ⚠️ Só verbos **transitivos diretos** (e transitivos diretos e indiretos, pelo OD) formam passiva. *"Precisa-se de funcionários"* (VTI) → **não** é passiva: o *se* indetermina o sujeito, verbo no singular.
`,
      fc: [
        ["Correlação: ‘Se eu tivesse tempo…’", "…eu viajaria (pretérito imperfeito do subjuntivo + futuro do pretérito)."],
        ["Correlação: ‘Se eu tiver tempo…’", "…eu viajarei (futuro do subjuntivo + futuro do presente)."],
        ["Como passar uma frase da voz ativa para a passiva analítica?", "O objeto direto vira sujeito; o sujeito vira agente da passiva; ser no mesmo tempo do verbo ativo + particípio (A banca elaborou a prova → A prova foi elaborada pela banca)."],
      ],
      mc: [
        ["Assinale a alternativa com correlação verbal correta.", ["Se eu tivesse dinheiro, comprarei o carro.", "Se eu tiver dinheiro, comprarei o carro.", "Se eu tiver dinheiro, compraria o carro.", "Se eu tivesse dinheiro, comprei o carro."], 1, "Futuro do subjuntivo (tiver) + futuro do presente (comprarei).", "MEDIO"],
        ["A frase ‘O Congresso aprovou as leis’ na voz passiva analítica é:", ["As leis foram aprovadas pelo Congresso.", "As leis aprovou-se pelo Congresso.", "As leis eram aprovadas pelo Congresso.", "Aprovaram-se as leis pelo Congresso."], 0, "Ser no pretérito perfeito (foram) + particípio concordando com ‘as leis’ + agente da passiva.", "MEDIO"],
        ["Assinale a alternativa correta quanto ao emprego do modo verbal.", ["Embora ele estuda muito, não passou.", "Embora ele estude muito, não passou.", "Caso ele vier, avise-me.", "Talvez ele chega amanhã."], 1, "‘Embora’ pede subjuntivo (estude). ‘Caso’ pede presente do subjuntivo (venha) e ‘talvez’ também (chegue).", "MEDIO"],
      ],
      ce: [
        ["Em ‘Se eu tivesse estudado, teria passado’, há correlação adequada entre o mais-que-perfeito do subjuntivo e o futuro do pretérito composto.", "C", "Se + pret. mais-que-perfeito do subj. → futuro do pretérito composto (teria passado)."],
        ["‘Precisa-se de engenheiros’ é um exemplo de voz passiva sintética, pois o ‘se’ é partícula apassivadora.", "E", "Precisar é VTI: o ‘se’ indetermina o sujeito; o verbo fica no singular."],
        ["O pretérito mais-que-perfeito indica fato anterior a outro fato já passado.", "C", "Ex.: Quando cheguei, ela já saíra."],
        ["A forma ‘Caso ele vier’ é recomendada pela norma-padrão.", "E", "‘Caso’ exige o presente do subjuntivo: ‘Caso ele venha’."],
      ],
    },
    {
      titulo: "Advérbio, Preposição e Interjeição",
      slug: "adverbio-preposicao-interjeicao",
      resumo: "Advérbio modifica verbo, adjetivo ou outro advérbio e é invariável (meio, bastante, menos, só). Preposição liga termos e ganha valor semântico; sua regência é base de regência e crase. Interjeição expressa emoção.",
      conteudo: `# Advérbio, Preposição e Interjeição

## Advérbio

**Modifica verbo, adjetivo ou outro advérbio** e é **invariável**. Circunstâncias: lugar (*aqui, ali*), tempo (*hoje, já*), modo (*bem, mal, assim*), intensidade (*muito, pouco, bastante*), afirmação (*sim, certamente*), negação (*não, nunca*), dúvida (*talvez, quiçá*).

### Cuidados (concordância nominal)

| Palavra | Adjetivo (varia) | Advérbio (invariável) |
|---|---|---|
| **meio** | meia-noite, meia hora | Ela está **meio** cansada. |
| **bastante** | **bastantes** pessoas (= muitas) | Elas são **bastante** simpáticas. |
| **muito/pouco** | muitos alunos | Elas estudam **muito**. |
| **menos** | — (sempre invariável) | Há **menos** alunos. (nunca ~~menas~~) |
| **só** | Elas estavam **sós** (sozinhas) | **Só** elas chegaram (= apenas). |
| **caro/barato** | Frutas caras | As frutas custam **caro**. |

## Preposição

Liga termos e estabelece relação de sentido (**valor semântico**): *causa (morreu **de** fome), meio (viajou **de** trem), finalidade (veio **para** estudar), posse (livro **de** Ana), companhia (saiu **com** amigos), lugar, tempo, matéria (mesa **de** madeira)*.

- **Essenciais:** *a, ante, após, até, com, contra, de, desde, em, entre, para, perante, por (per), sem, sob, sobre, trás*.
- **Acidentais** (vêm de outras classes): *conforme, durante, exceto, mediante, salvo, segundo*.
- **Combinação** (sem perda de fonema): *a + o = ao*. **Contração** (com perda): *de + o = do; em + a = na; por + a = pela*.

> 💡 O autor da gramática-base lembra: preposição é cobrada principalmente em **regência** (verbal e nominal) e em **crase**.

## Interjeição

Palavra ou expressão que **exprime emoção** (valor semântico): *Ah! (alegria/surpresa), Ai! (dor), Oba! (alegria), Psiu! (chamamento), Silêncio! (ordem), Credo! (espanto)*. Vem seguida de **ponto de exclamação** (ou vírgula).
`,
      fc: [
        ["‘Meio’ varia?", "Como advérbio (= um pouco), não varia: ‘Ela está meio cansada’. Como numeral (= metade), varia: ‘meia hora’, ‘meia-noite’."],
        ["‘Bastante’: varia ou não?", "Adjetivo (= suficiente/muitos), varia em número: ‘bastantes pessoas’. Advérbio (= muito), invariável: ‘elas são bastante simpáticas’."],
        ["Combinação × contração?", "Combinação: preposição + artigo sem alteração (a + o = ao). Contração: com perda de fonema (de + o = do; em + a = na)."],
      ],
      mc: [
        ["Assinale a frase em que o termo destacado está CORRETAMENTE flexionado.", ["Ela estava meia cansada.", "Há menas pessoas na sala.", "Elas são bastante inteligentes.", "As frutas estão baratas demais, custam caras."], 2, "‘Bastante’ advérbio: invariável (e, nesse caso, modifica o adjetivo). As outras: meio (advérbio, invariável), menos (nunca ‘menas’) e ‘custam caro’.", "MEDIO"],
        ["Em ‘O livro de Ana está sobre a mesa de madeira’, as preposições ‘de’ expressam, respectivamente:", ["posse e matéria.", "lugar e posse.", "causa e meio.", "matéria e finalidade."], 0, "‘Livro de Ana’ = posse; ‘mesa de madeira’ = matéria.", "MEDIO"],
        ["A interjeição ‘Psiu!’ expressa, em geral:", ["dor.", "chamamento ou pedido de silêncio.", "alegria.", "espanto."], 1, "É interjeição de chamamento/silêncio.", "FACIL"],
      ],
      ce: [
        ["Em ‘Ela está meio cansada’, a palavra ‘meio’ é advérbio e, portanto, permanece invariável.", "C", "Advérbio de intensidade = um pouco."],
        ["As expressões ‘menos pessoas’ e ‘menas pessoas’ são formas igualmente aceitas pela norma-padrão.", "E", "‘Menos’ é sempre invariável; ‘menas’ não existe."],
        ["‘De’ + ‘o’ = ‘do’ é exemplo de contração; ‘a’ + ‘o’ = ‘ao’ é exemplo de combinação.", "C", "Contração envolve perda de fonema; combinação não."],
        ["Em ‘Elas estavam sós’, o termo ‘sós’ é advérbio.", "E", "‘Sós’ = sozinhas: adjetivo, por isso varia."],
      ],
    },
    {
      titulo: "Conjunção: Coordenativas e Subordinativas",
      slug: "conjuncao",
      resumo: "Quem domina conjunção resolve coesão, reescritura, orações coordenadas e subordinadas e pontuação. Decore as classificações e os valores semânticos (causa, concessão, condição, conformidade, consequência, finalidade, proporção, tempo, comparação).",
      conteudo: `# Conjunção: Coordenativas e Subordinativas

> **Decore.** Conjunção é o "coringa": coesão, reescritura, orações coordenadas e subordinadas, pontuação.

## Coordenativas (ligam orações independentes)

| Tipo | Valor | Conjunções |
|---|---|---|
| **Aditivas** | soma | e, nem, não só… mas também |
| **Adversativas** | oposição | mas, porém, contudo, todavia, entretanto, no entanto, não obstante |
| **Alternativas** | alternância | ou, ora… ora, quer… quer, seja… seja |
| **Conclusivas** | conclusão | logo, portanto, por isso, por conseguinte, assim, pois (depois do verbo) |
| **Explicativas** | explicação | que, porque, pois (antes do verbo) |

> 💡 **Pois:** *Corra, **pois** está tarde* (explicativa) × *Está tarde; devemos, **pois**, partir* (conclusiva, posposta ao verbo, entre vírgulas).

## Subordinativas

| Tipo | Valor | Conjunções |
|---|---|---|
| **Integrantes** | introduzem oração substantiva | que, se |
| **Causais** | causa | porque, como (no início), já que, visto que, uma vez que, pois que |
| **Comparativas** | comparação | como, mais/menos… (do) que, tal qual, assim como |
| **Concessivas** | contrariedade sem impedimento | embora, ainda que, mesmo que, conquanto, apesar de que, se bem que |
| **Condicionais** | condição | se, caso, desde que, contanto que, a menos que, sem que |
| **Conformativas** | conformidade | conforme, segundo, consoante, como |
| **Consecutivas** | consequência | que (tão… que), de modo que, de sorte que, tanto que |
| **Finais** | finalidade | para que, a fim de que |
| **Proporcionais** | proporção | à medida que, à proporção que, quanto mais… mais |
| **Temporais** | tempo | quando, enquanto, assim que, logo que, depois que, antes que |

## Pontos de atenção

- **Concessiva** (*embora estude, não aprende*) × **adversativa** (*estuda, mas não aprende*): sentido próximo, **estrutura** diferente (subordinação × coordenação).
- **Como** pode ser **causal** (*Como estava cansado, dormiu*), **conformativa** (*Como disse o professor, o prazo acaba*) ou **comparativa** (*Estuda como um atleta treina*).
- **Logo:** conclusiva (*Penso, **logo** existo*) × advérbio de tempo (*Chegará **logo***).
- **Mas** é conjunção; **mais** é advérbio/pronome (*Quero mais café, mas sem açúcar*).
- **Porque** (conjunção) × **por que/por quê/porquê**: tópico à parte em *Domínio do Registro Culto*.
`,
      fc: [
        ["Conjunções adversativas?", "Mas, porém, contudo, todavia, entretanto, no entanto, não obstante."],
        ["Conjunções concessivas?", "Embora, ainda que, mesmo que, conquanto, apesar de que, se bem que (exigem subjuntivo, exceto quando introduzidas por ‘apesar de’ + infinitivo)."],
        ["Conjunções conformativas?", "Conforme, segundo, consoante, como (= de acordo com)."],
      ],
      mc: [
        ["‘Embora estivesse cansado, concluiu o trabalho.’ A oração destacada expressa:", ["causa.", "condição.", "concessão.", "conformidade."], 2, "‘Embora’ é conjunção concessiva.", "FACIL"],
        ["Em ‘Corra, pois está tarde’, a conjunção ‘pois’ é:", ["conclusiva.", "explicativa.", "adversativa.", "concessiva."], 1, "‘Pois’ antes do verbo, explica a ordem: explicativa.", "MEDIO"],
        ["‘À medida que o prazo se aproximava, aumentava a ansiedade.’ A conjunção expressa:", ["causa.", "finalidade.", "proporção.", "comparação."], 2, "‘À medida que’ = proporcional.", "FACIL"],
      ],
      ce: [
        ["Em ‘Estudou muito; contudo, não passou’, a conjunção ‘contudo’ expressa ideia de oposição.", "C", "Adversativa."],
        ["Em ‘Penso, logo existo’, ‘logo’ é advérbio de tempo.", "E", "É conjunção conclusiva (= portanto)."],
        ["As conjunções ‘conforme’ e ‘segundo’ podem expressar conformidade.", "C", "Conformativas."],
        ["‘Desde que’ introduz oração subordinada adverbial condicional em ‘Irei, desde que me convidem’.", "C", "Desde que = contanto que (condição)."],
      ],
    },
  ],
};
