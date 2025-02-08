import { NextRequest, NextResponse } from 'next/server';
import createBid from '@/lib/db/createBid';
import { updateBid } from '@/lib/db/updateBid';

interface CreateBidParams {
  auctionAddress: string;
  bidderAddress: string;
  l1Address: string;
  amount: string;
}

export async function POST(req: NextRequest) {
  try {
    const { auctionAddress, bidderAddress, l1Address, amount }: CreateBidParams = await req.json();
    await createBid({ auctionAddress, bidderAddress, l1Address, amount });
    return NextResponse.json({ message: 'Bid created successfully' });
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json({ error: 'Failed to create bid' }, { status: 500 });
  }
}

interface UpdateBidParams {
  bidId: number;
  resultClaimed?: boolean;
}

export async function PUT(req: NextRequest) {
  try {
    const { bidId: id, ...updates }: UpdateBidParams = await req.json();

    // Ensure id is provided
    if (!id) {
      return NextResponse.json({ error: 'bid id is required' }, { status: 400 });
    }

    // Call updateBid with provided fields
    await updateBid(id, updates);

    return NextResponse.json({ message: 'Bid updated successfully' });
  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json({ error: 'Failed to update bid' }, { status: 500 });
  }
}
