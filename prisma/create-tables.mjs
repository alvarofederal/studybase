/**
 * Script para criar as tabelas no MySQL sem depender do Prisma CLI.
 * Usa mysql2 que já está instalado como dependência do projeto.
 * Execute: node prisma/create-tables.mjs
 */

import mysql from "../node_modules/mysql2/promise.js";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://u937845481_user_studybase:atendimento_AlvareX1!Akjsm@212.85.3.45:3306/u937845481_studybasedb";

// Parseia a URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  multipleStatements: true,
  ssl: false,
};

const SQL = `
-- ─────────────────────────────────────────────
-- Cria tabelas StudyBase (idempotente: IF NOT EXISTS)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS \`materias\` (
  \`id\`        VARCHAR(30)   NOT NULL,
  \`nome\`      VARCHAR(191)  NOT NULL,
  \`slug\`      VARCHAR(191)  NOT NULL,
  \`descricao\` TEXT          NULL,
  \`icone\`     VARCHAR(191)  NULL,
  \`cor\`       VARCHAR(191)  NULL,
  \`ativa\`     TINYINT(1)    NOT NULL DEFAULT 1,
  \`ordem\`     INT           NOT NULL DEFAULT 0,
  \`createdAt\` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3)   NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`materias_slug_key\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`blocos\` (
  \`id\`        VARCHAR(30)   NOT NULL,
  \`nome\`      VARCHAR(191)  NOT NULL,
  \`slug\`      VARCHAR(191)  NOT NULL,
  \`descricao\` TEXT          NULL,
  \`ordem\`     INT           NOT NULL DEFAULT 0,
  \`materiaId\` VARCHAR(30)   NOT NULL,
  \`createdAt\` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3)   NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`blocos_materiaId_slug_key\` (\`materiaId\`, \`slug\`),
  CONSTRAINT \`blocos_materiaId_fkey\` FOREIGN KEY (\`materiaId\`) REFERENCES \`materias\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`topicos\` (
  \`id\`        VARCHAR(30)   NOT NULL,
  \`titulo\`    VARCHAR(191)  NOT NULL,
  \`slug\`      VARCHAR(191)  NOT NULL,
  \`conteudo\`  LONGTEXT      NOT NULL,
  \`resumo\`    TEXT          NULL,
  \`ordem\`     INT           NOT NULL DEFAULT 0,
  \`blocoId\`   VARCHAR(30)   NOT NULL,
  \`createdAt\` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3)   NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`topicos_blocoId_slug_key\` (\`blocoId\`, \`slug\`),
  CONSTRAINT \`topicos_blocoId_fkey\` FOREIGN KEY (\`blocoId\`) REFERENCES \`blocos\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`quizzes\` (
  \`id\`         VARCHAR(30)   NOT NULL,
  \`pergunta\`   TEXT          NOT NULL,
  \`explicacao\` TEXT          NULL,
  \`ordem\`      INT           NOT NULL DEFAULT 0,
  \`topicoId\`   VARCHAR(30)   NOT NULL,
  \`createdAt\`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\`  DATETIME(3)   NOT NULL,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`quizzes_topicoId_fkey\` FOREIGN KEY (\`topicoId\`) REFERENCES \`topicos\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`opcoes_quiz\` (
  \`id\`      VARCHAR(30)   NOT NULL,
  \`texto\`   TEXT          NOT NULL,
  \`correta\` TINYINT(1)   NOT NULL DEFAULT 0,
  \`ordem\`   INT          NOT NULL DEFAULT 0,
  \`quizId\`  VARCHAR(30)  NOT NULL,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`opcoes_quiz_quizId_fkey\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`flashcards\` (
  \`id\`        VARCHAR(30)   NOT NULL,
  \`frente\`    TEXT          NOT NULL,
  \`verso\`     LONGTEXT      NOT NULL,
  \`dica\`      TEXT          NULL,
  \`ordem\`     INT           NOT NULL DEFAULT 0,
  \`topicoId\`  VARCHAR(30)   NOT NULL,
  \`createdAt\` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3)   NOT NULL,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`flashcards_topicoId_fkey\` FOREIGN KEY (\`topicoId\`) REFERENCES \`topicos\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function main() {
  console.log("🔌 Conectando ao MySQL em", config.host + ":" + config.port);
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log("✅ Conexão estabelecida!\n");

    const statements = SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const stmt of statements) {
      const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS `([^`]+)`/)?.[1];
      if (tableName) {
        process.stdout.write(`   Criando tabela \`${tableName}\`... `);
        await conn.execute(stmt);
        console.log("✓");
      }
    }

    console.log("\n✅ Todas as tabelas criadas com sucesso!");
    console.log("   Rode agora: npm run db:seed");
  } catch (err) {
    console.error("\n❌ Erro:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
