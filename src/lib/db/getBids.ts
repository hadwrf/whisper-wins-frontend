import prisma from './prisma';

interface GetBidsParams {
  l1Address: string;
}

export async function getBids({ l1Address }: GetBidsParams) {
  return await prisma.bid.findMany({
    where: { l1Address },
    include: {
      auction: true, // This will fetch the related auction object
    },
  });
}
