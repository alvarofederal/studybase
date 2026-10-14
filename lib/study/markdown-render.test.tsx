import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import b1 from "../../prisma/data/lingua-portuguesa/01-interpretacao.mjs";
import b2 from "../../prisma/data/lingua-portuguesa/02-fonologia-ortografia.mjs";
import b3 from "../../prisma/data/lingua-portuguesa/03-semantica-formacao.mjs";
import b4 from "../../prisma/data/lingua-portuguesa/04-classes-de-palavras.mjs";
import b5 from "../../prisma/data/lingua-portuguesa/05-sintaxe.mjs";
import b6 from "../../prisma/data/lingua-portuguesa/06-pontuacao-concordancia-regencia-crase.mjs";
import b7 from "../../prisma/data/lingua-portuguesa/07-reescrita-registro-culto.mjs";
import b8 from "../../prisma/data/lingua-portuguesa/08-redacao-oficial.mjs";

const topicos = ([b1, b2, b3, b4, b5, b6, b7, b8] as { topicos: { titulo: string; conteudo: string }[] }[]).flatMap(
  (b) => b.topicos,
);

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
