import transferNftToContract from '@/lib/db/transferNftToContract';
import { AuctionStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface TransferNftToContractParams {
  auctionAddress: string;
  status: AuctionStatus;
}

export async function POST(request: NextRequest) {
  try {
    const { auctionAddress, status }: TransferNftToContractParams = await request.json();
    await transferNftToContract({ auctionAddress, status });
    return NextResponse.json({ message: `Auction status changed to ${status} successfully` });
  } catch (error) {
    console.error('Error changing auction status to IN_PROGRESS:', error);
    return NextResponse.json({ error: 'Failed to change auction status to IN_PROGRESS' }, { status: 500 });
  }
}
