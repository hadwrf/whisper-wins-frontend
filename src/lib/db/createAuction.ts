import { AuctionStatus } from '@prisma/client';
import prisma from './prisma';

interface CreateAuctionParams {
  auctionAddress: string;
  ownerAddress: string;
  nftAddress: string;
  tokenId: string;
  minimumBid: string;
  endTime: Date;
}

export default async function createAuction(params: CreateAuctionParams) {
  await prisma.auction.create({
    data: {
      contractAddress: params.auctionAddress,
      ownerAddress: params.ownerAddress,
      nftAddress: params.nftAddress,
      tokenId: params.tokenId,
      status: AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING,
      minimumBid: parseFloat(params.minimumBid),
      resultClaimed: false,
      endTime: params.endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
