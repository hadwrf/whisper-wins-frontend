import getNftStatus from '@/lib/db/getNftStatus';
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
    const nftStatus = await getNftStatus({ nftAddress, tokenId });

    NextResponse.json({ nftStatus });
  } catch (error) {
    console.error('Error retrieving NFT status:', error);
    NextResponse.json({ error: 'Failed to retrieve NFT status' }, { status: 500 });
  }
}
