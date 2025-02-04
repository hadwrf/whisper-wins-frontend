import getNewNotifications from '@/lib/db/getNewNotifications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return new Response(JSON.stringify({ error: 'Missing userAddress parameter' }), { status: 400 });
  }

  const lastFetchedId = searchParams.get('lastFetchedId') ? parseInt(searchParams.get('lastFetchedId')!, 10) : 0;
  const notifications = await getNewNotifications({ userAddress, lastFetchedId });

  return NextResponse.json({ notifications });
}
