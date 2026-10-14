/** Dia (YYYY-MM-DD) no fuso de Brasília, para o streak não virar à meia-noite UTC. */
export function diaBR(d: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(d);
}

/** Sequência de dias consecutivos com atividade, contando de hoje (ou de ontem, se hoje ainda não estudou). */
export function calcularStreak(datas: Date[], agora = new Date()): number {
  const dias = new Set(datas.map(diaBR));
  const DIA = 24 * 60 * 60 * 1000;
  let cursor = new Date(agora);
  if (!dias.has(diaBR(cursor))) cursor = new Date(cursor.getTime() - DIA);
  let streak = 0;
  while (dias.has(diaBR(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - DIA);
  }
  return streak;
}
