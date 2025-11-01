import { PrismaClient } from '@prisma/client';

// Singleton de Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Manejo de cierre graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;