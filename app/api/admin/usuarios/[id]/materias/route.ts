import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// Lista matérias do usuário
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;

  const userMaterias = await prisma.userMateria.findMany({
    where: { userId: id },
    select: {
      materia: {
        select: { id: true, nome: true, slug: true, icone: true, cor: true },
      },
    },
  });

  return NextResponse.json({ materias: userMaterias.map((um) => um.materia) });
}

// Substitui as matérias do usuário (recebe array de materiaIds)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id: userId } = await params;
  const { materiaIds } = await req.json() as { materiaIds: string[] };

  if (!Array.isArray(materiaIds)) {
    return NextResponse.json(
      { error: "materiaIds deve ser um array." },
      { status: 400 }
    );
  }

  // Apaga tudo e recria
  await prisma.$transaction([
    prisma.userMateria.deleteMany({ where: { userId } }),
    ...materiaIds.map((materiaId) =>
      prisma.userMateria.create({ data: { userId, materiaId } })
    ),
  ]);

  return NextResponse.json({ ok: true });
}
