import Link from "next/link";
import prisma from "@/lib/prisma";
import { exigirAluno } from "@/lib/auth/pagina";
import { materiasAtivasIds } from "@/lib/study/painel";
import SimuladoCliente from "./SimuladoCliente";

export const dynamic = "force-dynamic";
export const metadata = { title: "Simulado | StudyBase" };

type Props = { searchParams: Promise<{ modo?: string }> };

export default async function SimuladoPage({ searchParams }: Props) {
  const { sub: userId } = await exigirAluno();
  const { modo } = await searchParams;
  const ids = await materiasAtivasIds(userId);
  const materias = await prisma.materia.findMany({
    where: { id: { in: ids } },
    orderBy: { ordem: "asc" },
    select: { slug: true, nome: true },
  });

  return (
    <div className="min-h-screen text-white">
      <header className="h-14 glass !rounded-none !border-x-0 !border-t-0 flex items-center px-4 gap-3">
        <Link href="/estudo" className="text-gray-400 hover:text-white text-sm">← Início</Link>
        <h1 className="font-bold text-sm">Simulado</h1>
      </header>
      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        <SimuladoCliente materias={materias} modoInicial={modo === "erros" ? "erros" : "aleatorio"} />
      </main>
    </div>
  );
}
