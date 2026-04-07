/**
 * Camada de acesso a dados universal.
 * Tenta Prisma (banco real) → cai para dados estáticos se não tiver DB.
 *
 * Uso: import { getMateriaData, getAllMateriasData } from "@/lib/getMateriaData"
 */

import { getMateriaBySlug, getAllMaterias, type Materia } from "@/lib/data";

// Lazy import do Prisma para não quebrar o build sem DB
async function getPrisma() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    // Testa a conexão rapidamente
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

export async function getMateriaData(slug: string): Promise<Materia | null> {
  const prisma = await getPrisma();

  if (prisma) {
    try {
      const m = await prisma.materia.findUnique({
        where: { slug, ativa: true },
        include: {
          blocos: {
            orderBy: { ordem: "asc" },
            include: {
              topicos: {
                orderBy: { ordem: "asc" },
                include: {
                  quizzes: {
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
      // DB disponível mas erro na query — cai para estático
    }
  }

  // Fallback: dados estáticos (lib/data.ts)
  return getMateriaBySlug(slug);
}

export async function getAllMateriasData(): Promise<Materia[]> {
  const prisma = await getPrisma();

  if (prisma) {
    try {
      const materias = await prisma.materia.findMany({
        where: { ativa: true },
        orderBy: { ordem: "asc" },
        include: {
          blocos: {
            orderBy: { ordem: "asc" },
            include: {
              topicos: {
                orderBy: { ordem: "asc" },
                include: {
                  quizzes: {
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
  }

  return getAllMaterias();
}
