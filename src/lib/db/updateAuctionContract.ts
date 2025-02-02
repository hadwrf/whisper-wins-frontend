import { AuctionStatus } from '@prisma/client';

import prisma from './prisma';

export async function updateAuctionContract(
  contractAddress: string,
  updates: Partial<{
    status: AuctionStatus;
    endTime: Date;
    minimumBid: number;
    winnerAddres: string | null;
    nftTransferAddress: string | null;
    resultClaimed: boolean;
  }>,
) {
  try {
    const updatedAuction = await prisma.auction.update({
      where: { contractAddress },
      data: {
        ...updates,
        updatedAt: new Date(), // Ensure updatedAt is refreshed
      },
    });
    console.log('Auction updated:', updatedAuction);
    return updatedAuction;
  } catch (error) {
    console.error('Error updating auction:', error);
    throw error;
  }
}
