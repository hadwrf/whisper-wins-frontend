import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

interface Window {
  ethereum?: import('ethers').providers.ExternalProvider;
}

// Prevent TypeScript from treating this file as a script
export {};
