/**
 * Singleton do PrismaClient para Prisma 7.
 *
 * Prisma 7 requer um driver adapter em vez de ler DATABASE_URL automaticamente.
 * Usamos @prisma/adapter-mariadb (compatível com MySQL e MariaDB).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida");

  // PrismaMariaDb cria o pool internamente — passar config object, não pool
  const dbUrl = new URL(url);
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    // Manter pool pequeno — o plano compartilhado tem limite de conexões/hora
    connectionLimit: 2,
    // Libera conexões ociosas rapidamente
    idleTimeout: 10_000,
    connectTimeout: 10_000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
