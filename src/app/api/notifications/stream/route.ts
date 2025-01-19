import getNewNotifications from '@/lib/db/getNewNotifications';
import { Notification } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return NextResponse.json({ error: 'Missing userAddress parameter' }, { status: 400 });
  }

  let lastFetchedId = 0;

  const stream = new ReadableStream({
    start(controller) {
      const sendNotification = (notification: Notification) => {
        controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
      };

      const interval = setInterval(async () => {
        try {
          const notifications = await getNewNotifications({ userAddress, lastFetchedId });
          if (notifications.length > 0) {
            notifications.forEach((notification) => {
              sendNotification(notification);
            });

            lastFetchedId = notifications[notifications.length - 1].id;
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
          controller.error('Error fetching notifications');
        }
      }, 5000);

      // Close the stream on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
