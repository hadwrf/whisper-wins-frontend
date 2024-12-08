import { Auction } from '@prisma/client';
import prisma from './prisma';

interface GetAuctionsParams {
  address: string;
}

export async function getAuctions({ address }: GetAuctionsParams) {
  return await prisma.auction.findMany({
    where: { ownerAddress: address },
  });
}

export async function getAllAuctions(): Promise<Auction[]> {
  return await prisma.auction.findMany();
}
