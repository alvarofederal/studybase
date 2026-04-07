import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// Busca um usuário
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      ativo: true,
      createdAt: true,
      materias: {
        select: {
          materia: { select: { id: true, nome: true, slug: true, icone: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// Atualiza usuário
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { nome, email, senha, role, ativo } = body;

  const data: Record<string, unknown> = {};
  if (nome !== undefined) data.nome = nome;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;
  if (ativo !== undefined) data.ativo = ativo;
  if (senha) data.senha = await hashPassword(senha);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, nome: true, email: true, role: true, ativo: true },
  });

  return NextResponse.json({ user });
}

// Deleta usuário
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;

  // Não permite deletar a si mesmo
  if (id === session.sub) {
    return NextResponse.json(
      { error: "Você não pode deletar sua própria conta." },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
