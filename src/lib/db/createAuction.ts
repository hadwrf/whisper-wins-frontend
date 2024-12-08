import prisma from './prisma';

interface CreateAuctionParams {
  auctionAddress: string;
  ownerAddress: string;
  nftAddress: string;
  tokenId: string;
}

export default async function createAuction(params: CreateAuctionParams) {
  await prisma.auction.create({
    data: {
      contractAddress: params.auctionAddress,
      ownerAddress: params.ownerAddress,
      nftAddress: params.nftAddress,
      tokenId: params.tokenId,
      status: 'NFT_TRANSFER_PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
