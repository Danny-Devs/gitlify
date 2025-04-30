import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Add types to the global object for Prisma
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient | undefined;
}

// Tell TypeScript about the custom properties on the global object
declare const global: CustomNodeJsGlobal;

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
