import { updateAuctionContract } from '@/lib/db/updateAuctionContract';
import { AuctionStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface AuctionUpdateParams {
  contractAddress: string;
  ownerAddress?: string;
  nftAddress?: string;
  tokenId?: string;
  status?: AuctionStatus;
  endTime?: Date;
  minimumBid?: number;
  winnerAddres?: string | null;
  nftTransferAddress?: string | null;
  resultClaimed?: boolean;
}

export async function PUT(request: NextRequest) {
  try {
    const { contractAddress, ...updates }: AuctionUpdateParams = await request.json();

    // Ensure contractAddress is provided
    if (!contractAddress) {
      return NextResponse.json({ error: 'contractAddress is required' }, { status: 400 });
    }

    // Call updateAuction with provided fields
    await updateAuctionContract(contractAddress, updates);

    return NextResponse.json({ message: 'Auction updated successfully' });
  } catch (error) {
    console.error('Error updating auction:', error);
    return NextResponse.json({ error: 'Failed to update auction' }, { status: 500 });
  }
}
