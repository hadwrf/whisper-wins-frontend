import { NextRequest, NextResponse } from 'next/server';
import createBid from '@/lib/db/createBid';

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
