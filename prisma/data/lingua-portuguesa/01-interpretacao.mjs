// Bloco 1 — Interpretação de Textos
// Formato: fc = [frente, verso] · mc = [pergunta, [4 opções], índiceCorreto, explicação, dificuldade?] · ce = [assertiva, "C"|"E", explicação]
export default {
  nome: "Interpretação de Textos",
  slug: "interpretacao-de-textos",
  descricao: "Compreensão, inferência, tipologia, gêneros, coesão e coerência — a base de toda prova de Língua Portuguesa.",
  ordem: 1,
  topicos: [
    {
      titulo: "Compreensão, Interpretação e Inferência",
      slug: "compreensao-interpretacao-inferencia",
      resumo: "Compreender é captar o que o texto diz; interpretar/inferir é concluir o que ele permite concluir; extrapolar é ir além dele (erro clássico). Pressuposto vem de marcas do enunciado; subentendido é insinuação.",
      conteudo: `# Compreensão, Interpretação e Inferência

## Três níveis de leitura

| Nível | O que é | Na prova |
|---|---|---|
| **Compreensão** | O que o texto diz de forma explícita | Item que repete ou parafraseia o trecho |
| **Interpretação / inferência** | O que o texto **permite concluir**, mesmo sem dizer | Item correto que exige raciocínio |
| **Extrapolação** | Ir **além** do que o texto autoriza | Principal armadilha das bancas |

> 💡 Regra de ouro: a resposta está **no texto**. Conhecimento de mundo não autoriza concluir o que o texto não permite.

## Como a banca constrói o item errado

- **Extrapolação:** acrescenta informação que o texto não traz.
- **Redução:** toma a parte pelo todo (o texto fala de "alguns" e o item diz "todos").
- **Contradição:** nega o que o texto afirma.
- **Inversão:** troca causa e efeito, agente e paciente.
- **Absolutização:** usa "sempre", "nunca", "apenas", "somente" onde o texto admite exceções.

> 💡 Nem toda palavra absoluta torna o item errado: ele só erra se **contradiz** o texto. E **incompleto não é errado** — o item pode dizer menos do que o texto, desde que não o contradiga.

## Ideia central, tese e argumentos

- **Ideia central / tese:** o ponto de vista que o autor defende.
- **Argumentos:** razões, dados e exemplos que sustentam a tese.
- **Ponto de vista:** posição do autor — percebida pela escolha de palavras, pela ordem e pela ênfase.

## Pressuposto × subentendido

| | Pressuposto | Subentendido |
|---|---|---|
| Origem | **Marca linguística** presente no enunciado | **Contexto**, insinuação |
| Responsabilidade | Do enunciador (não dá para negar sem se contradizer) | Do interlocutor, que o deduz |
| Exemplo | "A empresa **deixou de** pagar o bônus" → pagava antes | "Está frio aqui", dito perto de uma janela aberta → pedido para fechá-la |

**Marcadores de pressuposto:** *deixar de, continuar, voltar a, começar a, ainda, já, agora, antigo, ex-*, orações adjetivas, perguntas com "por que".

## Estratégia de prova

1. Leia o item **antes** de procurar no texto: o que ele afirma, de fato?
2. Localize o trecho que o sustenta ou o contradiz.
3. Verifique quantificadores, tempos verbais e relações de causa/efeito.
4. Só marque Certo se o texto **autoriza**; na dúvida entre "provável" e "autorizado", vale o autorizado.
`,
      fc: [
        ["O que é extrapolação em interpretação de texto?", "Atribuir ao texto algo que ele não diz nem permite concluir — ir além do que o texto autoriza."],
        ["Diferença entre pressuposto e subentendido?", "Pressuposto decorre de marcas no próprio enunciado (ex.: ‘deixou de’, ‘continua’). Subentendido é insinuação que depende do contexto e fica por conta do interlocutor."],
        ["Quais são as principais ‘armadilhas’ dos itens errados?", "Extrapolação, redução (parte pelo todo), contradição, inversão (causa/efeito, agente/paciente) e absolutização (sempre, nunca, apenas)."],
      ],
      mc: [
        ["Em ‘O banco deixou de cobrar a tarifa’, está pressuposto que:", ["o banco nunca cobrou a tarifa.", "o banco cobrava a tarifa anteriormente.", "a tarifa foi extinta por lei.", "o cliente deixou de pagar a tarifa."], 1, "‘Deixar de’ é marcador de pressuposto: a ação ocorria antes.", "FACIL"],
        ["Assinale a operação que caracteriza extrapolação na leitura de um texto.", ["Parafrasear um trecho com outras palavras.", "Atribuir ao autor uma conclusão que o texto não autoriza.", "Identificar a tese defendida.", "Reconhecer a ordem dos argumentos."], 1, "Extrapolar é ir além do texto, acrescentando o que ele não permite concluir."],
        ["Qual alternativa traz um subentendido, e não um pressuposto?", ["‘Maria voltou a estudar.’", "‘O antigo diretor foi demitido.’", "‘Está muito frio nesta sala’, dito a quem está perto da janela aberta.", "‘Ele continua doente.’"], 2, "O pedido para fechar a janela não está marcado no enunciado: é deduzido do contexto. As demais têm marcadores de pressuposto (voltar a, antigo, continuar).", "MEDIO"],
      ],
      ce: [
        ["Em ‘A empresa continua lucrando’, há o pressuposto de que a empresa já lucrava anteriormente.", "C", "‘Continuar’ é marcador de pressuposto."],
        ["Inferir e extrapolar são procedimentos equivalentes, pois em ambos o leitor acrescenta ao texto informações que ele não autoriza.", "E", "Inferir é concluir com base no texto; extrapolar é que vai além do que o texto autoriza."],
        ["O pressuposto decorre de marcas linguísticas presentes no enunciado, ao passo que o subentendido depende do contexto e da dedução do interlocutor.", "C", "Distinção clássica entre os dois conceitos."],
        ["Todo item que contenha termos como ‘sempre’, ‘nunca’ ou ‘apenas’ está necessariamente errado.", "E", "O item só está errado se contradisser o texto; o texto pode autorizar a afirmação absoluta."],
      ],
    },
    {
      titulo: "Tipologia Textual, Gêneros e Funções da Linguagem",
      slug: "tipologia-generos-funcoes",
      resumo: "Os tipos textuais (narração, descrição, dissertação, injunção) se reconhecem por marcas linguísticas; os gêneros são as formas concretas (notícia, crônica, ofício). As funções da linguagem dependem do elemento da comunicação que o texto privilegia.",
      conteudo: `# Tipologia Textual, Gêneros e Funções da Linguagem

## Tipos textuais e suas marcas

| Tipo | Objetivo | Marcas típicas |
|---|---|---|
| **Narração** | Contar fatos no tempo | Verbos de ação, pretérito perfeito/imperfeito, advérbios de tempo, personagens |
| **Descrição** | Caracterizar seres, lugares, objetos | Verbos de ligação, pretérito imperfeito/presente, adjetivos, advérbios de lugar |
| **Dissertação expositiva** | Explicar, informar | Presente do indicativo, conectivos lógicos, objetividade |
| **Dissertação argumentativa** | Convencer | Tese, argumentos, conectivos de oposição/conclusão, modalizadores |
| **Injunção (instrucional)** | Orientar, mandar fazer | Imperativo ou infinitivo, verbos de comando, sequência de passos |

Um mesmo texto pode **misturar** tipos; classifica-se pelo predominante.

## Gênero × tipo

**Gênero** é a forma social que o texto assume: notícia, reportagem, editorial, artigo de opinião, crônica, carta, ofício, e-mail, bula, receita, resenha. O gênero *carta do leitor*, por exemplo, é predominantemente **argumentativo**; a *receita*, **injuntiva**.

## Linguagem denotativa × conotativa

- **Denotativa:** sentido literal, objetivo (texto informativo, técnico).
- **Conotativa:** sentido figurado, subjetivo (literatura, publicidade).

## Variação linguística

Registro **formal** × **informal**; variações regional, social, histórica e situacional. A norma-padrão é adequada a contextos formais — não é "mais correta" em termos absolutos, é a **adequada** à situação.

## Funções da linguagem (Jakobson)

| Função | Foco em | Marca |
|---|---|---|
| **Referencial** | O assunto (referente) | 3ª pessoa, objetividade — notícia, texto científico |
| **Emotiva / expressiva** | O emissor | 1ª pessoa, exclamações, subjetividade |
| **Apelativa / conativa** | O receptor | Imperativo, vocativo, 2ª pessoa — publicidade, discurso |
| **Poética** | A própria mensagem | Ritmo, rima, figuras — poesia, slogans |
| **Fática** | O canal | Checar contato: "Alô?", "Está me ouvindo?" |
| **Metalinguística** | O código | A língua falando de si: dicionário, poema sobre poesia |

> 💡 Dica: pergunte "o texto quer **informar** (referencial), **expressar** (emotiva), **convencer** (apelativa), **encantar** (poética), **checar o contato** (fática) ou **explicar o código** (metalinguística)?"
`,
      fc: [
        ["Marcas linguísticas da narração?", "Verbos de ação, pretérito perfeito e imperfeito, advérbios de tempo, personagens e sequência de fatos."],
        ["Qual função da linguagem prevalece em um dicionário?", "Metalinguística — a língua é usada para explicar a própria língua (o código)."],
        ["Diferença entre tipo textual e gênero textual?", "Tipo é a estrutura predominante (narração, descrição, dissertação, injunção); gênero é a forma social concreta (notícia, ofício, receita, crônica)."],
      ],
      mc: [
        ["Um texto que traz sequência de passos no imperativo e no infinitivo (‘misture’, ‘aguardar’, ‘retirar’) é predominantemente:", ["narrativo.", "descritivo.", "dissertativo-argumentativo.", "injuntivo."], 3, "Imperativo/infinitivo e sequência de comandos caracterizam o tipo injuntivo (instrucional).", "FACIL"],
        ["Em ‘Alô? Está me ouvindo bem?’, predomina a função:", ["fática.", "referencial.", "poética.", "metalinguística."], 0, "A função fática verifica e mantém o canal de comunicação.", "FACIL"],
        ["Sobre a variação linguística, é correto afirmar que:", ["a norma-padrão é a única forma legítima de usar a língua.", "o registro informal é sempre inadequado em qualquer contexto.", "a adequação do registro depende da situação de comunicação.", "a variação regional é erro de português."], 2, "Não há ‘erro’ absoluto de variação: há adequação ou inadequação à situação.", "MEDIO"],
      ],
      ce: [
        ["O predomínio de verbos de ação no pretérito e de advérbios de tempo é característico dos textos narrativos.", "C", "Marcas típicas da narração."],
        ["A função apelativa da linguagem tem como foco o emissor da mensagem e se caracteriza pelo uso da primeira pessoa e de exclamações.", "E", "Isso descreve a função emotiva. A apelativa tem foco no receptor e usa imperativo/vocativo."],
        ["Um mesmo texto pode combinar tipos textuais distintos, classificando-se segundo o tipo predominante.", "C", "Os tipos se misturam; classifica-se pelo predominante."],
        ["A linguagem conotativa se caracteriza pelo sentido figurado e é recorrente em textos publicitários e literários.", "C", "Conotação = sentido figurado, subjetivo."],
      ],
    },
    {
      titulo: "Coesão e Coerência",
      slug: "coesao-coerencia",
      resumo: "Coesão é a costura linguística do texto (pronomes, conectivos, substituições); coerência é a lógica do sentido. Cada conectivo estabelece uma relação (oposição, causa, concessão, conclusão…) que não pode ser trocada à toa.",
      conteudo: `# Coesão e Coerência

## Coesão × coerência

- **Coesão:** ligação **linguística** entre as partes (pronomes, conectivos, sinônimos, elipse).
- **Coerência:** ligação de **sentido** — o texto faz sentido, sem contradição, com progressão de ideias.

Um texto pode ser coeso e incoerente (frases bem ligadas, mas absurdas) — e o contrário.

## Coesão referencial

| Recurso | Exemplo |
|---|---|
| **Anáfora** (retoma o que veio antes) | "O ministro chegou. **Ele** discursou." |
| **Catáfora** (antecipa o que vem depois) | "Só digo **isto**: ninguém sairá." |
| **Substituição lexical** (sinônimo, hiperônimo) | "o cão… o **animal**" |
| **Elipse** (omissão recuperável) | "Estudei e (eu) passei." |

## Coesão sequencial: os conectivos

| Relação | Conectivos |
|---|---|
| **Adição** | e, nem, além disso, ademais |
| **Oposição** | mas, porém, contudo, todavia, entretanto, no entanto |
| **Alternância** | ou, ora… ora, quer… quer |
| **Conclusão** | logo, portanto, por isso, por conseguinte, assim |
| **Explicação** | pois (depois do verbo), porque, que |
| **Causa** | porque, já que, visto que, uma vez que, como |
| **Consequência** | de modo que, tanto que, tão… que |
| **Concessão** | embora, ainda que, mesmo que, conquanto, apesar de |
| **Condição** | se, caso, desde que, contanto que, a menos que |
| **Finalidade** | para que, a fim de que |
| **Conformidade** | conforme, segundo, consoante |
| **Proporção** | à medida que, quanto mais… mais |
| **Tempo** | quando, enquanto, assim que, logo que |

> 💡 **Concessão não é oposição pura.** "Embora estude, não aprende" (concessiva) é diferente de "Estuda, mas não aprende" (adversativa): ambas contrariam uma expectativa, mas só a concessiva traz o verbo no **subjuntivo** e a ideia subordinada.

## Coerência

Exige: **não contradição**, **progressão** (informação nova), **continuidade** (assunto mantido) e **relação lógica** entre as partes. Conectivo errado quebra a coerência: "Estudou muito, **portanto** foi reprovado" (conclusão onde cabe oposição).
`,
      fc: [
        ["Diferença entre anáfora e catáfora?", "Anáfora retoma um termo já mencionado; catáfora antecipa um termo que será mencionado depois."],
        ["Cite cinco conectivos concessivos.", "Embora, ainda que, mesmo que, conquanto, apesar de (que). Com verbo no subjuntivo, exceto ‘apesar de’ + infinitivo/substantivo."],
        ["‘Pois’ explicativo ou conclusivo: como distinguir?", "‘Pois’ explicativo vem antes do verbo/oração (‘Corra, pois está tarde’). ‘Pois’ conclusivo vem depois do verbo, entre vírgulas (‘Está tarde; devemos, pois, partir’)."],
      ],
      mc: [
        ["No trecho ‘O réu foi absolvido. O magistrado, contudo, determinou novo exame’, o conectivo ‘contudo’ estabelece relação de:", ["conclusão.", "oposição.", "explicação.", "condição."], 1, "‘Contudo’ é conjunção adversativa: indica oposição.", "FACIL"],
        ["Assinale o conectivo que expressa concessão.", ["Portanto", "Porque", "Conquanto", "Conforme"], 2, "‘Conquanto’ equivale a ‘embora’: concessão.", "MEDIO"],
        ["Em ‘Estudou muito, portanto foi reprovado’, o problema do trecho é:", ["falta de coesão referencial.", "emprego de conectivo conclusivo onde a ideia exige oposição.", "ausência de elipse.", "uso inadequado de catáfora."], 1, "‘Portanto’ indica conclusão, mas a relação lógica é de oposição (‘mas foi reprovado’): quebra de coerência.", "MEDIO"],
      ],
      ce: [
        ["Coesão refere-se à ligação linguística entre as partes do texto; coerência, à relação lógica de sentido entre elas.", "C", "Definição correta dos dois conceitos."],
        ["Em ‘Embora estudasse, não aprendia’, o conectivo ‘embora’ pode ser substituído por ‘porque’ sem alterar o sentido do período.", "E", "‘Embora’ é concessivo; ‘porque’ é causal e inverteria o sentido."],
        ["Um texto pode apresentar coesão adequada e, ainda assim, ser incoerente.", "C", "Frases bem ligadas podem não fazer sentido."],
        ["Substituir um termo por um sinônimo ou por um hiperônimo é recurso de coesão lexical/referencial.", "C", "É coesão por substituição lexical."],
      ],
    },
  ],
};
