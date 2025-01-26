import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const neon = new Pool({ connectionString: process.env.POSTGRES_URL });
const adapter = new PrismaNeon(neon);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const prismaEdge = new PrismaClient({ adapter });
