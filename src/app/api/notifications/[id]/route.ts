import markNotificationAsRead from '@/lib/db/markNotificationAsRead';
import { NextRequest, NextResponse } from 'next/server';

interface MarkNotificationAsReadParams {
  id: number;
}

export async function PATCH(request: NextRequest) {
  try {
    const { id }: MarkNotificationAsReadParams = await request.json();
    await markNotificationAsRead({ id });
    return NextResponse.json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Error updating notification from database' }, { status: 500 });
  }
}
