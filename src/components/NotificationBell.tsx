'use client';
import { useAuthContext } from '@/context/AuthContext';
import { Notification, NotificationType } from '@prisma/client';
import { BellIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastFetchedId, setLastFetchedId] = useState(0);
  const [showOnlyUnclicked, setShowOnlyUnclicked] = useState(true); // Toggle filter
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { account } = useAuthContext();
  const router = useRouter();

  const bellRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!account) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/notifications/getUserNotifications?userAddress=${account}&lastFetchedId=${lastFetchedId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (!response.ok) return;

        const notificationsResponse = (await response.json()).notifications;
        if (notificationsResponse.length) {
          setLastFetchedId(notificationsResponse[notificationsResponse.length - 1].id);
          setNotifications((prev) => {
            const newNotifications = notificationsResponse.filter(
              (newNotif: Notification) => !prev.some((notif) => notif.id === newNotif.id),
            );
            return [...newNotifications, ...prev];
          });
        }
      } catch (error) {
        console.error('Failed to get notifications:', error);
      }
    };

    const intervalId = setInterval(fetchNotifications, 10000);
    fetchNotifications(); // Call once immediately

    return () => clearInterval(intervalId);
  }, [account, lastFetchedId]);

  useEffect(() => {
    if (isOpen) {
      const delayMarkingNotifications = setTimeout(() => {
        markAllAsRead(account);
      }, 5000);

      return () => clearTimeout(delayMarkingNotifications); // Clean up timeout when component unmounts or isOpen changes
    }
  }, [isOpen, notifications, account]);

  const markAsReadAndClicked = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, clicked: true, read: true }),
      });

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true, clicked: true } : notif)),
      );
    } catch (error) {
      console.error('Failed to mark notification as read and clicked:', error);
    }
  };

  const markAllAsRead = async (account: string | null) => {
    if (!account) {
      console.error('User account is not available.');
      return;
    }

    try {
      await fetch(`/api/notifications/markAllRead?userAddress=${account}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: account }),
      });

      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsReadAndClicked(notification.id);
    router.push(notification.userType === 'AUCTIONEER' ? '/dashboard/my-auctions' : '/dashboard/my-bids');
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const now = new Date();
    const notificationDate = timestamp instanceof Date ? timestamp : new Date(timestamp); // Ensure it's a Date object
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;

    return notificationDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatNotificationMessage = (notification: Notification): string => {
    const { type, nftName } = notification;
    switch (type) {
      case NotificationType.AUCTION_TIME_END:
        return `⏳ The auction for ${nftName || 'an NFT'} has ended! 🧑🏻‍⚖️ Resolve the auction now!`;
      case NotificationType.AUCTION_WON:
        return `🎉 Congratulations! You won the auction for ${nftName || 'an NFT'}! 🏆 Claim your new NFT now!`;
      case NotificationType.AUCTION_LOST:
        return `😞 Unfortunately, you lost the auction for ${nftName || 'an NFT'}. 💸 You can claim your bid back.`;
      case NotificationType.CLAIM_HIGHEST_BID:
        return `💰 You’ve got earnings to claim! 🤑 Collect your earnings from the NFT ${nftName || 'an NFT'} you sold!`;
      default:
        return '🔔 You have a new notification.';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!account) return null;

  // Filter notifications based on toggle
  const filteredNotifications = showOnlyUnclicked ? notifications.filter((n) => !n.clicked) : notifications;

  return (
    <div className='relative mx-3'>
      {/* Bell Icon */}
      <button
        ref={bellRef}
        className='relative p-2 text-gray-700 hover:text-gray-900'
        onClick={() => {
          setIsOpen((prev) => !prev);
          markAllAsRead(account);
        }}
      >
        <BellIcon className='size-6' />
        {unreadCount > 0 && (
          <span className='absolute -right-0 -top-px flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute right-0 z-50 mt-2 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'
        >
          {/* Tab Switcher */}
          <div className='flex border-b'>
            <button
              className={`w-1/2 py-2 text-sm font-medium ${
                showOnlyUnclicked ? 'border-b-2 border-black text-black-600' : 'text-gray-500'
              }`}
              onClick={() => setShowOnlyUnclicked(true)}
            >
              Unread
            </button>
            <button
              className={`w-1/2 py-2 text-sm font-medium ${
                !showOnlyUnclicked ? 'border-b-2 border-black text-black-600' : 'text-gray-500'
              }`}
              onClick={() => setShowOnlyUnclicked(false)}
            >
              All
            </button>
          </div>

          {/* Notifications List */}
          <div className='max-h-64 overflow-y-auto p-2'>
            {filteredNotifications.length === 0 ? (
              <p className='text-sm text-gray-500 p-3 text-center'>No notifications</p>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-sm border-b last:border-none cursor-pointer ${
                    n.read ? 'text-gray-500' : 'font-medium text-gray-900'
                  } hover:bg-gray-100`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <p className={`${n.clicked ? 'text-gray-500' : 'font-medium text-gray-900'} hover:bg-gray-100`}>
                    {formatNotificationMessage(n)}
                  </p>
                  <span className='text-xs text-gray-400'>{formatTimeAgo(n.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
