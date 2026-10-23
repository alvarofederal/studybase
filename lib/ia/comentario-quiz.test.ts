import { describe, expect, it } from "vitest";
import {
  comentarioVisivel,
  lerSaida,
  montarBlocoTopico,
  montarMensagemQuestao,
  SCHEMA_SAIDA,
  validarSaida,
  type ContextoQuestao,
} from "./comentario-quiz";

const multipla: ContextoQuestao = {
  materia: "LGPD",
  bloco: "Fundamentos",
  topico: "Objeto e aplicação",
  conteudoTopico: "# Art. 1º\nA LGPD protege a **pessoa natural**.",
  tipo: "MULTIPLA",
  pergunta: "A LGPD protege dados de:",
  explicacao: "Só pessoa natural.",
  opcoes: [
    { texto: "Pessoa jurídica", correta: false },
    { texto: "Pessoa natural", correta: true },
    { texto: "Órgãos públicos", correta: false },
  ],
};

describe("montagem do prompt (CT-04)", () => {
  it("bloco do tópico traz matéria, bloco, tópico e o conteúdo inteiro", () => {
    const b = montarBlocoTopico(multipla);
    expect(b).toContain("Matéria: LGPD");
    expect(b).toContain("Tópico: Objeto e aplicação");
    expect(b).toContain("<conteudo>\n# Art. 1º\nA LGPD protege a **pessoa natural**.\n</conteudo>");
  });

  it("tópico sem conteúdo é declarado como tal", () => {
    expect(montarBlocoTopico({ ...multipla, conteudoTopico: "  " })).toContain("não tem conteúdo teórico");
  });

  it("múltipla escolha lista as alternativas com letra e marca o gabarito", () => {
    const m = montarMensagemQuestao(multipla);
    expect(m).toContain("A) Pessoa jurídica\n");
    expect(m).toContain("B) Pessoa natural   ← GABARITO");
    expect(m).toContain("Explicação que o material já traz:\nSó pessoa natural.");
    expect(m.match(/GABARITO/g)).toHaveLength(1);
  });

  it("Certo/Errado informa o gabarito por extenso, sem listar alternativas", () => {
    const m = montarMensagemQuestao({
      ...multipla,
      tipo: "CERTO_ERRADO",
      pergunta: "A LGPD se aplica a dados de pessoa jurídica.",
      explicacao: null,
      opcoes: [{ texto: "Certo", correta: false }, { texto: "Errado", correta: true }],
    });
    expect(m).toContain("Assertiva:\nA LGPD se aplica a dados de pessoa jurídica.");
    expect(m).toContain("Gabarito oficial: ERRADO");
    expect(m).not.toContain("Alternativas:");
    expect(m).not.toContain("Explicação que o material");
  });

  it("schema exige os três campos e não aceita propriedades extras", () => {
    expect(SCHEMA_SAIDA.required).toEqual(["comentario", "alertaGabarito", "motivoAlerta"]);
    expect(SCHEMA_SAIDA.additionalProperties).toBe(false);
  });
});

describe("validação da saída (CT-05)", () => {
  const texto = "A **pessoa natural** é o titular protegido; pessoa jurídica fica de fora.";

  it("aceita saída válida e normaliza motivo vazio para null", () => {
    expect(validarSaida({ comentario: texto, alertaGabarito: false, motivoAlerta: "" })).toEqual({
      ok: true,
      valor: { comentario: texto, alertaGabarito: false, motivoAlerta: null },
    });
  });

  it("aceita alerta com motivo", () => {
    const r = validarSaida({ comentario: texto, alertaGabarito: true, motivoAlerta: "O art. 4º diz o contrário." });
    expect(r).toMatchObject({ ok: true, valor: { alertaGabarito: true, motivoAlerta: "O art. 4º diz o contrário." } });
  });

  it("rejeita comentário ausente, curto, alerta sem motivo e JSON inválido", () => {
    expect(validarSaida({ alertaGabarito: false, motivoAlerta: "" }).ok).toBe(false);
    expect(validarSaida({ comentario: "curto", alertaGabarito: false, motivoAlerta: "" }).ok).toBe(false);
    expect(validarSaida({ comentario: texto, alertaGabarito: true, motivoAlerta: " " }).ok).toBe(false);
    expect(validarSaida({ comentario: texto, motivoAlerta: "" }).ok).toBe(false);
    expect(lerSaida("não é json").ok).toBe(false);
    expect(lerSaida(JSON.stringify({ comentario: texto, alertaGabarito: false, motivoAlerta: "" })).ok).toBe(true);
  });
});

describe("visibilidade para o aluno (RF-IA-05)", () => {
  it("esconde oculto e alerta não revisado; mostra o resto", () => {
    expect(comentarioVisivel(null)).toBe(false);
    expect(comentarioVisivel({ oculto: true, alertaGabarito: false, revisado: true })).toBe(false);
    expect(comentarioVisivel({ oculto: false, alertaGabarito: true, revisado: false })).toBe(false);
    expect(comentarioVisivel({ oculto: false, alertaGabarito: true, revisado: true })).toBe(true);
    expect(comentarioVisivel({ oculto: false, alertaGabarito: false, revisado: false })).toBe(true);
  });
});
