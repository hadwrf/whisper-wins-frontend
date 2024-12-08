import prisma from './prisma';

interface GetAuctionsParams {
  address: string;
}

export default async function getAuctions({ address }: GetAuctionsParams) {
  return await prisma.auctions.findMany({
    where: { ownerAddress: address },
  });
}
