import createAuction from '@/lib/db/createAuction';
import { NextRequest, NextResponse } from 'next/server';

interface CreateAuctionParams {
  auctionAddress: string;
  ownerAddress: string;
  nftAddress: string;
  tokenId: string;
  minimumBid: string;
  endTime: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { auctionAddress, ownerAddress, nftAddress, tokenId, minimumBid, endTime }: CreateAuctionParams =
      await req.json();
    await createAuction({ auctionAddress, ownerAddress, nftAddress, tokenId, minimumBid, endTime });
    return NextResponse.json({ message: 'Auction created successfully' });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}
