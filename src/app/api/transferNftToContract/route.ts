import transferNftToContract from '@/lib/db/transferNftToContract';
import { NextRequest, NextResponse } from 'next/server';

interface TransferNftToContractParams {
  auctionAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const { auctionAddress }: TransferNftToContractParams = await request.json();
    await transferNftToContract({ auctionAddress });
    return NextResponse.json({ message: 'Auction status changed to IN_PROGRESS successfully' });
  } catch (error) {
    console.error('Error changing auction status to IN_PROGRESS:', error);
    return NextResponse.json({ error: 'Failed to change auction status to IN_PROGRESS' }, { status: 500 });
  }
}
