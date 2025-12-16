import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  // Use Prisma Accelerate URL from environment
  accelerateUrl: process.env.DATABASE_URL!,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

