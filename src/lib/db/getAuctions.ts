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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getBiddableAuctions({ address }: GetAuctionsParams) {
  return await prisma.auction.findMany({
    where: {
      // todo show all auctions for now for debugging purpose.
      // AND: [{ ownerAddress: { not: address } }, { status: AuctionStatus.IN_PROGRESS }],
      status: AuctionStatus.IN_PROGRESS,
    },
  });
}
