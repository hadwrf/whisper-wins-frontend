import prisma from './prisma';

export async function updateBid(
  id: number,
  updates: Partial<{
    resultClaimed: boolean;
  }>,
) {
  try {
    const updatedBid = await prisma.bid.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(), // Ensure updatedAt is refreshed
      },
    });
    console.log('Bid updated:', updatedBid);
    return updatedBid;
  } catch (error) {
    console.error('Error updating bid:', error);
    throw error;
  }
}
