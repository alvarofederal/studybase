// Bloco 8 — Redação Oficial (complemento ao programa da gramática-base; cobrado em concursos federais)
export default {
  nome: "Redação Oficial",
  slug: "redacao-oficial",
  descricao: "Atributos da redação oficial, documentos do Manual de Redação da Presidência e formas de tratamento (Decreto nº 9.758/2019).",
  ordem: 8,
  topicos: [
    {
      titulo: "Redação Oficial: Conceito e Atributos",
      slug: "redacao-oficial-atributos",
      resumo: "Redação oficial é a forma de a Administração se comunicar. Seus atributos: impessoalidade, uso do padrão culto, clareza e precisão, concisão, formalidade e padronização. Nada de gíria, regionalismo, rebuscamento ou opinião pessoal.",
      conteudo: `# Redação Oficial: Conceito e Atributos

**Redação oficial** é a maneira pela qual o Poder Público redige **atos normativos e comunicações**. Sua finalidade é **comunicar com impessoalidade e máxima clareza**, atendendo ao interesse público. O referencial clássico é o **Manual de Redação da Presidência da República** (3ª edição, revista e atualizada, 2018).

## Atributos

| Atributo | O que exige | Exemplo |
|---|---|---|
| **Impessoalidade** | Não há "eu": o emissor é o órgão; o destinatário é o público ou outro órgão; **sem juízo pessoal** | Prefira *"Solicita-se…"* a *"Eu acho que…"* |
| **Padrão culto da língua** | Norma-padrão; **sem gíria, regionalismo e coloquialismo**; sem rebuscamento | *"Os servidores compareceram"*; não *"os caras vieram"* |
| **Clareza e precisão** | Texto inteligível **de uma só leitura**; evita ambiguidade | Frases curtas, ordem direta |
| **Concisão** | Máximo de informação com o **mínimo de palavras**; sem repetições e redundâncias | Evite *"surpresa inesperada"* |
| **Formalidade e padronização** | Polidez, civilidade, **uniformidade** de formato | Uso das formas de tratamento adequadas |

> 💡 **Clareza ≠ simplicidade vazia**; **concisão ≠ telegráfico**. O texto deve ser **completo** sem ser **prolixo**.

## Orientações de redação

- **Siglas:** na **primeira ocorrência**, escreva o nome completo e a sigla entre parênteses: *Controladoria-Geral da União (CGU)*.
- **Uso de "em anexo":** *"Seguem **em anexo** os documentos."* (invariável).
- **Numerais:** evite cifras desnecessárias; datas sem zero à esquerda: **5 de maio de 2026**.
- **Horas:** *14h30* (sem *min*).
- **Vocativo:** usa-se **vírgula** após o vocativo (*Senhor Ministro,*).
- **Linguagem:** impessoal, voz passiva sintética ou 3ª pessoa: *Informa-se que…*, *Solicita-se…*.
- **Evite:** gerundismo ("vou estar enviando"), clichês burocráticos ("outrossim", "destarte") e juízos de valor.

## Erros comuns

- Confundir **impessoalidade** com **ausência de sujeito** (o sujeito existe; é o **órgão**).
- Confundir **formalidade** com **linguagem rebuscada**.
- Usar **adjetivação excessiva** e **opinião**.
- Usar **abreviações não convencionais**.
`,
      fc: [
        ["Cite os atributos da redação oficial.", "Impessoalidade, uso do padrão culto, clareza e precisão, concisão, formalidade e padronização."],
        ["Como se apresentam siglas no texto oficial?", "Na primeira ocorrência: nome por extenso seguido da sigla entre parênteses (Controladoria-Geral da União (CGU)). Depois, só a sigla."],
        ["Impessoalidade significa ausência de sujeito?", "Não. Significa que o emissor é o órgão (não a pessoa), sem juízos ou opiniões pessoais."],
      ],
      mc: [
        ["Em redação oficial, a impessoalidade se evidencia pelo uso de:", ["primeira pessoa do singular.", "juízos de valor.", "fórmulas como ‘Solicita-se’ e ‘Informa-se’.", "gírias e expressões regionais."], 2, "Construções impessoais afastam o ‘eu’ e destacam o órgão.", "FACIL"],
        ["Qual das expressões atende melhor ao atributo da concisão?", ["surpresa inesperada", "encarar de frente", "O prazo termina em 5 de maio.", "Venho por meio deste informar-lhe, com grande pesar, que, infelizmente, o prazo se encerra."], 2, "Dá a informação completa com o mínimo de palavras.", "MEDIO"],
        ["Quanto à apresentação de siglas na redação oficial, é correto:", ["escrever só a sigla, sempre.", "escrever o nome por extenso e a sigla entre parênteses na primeira ocorrência.", "evitar o nome por extenso.", "usar a sigla entre aspas."], 1, "Primeira ocorrência: nome completo + sigla entre parênteses.", "FACIL"],
      ],
      ce: [
        ["A formalidade na redação oficial exige o emprego de linguagem rebuscada e de vocabulário raro.", "E", "Formalidade = polidez e padronização; não rebuscamento."],
        ["A clareza do texto oficial pressupõe que ele seja compreendido de uma só leitura.", "C", "Princípio da clareza."],
        ["O uso de gírias e regionalismos é admitido na redação oficial quando facilita a comunicação com o público.", "E", "Exige-se o padrão culto."],
        ["A impessoalidade impede que o texto oficial seja redigido na voz passiva sintética.", "E", "A voz passiva sintética é recurso da impessoalidade (Solicita-se…)."],
      ],
    },
    {
      titulo: "Documentos Oficiais e Formas de Tratamento",
      slug: "documentos-oficiais-tratamento",
      resumo: "Ofício, aviso e memorando compartilham o padrão ofício. O Manual da Presidência (3ª ed., 2018) foi alterado, para a administração federal, pelo Decreto nº 9.758/2019: tratamento ‘senhor/senhora’, vocativo ‘Senhor + cargo’ e fecho ‘Atenciosamente’. Confirme no edital qual é o referencial.",
      conteudo: `# Documentos Oficiais e Formas de Tratamento

> ⚠️ **Confira sempre o referencial do edital** (Manual da Presidência, 3ª ed., 2018, e/ou **Decreto nº 9.758/2019**). Abaixo, o que é **comum** e o que mudou.

## Principais documentos

| Documento | Finalidade |
|---|---|
| **Ofício** | Comunicação **externa**: entre autoridades e destes com particulares. |
| **Aviso** | Uso **restrito**: Ministros de Estado e autoridades de hierarquia equivalente. |
| **Memorando** | Comunicação **interna**, entre unidades de um **mesmo órgão**. |
| **Mensagem** | Comunicação entre **Chefes de Poder** (ex.: Executivo → Legislativo). |
| **Exposição de motivos** | Ministro → **Presidente da República**: propõe medida, informa ou submete ato. |
| **Requerimento** | Pedido a autoridade (servidor/particular). |
| **E-mail (correio eletrônico)** | Pode ser documento oficial, observando o padrão do órgão. |

> 💡 No Manual de 2018, **ofício, aviso e memorando** foram unificados no **padrão ofício** (mesma estrutura: número, data, assunto, destinatário, vocativo, texto, fecho, assinatura).

## Estrutura do padrão ofício

1. **Cabeçalho** (órgão), 2. **Número e sigla** (*Ofício nº 12/2026/SIGLA*), 3. **Local e data** (*Brasília, 5 de maio de 2026*), 4. **Assunto**, 5. **Destinatário**, 6. **Vocativo**, 7. **Texto**, 8. **Fecho**, 9. **Assinatura**, 10. **Identificação do signatário**.

## Formas de tratamento

### Pelo Manual (3ª ed., 2018)

- **Vossa Excelência** — autoridades dos três Poderes, embaixadores, oficiais-generais…
- **Vossa Senhoria** — demais autoridades e particulares.
- **Vossa Magnificência** — reitores de universidades.
- **Concordância:** 3ª pessoa (*Vossa Excelência **decidirá***); *Vossa* para falar **com**; *Sua* para falar **de**.
- ***Doutor* não é pronome de tratamento**: é título acadêmico.

### Pelo Decreto nº 9.758/2019 (agentes públicos federais)

- O **único pronome de tratamento** nas comunicações com agentes públicos federais é **"senhor"** (e flexões), independentemente de cargo, hierarquia ou ocasião.
- **Vocativo:** *Senhor + cargo* — *Senhor Ministro,* · *Senhora Diretora,*.
- **Endereçamento:** *Ao Senhor Fulano de Tal, Ministro de Estado…*
- Ficam dispensados **Vossa Excelência, Vossa Senhoria, Excelentíssimo, Ilustríssimo** e semelhantes.
- **Fecho único:** **Atenciosamente,**.

## Fechos

| Referencial | Fecho |
|---|---|
| Manual de 2018 (sem o Decreto) | **Respeitosamente,** (autoridades superiores) · **Atenciosamente,** (mesma hierarquia ou inferior) |
| **Decreto nº 9.758/2019** | **Atenciosamente,** em todos os casos |

> 💡 **Estratégia de prova:** se o enunciado citar o **Decreto 9.758/2019** ou comunicação com **agente público federal**, aplique o decreto; se citar apenas o **Manual**, aplique o Manual de 2018.
`,
      fc: [
        ["Pronome de tratamento pelo Decreto 9.758/2019?", "Apenas ‘senhor’ (e flexões) nas comunicações com agentes públicos federais; vocativo ‘Senhor + cargo’ e fecho ‘Atenciosamente’."],
        ["Qual a diferença entre ofício e memorando?", "Ofício é comunicação externa (entre autoridades e com particulares); memorando é comunicação interna entre unidades de um mesmo órgão."],
        ["‘Doutor’ é pronome de tratamento?", "Não. É título acadêmico; não é forma de tratamento oficial."],
      ],
      mc: [
        ["Segundo o Decreto nº 9.758/2019, o fecho das comunicações com agentes públicos federais é:", ["Respeitosamente,", "Atenciosamente,", "Cordialmente,", "Respeitosamente ou Atenciosamente, conforme a hierarquia."], 1, "O decreto unificou o fecho: ‘Atenciosamente,’.", "MEDIO"],
        ["A comunicação interna entre unidades administrativas de um mesmo órgão é feita, em regra, por:", ["ofício.", "aviso.", "memorando.", "mensagem."], 2, "Memorando: comunicação interna.", "FACIL"],
        ["Quanto ao pronome de tratamento ‘Vossa Excelência’, é correto afirmar que:", ["exige verbo na 2ª pessoa.", "exige verbo na 3ª pessoa.", "só se usa para particulares.", "equivale a ‘Vossa Senhoria’."], 1, "Pronomes de tratamento concordam com a 3ª pessoa.", "MEDIO"],
      ],
      ce: [
        ["Pelo Manual de Redação da Presidência da República (3ª ed., 2018), ofício, aviso e memorando compartilham a mesma estrutura de diagramação, denominada padrão ofício.", "C", "Unificação promovida no Manual de 2018."],
        ["O Decreto nº 9.758/2019 dispõe que, nas comunicações com agentes públicos federais, o único pronome de tratamento é ‘senhor’ e suas flexões.", "C", "Conteúdo central do decreto."],
        ["O termo ‘doutor’ é forma de tratamento oficial para qualquer pessoa com ensino superior.", "E", "Doutor é título acadêmico, não pronome de tratamento."],
        ["Em ‘Sua Excelência confirmou a presença’, o pronome ‘Sua’ é usado porque se fala sobre a autoridade, e não com ela.", "C", "Vossa (com a pessoa) × Sua (sobre a pessoa)."],
      ],
    },
  ],
};
