import { notFound } from "next/navigation";
import { getMateriaData } from "@/lib/getMateriaData";
import EstudoCliente from "./EstudoCliente";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const materia = await getMateriaData(slug);
  if (!materia) return { title: "Não encontrado" };
  return {
    title: `${materia.nome} | StudyBase`,
    description: materia.descricao ?? undefined,
  };
}

export default async function EstudoPage({ params }: Props) {
  const { slug } = await params;
  const materia = await getMateriaData(slug);
  if (!materia) notFound();
  return <EstudoCliente materia={materia} />;
}
