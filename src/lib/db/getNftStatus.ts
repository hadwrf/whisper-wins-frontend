import prisma from './prisma';

interface GetNftStatusParams {
  nftAddress: string;
  tokenId: string;
}

export default async function getNftStatus(params: GetNftStatusParams) {
  console.log(params);
  return await prisma.auctions.findFirst({
    where: {
      nftAddress: params.nftAddress,
      tokenId: params.tokenId,
    },
    select: {
      status: true,
    },
  });
}
