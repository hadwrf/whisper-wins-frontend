import { NextRequest, NextResponse } from 'next/server';
import { getBids } from '@/lib/db/getBids';

export async function GET(request: NextRequest, { params }: { params: Promise<{ l1Address: string }> }) {
  const l1Address = (await params).l1Address;

  try {
    const bids = await getBids({ l1Address });
    return NextResponse.json(bids);
  } catch {
    return NextResponse.json({ error: 'Error fetching bids from database' }, { status: 500 });
  }
}
