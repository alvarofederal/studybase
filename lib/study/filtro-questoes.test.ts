import { describe, expect, it } from "vitest";
import { montarWhereQuestoes, normalizarFiltro, situacaoEhFila } from "./filtro-questoes";

const sp = (o: Record<string, string>) => new URLSearchParams(o);

describe("normalizarFiltro (CT-06)", () => {
  it("usa padrões quando não há parâmetros", () => {
    expect(normalizarFiltro(sp({}))).toEqual({
      materiaSlug: null, blocoId: null, dificuldade: null, tipo: null, situacao: "todas", pagina: 1,
    });
  });

  it("aceita valores conhecidos e descarta os desconhecidos", () => {
    const f = normalizarFiltro(sp({
      materia: "lgpd", bloco: "b1", dificuldade: "DIFICIL", tipo: "CERTO_ERRADO", situacao: "erradas", pagina: "3",
    }));
    expect(f).toEqual({ materiaSlug: "lgpd", blocoId: "b1", dificuldade: "DIFICIL", tipo: "CERTO_ERRADO", situacao: "erradas", pagina: 3 });

    const g = normalizarFiltro(sp({ dificuldade: "facil", tipo: "OUTRO", situacao: "x", pagina: "-2" }));
    expect(g).toMatchObject({ dificuldade: null, tipo: null, situacao: "todas", pagina: 1 });
  });

  it("ignora texto longo demais e página absurda", () => {
    const f = normalizarFiltro(sp({ materia: "a".repeat(101), pagina: "999999999" }));
    expect(f.materiaSlug).toBeNull();
    expect(f.pagina).toBe(10_000);
  });
});

describe("montarWhereQuestoes (CT-06)", () => {
  const base = normalizarFiltro(sp({}));

  it("restringe sempre à trilha, a tópicos publicados e às matérias com acesso", () => {
    expect(montarWhereQuestoes(base, "u1", ["m1", "m2"])).toEqual({
      origemId: null,
      topico: { publicado: true, bloco: { materiaId: { in: ["m1", "m2"] } } },
    });
  });

  it("matéria e bloco da URL só estreitam, nunca ampliam o acesso", () => {
    const w = montarWhereQuestoes({ ...base, materiaSlug: "lgpd", blocoId: "b9" }, "u1", ["m1"]);
    expect(w.topico).toEqual({
      publicado: true,
      bloco: { materiaId: { in: ["m1"] }, materia: { slug: "lgpd" }, id: "b9" },
    });
  });

  it("aplica dificuldade e tipo", () => {
    const w = montarWhereQuestoes({ ...base, dificuldade: "FACIL", tipo: "MULTIPLA" }, "u1", ["m1"]);
    expect(w).toMatchObject({ dificuldade: "FACIL", tipo: "MULTIPLA" });
  });

  it("traduz cada situação para o filtro de respostas do próprio aluno", () => {
    expect(montarWhereQuestoes({ ...base, situacao: "nao-respondidas" }, "u1", []).respostas).toEqual({ none: { userId: "u1" } });
    expect(montarWhereQuestoes({ ...base, situacao: "erradas" }, "u1", []).respostas).toEqual({ some: { userId: "u1", correta: false } });
    expect(montarWhereQuestoes({ ...base, situacao: "certas" }, "u1", []).respostas).toEqual({ some: { userId: "u1", correta: true } });
    expect(montarWhereQuestoes(base, "u1", []).respostas).toBeUndefined();
  });

  it("modos de fila: não respondidas e que errei", () => {
    expect(situacaoEhFila("nao-respondidas")).toBe(true);
    expect(situacaoEhFila("erradas")).toBe(true);
    expect(situacaoEhFila("todas")).toBe(false);
    expect(situacaoEhFila("certas")).toBe(false);
  });
});
