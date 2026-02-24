import 'dotenv/config'
import path from 'node:path'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

type PrismaClientInstance = InstanceType<typeof PrismaClient>

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientInstance }

function createPrismaClient(): PrismaClientInstance {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  // Adapter expects a file path; resolve relative paths from project root
  const dbPath = url.startsWith('file:') ? url.slice(5) : url
  const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath)
  const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClientInstance =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
