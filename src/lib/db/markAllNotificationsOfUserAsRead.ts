import prisma from './prisma';

interface MarkAllNotificationAsReadParams {
  userAddress: string;
}

export async function markAllNotificationAsRead({ userAddress }: MarkAllNotificationAsReadParams) {
  await prisma.notification.updateMany({
    where: {
      userAddress: String(userAddress),
    },
    data: { read: true },
  });
}
