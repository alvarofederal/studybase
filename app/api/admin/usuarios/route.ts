import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/hash";

export const dynamic = "force-dynamic";

// Lista todos os usuários
export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const usuarios = await prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      ativo: true,
      createdAt: true,
      _count: { select: { materias: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ usuarios });
}

// Cria novo usuário (pelo admin)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { nome, email, senha, role } = await req.json();

  if (!nome || !email || !senha) {
    return NextResponse.json(
      { error: "Nome, e-mail e senha são obrigatórios." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
  }

  const senhaHash = await hashPassword(senha);
  const user = await prisma.user.create({
    data: { nome, email, senha: senhaHash, role: role ?? "USER" },
    select: { id: true, nome: true, email: true, role: true, ativo: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
