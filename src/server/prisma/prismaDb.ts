import { PrismaClient } from '@prisma/client';

let prismaDb: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaDb = new PrismaClient();
} else {
  prismaDb = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
}

globalThis.prismaDb = prismaDb;

export default prismaDb;
