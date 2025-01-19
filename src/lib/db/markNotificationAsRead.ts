import prisma from './prisma';

interface MarkNotificationAsReadParams {
  id: number;
}

export default async function markNotificationAsRead(params: MarkNotificationAsReadParams) {
  await prisma.notification.update({
    where: {
      id: params.id,
    },
    data: {
      read: true,
      updatedAt: new Date(),
    },
  });
}
