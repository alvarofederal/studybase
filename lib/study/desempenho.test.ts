import { describe, expect, it } from "vitest";
import {
  evolucaoSemanal,
  inicioDaSemanaBRT,
  inicioJanelaSemanas,
  montarDesempenho,
  pct,
  type ContagemTopico,
  type TopicoMeta,
} from "./desempenho";

function topico(p: Partial<TopicoMeta> & { topicoId: string }): TopicoMeta {
  return {
    titulo: p.topicoId, ordem: 0,
    blocoId: "b1", blocoNome: "Bloco 1", blocoOrdem: 0,
    materiaId: "m1", materiaNome: "Matéria 1", materiaSlug: "materia-1", materiaIcone: null, materiaOrdem: 0,
    questoesTrilha: 10, flashcards: 4,
    ...p,
  };
}
function contagem(p: Partial<ContagemTopico> & { topicoId: string }): ContagemTopico {
  return { respondidos: 0, acertos: 0, respondidosTrilha: 0, fcRevisados: 0, fcAcertos: 0, ...p };
}

describe("pct", () => {
  it("arredonda e devolve null sem base", () => {
    expect(pct(2, 3)).toBe(67);
    expect(pct(0, 0)).toBeNull();
    expect(pct(0, 5)).toBe(0);
  });
});

describe("montarDesempenho (CT-01)", () => {
  const topicos = [
    topico({ topicoId: "t1", blocoId: "b1", blocoNome: "B1", ordem: 1 }),
    topico({ topicoId: "t2", blocoId: "b1", blocoNome: "B1", ordem: 2, questoesTrilha: 5, flashcards: 2 }),
    topico({ topicoId: "t3", blocoId: "b2", blocoNome: "B2", blocoOrdem: 1 }),
    topico({ topicoId: "t4", materiaId: "m2", materiaNome: "Matéria 2", materiaSlug: "m2", materiaOrdem: 1, blocoId: "b3", blocoNome: "B3" }),
  ];
  const contagens = [
    contagem({ topicoId: "t1", respondidos: 8, acertos: 6, respondidosTrilha: 6, fcRevisados: 4, fcAcertos: 3 }),
    contagem({ topicoId: "t2", respondidos: 4, acertos: 4, respondidosTrilha: 4 }),
    contagem({ topicoId: "t4", respondidos: 2, acertos: 1, respondidosTrilha: 2, fcRevisados: 1, fcAcertos: 1 }),
    contagem({ topicoId: "fora-do-acesso", respondidos: 50, acertos: 50 }),
  ];
  const d = montarDesempenho(topicos, contagens);

  it("soma o geral só com tópicos das matérias com acesso", () => {
    expect(d.geral).toEqual({ respondidos: 14, acertos: 11, pct: 79, fcRevisados: 5, fcAcertos: 4, fcPct: 80 });
  });

  it("agrupa por matéria e bloco, na ordem das matérias e blocos", () => {
    expect(d.materias.map((m) => m.id)).toEqual(["m1", "m2"]);
    const m1 = d.materias[0];
    expect(m1).toMatchObject({ respondidos: 12, acertos: 10, pct: 83, trilhaRespondidas: 10, trilhaTotal: 25, fcRevisados: 4, fcTotal: 10 });
    expect(m1.blocos.map((b) => [b.nome, b.respondidos, b.pct, b.trilhaRespondidas, b.trilhaTotal])).toEqual([
      ["B1", 12, 83, 10, 15],
      ["B2", 0, null, 0, 10],
    ]);
  });

  it("progresso da trilha nunca passa do total do tópico", () => {
    const x = montarDesempenho(
      [topico({ topicoId: "t", questoesTrilha: 2 })],
      [contagem({ topicoId: "t", respondidos: 5, acertos: 5, respondidosTrilha: 5 })],
    );
    expect(x.materias[0].trilhaRespondidas).toBe(2);
  });
});

describe("pontos fracos (CT-02)", () => {
  it("exige ao menos 3 respondidos e acerto abaixo de 70%, do menor acerto para o maior", () => {
    const topicos = ["a", "b", "c", "d", "e"].map((id) => topico({ topicoId: id }));
    const d = montarDesempenho(topicos, [
      contagem({ topicoId: "a", respondidos: 2, acertos: 0 }), // poucos itens
      contagem({ topicoId: "b", respondidos: 10, acertos: 7 }), // 70% (não entra)
      contagem({ topicoId: "c", respondidos: 10, acertos: 5 }), // 50%
      contagem({ topicoId: "d", respondidos: 4, acertos: 1 }), // 25%
      contagem({ topicoId: "e", respondidos: 8, acertos: 2 }), // 25%, mais respondidos → antes de "d"
    ]);
    expect(d.pontosFracos.map((p) => [p.topicoId, p.pct])).toEqual([["e", 25], ["d", 25], ["c", 50]]);
  });

  it("limita a 6 itens", () => {
    const ids = Array.from({ length: 9 }, (_, i) => `t${i}`);
    const d = montarDesempenho(
      ids.map((id) => topico({ topicoId: id })),
      ids.map((id) => contagem({ topicoId: id, respondidos: 5, acertos: 1 })),
    );
    expect(d.pontosFracos).toHaveLength(6);
  });
});

describe("semanas (CT-03)", () => {
  // quarta-feira 22/10/2026 15:00 em Brasília = 18:00 UTC
  const agora = new Date("2026-10-22T18:00:00Z");

  it("a semana começa na segunda 00:00 de Brasília", () => {
    expect(new Date(inicioDaSemanaBRT(agora)).toISOString()).toBe("2026-10-19T03:00:00.000Z");
  });

  it("domingo 23:30 em Brasília ainda pertence à semana anterior", () => {
    const domingoNoite = new Date("2026-10-26T02:30:00Z"); // 25/10 23:30 BRT
    expect(new Date(inicioDaSemanaBRT(domingoNoite)).toISOString()).toBe("2026-10-19T03:00:00.000Z");
  });

  it("monta 8 semanas, agrupa tentativas e deixa semana vazia com pct null", () => {
    const s = evolucaoSemanal(
      [
        { createdAt: new Date("2026-10-20T12:00:00Z"), correta: true },
        { createdAt: new Date("2026-10-21T12:00:00Z"), correta: false },
        { createdAt: new Date("2026-09-01T12:00:00Z"), correta: true }, // primeira semana (31/08)
        { createdAt: new Date("2026-08-20T12:00:00Z"), correta: true }, // fora da janela
      ],
      agora,
    );
    expect(s).toHaveLength(8);
    expect(s[0].inicio).toBe("2026-08-31");
    expect(s[7]).toEqual({ inicio: "2026-10-19", tentativas: 2, acertos: 1, pct: 50 });
    expect(s[0]).toMatchObject({ tentativas: 1, pct: 100 });
    expect(s[3]).toMatchObject({ tentativas: 0, pct: null });
  });

  it("a janela de busca começa na segunda da primeira semana", () => {
    expect(inicioJanelaSemanas(agora).toISOString()).toBe("2026-08-31T03:00:00.000Z");
  });
});
