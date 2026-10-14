// Raciocínio Lógico — novos blocos 10 e 11 (Raciocínio Matemático e Geometria)
// Base: "Raciocínio Lógico Facilitado" (Bruno Villa), caps. 10, 11, 14 e 17, com texto próprio.
export default [
  {
    nome: "Raciocínio Matemático",
    slug: "raciocinio-matematico",
    descricao: "Razão, proporção, divisão proporcional, regra de três, porcentagem, frações, divisibilidade, MMC e MDC.",
    ordem: 10,
    topicos: [
      {
        titulo: "Razão, Proporção e Divisão Proporcional",
        slug: "razao-proporcao-divisao-proporcional",
        resumo: "Razão compara duas grandezas (a/b). Proporção é a igualdade de duas razões (a/b = c/d, ou a·d = b·c). Grandezas diretamente proporcionais crescem juntas; inversamente, uma cresce quando a outra diminui. Divisão proporcional direta usa a soma das partes; a inversa usa os inversos.",
        conteudo: `# Razão, Proporção e Divisão Proporcional

## Razão

**Razão** entre **a** e **b** (b ≠ 0) é o **quociente a/b**.

- *12 para 18* → 12/18 = **2/3**.
- **Razões especiais:** **velocidade média** (km/h), **densidade** (g/cm³), **escala** (medida no desenho / medida real), **densidade demográfica** (hab/km²).

## Proporção

**Proporção** é a **igualdade entre duas razões**:

> **a/b = c/d** ⟺ **a · d = b · c** (produto dos meios = produto dos extremos)

*Ex.:* 3/5 = x/20 ⇒ 5x = 60 ⇒ **x = 12**.

## Grandezas proporcionais

| Tipo | Comportamento | Exemplo |
|---|---|---|
| **Diretamente proporcionais** | uma **cresce**, a outra **cresce** na mesma razão | quantidade × preço |
| **Inversamente proporcionais** | uma **cresce**, a outra **diminui** na razão inversa | nº de operários × dias de trabalho |

## Divisão proporcional

### Direta
Dividir **N** em partes **diretamente proporcionais** a **a, b, c**:
- **k = N / (a + b + c)** → partes **a·k, b·k, c·k**.

**Exemplo.** Dividir **120** em partes proporcionais a **2, 3 e 7**: soma = 12 ⇒ k = 10 ⇒ **20, 30 e 70**.

### Inversa
Dividir **N** em partes **inversamente proporcionais** a **a, b, c** = dividir **diretamente** a **1/a, 1/b, 1/c**.

**Exemplo.** Dividir **260** em partes inversamente proporcionais a **2, 3 e 4**:
- 1/2 : 1/3 : 1/4 = **6 : 4 : 3** (reduzindo ao mesmo denominador, 12);
- soma = 13 ⇒ k = 20 ⇒ **120, 80 e 60**.

> 💡 Se a divisão for proporcional a **números** (por exemplo, **idades**), mas **inversamente** aos **atrasos**, multiplique as razões.

## Propriedades úteis das proporções

- **(a + b)/b = (c + d)/d**
- **a/b = c/d = (a + c)/(b + d)** (soma dos antecedentes sobre soma dos consequentes)
`,
        fc: [
          ["Propriedade fundamental da proporção?", "Em a/b = c/d, o produto dos meios é igual ao produto dos extremos: a·d = b·c."],
          ["Como dividir N em partes diretamente proporcionais a a, b e c?", "k = N/(a + b + c); as partes são a·k, b·k e c·k."],
          ["Como dividir em partes inversamente proporcionais a a, b e c?", "Divida diretamente proporcional aos inversos 1/a, 1/b e 1/c (reduza ao mesmo denominador)."],
        ],
        mc: [
          ["Dividindo-se 120 em partes diretamente proporcionais a 2, 3 e 7, a maior parte é:", ["50.", "60.", "70.", "80."], 2, "k = 120/12 = 10 ⇒ 20, 30 e 70.", "FACIL"],
          ["Dividindo-se 260 em partes inversamente proporcionais a 2, 3 e 4, a menor parte é:", ["60.", "80.", "100.", "120."], 0, "Proporção 6 : 4 : 3, soma 13, k = 20 ⇒ 120, 80 e 60.", "MEDIO"],
          ["Se 3/5 = x/20, o valor de x é:", ["8.", "10.", "12.", "15."], 2, "5x = 60 ⇒ x = 12.", "FACIL"],
        ],
        ce: [
          ["Dividir 120 em partes diretamente proporcionais a 2, 3 e 7 resulta em partes de 20, 30 e 70.", "C", "k = 10."],
          ["Número de operários e tempo necessário para concluir uma obra são, em geral, grandezas diretamente proporcionais.", "E", "São inversamente proporcionais: mais operários, menos dias."],
          ["A razão entre 12 e 18 é 2/3.", "C", "12/18 = 2/3."],
          ["Em uma proporção a/b = c/d, vale a · d = b · c.", "C", "Produto dos extremos = produto dos meios."],
        ],
      },
      {
        titulo: "Regra de Três Simples e Composta",
        slug: "regra-de-tres",
        resumo: "Regra de três simples relaciona duas grandezas (direta ou inversa); composta relaciona três ou mais. Passo a passo: organize a tabela, identifique se cada grandeza é direta ou inversamente proporcional à incógnita, inverta as razões das inversas e resolva.",
        conteudo: `# Regra de Três Simples e Composta

## Regra de três simples

Relaciona **duas grandezas**.

### Direta (as duas crescem juntas)

*3 kg de um produto custam R$ 21,00. Quanto custam 5 kg?*

| kg | R$ |
|---|---|
| 3 | 21 |
| 5 | x |

3/5 = 21/x ⇒ **x = 35**.

### Inversa (uma cresce, a outra diminui)

*6 operários constroem um muro em 12 dias. Em quantos dias 9 operários o constroem?*

Mais operários → **menos** dias (inversa) ⇒ **inverta uma razão**:

12/x = 9/6 ⇒ **x = 8 dias**.

## Regra de três composta

Relaciona **três ou mais** grandezas.

**Roteiro:**
1. **Organize** as grandezas em colunas; a **incógnita** fica numa coluna.
2. Compare **cada grandeza com a incógnita**, **mantendo as demais constantes**: **direta** ou **inversa**?
3. **Inverta** as razões das grandezas **inversamente proporcionais**.
4. **Multiplique** as razões e iguale à razão da incógnita.

### Exemplo A (todas diretas)

*4 máquinas, em 6 dias, produzem 240 peças. Quantas peças produzirão 6 máquinas em 10 dias?*

- máquinas ↑ → peças ↑ (direta) e dias ↑ → peças ↑ (direta).

x = 240 · (6/4) · (10/6) = 240 · 2,5 = **600 peças**.

### Exemplo B (com inversa)

*10 operários constroem um muro em 15 dias, trabalhando 8 horas por dia. Se 12 operários trabalharem durante 10 dias, quantas horas por dia precisam trabalhar?*

Mais operários e **mais dias** → **menos** horas por dia (inversas):

10 · 15 · 8 = 12 · 10 · h ⇒ 1 200 = 120 h ⇒ **h = 10 horas por dia**.

> 💡 **Atalho (trabalho constante):** quando "tudo se compensa" (obra pronta), **operários × dias × horas = constante**.

> ⚠️ **Erro clássico:** esquecer-se de inverter a razão da grandeza inversamente proporcional.
`,
        fc: [
          ["Como saber se a regra de três é inversa?", "Se, ao aumentar uma grandeza, a outra diminui na mesma razão (ex.: operários × dias)."],
          ["Roteiro da regra de três composta?", "Comparar cada grandeza com a incógnita (direta ou inversa), inverter as razões das inversas, multiplicar as razões e igualar à razão da incógnita."],
          ["‘Atalho’ da obra constante?", "Operários × dias × horas por dia = constante (quando o trabalho a executar é o mesmo)."],
        ],
        mc: [
          ["Seis operários constroem um muro em 12 dias. Em quantos dias nove operários, com o mesmo rendimento, construirão o mesmo muro?", ["6.", "8.", "9.", "18."], 1, "Inversa: 6 · 12 = 9 · x ⇒ x = 8.", "MEDIO"],
          ["Quatro máquinas, em 6 dias, produzem 240 peças. Seis máquinas em 10 dias produzirão:", ["400 peças.", "500 peças.", "600 peças.", "720 peças."], 2, "240 · (6/4) · (10/6) = 600.", "MEDIO"],
          ["Dez operários constroem um muro em 15 dias, trabalhando 8 horas por dia. Com 12 operários, em 10 dias, o número de horas por dia necessário é:", ["8.", "9.", "10.", "12."], 2, "10 · 15 · 8 = 12 · 10 · h ⇒ h = 10.", "DIFICIL"],
        ],
        ce: [
          ["Se 3 kg de um produto custam R$ 21,00, então 5 kg custam R$ 35,00.", "C", "Proporção direta: 21/3 · 5 = 35."],
          ["Em uma regra de três composta, as razões das grandezas inversamente proporcionais à incógnita devem ser invertidas.", "C", "Procedimento padrão."],
          ["Se 6 operários concluem uma obra em 12 dias, 9 operários, com o mesmo rendimento, a concluirão em 18 dias.", "E", "São 8 dias (inversa)."],
          ["Se 4 máquinas produzem 240 peças em 6 dias, 6 máquinas produzem 600 peças em 10 dias.", "C", "240 · 1,5 · (10/6) = 600."],
        ],
      },
      {
        titulo: "Porcentagem, Lucro, Desconto e Variações Sucessivas",
        slug: "porcentagem-lucro-desconto",
        resumo: "x% de y = (x/100)·y. Aumento de i% multiplica por (1 + i); desconto de i% multiplica por (1 − i). Variações sucessivas se multiplicam (fatores), nunca se somam. Lucro pode ser sobre o custo ou sobre a venda; leia a base.",
        conteudo: `# Porcentagem, Lucro, Desconto e Variações Sucessivas

## Conceito

**x%** significa **x/100**. *15% de 240 = 0,15 · 240 = 36*.

## Fator de multiplicação

| Operação | Fator |
|---|---|
| **Aumento de i%** | **1 + i/100** (aumento de 20% → **1,20**) |
| **Desconto de i%** | **1 − i/100** (desconto de 20% → **0,80**) |

*Ex.:* um produto de **R$ 250** com **10% de desconto** → 250 · 0,90 = **R$ 225**.

## ⭐ Variações sucessivas: **multiplicam-se** os fatores

- **Aumento de 20% seguido de desconto de 20%:** 1,20 · 0,80 = **0,96** ⇒ **redução de 4%** (e não "volta ao preço original").
- **Dois aumentos de 10%:** 1,10 · 1,10 = **1,21** ⇒ **aumento de 21%** (e não 20%).
- **Aumento de 25% e depois desconto para voltar ao original:** 1,25 · x = 1 ⇒ x = 0,80 ⇒ desconto de **20%**.

> ⚠️ **Nunca some percentuais sucessivos**: eles incidem sobre **bases diferentes**.

## Lucro e prejuízo

- **Lucro = venda − custo.**
- **Sobre o custo:** lucro/custo · 100. **Sobre a venda:** lucro/venda · 100.

**Exemplo.** Comprado a **R$ 80** e vendido a **R$ 100**: lucro = **R$ 20**.
- Sobre o **custo:** 20/80 = **25%**.
- Sobre a **venda:** 20/100 = **20%**.

> 💡 **Leia a base!** "Lucro de 25% sobre o preço de custo" ≠ "lucro de 25% sobre o preço de venda".

## Variação percentual

> **Variação (%) = (valor final − valor inicial) / valor inicial × 100**

*De 400 para 500:* (500 − 400)/400 = **25%**.

## Dicas

- **"x% a mais"** → multiplique por **(1 + x/100)**.
- **"x% a menos"** → multiplique por **(1 − x/100)**.
- Se um valor **aumenta 100%**, ele **dobra**; **200%** de aumento → **triplica**.
- **Pontos percentuais ≠ percentual:** de 10% para 15% o aumento é de **5 pontos percentuais** (e de **50%** em termos relativos).
`,
        fc: [
          ["Como calcular dois aumentos sucessivos de 10%?", "Multiplicam-se os fatores: 1,10 × 1,10 = 1,21, ou seja, aumento total de 21%."],
          ["Aumento de 20% seguido de desconto de 20%?", "1,20 × 0,80 = 0,96: redução de 4% em relação ao valor original."],
          ["Lucro sobre o custo × lucro sobre a venda?", "Sobre o custo: lucro/custo. Sobre a venda: lucro/venda. Comprado a 80 e vendido a 100: 25% sobre o custo e 20% sobre a venda."],
        ],
        mc: [
          ["Um produto sofreu aumento de 20% e, em seguida, desconto de 20%. Em relação ao preço original, o preço final:", ["é igual.", "aumentou 4%.", "diminuiu 4%.", "diminuiu 2%."], 2, "1,20 × 0,80 = 0,96.", "MEDIO"],
          ["Um produto comprado por R$ 80 foi vendido por R$ 100. O lucro sobre o preço de custo foi de:", ["20%.", "25%.", "30%.", "80%."], 1, "20/80 = 25%.", "MEDIO"],
          ["Dois aumentos sucessivos de 10% equivalem a um único aumento de:", ["20%.", "20,5%.", "21%.", "22%."], 2, "1,1 · 1,1 = 1,21.", "FACIL"],
        ],
        ce: [
          ["15% de 240 é igual a 36.", "C", "0,15 · 240 = 36."],
          ["Um aumento de 20% seguido de um desconto de 20% faz o preço voltar ao valor original.", "E", "O resultado é 0,96 do original."],
          ["Se um preço aumenta 100%, ele dobra.", "C", "Fator 2."],
          ["O desconto de 20% sobre R$ 500 resulta em R$ 400.", "C", "500 · 0,80 = 400."],
        ],
      },
      {
        titulo: "Frações, Divisibilidade, MMC e MDC",
        slug: "fracoes-divisibilidade-mmc-mdc",
        resumo: "Operações com frações e critérios de divisibilidade (2, 3, 4, 5, 6, 8, 9, 10, 11). MMC resolve problemas de coincidência (‘de quanto em quanto tempo se encontram de novo?’); MDC resolve problemas de divisão em partes iguais (‘maior tamanho possível’).",
        conteudo: `# Frações, Divisibilidade, MMC e MDC

## Operações com frações

| Operação | Regra | Exemplo |
|---|---|---|
| **Soma/subtração** | denominador comum | 1/2 + 1/3 = 3/6 + 2/6 = **5/6** |
| **Multiplicação** | numerador × numerador, denominador × denominador | 2/3 · 3/4 = **1/2** |
| **Divisão** | multiplica pelo **inverso** | 3/4 ÷ 1/2 = 3/4 · 2 = **3/2** |
| **Fração de um número** | multiplique | 2/3 de 90 = **60** |

**Dízima periódica → fração geratriz:** 0,333… = **1/3** · 0,1212… = 12/99 = **4/33**.

## Critérios de divisibilidade

| Divisor | Critério |
|---|---|
| **2** | termina em 0, 2, 4, 6 ou 8 |
| **3** | **soma dos algarismos** divisível por 3 |
| **4** | **dois últimos** algarismos formam número divisível por 4 (ou terminam em 00) |
| **5** | termina em 0 ou 5 |
| **6** | divisível por **2 e por 3** |
| **8** | **três últimos** algarismos divisíveis por 8 |
| **9** | **soma dos algarismos** divisível por 9 |
| **10** | termina em 0 |
| **11** | **diferença entre a soma dos algarismos de ordem ímpar e a dos de ordem par** é 0 ou múltiplo de 11 |

*Exemplos:* **1 236** é divisível por **3** (1+2+3+6 = 12) e por **4** (36 ÷ 4 = 9). **2 574** é divisível por **11**: 2 − 5 + 7 − 4 = 0 (2 574 = 11 · 234).

## MMC e MDC

Fatore em **números primos**:

- **MMC:** produto dos fatores **comuns e não comuns**, com os **maiores expoentes**.
- **MDC:** produto dos fatores **comuns**, com os **menores expoentes**.

| Cálculo | Resultado |
|---|---|
| **MMC (12, 18)** (12 = 2²·3, 18 = 2·3²) | 2²·3² = **36** |
| **MDC (12, 18)** | 2·3 = **6** |
| **MMC (15, 20, 30)** | **60** |
| **MDC (48, 60)** | **12** |

**Relação:** **MMC(a, b) · MDC(a, b) = a · b** (para dois números).

## Quando usar cada um

| Pergunta | Use |
|---|---|
| "**De quanto em quanto tempo** dois eventos voltam a coincidir?" / "**quando se encontrarão de novo**?" | **MMC** |
| "Dividir em **grupos iguais, o maior possível**" / "**cortar em pedaços iguais do maior tamanho**" | **MDC** |

*Ex.:* dois ônibus saem a cada **12** e **18** minutos: voltam a sair juntos em **36 minutos** (MMC).
*Ex.:* cortar fitas de **48 m** e **60 m** em pedaços iguais, o maior possível: **12 m** (MDC).
`,
        fc: [
          ["Critério de divisibilidade por 3 e por 9?", "A soma dos algarismos deve ser divisível por 3 (ou por 9)."],
          ["Quando usar MMC e quando usar MDC?", "MMC: coincidências no tempo (quando se encontram de novo). MDC: dividir em partes iguais, o maior tamanho possível."],
          ["Relação entre MMC e MDC de dois números?", "MMC(a, b) · MDC(a, b) = a · b."],
        ],
        mc: [
          ["O MMC entre 12 e 18 é:", ["6.", "24.", "36.", "72."], 2, "12 = 2²·3 e 18 = 2·3² ⇒ 2²·3² = 36.", "FACIL"],
          ["Dois ônibus saem de um terminal juntos às 8h. Um sai a cada 12 minutos e o outro a cada 18 minutos. Voltarão a sair juntos às:", ["8h24min.", "8h30min.", "8h36min.", "8h42min."], 2, "MMC(12, 18) = 36 minutos.", "MEDIO"],
          ["Qual dos números a seguir é divisível por 11?", ["2 573.", "2 574.", "2 575.", "2 576."], 1, "2 − 5 + 7 − 4 = 0 ⇒ divisível por 11 (2 574 = 11 · 234).", "MEDIO"],
        ],
        ce: [
          ["O número 1 236 é divisível por 3 e por 4.", "C", "1+2+3+6 = 12 (por 3); 36 ÷ 4 = 9 (por 4)."],
          ["O MDC entre 48 e 60 é 12.", "C", "48 = 2⁴·3; 60 = 2²·3·5 ⇒ 2²·3 = 12."],
          ["Para saber quando dois eventos periódicos voltarão a coincidir, usa-se o MDC dos períodos.", "E", "Usa-se o MMC."],
          ["3/4 ÷ 1/2 = 3/8.", "E", "3/4 ÷ 1/2 = 3/4 · 2 = 3/2."],
        ],
      },
    ],
  },
  {
    nome: "Geometria e Medidas",
    slug: "geometria-medidas",
    descricao: "Unidades, ângulos, figuras planas, sólidos e trigonometria no triângulo retângulo.",
    ordem: 11,
    topicos: [
      {
        titulo: "Unidades, Ângulos e Figuras Planas",
        slug: "unidades-angulos-figuras-planas",
        resumo: "Conversão de unidades (quilo, hecto…, m², ha, L). Soma dos ângulos internos de um polígono = (n − 2)·180°. Áreas: retângulo b·h, triângulo b·h/2, trapézio (B + b)·h/2, losango D·d/2, círculo πr². Teorema de Pitágoras: a² = b² + c².",
        conteudo: `# Unidades, Ângulos e Figuras Planas

## Unidades

| Grandeza | Relações |
|---|---|
| **Comprimento** | 1 km = 1 000 m · 1 m = 100 cm = 1 000 mm |
| **Área** | 1 m² = 10 000 cm² · **1 ha = 10 000 m²** · 1 km² = 1 000 000 m² |
| **Volume** | 1 m³ = 1 000 dm³ = **1 000 litros** · **1 L = 1 dm³** · 1 mL = 1 cm³ |
| **Massa** | 1 kg = 1 000 g · 1 t = 1 000 kg |

> 💡 Para **área**, cada "casa" decimal vale **100**; para **volume**, **1 000**.

## Ângulos

- **Agudo:** < 90° · **reto:** = 90° · **obtuso:** > 90° · **raso:** 180°.
- **Complementares:** somam **90°** · **suplementares:** somam **180°**.
- **Opostos pelo vértice** são **iguais**.
- **Duas retas paralelas cortadas por uma transversal:** ângulos **correspondentes** e **alternos** são **iguais**; **colaterais** são **suplementares** (somam 180°).

## Triângulos

- **Soma dos ângulos internos = 180°.**
- **Ângulo externo** = **soma dos dois internos não adjacentes**.
- **Classificação:** pelos **lados** (equilátero, isósceles, escaleno) e pelos **ângulos** (acutângulo, retângulo, obtusângulo).
- **Teorema de Pitágoras** (triângulo **retângulo**): **a² = b² + c²** (a = hipotenusa). *Catetos 6 e 8 → hipotenusa 10.*

## Polígonos

> **Soma dos ângulos internos = (n − 2) · 180°**

| Polígono | n | Soma interna |
|---|---|---|
| Triângulo | 3 | 180° |
| Quadrilátero | 4 | 360° |
| Pentágono | 5 | 540° |
| **Hexágono** | 6 | **720°** (regular: cada ângulo **120°**) |

- **Ângulo interno de polígono regular:** (n − 2)·180° / n.
- **Diagonais:** n(n − 3)/2.

## Áreas e perímetros

| Figura | Área | Exemplo |
|---|---|---|
| **Retângulo** | **b · h** | 8 × 5 = **40** (perímetro 2·(8+5) = **26**) |
| **Quadrado** | **l²** | lado 5 → 25 (diagonal **5√2**) |
| **Triângulo** | **b · h / 2** | b = 10, h = 6 → **30** |
| **Trapézio** | **(B + b) · h / 2** | (12 + 8)·5/2 = **50** |
| **Losango** | **D · d / 2** | 10·6/2 = **30** |
| **Círculo** | **π r²** | r = 5 → **25π** ≈ 78,5 |
| **Circunferência (comprimento)** | **2 π r** | r = 7 → **14π** |

> ⚠️ Nos problemas, **converta antes as unidades** para a mesma medida.
`,
        fc: [
          ["Soma dos ângulos internos de um polígono de n lados?", "(n − 2) · 180°. Triângulo 180°, quadrilátero 360°, hexágono 720°."],
          ["Fórmulas das áreas do trapézio, do losango e do triângulo?", "Trapézio: (B + b)·h/2. Losango: D·d/2. Triângulo: b·h/2."],
          ["Teorema de Pitágoras?", "Em triângulo retângulo, a hipotenusa ao quadrado é igual à soma dos quadrados dos catetos: a² = b² + c²."],
        ],
        mc: [
          ["Um triângulo retângulo tem catetos de 6 cm e 8 cm. A hipotenusa mede:", ["9 cm.", "10 cm.", "12 cm.", "14 cm."], 1, "√(36 + 64) = 10.", "FACIL"],
          ["A soma dos ângulos internos de um hexágono é:", ["360°.", "540°.", "720°.", "1 080°."], 2, "(6 − 2) · 180° = 720°.", "FACIL"],
          ["A área de um trapézio de bases 12 e 8 e altura 5 é:", ["40.", "50.", "60.", "100."], 1, "(12 + 8) · 5 / 2 = 50.", "MEDIO"],
        ],
        ce: [
          ["Um retângulo de lados 8 e 5 possui área 40 e perímetro 26.", "C", "8·5 = 40; 2·(8+5) = 26."],
          ["Cada ângulo interno de um hexágono regular mede 120°.", "C", "720°/6 = 120°."],
          ["A área de um losango de diagonais 10 e 6 é 60.", "E", "D·d/2 = 30."],
          ["1 hectare equivale a 10 000 m².", "C", "1 ha = 100 m × 100 m."],
        ],
      },
      {
        titulo: "Sólidos Geométricos e Trigonometria no Triângulo Retângulo",
        slug: "solidos-trigonometria",
        resumo: "Volumes: cubo a³, paralelepípedo a·b·c, cilindro πr²h, cone πr²h/3, esfera 4πr³/3. 1 m³ = 1 000 L. Trigonometria no triângulo retângulo: sen = cateto oposto/hipotenusa, cos = cateto adjacente/hipotenusa, tg = oposto/adjacente; valores notáveis de 30°, 45° e 60°.",
        conteudo: `# Sólidos Geométricos e Trigonometria no Triângulo Retângulo

## Volumes

| Sólido | Volume | Exemplo |
|---|---|---|
| **Cubo** (aresta a) | **a³** | a = 3 → **27** |
| **Paralelepípedo** (a, b, c) | **a · b · c** | 4·3·2 = **24** |
| **Cilindro** (raio r, altura h) | **π r² h** | r = 2, h = 5 → **20π** ≈ 62,8 |
| **Cone** | **π r² h / 3** | r = 3, h = 4 → **12π** |
| **Esfera** | **4 π r³ / 3** | r = 3 → **36π** |

- **Área lateral do cilindro:** 2πrh · **área total:** 2πr(r + h).
- **Área do cubo (total):** 6a².
- **Capacidade:** **1 m³ = 1 000 litros**. *Piscina 5 m × 4 m × 1,5 m = 30 m³ = **30 000 L**.*

## Trigonometria no triângulo retângulo

Em um ângulo agudo **α**:

> **sen α = cateto oposto / hipotenusa**
> **cos α = cateto adjacente / hipotenusa**
> **tg α = cateto oposto / cateto adjacente** = **sen α / cos α**

**Relação fundamental:** **sen² α + cos² α = 1.**

### Valores notáveis

| | **30°** | **45°** | **60°** |
|---|---|---|---|
| **sen** | 1/2 | √2/2 | √3/2 |
| **cos** | √3/2 | √2/2 | 1/2 |
| **tg** | √3/3 | 1 | √3 |

> 💡 **Macete:** o **seno de 30°** é **1/2** e o **cosseno de 60°** também é **1/2**; **seno e cosseno de ângulos complementares trocam** (sen 30° = cos 60°).

**Exemplo.** Uma escada de **10 m** apoiada em uma parede forma **30°** com o chão. A altura atingida é **10 · sen 30° = 5 m**.

## Dicas

- **Faça a figura**, nomeie catetos e hipotenusa em relação ao **ângulo dado**.
- Para **ângulos complementares** (α + β = 90°): **sen α = cos β**.
- Converta as **unidades** antes de aplicar as fórmulas.
`,
        fc: [
          ["Volumes do cilindro, do cone e da esfera?", "Cilindro: πr²h. Cone: πr²h/3. Esfera: 4πr³/3."],
          ["Quantos litros há em 1 m³?", "1 000 litros (1 L = 1 dm³)."],
          ["Valores de seno, cosseno e tangente de 30°, 45° e 60°?", "30°: 1/2, √3/2, √3/3. 45°: √2/2, √2/2, 1. 60°: √3/2, 1/2, √3."],
        ],
        mc: [
          ["O volume de um cubo de aresta 3 cm é:", ["9 cm³.", "18 cm³.", "27 cm³.", "81 cm³."], 2, "3³ = 27.", "FACIL"],
          ["Uma piscina em forma de paralelepípedo tem 5 m de comprimento, 4 m de largura e 1,5 m de profundidade. Sua capacidade é de:", ["30 litros.", "300 litros.", "3 000 litros.", "30 000 litros."], 3, "5·4·1,5 = 30 m³ = 30 000 L.", "MEDIO"],
          ["Uma escada de 10 m, apoiada em uma parede, forma 30° com o chão. A altura que a escada atinge na parede é:", ["5 m.", "5√3 m.", "10√3 m.", "20 m."], 0, "10 · sen 30° = 10 · 1/2 = 5.", "MEDIO"],
        ],
        ce: [
          ["O volume de um cilindro de raio 2 e altura 5 é 20π.", "C", "π · 2² · 5 = 20π."],
          ["1 m³ corresponde a 1 000 litros.", "C", "1 L = 1 dm³ e 1 m³ = 1 000 dm³."],
          ["O seno de 60° é igual a 1/2.", "E", "sen 60° = √3/2; cos 60° = 1/2."],
          ["O volume de um cone de raio 3 e altura 4 é 36π.", "E", "π·9·4/3 = 12π."],
        ],
      },
    ],
  },
];
