"use client";

/**
 * Renderizador de Markdown simples — sem dependências externas.
 * Suporta os elementos usados no conteúdo do StudyBase:
 *   # h1, ## h2, ### h3
 *   **negrito**, *itálico*
 *   - listas, 1. listas numeradas
 *   > blockquote / 💡 pontos-chave
 *   `código inline`
 *   | tabelas |
 *   linha em branco = novo parágrafo
 */

import React from "react";

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function parseInline(text: string): React.ReactNode {
  // Marcadores alternáveis: **negrito**, *itálico*, ~~tachado~~, `código` — aceitam aninhamento
  // (ex.: *Não **se** esqueça.*). Um marcador sem par vira texto normal ao fim.
  const parts: React.ReactNode[] = [];
  let bold = false;
  let italic = false;
  let strike = false;
  let buf = "";
  let key = 0;

  const flush = () => {
    if (!buf) return;
    if (!bold && !italic && !strike) {
      parts.push(buf);
    } else {
      const cls = [
        bold ? "font-semibold text-white" : "",
        italic ? "italic text-gray-200" : "",
        strike ? "line-through decoration-red-400/70 text-red-300/80" : "",
      ]
        .filter(Boolean)
        .join(" ");
      parts.push(<span key={key++} className={cls}>{buf}</span>);
    }
    buf = "";
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "*" && text[i + 1] === "*") {
      flush();
      bold = !bold;
      i++;
    } else if (c === "*") {
      flush();
      italic = !italic;
    } else if (c === "~" && text[i + 1] === "~") {
      flush();
      strike = !strike;
      i++;
    } else if (c === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        flush();
        parts.push(
          <code key={key++} className="bg-gray-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {text.slice(i + 1, end)}
          </code>
        );
        i = end;
      } else {
        buf += c;
      }
    } else {
      buf += c;
    }
  }
  flush();
  return parts.length === 1 ? parts[0] : parts;
}

/** Divide uma linha de tabela preservando células vazias (só remove as barras das pontas). */
function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((c) => c.trim());
}

function parseBlocks(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }

    // HR
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ") || line === ">") {
      const quoted: string[] = [];
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i] === ">")) {
        quoted.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", lines: quoted });
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("--")) {
      const headers = splitRow(line);
      i += 2; // skip separator line
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith(">") && !lines[i].startsWith("|") && !/^[-*] /.test(lines[i]) && !/^\d+\. /.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1 key={idx} className="text-2xl font-black text-white mt-6 mb-2 first:mt-0">
                {parseInline(block.text)}
              </h1>
            );
          case "h2":
            return (
              <h2 key={idx} className="text-lg font-bold text-white mt-5 mb-1.5 border-b border-gray-800 pb-1.5">
                {parseInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={idx} className="text-base font-semibold text-emerald-400 mt-4 mb-1">
                {parseInline(block.text)}
              </h3>
            );
          case "p":
            return (
              <p key={idx} className="text-gray-300 leading-relaxed text-sm">
                {parseInline(block.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-1.5 ml-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                    <span>{parseInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-1.5 ml-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                    <span className="text-emerald-500 font-bold shrink-0 w-5">{j + 1}.</span>
                    <span>{parseInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "blockquote":
            return (
              <div key={idx} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 my-2">
                <div className="space-y-1">
                  {block.lines.map((ln, j) =>
                    /^[-*] /.test(ln) ? (
                      <p key={j} className="text-sm text-emerald-200 leading-relaxed flex gap-2">
                        <span className="text-emerald-500 shrink-0">→</span>
                        <span>{parseInline(ln.slice(2))}</span>
                      </p>
                    ) : ln.trim() === "" ? null : (
                      <p key={j} className="text-sm text-emerald-200 leading-relaxed">
                        {parseInline(ln)}
                      </p>
                    ),
                  )}
                </div>
              </div>
            );
          case "table":
            return (
              <div key={idx} className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {parseInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-gray-900" : "bg-gray-900/60"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-2.5 text-gray-300">
                            {parseInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "hr":
            return <hr key={idx} className="border-gray-800 my-4" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
