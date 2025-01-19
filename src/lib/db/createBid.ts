import prisma from './prisma';

interface CreateBidParams {
  auctionAddress: string;
  bidderAddress: string;
  amount: string;
}

export default async function createBid(params: CreateBidParams) {
  try {
    await prisma.bid.create({
      data: {
        auctionAddress: params.auctionAddress,
        bidderAddress: params.bidderAddress,
        amount: parseFloat(params.amount),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.log('Error while persisting bid into the database.', error);
  }
}
