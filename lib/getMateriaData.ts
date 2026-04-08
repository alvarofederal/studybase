/**
 * Camada de acesso a dados universal.
 * Tenta Prisma (banco real) → cai para dados estáticos em caso de erro.
 *
 * IMPORTANTE: não faz SELECT 1 de teste — cada conexão extra conta contra
 * o limite de conexões/hora do plano compartilhado.
 */

import { getMateriaBySlug, getAllMaterias, type Materia } from "@/lib/data";
import prisma from "@/lib/prisma";

export async function getMateriaData(slug: string): Promise<Materia | null> {
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
    // DB indisponível — cai para dados estáticos
  }

  return getMateriaBySlug(slug);
}

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

  return getAllMaterias();
}
