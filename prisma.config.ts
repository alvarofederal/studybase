import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Prisma 7 carrega prisma.config.ts antes de processar o .env,
// então precisamos carregar manualmente.
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
