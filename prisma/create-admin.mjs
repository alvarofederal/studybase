/**
 * Cria o primeiro usuário ADMIN.
 * Execute: node prisma/create-admin.mjs
 *
 * Altere email/senha antes de rodar em produção.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@studybase.com.br";
const ADMIN_SENHA = process.env.ADMIN_SENHA || "studybase@2025";
const ADMIN_NOME  = process.env.ADMIN_NOME  || "Administrador";

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 2,
  });

  const prisma = new PrismaClient({ adapter });

  const exists = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (exists) {
    console.log(`✅ Admin já existe: ${ADMIN_EMAIL}`);
    await prisma.$disconnect();
    return;
  }

  const senhaHash = await bcrypt.hash(ADMIN_SENHA, 12);
  const user = await prisma.user.create({
    data: { nome: ADMIN_NOME, email: ADMIN_EMAIL, senha: senhaHash, role: "ADMIN" },
  });

  console.log(`✅ Admin criado:`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Senha: ${ADMIN_SENHA}`);
  console.log(`   ⚠️  Troque a senha após o primeiro login!`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
