import prisma from './prisma';

interface GetBidsParams {
  bidderAddress: string;
}

export async function getBids({ bidderAddress }: GetBidsParams) {
  return await prisma.bid.findMany({
    where: { bidderAddress },
  });
}
