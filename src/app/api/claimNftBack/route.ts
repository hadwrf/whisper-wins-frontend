import claimNftBack from '@/lib/db/claimNftBack';
import { NextRequest, NextResponse } from 'next/server';

interface ClaimNftBackParams {
  auctionAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const { auctionAddress }: ClaimNftBackParams = await request.json();
    await claimNftBack({ auctionAddress });
    return NextResponse.json({ message: 'Auction created successfully' });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}
