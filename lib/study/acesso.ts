import prisma from "@/lib/prisma";

/** Usuário tem acesso ativo (sem expiração ou dentro do prazo) à matéria? */
export async function temAcessoMateria(userId: string, materiaId: string): Promise<boolean> {
  const a = await prisma.userMateria.findUnique({
    where: { userId_materiaId: { userId, materiaId } },
    select: { expiresAt: true },
  });
  return !!a && (a.expiresAt === null || a.expiresAt > new Date());
}
