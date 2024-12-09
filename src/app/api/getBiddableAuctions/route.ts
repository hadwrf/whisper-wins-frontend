import { getBiddableAuctions } from '@/lib/db/getAuctions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('accountAddress') || '';
    const auctions = await getBiddableAuctions({ address });
    return NextResponse.json(auctions);
  } catch {
    return NextResponse.json({ error: 'Error fetching auctions from database' }, { status: 500 });
  }
}
