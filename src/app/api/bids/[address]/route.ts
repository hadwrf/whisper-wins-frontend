import { NextRequest, NextResponse } from 'next/server';
import { getBids } from '@/lib/db/getBids';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const bidderAddress = (await params).address;

  try {
    const auctions = await getBids({ bidderAddress });
    return NextResponse.json(auctions);
  } catch {
    return NextResponse.json({ error: 'Error fetching bids from database' }, { status: 500 });
  }
}
