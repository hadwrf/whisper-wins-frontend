import getNewNotifications from '@/lib/db/getNewNotifications';
import { NextRequest } from 'next/server';

// Disabled because it fails to build
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return new Response(JSON.stringify({ error: 'Missing userAddress parameter' }), { status: 400 });
  }

  let lastFetchedId = 0;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const notifications = await getNewNotifications({ userAddress, lastFetchedId });
        if (notifications.length > 0) {
          notifications.forEach((notification) => {
            const data = `data: ${JSON.stringify(notification)}\n\n`;
            controller.enqueue(encoder.encode(data));
          });

          lastFetchedId = notifications[notifications.length - 1].id;
        }
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
