/**
 * Camada de acesso a dados universal.
 * Tenta Prisma (banco real) → cai para dados estáticos em caso de erro.
 *
 * IMPORTANTE: não faz SELECT 1 de teste — cada conexão extra conta contra
 * o limite de conexões/hora do plano compartilhado.
 */

import { getMateriaBySlug, getAllMaterias, type Materia } from "@/lib/data";
import { cache } from "react";
import prisma from "@/lib/prisma";

// cache() de React: generateMetadata e a página chamam a mesma função na mesma requisição —
// sem isso a matéria inteira (centenas de KB) era carregada do banco duas vezes.
export const getMateriaData = cache(async function getMateriaData(slug: string): Promise<Materia | null> {
  try {
    const m = await prisma.materia.findUnique({
      where: { slug, ativa: true },
      include: {
        blocos: {
          orderBy: { ordem: "asc" },
          include: {
            topicos: {
              // NOTA: filtro { publicado: true } só pode ser ativado após
              // executar `npx prisma db push` para criar a coluna no banco.
              orderBy: { ordem: "asc" },
              include: {
                quizzes: {
                  // itens CE derivados servem só ao simulado; não entram na aprovação do tópico
                  where: { origemId: null },
                  orderBy: { ordem: "asc" },
                  include: { opcoes: { orderBy: { ordem: "asc" } } },
                },
                flashcards: { orderBy: { ordem: "asc" } },
              },
            },
          },
        },
      },
    });
    if (m) return m as unknown as Materia;
  } catch {
    // DB indisponível — cai para dados estáticos
  }

  return getMateriaBySlug(slug);
});

export async function getAllMateriasData(): Promise<Materia[]> {
  try {
    const materias = await prisma.materia.findMany({
      where: { ativa: true },
      orderBy: { ordem: "asc" },
      include: {
        blocos: {
          orderBy: { ordem: "asc" },
          include: {
            topicos: {
              // NOTA: filtro { publicado: true } só pode ser ativado após
              // executar `npx prisma db push` para criar a coluna no banco.
              orderBy: { ordem: "asc" },
              include: {
                quizzes: {
                  // itens CE derivados servem só ao simulado; não entram na aprovação do tópico
                  where: { origemId: null },
                  orderBy: { ordem: "asc" },
                  include: { opcoes: { orderBy: { ordem: "asc" } } },
                },
                flashcards: { orderBy: { ordem: "asc" } },
              },
            },
          },
        },
      },
    });
    if (materias.length > 0) return materias as unknown as Materia[];
  } catch {
    // cai para estático
  }

  return getAllMaterias();
}

/* ───────────────────────── Resumo leve (só contagens) ─────────────────────────
 * Landing e dashboard admin só precisam de números. Carregar questões/opções/flashcards
 * completos (centenas de KB) só para contar deixava essas telas lentas.
 */
export interface ResumoMateria {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  blocos: number;
  topicos: number;
  quizzes: number;
  flashcards: number;
}

export async function getResumoMaterias(): Promise<ResumoMateria[]> {
  try {
    const materias = await prisma.materia.findMany({
      where: { ativa: true },
      orderBy: { ordem: "asc" },
      select: {
        id: true,
        slug: true,
        nome: true,
        descricao: true,
        icone: true,
        blocos: {
          select: {
            topicos: {
              select: {
                _count: {
                  select: {
                    // itens CE derivados servem só ao simulado
                    quizzes: { where: { origemId: null } },
                    flashcards: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (materias.length > 0) {
      return materias.map((m) => {
        const topicos = m.blocos.flatMap((b) => b.topicos);
        return {
          id: m.id,
          slug: m.slug,
          nome: m.nome,
          descricao: m.descricao,
          icone: m.icone,
          blocos: m.blocos.length,
          topicos: topicos.length,
          quizzes: topicos.reduce((a, t) => a + t._count.quizzes, 0),
          flashcards: topicos.reduce((a, t) => a + t._count.flashcards, 0),
        };
      });
    }
  } catch {
    // cai para estático
  }

  return getAllMaterias().map((m) => {
    const topicos = m.blocos.flatMap((b) => b.topicos);
    return {
      id: m.id,
      slug: m.slug,
      nome: m.nome,
      descricao: m.descricao ?? null,
      icone: m.icone ?? null,
      blocos: m.blocos.length,
      topicos: topicos.length,
      quizzes: topicos.reduce((a, t) => a + t.quizzes.length, 0),
      flashcards: topicos.reduce((a, t) => a + t.flashcards.length, 0),
    };
  });
}

/* ───────────────────────── Carregamento por tópico ─────────────────────────
 * A tela de estudo precisa, para TODOS os tópicos, só do que alimenta o progresso e o
 * destravamento dos blocos: ids de questões/flashcards e qual alternativa é a correta.
 * Textos (conteúdo, enunciados, alternativas, explicações, cards) vêm sob demanda,
 * por tópico, de /api/estudo/topico/[id].
 */
export interface MateriaEsqueleto {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  descricao: string | null;
  blocos: {
    id: string;
    nome: string;
    slug: string;
    topicos: {
      id: string;
      titulo: string;
      slug: string;
      resumo: string | null;
      conteudo: string;
      quizzes: {
        id: string;
        pergunta: string;
        explicacao: string | null;
        opcoes: { id: string; texto: string; correta: boolean; ordem: number }[];
      }[];
      flashcards: { id: string; frente: string; verso: string; dica: string | null }[];
    }[];
  }[];
}

export const getMateriaEsqueleto = cache(async function getMateriaEsqueleto(
  slug: string,
): Promise<MateriaEsqueleto | null> {
  const m = await prisma.materia.findUnique({
    where: { slug, ativa: true },
    select: {
      id: true,
      nome: true,
      slug: true,
      icone: true,
      descricao: true,
      blocos: {
        orderBy: { ordem: "asc" },
        select: {
          id: true,
          nome: true,
          slug: true,
          topicos: {
            orderBy: { ordem: "asc" },
            select: {
              id: true,
              titulo: true,
              slug: true,
              resumo: true,
              quizzes: {
                // itens CE derivados servem só ao simulado; não entram na aprovação do tópico
                where: { origemId: null },
                orderBy: { ordem: "asc" },
                select: { id: true, opcoes: { orderBy: { ordem: "asc" }, select: { id: true, correta: true, ordem: true } } },
              },
              flashcards: { orderBy: { ordem: "asc" }, select: { id: true } },
            },
          },
        },
      },
    },
  });
  if (!m) return null;

  return {
    id: m.id,
    nome: m.nome,
    slug: m.slug,
    icone: m.icone,
    descricao: m.descricao,
    blocos: m.blocos.map((b) => ({
      id: b.id,
      nome: b.nome,
      slug: b.slug,
      topicos: b.topicos.map((t) => ({
        id: t.id,
        titulo: t.titulo,
        slug: t.slug,
        resumo: t.resumo,
        conteudo: "",
        quizzes: t.quizzes.map((q) => ({
          id: q.id,
          pergunta: "",
          explicacao: null,
          opcoes: q.opcoes.map((o) => ({ id: o.id, texto: "", correta: o.correta, ordem: o.ordem })),
        })),
        flashcards: t.flashcards.map((f) => ({ id: f.id, frente: "", verso: "", dica: null })),
      })),
    })),
  };
});
