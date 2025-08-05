import { PrismaClient } from '@prisma/client';

// Creamos una única instancia de PrismaClient para ser usada en toda la aplicación.
const prisma = new PrismaClient();

export default prisma;