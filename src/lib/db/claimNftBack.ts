import prisma from './prisma';

interface ClaimNftBackParams {
  auctionAddress: string;
}

export default async function claimNftBack(params: ClaimNftBackParams) {
  await prisma.auction.update({
    where: {
      contractAddress: params.auctionAddress,
    },
    data: {
      status: 'RESOLVED',
      updatedAt: new Date(),
    },
  });
}
