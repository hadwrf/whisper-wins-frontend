import { Auction, Bid } from '@prisma/client';
import prisma from './prisma';

interface GetBidsParams {
  l1Address: string;
}

export type BidWithAuction = Bid & {
  auction: Auction; // Include the auction relationship
};

export async function getBids({ l1Address }: GetBidsParams): Promise<BidWithAuction[]> {
  return await prisma.bid.findMany({
    where: { l1Address },
    include: {
      auction: true, // This will fetch the related auction object
    },
  });
}
