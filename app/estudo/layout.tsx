import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import PresencaHeartbeat from "@/components/estudo/PresencaHeartbeat";

export const dynamic = "force-dynamic";

/**
 * Layout da área do aluno:
 *  - sessão única: se a conta foi aberta em outro aparelho, derruba esta sessão já no carregamento;
 *  - monta o heartbeat de presença (indicador de "online" do painel admin).
 */
export default async function EstudoLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session && session.role === "USER") {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { sessionId: true },
    });
    if (user?.sessionId && session.sid !== user.sessionId) {
      redirect("/api/auth/sessao-encerrada?motivo=outro-dispositivo");
    }
  }

  return (
    <>
      <PresencaHeartbeat />
      {children}
    </>
  );
}
