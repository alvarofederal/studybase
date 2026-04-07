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
  | { type: "blockquote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function parseInline(text: string): React.ReactNode {
  // Divide por padrões inline: **bold**, *italic*, `code`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++} className="italic text-gray-200">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={key++} className="bg-gray-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {match[4]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
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
    if (line.startsWith("> ")) {
      const text = line.slice(2);
      blocks.push({ type: "blockquote", text });
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("--")) {
      const headers = line
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      i += 2; // skip separator line
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean)
        );
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
                {block.text}
              </h1>
            );
          case "h2":
            return (
              <h2 key={idx} className="text-lg font-bold text-white mt-5 mb-1.5 border-b border-gray-800 pb-1.5">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={idx} className="text-base font-semibold text-emerald-400 mt-4 mb-1">
                {block.text}
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
                <p className="text-sm text-emerald-200 leading-relaxed">
                  {parseInline(block.text)}
                </p>
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
                          {h}
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
