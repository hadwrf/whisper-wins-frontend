// pages/api/notifications/markAllRead.ts
import { markAllNotificationAsRead } from '@/lib/db/markAllNotificationsOfUserAsRead';
import { NextRequest, NextResponse } from 'next/server';

interface MarkAllNotificationAsReadParams {
  userAddress: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const { userAddress }: MarkAllNotificationAsReadParams = await request.json();

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 });
    }

    await markAllNotificationAsRead({ userAddress });

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
