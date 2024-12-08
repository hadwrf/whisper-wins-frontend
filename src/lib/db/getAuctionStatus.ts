import prisma from './prisma';

interface GetAuctionsStatusParams {
  nftAddress: string;
  tokenId: string;
}

export default async function getAuctionStatus(params: GetAuctionsStatusParams) {
  console.log(params);
  return await prisma.auction.findFirst({
    where: {
      nftAddress: params.nftAddress,
      tokenId: params.tokenId,
    },
    select: {
      status: true,
    },
  });
}
