// Bloco 2 — Fonologia, Acentuação e Ortografia (cap. 1–3 da gramática-base)
export default {
  nome: "Fonologia, Acentuação e Ortografia",
  slug: "fonologia-acentuacao-ortografia",
  descricao: "Fonemas e sílabas, acentuação gráfica, hífen e Novo Acordo Ortográfico, emprego das letras.",
  ordem: 2,
  topicos: [
    {
      titulo: "Fonologia: Fonemas, Encontros e Separação Silábica",
      slug: "fonologia",
      resumo: "Fonema é o som; letra é o símbolo. Dígrafo = duas letras, um fonema (ch, rr, ss); dífono = uma letra, dois fonemas (x = ks). Ditongo e tritongo ficam na mesma sílaba; hiato se separa.",
      conteudo: `# Fonologia: Fonemas, Encontros e Separação Silábica

## Fonema × letra

- **Fonema:** menor unidade sonora que distingue palavras (*pato × bato*).
- **Letra:** representação escrita. O número de letras nem sempre é o de fonemas.

| Palavra | Letras | Fonemas | Por quê |
|---|---|---|---|
| **hoje** | 4 | 3 | o *h* não tem som |
| **chave** | 5 | 4 | *ch* é dígrafo (1 fonema) |
| **táxi** | 4 | 5 | *x* = /ks/ (dífono) |

- **Dígrafo:** duas letras, um som — *ch, lh, nh, rr, ss, sc, sç, xc, qu, gu* (antes de e/i).
- **Dífono:** uma letra, dois sons — *x* em *táxi, fixo, oxigênio*.

## Classificação dos fonemas

- **Vogais** (a, e, i, o, u): som livre, formam a base da sílaba (orais e nasais).
- **Semivogais** (i, u): não formam sílaba sozinhas — *pai, mau*.
- **Consoantes:** som com obstrução do ar.

## Encontros vocálicos

| Encontro | Definição | Exemplo | Separação |
|---|---|---|---|
| **Ditongo** | vogal + semivogal (ou o inverso) na mesma sílaba | pai, história, quase | **não separa** |
| **Tritongo** | semivogal + vogal + semivogal | Paraguai, enxaguou | **não separa** |
| **Hiato** | duas vogais em sílabas diferentes | sa-ú-de, do-er, ju-í-zo | **separa** |

## Separação silábica

**Separam-se:** hiatos (*pi-a-da*), dígrafos *rr, ss, sc, sç, xc* (*car-ro, pas-sa, nas-cer, cres-ço, ex-ce-to*) e encontros consonantais disjuntos (*ab-so-lu-to, ad-vo-ga-do, sub-ma-ri-no, ap-to*).

**Não se separam:** ditongos e tritongos, dígrafos *ch, lh, nh, qu, gu* (*chu-va, ba-ra-lho*) e encontros consonantais de início de sílaba (*pr, br, tr, gr, bl, cl, pl, fl*: *ca-bra, a-tle-ta*).

## Ortoepia e prosódia

Pronúncia correta de palavras (ortoepia) e posição da sílaba tônica (prosódia). Paroxítonas que costumam ser pronunciadas como proparoxítonas: **rubrica, recorde, ibero, avaro, mendigo, pudico, gratuito, fortuito**. Oxítonas: **refém, Nobel, ruim**.

> 💡 Na prova, fonologia aparece em contagem de fonemas, identificação de ditongo/hiato e divisão silábica. Treine o **som**, não a letra.
`,
      fc: [
        ["Dígrafo × dífono?", "Dígrafo: duas letras representam um só fonema (ch, rr, ss, lh, nh, qu). Dífono: uma letra representa dois fonemas (x = ks em táxi)."],
        ["Ditongo, tritongo e hiato: o que se faz na separação silábica?", "Ditongo e tritongo NÃO se separam (his-tó-ria, Pa-ra-guai). Hiato SE separa (sa-ú-de, do-er)."],
        ["Quais dígrafos se separam na divisão silábica?", "rr, ss, sc, sç, xc: car-ro, pas-sa, nas-cer, cres-ço, ex-ce-to."],
      ],
      mc: [
        ["Em qual palavra o número de fonemas é MAIOR que o de letras?", ["hoje", "chave", "táxi", "queijo"], 2, "Em ‘táxi’, o x é dífono (/ks/): 4 letras e 5 fonemas.", "MEDIO"],
        ["Assinale a palavra cuja separação silábica está INCORRETA.", ["car-ro", "sa-ú-de", "ca-bra", "e-xce-to"], 3, "‘Exceto’ separa-se ex-ce-to: o dígrafo xc se separa. As demais estão corretas.", "MEDIO"],
        ["Em qual alternativa todas as palavras possuem hiato?", ["pai, mau, céu", "saúde, juízo, país", "história, série, quase", "queijo, caixa, ameixa"], 1, "Em sa-ú-de, ju-í-zo e pa-ís as vogais ficam em sílabas diferentes: hiato.", "MEDIO"],
      ],
      ce: [
        ["O vocábulo ‘hoje’ possui quatro letras e três fonemas, já que a letra ‘h’ não representa som.", "C", "H-o-j-e: 4 letras; fonemas /o/, /ʒ/, /i/ = 3."],
        ["O vocábulo ‘Paraguai’ apresenta um tritongo, razão pela qual não se separa a sequência ‘uai’ na divisão silábica.", "C", "Semivogal + vogal + semivogal; fica na mesma sílaba: Pa-ra-guai."],
        ["Em ‘sa-ú-de’, a separação silábica ocorre porque há um ditongo decrescente.", "E", "‘Saúde’ tem hiato (a-ú), e é por isso que se separa."],
        ["O dígrafo ‘rr’ separa-se na divisão silábica, como em ‘car-ro’.", "C", "rr, ss, sc, sç e xc separam-se."],
      ],
    },
    {
      titulo: "Acentuação Gráfica",
      slug: "acentuacao-grafica",
      resumo: "Regras por posição da sílaba tônica: proparoxítonas sempre; paroxítonas só em certas terminações; oxítonas em a/e/o(s), em/ens; monossílabos tônicos em a/e/o(s). Atenção aos hiatos, aos ditongos abertos e a ter/vir.",
      conteudo: `# Acentuação Gráfica

Antes de acentuar, descubra **qual é a sílaba tônica** e **onde ela está**.

## Regras por classificação

| Tipo | Regra | Exemplos |
|---|---|---|
| **Monossílabos tônicos** | terminados em **a(s), e(s), o(s)** | pá, pé, nó, más, dê, pôs |
| **Oxítonas** | terminadas em **a(s), e(s), o(s), em, ens** | sofá, café, cipó, também, parabéns |
| **Paroxítonas** | terminadas em **l, n, r, x, ps, i(s), um(ns), us, ã(s), ão(s)** e em ditongo oral | fácil, hífen, caráter, tórax, bíceps, táxi, lápis, álbum, bônus, ímã, órfão, história |
| **Proparoxítonas** | **todas** | médico, pássaro, lâmpada |

> 💡 Paroxítonas terminadas em **-ens** não levam acento: *hifens, jovens, itens, polens*.

## Hiatos tônicos (i e u)

Acentua-se o **i/u tônico** que forma hiato quando está sozinho na sílaba (ou com **s**): *saída, baú, país, egoísta*.

**Não se acentuam:**
- quando seguidos de **nh**: *rainha, bainha, moinho*;
- quando seguidos de outra consoante na mesma sílaba: *ruim, juiz, Raul*;
- quando vêm **depois de ditongo em paroxítona**: *feiura, baiuca, bocaiuva*.

## Ditongos abertos (éi, éu, ói)

- **Oxítonas e monossílabos:** mantêm o acento — *papéis, chapéu, herói, céu, anzóis*.
- **Paroxítonas:** perderam o acento (Acordo de 2009) — *ideia, assembleia, heroico, jiboia, paranoico*.

## Hiatos "êem" e "ôo" (Acordo)

Perderam o circunflexo: **voo, enjoo, leem, veem, creem, deem, descreem**.

## Trema e acentos diferenciais

- **Trema:** abolido (*linguiça, frequente*); permanece só em nomes estrangeiros (*Müller*).
- **Perderam** o diferencial: *para* (verbo), *pelo, polo, pera, coa*.
- **Mantêm:** *pôr* (verbo) × *por* (preposição); *pôde* (pretérito) × *pode* (presente); *fôrma/forma* (facultativo).

## ⚠️ Ter e vir (campeões de prova)

| | Singular | Plural |
|---|---|---|
| **ter / vir** | ele **tem**, ele **vem** | eles **têm**, eles **vêm** |
| **derivados** (conter, manter, convir, intervir…) | ele **contém, mantém, convém, intervém** (agudo) | eles **contêm, mantêm, convêm, intervêm** (circunflexo) |
`,
      fc: [
        ["Como diferenciar ‘ele tem’ de ‘eles têm’?", "Singular sem acento (tem, vem); plural com circunflexo (têm, vêm). Derivados: singular com agudo (contém, mantém, convém); plural com circunflexo (contêm, mantêm, convêm)."],
        ["Quais paroxítonas são acentuadas?", "As terminadas em l, n, r, x, ps, i(s), um(ns), us, ã(s), ão(s) e em ditongo oral: fácil, hífen, caráter, tórax, bíceps, táxi, lápis, álbum, bônus, ímã, órfão, história."],
        ["Quais palavras perderam acento no Acordo de 2009?", "Ditongos abertos éi/ói em paroxítonas (ideia, heroico); hiato êem/ôo (voo, leem); acento diferencial (para, pelo, polo); trema."],
      ],
      mc: [
        ["Assinale a alternativa em que TODAS as palavras são acentuadas pela mesma regra (paroxítonas terminadas em ditongo oral).", ["história, série, água", "café, sofá, jacaré", "fácil, útil, amável", "tórax, bíceps, fênix"], 0, "História, série e água são paroxítonas terminadas em ditongo oral crescente. As demais seguem outras regras (oxítonas; paroxítonas em l; paroxítonas em x/ps).", "MEDIO"],
        ["Complete: ‘Os candidatos que ______ o edital ______ a prova.’", ["contém / mantém", "contêm / mantêm", "contem / mantem", "contêm / mantém"], 1, "Plural de conter e manter: circunflexo (contêm, mantêm).", "MEDIO"],
        ["Pelo Acordo Ortográfico em vigor, está CORRETA a grafia:", ["idéia", "vôo", "heróico", "assembleia"], 3, "‘Assembleia’ perdeu o acento (paroxítona com ditongo aberto ei). Corretas: ideia, voo, heroico.", "FACIL"],
      ],
      ce: [
        ["Em ‘Eles mantêm o contrato’, o acento circunflexo em ‘mantêm’ indica que o verbo está no plural.", "C", "Plural de manter: mantêm; singular: mantém."],
        ["Pelas regras atuais, a palavra ‘ideia’ mantém o acento agudo, pois contém ditongo aberto.", "E", "Em paroxítonas, o acento do ditongo aberto éi foi abolido: ‘ideia’."],
        ["A palavra ‘saída’ recebe acento gráfico por conter um hiato cujo i tônico está sozinho na sílaba.", "C", "Sa-í-da: i tônico em hiato, sozinho na sílaba."],
        ["Todas as proparoxítonas são acentuadas graficamente.", "C", "Regra sem exceção: médico, pássaro, lâmpada."],
      ],
    },
    {
      titulo: "Hífen e o Novo Acordo Ortográfico",
      slug: "hifen-acordo-ortografico",
      resumo: "Com prefixos, o hífen aparece diante de h ou de letra igual (anti-inflamatório, super-homem, inter-regional); diante de vogal diferente cola (autoescola); diante de r/s dobra (antissocial). Ex-, vice-, pós-, pré-, pró-, recém-, sem-, além- sempre com hífen; co- e re- nunca.",
      conteudo: `# Hífen e o Novo Acordo Ortográfico

O **Acordo Ortográfico da Língua Portuguesa** (assinado em 1990) entrou em vigor no Brasil em **2009**, com uso obrigatório a partir de **2016**. Alfabeto: **26 letras** (k, w, y incluídas).

## Regra geral: prefixo + palavra

O hífen aparece **em duas situações principais**:

1. quando a palavra seguinte começa por **h**: *pré-história, super-homem, anti-higiênico, semi-hospitalar*;
2. quando o prefixo termina na **mesma letra** com que a palavra começa: *anti-inflamatório, micro-ondas, hiper-realismo, inter-regional, sub-bibliotecário*.

## Prefixo terminado em VOGAL

| Situação | Regra | Exemplos |
|---|---|---|
| + vogal **diferente** | junta | autoescola, antiaéreo, extraoficial, infraestrutura |
| + consoante diferente de r/s | junta | anteprojeto, semicírculo, hipermercado |
| + **r** ou **s** | junta e **dobra** | antirracismo, contrarregra, antissocial, ultrassom, minissaia |
| + mesma vogal | hífen | contra-ataque, micro-ondas, arqui-inimigo |

## Prefixo terminado em CONSOANTE

- + mesma consoante → hífen: *inter-regional, sub-bairro*.
- + consoante diferente → junta: *intermunicipal, supersônico*.
- + vogal → junta: *interestadual, superinteressante*.

## Casos especiais (decore)

- **Sempre com hífen:** *ex-* (anterior), *vice-, recém-, sem-, além-, aquém-, grão-/grã-, soto-*: *ex-aluno, vice-presidente, recém-casado, sem-terra, além-mar*.
- **Pós-, pré-, pró-** (tônicos) → hífen com qualquer palavra: *pós-graduação, pré-escolar, pró-reitor*. Átonos juntam: *preconceito, predeterminar, pospor*.
- **Sub-** → hífen antes de **b** e **r**: *sub-bairro, sub-região, sub-reitor*.
- **Circum-** e **pan-** → hífen antes de vogal, **m** e **n**: *circum-navegação, pan-americano*.
- **Co-** → sempre junto: *coordenar, cooperar, coautor*.
- **Re-** → nunca hífen: *reescrever, reeleição*.
- **Mal-** → hífen antes de vogal, **h** ou **l**: *mal-estar, mal-humorado, mal-limpo*; antes de outras consoantes junta: *malcriado, malsucedido*.
- **In-** e **des-** + h: o h cai, sem hífen: *inábil, desumano*.
- **Não** e **quase** como prefixos: sem hífen (*não conformismo*).

> 💡 Prefixo não citado acima segue a **regra geral** (h ou letra igual).
`,
      fc: [
        ["Quando o hífen é obrigatório com prefixos (regra geral)?", "Quando a palavra seguinte começa por H, ou quando o prefixo termina com a mesma letra com que a palavra começa (anti-inflamatório, super-homem, inter-regional)."],
        ["Prefixos que SEMPRE levam hífen?", "ex- (anterior), vice-, recém-, sem-, além-, aquém-, grão-/grã-, soto-. Também pós-, pré-, pró- quando tônicos."],
        ["Prefixos que NUNCA levam hífen?", "co- (coordenar, coautor) e re- (reescrever). E, em geral, prefixo + vogal diferente: autoescola, infraestrutura."],
      ],
      mc: [
        ["Assinale a série em que todas as palavras estão grafadas conforme o Acordo Ortográfico.", ["anti-social, auto-escola, extra-oficial", "antissocial, autoescola, extraoficial", "antissocial, auto-escola, extra-oficial", "anti-social, autoescola, extraoficial"], 1, "Prefixo terminado em vogal + r/s dobra (antissocial) e + vogal diferente junta (autoescola, extraoficial).", "MEDIO"],
        ["Está INCORRETA a grafia:", ["micro-ondas", "ex-presidente", "contrarregra", "recémnascido"], 3, "‘Recém-’ sempre leva hífen: recém-nascido.", "MEDIO"],
        ["Assinale a alternativa em que o hífen está empregado de forma INCORRETA.", ["pré-história", "reeleição", "super-homem", "co-operar"], 3, "O prefixo co- sempre se junta ao segundo elemento: cooperar.", "MEDIO"],
      ],
      ce: [
        ["Segundo a regra geral do hífen com prefixos, grafa-se ‘anti-inflamatório’ porque o prefixo termina na mesma vogal com que a palavra seguinte se inicia.", "C", "Prefixo terminado em i + palavra iniciada por i: hífen."],
        ["O prefixo ‘co-’ liga-se por hífen a palavras iniciadas por ‘o’, como em ‘co-obrigação’.", "E", "Co- junta-se sempre: coobrigação, cooperar."],
        ["Escreve-se ‘ultrassom’, com duplicação do ‘s’, por tratar-se de prefixo terminado em vogal seguido de palavra iniciada por ‘s’.", "C", "Prefixo em vogal + r/s: junta e dobra."],
        ["Os prefixos ‘pós-’, ‘pré-’ e ‘pró-’, quando tônicos, unem-se por hífen a qualquer palavra, como em ‘pós-graduação’.", "C", "Tônicos e acentuados levam hífen."],
      ],
    },
    {
      titulo: "Ortografia: Emprego das Letras",
      slug: "ortografia-emprego-letras",
      resumo: "Foco nos pontos mais cobrados: verbos em -ear/-iar (MARIO), s/z/x/ch/g/j, sufixos (-ês/-esa × -ez/-eza), -izar × -isar, ç, ss, sc. Quando em dúvida, vale a memória visual e o radical da palavra.",
      conteudo: `# Ortografia: Emprego das Letras

## Verbos em -EAR e -IAR

A maioria dos verbos em **-iar** é regular (*copiar: copio*). Cinco **mudam o i em ei** nas formas rizotônicas — o famoso **MARIO**:

> **M**ediar · **A**nsiar · **R**emediar · **I**ncendiar · **O**diar

| Verbo | Presente do indicativo | Presente do subjuntivo |
|---|---|---|
| odiar | odeio, odeias, odeia, odiamos | que eu odeie |
| incendiar | incendeio… | que ele incendeie |
| ansiar | anseio… | que eles anseiem |

Os verbos em **-ear** (*passear, frear, nomear*) tomam **ei** nas formas rizotônicas: *passeio, nomeio, que ele passeie*.

## S, Z, X e CH

| Regra | Exemplos |
|---|---|
| **-ês / -esa** (gentílicos, títulos, profissões) | português, portuguesa, camponês, duquesa |
| **-ez / -eza** (substantivos abstratos) | altivez, rigidez · beleza, pobreza, nobreza |
| **-izar** (a partir de palavras sem *s*) | organizar, fiscalizar, realizar |
| **-isar** (radical já com *s*) | analisar, pesquisar, avisar, improvisar, paralisar |
| **X** depois de ditongo | caixa, faixa, ameixa, baixo |
| **X** depois de *en* | enxada, enxame, enxergar |
| **CH** (exceção após *en*, de radical com *ch*) | encher, enchente, encharcar |

## G ou J

- **-agem** → g: *viagem, garagem, coragem* (exceção: *pajem, lambujem*).
- Verbos em **-jar** → j: *viajar → viaje (subjuntivo)*; verbos em **-ger/-gir** → g: *fugir, tingir, proteger*.
- Palavras de origem indígena/africana/tupi costumam levar **j**: *jiló, jeito, canjica, jibóia*.

## Ç, SS, SC, SÇ

- **Ç** nunca inicia palavra; vem antes de a, o, u: *açúcar, coração*; depois de ditongo: *feição, eleição*.
- **SS:** *passar, expressão* (entre vogais); **SC/SÇ:** *nascer, crescer, desço, cresça*.

## Letras maiúsculas (essencial)

Meses, dias da semana e estações: **minúsculas**. Pontos cardeais: maiúsculos quando designam **região** (*o Nordeste do Brasil*) e minúsculos quando indicam **direção** (*siga para o norte*).

> 💡 Dica de prova: ao ver uma palavra "estranha", pense na **família de palavras** — *análise → analisar* (radical com *s*, por isso *-isar*).
`,
      fc: [
        ["O que significa a sigla MARIO?", "Mediar, Ansiar, Remediar, Incendiar, Odiar: verbos em -iar que viram -eio nas formas rizotônicas (odeio, anseio, remedeio, incendeio, medeio)."],
        ["-izar ou -isar?", "-izar quando o radical não tem s (organizar, fiscalizar). -isar quando o radical já tem s (análise → analisar; pesquisa → pesquisar; aviso → avisar)."],
        ["-ês/-esa × -ez/-eza?", "-ês/-esa: gentílicos, profissões e títulos (português, duquesa). -ez/-eza: substantivos abstratos (altivez, beleza, pobreza)."],
      ],
      mc: [
        ["Complete corretamente: ‘É preciso que ele ______ o conflito entre as partes.’", ["media", "medeie", "mediai", "medie"], 1, "Mediar é do grupo MARIO: que ele medeie.", "MEDIO"],
        ["Assinale a série em que todas as palavras estão grafadas corretamente.", ["analizar, pesquizar, avizar", "analisar, pesquisar, avisar", "analizar, pesquisar, avisar", "analisar, pesquizar, avizar"], 1, "As palavras vêm de análise, pesquisa e aviso (radicais com s): -isar.", "MEDIO"],
        ["Está CORRETA a grafia em:", ["Ele sempre viage para o Nordeste.", "A enchente chegou à garagem.", "Ele ainda anceia pela promoção.", "Houve ameicha de atraso."], 1, "‘Enchente’ (de encher, radical com ch) e ‘garagem’ (-agem). Corretos: viaje, anseia, ameixa.", "DIFICIL"],
      ],
      ce: [
        ["O verbo ‘odiar’ é irregular no presente do indicativo: ‘eu odeio’, ‘ele odeia’.", "C", "Odiar integra o MARIO (mediar, ansiar, remediar, incendiar, odiar)."],
        ["A grafia ‘pesquizar’ está correta, pois o sufixo -izar forma verbos a partir de substantivos.", "E", "De ‘pesquisa’ (radical com s), forma-se ‘pesquisar’."],
        ["Em ‘pobreza’ e ‘altivez’, os sufixos -eza e -ez formam substantivos abstratos.", "C", "-eza/-ez formam substantivos abstratos."],
        ["Pontos cardeais são sempre escritos com inicial maiúscula.", "E", "Maiúscula quando designam região; minúscula quando indicam direção."],
      ],
    },
  ],
};
