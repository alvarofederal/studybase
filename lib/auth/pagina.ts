import { redirect } from "next/navigation";
import { getSession } from "./session";

/** Para páginas de estudo (server components): devolve o usuário ou redireciona. */
export async function exigirAluno() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/admin");
  return session;
}
