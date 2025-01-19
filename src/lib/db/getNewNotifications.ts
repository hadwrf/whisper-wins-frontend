import prisma from './prisma';

interface GetNewNotificationsParams {
  userAddress: string;
  lastFetchedId?: number; // Optional parameter to avoid fetching old notifications
}

export default async function getNewNotifications({ userAddress, lastFetchedId }: GetNewNotificationsParams) {
  // Build the query to fetch notifications
  const whereCondition: { userAddress: string; id?: { gt: number } } = {
    userAddress, // Same as userAddress: userAddress, using shorthand syntax
  };

  // If lastFetchedId is provided, only fetch notifications with ID greater than the last fetched one
  if (lastFetchedId) {
    whereCondition.id = { gt: lastFetchedId };
  }

  // Fetch notifications from the database
  const notifications = await prisma.notification.findMany({
    where: whereCondition,
    orderBy: {
      id: 'asc', // Ensures notifications are ordered by their creation ID
    },
  });

  return notifications;
}
