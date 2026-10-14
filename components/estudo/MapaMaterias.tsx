"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ── tipos públicos ───────────────────────────────────────── */
export interface MapaTopico {
  id: string;
  titulo: string;
}
export interface MapaBloco {
  id: string;
  nome: string;
  topicos: MapaTopico[];
}
export interface MapaMateria {
  id: string;
  slug: string;
  nome: string;
  icone: string | null;
  blocos: MapaBloco[];
}

/* ── modelo da simulação ──────────────────────────────────── */
type Tipo = "hub" | "materia" | "bloco" | "topico";

interface No {
  id: string;
  tipo: Tipo;
  label: string;
  href: string | null;
  cor: string; // "r,g,b"
  raio: number;
  icone?: string;
  pai: No | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fixo: boolean;
}
interface Aresta {
  a: No;
  b: No;
  comprimento: number;
}

// Matizes da identidade (violeta, azul, rosa, ciano, âmbar suave, vinho)
const PALETA = [
  "113,76,182",
  "88,120,220",
  "214,98,150",
  "46,160,170",
  "200,140,60",
  "140,70,90",
];

function construir(materias: MapaMateria[], largura: number, altura: number) {
  const nos: No[] = [];
  const arestas: Aresta[] = [];
  const cx = largura / 2;
  const cy = altura / 2;

  const hub: No = {
    id: "hub", tipo: "hub", label: "Você", href: "/estudo", cor: "66,29,36",
    raio: 15, pai: null, x: cx, y: cy, vx: 0, vy: 0, fixo: true,
  };
  nos.push(hub);

  const n = Math.max(materias.length, 1);
  materias.forEach((m, i) => {
    const ang = (i / n) * Math.PI * 2;
    const cor = PALETA[i % PALETA.length];
    const dist = Math.min(largura, altura) * 0.3;
    const nm: No = {
      id: `m:${m.id}`, tipo: "materia", label: m.nome, href: `/estudo/${m.slug}`, cor,
      raio: 13, icone: m.icone ?? "📖", pai: hub,
      x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist, vx: 0, vy: 0, fixo: false,
    };
    nos.push(nm);
    arestas.push({ a: hub, b: nm, comprimento: dist });

    m.blocos.forEach((b, bi) => {
      const a2 = ang + (bi - m.blocos.length / 2) * 0.35;
      const nb: No = {
        id: `b:${b.id}`, tipo: "bloco", label: b.nome, href: `/estudo/${m.slug}`, cor,
        raio: 6, pai: nm,
        x: nm.x + Math.cos(a2) * 50, y: nm.y + Math.sin(a2) * 50, vx: 0, vy: 0, fixo: false,
      };
      nos.push(nb);
      arestas.push({ a: nm, b: nb, comprimento: 74 });

      b.topicos.forEach((t, ti) => {
        const a3 = a2 + (ti - b.topicos.length / 2) * 0.5;
        const nt: No = {
          id: `t:${t.id}`, tipo: "topico", label: t.titulo,
          href: `/estudo/${m.slug}?topico=${t.id}`, cor,
          raio: 2.6, pai: nb,
          x: nb.x + Math.cos(a3) * 26, y: nb.y + Math.sin(a3) * 26, vx: 0, vy: 0, fixo: false,
        };
        nos.push(nt);
        arestas.push({ a: nb, b: nt, comprimento: 36 });
      });
    });
  });

  return { nos, arestas, hub };
}

function passo(nos: No[], arestas: Aresta[], cx: number, cy: number, energia: number) {
  const n = nos.length;
  // repulsão (apenas a curta distância, o suficiente para espalhar sem custo excessivo)
  for (let i = 0; i < n; i++) {
    const p = nos[i];
    for (let j = i + 1; j < n; j++) {
      const q = nos[j];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > 40000) continue; // 150px
      const d = Math.sqrt(d2) || 0.01;
      const peso = (p.tipo === "topico" && q.tipo === "topico") ? 9 : 34;
      const f = (peso * (p.raio + q.raio)) / d2;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      p.vx -= fx; p.vy -= fy;
      q.vx += fx; q.vy += fy;
    }
  }
  // molas
  for (const e of arestas) {
    const dx = e.b.x - e.a.x;
    const dy = e.b.y - e.a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const f = (d - e.comprimento) * 0.04;
    const fx = (dx / d) * f;
    const fy = (dy / d) * f;
    e.a.vx += fx; e.a.vy += fy;
    e.b.vx -= fx; e.b.vy -= fy;
  }
  // gravidade suave ao centro + respiração (movimento contínuo, estilo Gource)
  const t = performance.now() / 1000;
  for (let i = 0; i < n; i++) {
    const p = nos[i];
    if (p.fixo) { p.x = cx; p.y = cy; p.vx = p.vy = 0; continue; }
    p.vx += (cx - p.x) * 0.0016;
    p.vy += (cy - p.y) * 0.0016;
    p.vx += Math.sin(t * 0.7 + i * 1.7) * 0.012 * energia;
    p.vy += Math.cos(t * 0.6 + i * 2.3) * 0.012 * energia;
    p.vx *= 0.88; p.vy *= 0.88;
    p.x += p.vx; p.y += p.vy;
  }
}

/* ── componente ───────────────────────────────────────────── */
export default function MapaMaterias({ materias }: { materias: MapaMateria[] }) {
  const router = useRouter();
  const routerRef = useRef(router);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dica, setDica] = useState<{ x: number; y: number; label: string; tipo: Tipo } | null>(null);

  useEffect(() => { routerRef.current = router; }, [router]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let largura = wrap.clientWidth;
    let altura = wrap.clientHeight;
    const modelo = construir(materias, largura, altura);
    let hover: No | null = null;
    let arrastando: No | null = null;
    let pressionado: No | null = null;
    let moveu = false;
    let ultimoToque: string | null = null;
    let ponteiro = { x: -999, y: -999 };
    let raf = 0;
    let rodando = true;

    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = wrap!.clientWidth;
      altura = wrap!.clientHeight;
      canvas!.width = largura * dpr;
      canvas!.height = altura * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ajustar();
    // pré-aquece a simulação para já abrir com o grafo assentado
    for (let i = 0; i < 260; i++) passo(modelo.nos, modelo.arestas, largura / 2, altura / 2, 0);

    const ro = new ResizeObserver(() => {
      ajustar();
      // limita ao novo tamanho
      for (const p of modelo.nos) {
        p.x = Math.min(Math.max(p.x, 20), largura - 20);
        p.y = Math.min(Math.max(p.y, 20), altura - 20);
      }
    });
    ro.observe(wrap);

    function vizinhos(no: No | null): Set<string> {
      const s = new Set<string>();
      if (!no) return s;
      s.add(no.id);
      // ancestrais
      for (let p = no.pai; p; p = p.pai) s.add(p.id);
      // descendentes
      const filhos = (alvo: No) => {
        for (const e of modelo.arestas) if (e.a === alvo) { s.add(e.b.id); filhos(e.b); }
      };
      filhos(no);
      return s;
    }

    function acharNo(x: number, y: number): No | null {
      let melhor: No | null = null;
      let melhorD = Infinity;
      for (const p of modelo.nos) {
        const d = Math.hypot(p.x - x, p.y - y);
        const folga = p.tipo === "topico" ? 7 : 9;
        if (d <= p.raio + folga && d < melhorD) { melhor = p; melhorD = d; }
      }
      return melhor;
    }

    function desenhar() {
      const claro = document.documentElement.classList.contains("light");
      const tinta = claro ? "41,40,39" : "237,237,237";
      ctx!.clearRect(0, 0, largura, altura);
      const ativos = vizinhos(hover);
      const temFoco = hover !== null;

      // arestas
      for (const e of modelo.arestas) {
        const emFoco = !temFoco || (ativos.has(e.a.id) && ativos.has(e.b.id));
        ctx!.beginPath();
        ctx!.moveTo(e.a.x, e.a.y);
        ctx!.lineTo(e.b.x, e.b.y);
        const op = emFoco ? (temFoco ? 0.55 : 0.28) : 0.06;
        ctx!.strokeStyle = `rgba(${e.b.cor},${op})`;
        ctx!.lineWidth = e.b.tipo === "materia" ? 1.4 : 1;
        ctx!.stroke();
      }

      // nós
      for (const p of modelo.nos) {
        const emFoco = !temFoco || ativos.has(p.id);
        const alfa = emFoco ? 1 : 0.18;
        const r = p.raio + (p === hover ? 2.5 : 0);

        if (p.tipo !== "topico") {
          const g = ctx!.createRadialGradient(p.x, p.y, r * 0.3, p.x, p.y, r * 3);
          g.addColorStop(0, `rgba(${p.cor},${0.35 * alfa})`);
          g.addColorStop(1, `rgba(${p.cor},0)`);
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (p.tipo === "hub" || p.tipo === "materia") {
          ctx!.fillStyle = claro ? `rgba(255,255,255,${0.92 * alfa})` : `rgba(30,30,36,${0.92 * alfa})`;
          ctx!.fill();
          ctx!.lineWidth = 2;
          ctx!.strokeStyle = `rgba(${p.cor},${alfa})`;
          ctx!.stroke();
        } else {
          ctx!.fillStyle = `rgba(${p.cor},${(p.tipo === "bloco" ? 0.9 : 0.7) * alfa})`;
          ctx!.fill();
        }

        if (p.tipo === "materia" && p.icone) {
          ctx!.globalAlpha = alfa;
          ctx!.font = "13px system-ui, sans-serif";
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(p.icone, p.x, p.y + 1);
          ctx!.globalAlpha = 1;
        }
        if (p.tipo === "hub") {
          ctx!.fillStyle = "#fff";
          ctx!.font = "600 10px Inter, system-ui, sans-serif";
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${p.cor},1)`;
          ctx!.fill();
          ctx!.fillStyle = "#fff";
          ctx!.fillText("Eu", p.x, p.y + 0.5);
        }

        // rótulos fixos das matérias
        if (p.tipo === "materia") {
          ctx!.font = "460 11px Inter, system-ui, sans-serif";
          ctx!.textAlign = "center";
          ctx!.textBaseline = "top";
          ctx!.fillStyle = `rgba(${tinta},${0.78 * alfa})`;
          const txt = p.label.length > 26 ? `${p.label.slice(0, 25)}…` : p.label;
          ctx!.fillText(txt, p.x, p.y + r + 5);
        }
      }
    }

    function quadro() {
      if (!rodando) return;
      if (!reduzido) passo(modelo.nos, modelo.arestas, largura / 2, altura / 2, 1);
      desenhar();
      raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);

    const pausar = () => {
      if (document.hidden) { cancelAnimationFrame(raf); rodando = false; }
      else if (!rodando) { rodando = true; raf = requestAnimationFrame(quadro); }
    };
    document.addEventListener("visibilitychange", pausar);

    function posicao(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function aoMover(e: PointerEvent) {
      ponteiro = posicao(e);
      if (arrastando) {
        moveu = true;
        arrastando.x = ponteiro.x;
        arrastando.y = ponteiro.y;
        arrastando.vx = arrastando.vy = 0;
        return;
      }
      const alvo = acharNo(ponteiro.x, ponteiro.y);
      if (alvo !== hover) {
        hover = alvo;
        canvas!.style.cursor = alvo && alvo.href ? "pointer" : "default";
        setDica(alvo ? { x: alvo.x, y: alvo.y, label: alvo.label, tipo: alvo.tipo } : null);
      } else if (alvo) {
        setDica({ x: alvo.x, y: alvo.y, label: alvo.label, tipo: alvo.tipo });
      }
    }
    function aoPressionar(e: PointerEvent) {
      ponteiro = posicao(e);
      const alvo = acharNo(ponteiro.x, ponteiro.y);
      moveu = false;
      if (e.pointerType === "touch") {
        hover = alvo;
        setDica(alvo ? { x: alvo.x, y: alvo.y, label: alvo.label, tipo: alvo.tipo } : null);
      }
      if (alvo && !alvo.fixo) {
        arrastando = alvo;
        canvas!.setPointerCapture(e.pointerId);
      }
      pressionado = alvo;
    }
    function aoSoltar(e: PointerEvent) {
      const alvo = pressionado;
      pressionado = null;
      const eraArrasto = arrastando !== null && moveu;
      arrastando = null;
      if (canvas!.hasPointerCapture(e.pointerId)) canvas!.releasePointerCapture(e.pointerId);
      if (!alvo || eraArrasto || !alvo.href) return;
      if (e.pointerType === "touch" && ultimoToque !== alvo.id) {
        ultimoToque = alvo.id; // 1º toque mostra o nome; 2º navega
        return;
      }
      routerRef.current.push(alvo.href);
    }
    function aoSair() {
      if (arrastando) return;
      hover = null;
      setDica(null);
    }

    canvas.addEventListener("pointermove", aoMover);
    canvas.addEventListener("pointerdown", aoPressionar);
    canvas.addEventListener("pointerup", aoSoltar);
    canvas.addEventListener("pointerleave", aoSair);

    return () => {
      rodando = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", pausar);
      canvas.removeEventListener("pointermove", aoMover);
      canvas.removeEventListener("pointerdown", aoPressionar);
      canvas.removeEventListener("pointerup", aoSoltar);
      canvas.removeEventListener("pointerleave", aoSair);
    };
  }, [materias]);

  const rotuloTipo: Record<Tipo, string> = {
    hub: "Seu mapa", materia: "Matéria", bloco: "Bloco", topico: "Tópico",
  };

  return (
    <div ref={wrapRef} className="relative h-[420px] sm:h-[500px] w-full select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-pan-y"
        aria-label="Mapa interativo das suas matérias, blocos e tópicos"
        role="img"
      />
      {dica && (
        <div
          className="glass pointer-events-none absolute z-10 max-w-[240px] -translate-x-1/2 px-3 py-1.5 text-xs leading-snug"
          style={{ left: dica.x, top: Math.max(dica.y - 44, 4) }}
        >
          <span className="block text-[10px] uppercase tracking-wider text-gray-500">
            {rotuloTipo[dica.tipo]}
          </span>
          <span className="font-medium text-white">{dica.label}</span>
        </div>
      )}
    </div>
  );
}
