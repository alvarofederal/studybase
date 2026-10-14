// Bloco 7 — Reescritura de Frases e Domínio do Registro Culto (cap. 36–37 da gramática-base)
export default {
  nome: "Reescritura e Registro Culto",
  slug: "reescritura-registro-culto",
  descricao: "Substituição de conectivos, voz, nominalização, reduzidas; emprego de palavras e expressões (porquês, mal/mau, a/há…).",
  ordem: 7,
  topicos: [
    {
      titulo: "Reescritura de Frases",
      slug: "reescritura-de-frases",
      resumo: "O CEBRASPE pergunta se a reescrita mantém a correção gramatical e o sentido. Os tipos mais comuns: troca de conectivo, reduzida ↔ desenvolvida, voz ativa ↔ passiva, nominalização, pronomes no lugar de substantivos, locução ↔ forma simples e deslocamento de termos.",
      conteudo: `# Reescritura de Frases

A pergunta típica: *"A reescrita ‘…’ mantém a correção gramatical e o sentido original?"* Duas verificações independentes:

1. **Correção gramatical** (concordância, regência, crase, pontuação, colocação pronominal, tempos e modos).
2. **Preservação do sentido** (relações lógicas, sujeito, circunstâncias).

## Os tipos mais cobrados

| Tipo | Exemplo | Cuidado |
|---|---|---|
| **Troca de conectivo** | *Embora estudasse, não passou* ↔ *Estudava, mas não passou* | mantém a oposição; troca estrutura (subordinada → coordenada) |
| **Reduzida ↔ desenvolvida** | *Ao chegar* ↔ *Quando chegar* | confira modo/tempo da desenvolvida |
| **Voz ativa ↔ passiva** | *A banca elaborou a prova* ↔ *A prova foi elaborada pela banca* | concordância do particípio; só VTD |
| **Nominalização** | *Quando os candidatos chegaram* → *Na chegada dos candidatos* | verbo vira substantivo |
| **Pronome no lugar do substantivo** | *Entreguei o livro ao aluno* → *Entreguei-lho* | colocação, contração |
| **Locução ↔ forma simples** | *fazer uma análise* ↔ *analisar* · *por meio de* ↔ *mediante* | equivalência de sentido |
| **Deslocamento de termos** | *Choveu ontem em Brasília* ↔ *Ontem, choveu em Brasília* | vírgula, ênfase |
| **Substituição por sinônimo** | *iniciar* ↔ *começar* | sentido no contexto |

## Equivalências de conectivos (decore)

| Valor | Equivalentes |
|---|---|
| **Concessão** | embora = ainda que = mesmo que = conquanto = apesar de que = se bem que (+ subjuntivo) |
| **Oposição** | mas = porém = contudo = todavia = entretanto = no entanto |
| **Causa** | porque = já que = visto que = uma vez que = como (início) = dado que |
| **Conclusão** | logo = portanto = por conseguinte = por isso |
| **Condição** | se = caso = desde que = contanto que |
| **Finalidade** | para que = a fim de que |
| **Proporção** | à medida que = à proporção que = quanto mais… mais |

> ⚠️ **Cuidados clássicos**
> - ‘**Embora**’ **nunca** com indicativo (*~~embora estuda~~*).
> - ‘**Se**’ condicional não é ‘**se**’ integrante: *Não sei se ele virá.*
> - ‘**Pois**’ conclusivo vem **depois** do verbo; antes dele, é explicativo.
> - Em **reescrita de voz**, o **agente** pode ser omitido, mas o **sentido** deve ser mantido.
> - A **posição** de *apenas, somente, até, inclusive* muda o sentido: *Só ele chegou* ≠ *Ele só chegou* (= ele apenas chegou).
> - Troca de **adversativa** por **concessiva** inverte o foco: *Estuda, mas não passa* (foco no resultado negativo) ≠ *Embora estude, não passa* (foco na ausência de resultado).

## Paralelismo

Elementos coordenados devem ter a **mesma estrutura**: *"Prefiro estudar e trabalhar"* (dois infinitivos) ✓ × *"Prefiro estudar e o trabalho"* ✗ (infinitivo + substantivo).

## Pontuação na reescrita

Mudança de **ordem** pode exigir ajuste de vírgula: *Quando chegou, avisou.* ↔ *Avisou quando chegou.* (sem vírgula, oração posposta).
`,
      fc: [
        ["‘Embora’ pode ser substituído por quais conectivos sem mudar o sentido?", "Ainda que, mesmo que, conquanto, apesar de que, se bem que (concessivas), todos com subjuntivo."],
        ["Reescrita de voz passiva: o que muda?", "O objeto direto vira sujeito, o sujeito vira agente da passiva e o verbo vira ser + particípio concordando com o novo sujeito."],
        ["Por que ‘Só ele chegou’ não equivale a ‘Ele só chegou’?", "A posição do ‘só/apenas’ muda o termo focalizado: ninguém mais chegou (1ª) × ele não fez nada além de chegar (2ª)."],
      ],
      mc: [
        ["Assinale a reescrita de ‘Embora estivesse cansado, concluiu o trabalho’ que mantém o sentido e a correção.", ["Estava cansado, porque concluiu o trabalho.", "Apesar de estar cansado, concluiu o trabalho.", "Estava cansado, portanto concluiu o trabalho.", "Embora estava cansado, concluiu o trabalho."], 1, "‘Apesar de’ + infinitivo mantém a concessão.", "MEDIO"],
        ["‘A banca elaborou a prova.’ Na voz passiva, fica:", ["A prova elaborou-se pela banca.", "A prova foi elaborada pela banca.", "A prova foram elaboradas pela banca.", "Elaborou-se a banca a prova."], 1, "OD vira sujeito; ser no pretérito perfeito + particípio concordando: foi elaborada.", "FACIL"],
        ["Em qual alternativa a reescrita altera o sentido de ‘Apenas o diretor assinou o contrato’?", ["Somente o diretor assinou o contrato.", "O diretor apenas assinou o contrato.", "Ninguém além do diretor assinou o contrato.", "O contrato foi assinado apenas pelo diretor."], 1, "‘O diretor apenas assinou’ = só assinou, não fez mais nada; muda o foco.", "DIFICIL"],
      ],
      ce: [
        ["‘Quando chegou, avisou’ pode ser reescrito como ‘Ao chegar, avisou’, sem prejuízo do sentido.", "C", "Reduzida de infinitivo = temporal."],
        ["A substituição de ‘embora’ por ‘porque’ em ‘Embora estudasse, não passou’ mantém o sentido original.", "E", "‘Porque’ introduz causa; ‘embora’, concessão."],
        ["Em ‘Prefiro estudar e o trabalho’, há quebra de paralelismo sintático.", "C", "Infinitivo coordenado a substantivo."],
        ["‘Fazer uma análise’ e ‘analisar’ são formas equivalentes (locução verbal e verbo simples).", "C", "Locução e forma simples com o mesmo sentido."],
      ],
    },
    {
      titulo: "Domínio do Registro Culto: Palavras e Expressões",
      slug: "registro-culto-palavras-expressoes",
      resumo: "Porquês, mal/mau, mas/mais, a/há, afim/a fim, onde/aonde, acerca de/há cerca de/cerca de, demais/de mais, senão/se não, tampouco/tão pouco, ao encontro de/de encontro a, em vez de/ao invés de: o domínio dessas dúvidas é cobrado em ‘redação adequada’.",
      conteudo: `# Domínio do Registro Culto: Palavras e Expressões

## Os quatro "porquês"

| Forma | Uso | Exemplo |
|---|---|---|
| **por que** | pergunta (início/meio) ou = *pelo qual / por qual motivo* | **Por que** você faltou? · O motivo **por que** faltei... |
| **por quê** | pergunta, **no fim** da frase ou antes de pausa | Faltou **por quê**? |
| **porque** | conjunção (causa/explicação) | Faltei **porque** estava doente. |
| **porquê** | substantivo (com artigo/pronome) | Não entendi **o porquê** da decisão. |

## Mal × mau

- **mal** (oposto de *bem*): advérbio/substantivo/conjunção temporal — *Ele passou mal. · O mal é grave. · **Mal** chegou, saiu.*
- **mau** (oposto de *bom*): adjetivo — *Ele é um mau aluno.* (*maus alunos, má pessoa*)

## Mas × mais

- **mas:** conjunção adversativa — *Estudou, **mas** não passou.*
- **mais:** quantidade — *Quero **mais** tempo.*

## A × há

- **há** (verbo haver): tempo **passado** — *Chegou **há** dois dias.*
- **a:** tempo **futuro** ou distância — *Chegará **daqui a** dois dias. · Fica **a** 5 km.*

## Onde × aonde

- **onde:** lugar **estático** (= *em que*) — *Onde você mora?*
- **aonde:** lugar com **movimento** (*a onde*) — *Aonde você vai?*

## Afim × a fim

- **afim:** semelhante, com afinidade — *Interesses afins.*
- **a fim de:** finalidade — *Veio **a fim de** estudar.*

## Cerca de, acerca de, a cerca de, há cerca de

| Forma | Sentido |
|---|---|
| **acerca de** | a respeito de — *Falou **acerca de** política.* |
| **cerca de** | aproximadamente — *Vieram **cerca de** dez pessoas.* |
| **há cerca de** | faz aproximadamente (tempo) — *Há cerca de dois anos.* |

## Outros pares

| Forma | Sentido | Exemplo |
|---|---|---|
| **demais** (advérbio/pronome) | em excesso / os outros | Trabalha **demais**. · Os **demais** candidatos... |
| **de mais** (oposto de *de menos*) | em quantidade excessiva (adj.) | Não há nada **de mais**. |
| **senão** | caso contrário / exceto / defeito | Corra, **senão** perde. · Não fez nada **senão** chorar. |
| **se não** | condição negativa | **Se não** chover, irei. |
| **tampouco** | também não | Não estudou, **tampouco** trabalhou. |
| **tão pouco** | muito pouco | Ganha **tão pouco** que... |
| **ao encontro de** | concordância, favor, aproximação | A medida vem **ao encontro de** nossos anseios. |
| **de encontro a** | oposição, choque | O carro foi **de encontro ao** muro. |
| **em vez de** | no lugar de | **Em vez de** estudar, dormiu. |
| **ao invés de** | ao contrário de | **Ao invés de** subir, desceu. |
| **a princípio** | no início | **A princípio**, discordei. |
| **em princípio** | em tese | **Em princípio**, está correto. |

## Expressões que merecem cuidado

- ❌ ***a nível de*** → ✔ ***em nível de*** / ***ao nível de*** (= à mesma altura).
- ❌ ***assistir o filme*** → ✔ ***assistir ao filme***.
- ❌ ***de encontro a*** com sentido de concordância → ✔ ***ao encontro de***.
- ❌ ***Fazem*** *dois anos* → ✔ ***Faz*** *dois anos*.
- ❌ ***Haja visto*** → ✔ ***Haja vista*** (invariável).
`,
      fc: [
        ["‘Ao encontro de’ × ‘de encontro a’?", "Ao encontro de = em direção, a favor, de acordo (A proposta vem ao encontro de nossos anseios). De encontro a = contra, em choque (O carro foi de encontro ao muro)."],
        ["Mal × mau?", "Mal é o oposto de bem (passou mal; mal chegou). Mau é o oposto de bom (mau aluno)."],
        ["Onde × aonde?", "Onde: lugar em que se está (Onde você mora?). Aonde: lugar a que se vai, com movimento (Aonde você vai?)."],
      ],
      mc: [
        ["Complete: ‘Não compreendi ______ de ele ter faltado.’", ["o porque", "o porquê", "o por que", "o por quê"], 1, "Substantivo, precedido de artigo: o porquê.", "MEDIO"],
        ["Assinale a frase em que o emprego do termo destacado está correto.", ["Há dois dias chegará a encomenda.", "A reunião foi há dois dias.", "Vou a muitos anos para lá.", "Voltarei a duas semanas atrás."], 1, "‘Há’ = faz, passado: a reunião foi há dois dias. ‘Daqui a’ para futuro.", "MEDIO"],
        ["Assinale a alternativa correta.", ["Ao invés de estudar, trabalhou muito.", "A nível de Brasil, a medida é nova.", "Em vez de estudar, dormiu.", "A proposta vem de encontro aos nossos anseios, pois os atende."], 2, "‘Em vez de’ = no lugar de. ‘Ao invés de’ exige ideia de oposição (estudar × trabalhar não são opostos); ‘a nível de’ é incorreto; e ‘de encontro a’ = contra, quando o sentido pedido é favor (ao encontro de).", "DIFICIL"],
      ],
      ce: [
        ["Em ‘Mal o dia amanheceu, ele saiu’, o termo ‘mal’ funciona como conjunção temporal (= assim que).", "C", "‘Mal’ pode ter valor temporal."],
        ["A expressão ‘a nível de’ é a forma recomendada pela norma-padrão em ‘a nível de gerência’.", "E", "Recomendam-se ‘em nível de’ ou ‘ao nível de’."],
        ["Em ‘Veio a fim de estudar’, a expressão ‘a fim de’ indica finalidade.", "C", "A fim de = para."],
        ["‘Ao encontro de’ e ‘de encontro a’ são expressões sinônimas.", "E", "Ao encontro de = favor; de encontro a = oposição."],
      ],
    },
  ],
};
