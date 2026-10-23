import Link from "next/link";
import prisma from "@/lib/prisma";
import { exigirAluno } from "@/lib/auth/pagina";
import { materiasAtivasIds } from "@/lib/study/painel";
import QuestoesCliente from "./QuestoesCliente";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banco de questões | StudyBase" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function QuestoesPage({ searchParams }: Props) {
  const { sub: userId } = await exigirAluno();
  const ids = await materiasAtivasIds(userId);
  const materias = await prisma.materia.findMany({
    where: { id: { in: ids } },
    orderBy: { ordem: "asc" },
    select: { slug: true, nome: true, icone: true, blocos: { orderBy: { ordem: "asc" }, select: { id: true, nome: true } } },
  });

  // Filtros iniciais vindos da URL (permite recarregar e compartilhar o link do filtro)
  const sp = await searchParams;
  const inicial = Object.fromEntries(
    ["materia", "bloco", "dificuldade", "tipo", "situacao"].map((k) => [k, typeof sp[k] === "string" ? (sp[k] as string) : ""]),
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="flex h-14 items-center gap-3 border-b border-gray-800 bg-gray-900 px-4">
        <Link href="/estudo" className="text-sm text-gray-400 hover:text-white">← Início</Link>
        <h1 className="flex-1 text-sm font-bold">Banco de questões</h1>
        <Link href="/estudo/desempenho" className="text-xs text-gray-400 hover:text-white">Desempenho →</Link>
      </header>
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        {materias.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
            <p className="font-medium text-gray-300">Você ainda não tem matérias liberadas.</p>
            <Link href="/estudo" className="mt-3 inline-block text-sm text-emerald-400 hover:underline">
              Solicitar acesso a uma matéria →
            </Link>
          </div>
        ) : (
          <QuestoesCliente materias={materias} inicial={inicial} />
        )}
      </main>
    </div>
  );
}
