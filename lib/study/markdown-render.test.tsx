/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Bloco = { topicos: { titulo: string; conteudo: string }[] };
const modulos = import.meta.glob("../../prisma/data/**/*.mjs", { eager: true }) as Record<string, { default: Bloco | Bloco[] }>;
const topicos = Object.values(modulos)
  .flatMap((m) => (Array.isArray(m.default) ? m.default : [m.default]))
  .flatMap((b) => b.topicos);

const textoVisivel = (html: string) => html.replace(/<[^>]+>/g, "");

describe("MarkdownRenderer", () => {
  it("aninha negrito dentro de itálico e aceita tachado", () => {
    const html = renderToStaticMarkup(<MarkdownRenderer content={"Veja *Não **se** esqueça.* e ~~errado~~ e **ok**."} />);
    expect(textoVisivel(html)).toBe("Veja Não se esqueça. e errado e ok.");
    expect(html).toContain("line-through");
  });

  it("preserva células vazias de tabela", () => {
    const md = "| a | b | c |\n|---|---|---|\n| 1 | | 3 |";
    const html = renderToStaticMarkup(<MarkdownRenderer content={md} />);
    expect(html.match(/<td/g)).toHaveLength(3);
    expect(html.match(/<th[ >]/g)).toHaveLength(3);
  });

  it("junta linhas consecutivas de citação em um bloco", () => {
    const html = renderToStaticMarkup(<MarkdownRenderer content={"> linha 1\n> - item\n> - item 2"} />);
    expect(html.match(/from-emerald-500\/10/g)).toHaveLength(1);
  });

  it.each(topicos.map((t) => [t.titulo, t.conteudo] as const))("%s: renderiza sem marcadores soltos", (_, conteudo) => {
    const texto = textoVisivel(renderToStaticMarkup(<MarkdownRenderer content={conteudo} />));
    expect(texto).not.toMatch(/\*\*|~~|\*/);
  });

  it.each(topicos.map((t) => [t.titulo, t.conteudo] as const))("%s: tabelas com colunas consistentes", (_, conteudo) => {
    const linhas = conteudo.split("\n");
    for (let i = 0; i < linhas.length - 1; i++) {
      if (linhas[i].includes("|") && /^\|?\s*:?-{3,}/.test(linhas[i + 1].trim())) {
        const colunas = linhas[i].trim().replace(/^\||\|$/g, "").split("|").length;
        let j = i + 2;
        while (j < linhas.length && linhas[j].includes("|")) {
          const n = linhas[j].trim().replace(/^\||\|$/g, "").split("|").length;
          expect(n, `linha ${j + 1}: ${linhas[j].slice(0, 60)}`).toBe(colunas);
          j++;
        }
        i = j;
      }
    }
  });
});
