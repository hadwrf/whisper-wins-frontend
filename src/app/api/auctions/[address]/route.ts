import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const address = (await params).address;

  try {
    const auctions = await prisma.auctions.findMany({
      where: { ownerAddress: address },
    });

    return NextResponse.json(auctions);
  } catch {
    return NextResponse.json({ error: 'Error fetching auctions from database' }, { status: 500 });
  }
}
