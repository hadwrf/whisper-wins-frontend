import prisma from './prisma';

interface TransferNftToContractParams {
  auctionAddress: string;
}

/**
 * Updates the status of an auction to IN_PROGRESS.
 *
 * @param params - Parameters to update the auction status.
 */
export default async function transferNftToContract(params: TransferNftToContractParams) {
  await prisma.auction.update({
    where: {
      contractAddress: params.auctionAddress,
    },
    data: {
      status: 'IN_PROGRESS',
      updatedAt: new Date(),
    },
  });
}
