import { Auction, AuctionStatus } from '@prisma/client';
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

export async function getBiddableAuctions({ address }: GetAuctionsParams) {
  return await prisma.auction.findMany({
    where: {
      AND: [{ ownerAddress: { not: address } }, { status: AuctionStatus.IN_PROGRESS }],
    },
  });
}
