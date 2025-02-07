import getAuctionStatus from '@/lib/db/getAuctionStatus';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Destructure and cast query parameters
    const nftAddress = request.nextUrl.searchParams.get('nftAddress');
    const tokenId = request.nextUrl.searchParams.get('tokenId');

    if (!nftAddress || !tokenId) {
      return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    // Call your database function
    const auctionStatus = await getAuctionStatus({ nftAddress, tokenId });
    if (auctionStatus == null) {
      return NextResponse.json({ error: 'There is no auction found in the db for the given NFT' }, { status: 404 });
    }
    return NextResponse.json({ auctionStatus });
  } catch (error) {
    console.error('Error retrieving NFT status:', error);
    return NextResponse.json({ error: 'Failed to get NFT status' }, { status: 500 });
  }
}
