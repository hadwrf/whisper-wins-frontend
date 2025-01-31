'use client';
import { useAuthContext } from '@/context/AuthContext';
import { Notification, NotificationType } from '@prisma/client';
import { BellIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { account } = useAuthContext();
  const router = useRouter();

  const bellRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications/stream?userAddress=${account}`);

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    eventSource.onerror = () => {
      console.log('error happened on stresm');
      eventSource.close();
    };

    // Cleanup on component unmount
    return () => {
      console.log('cleaning up');
      eventSource.close();
    };
  }, [account]);

  const markAsReadAndClicked = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, clicked: true, read: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === id ? { ...notif, read: true, clicked: true } : notif)),
        );
      } else {
        console.error('Error marking notification as read and clicked:', data.error);
      }
    } catch (error) {
      console.error('Failed to mark notification as read and clicked:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/markAllRead?userAddress=${account}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress: account }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      } else {
        console.error('Error marking all notifications as read:', data.error);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsReadAndClicked(notification.id);

    // Redirect to the appropriate page based on user type
    if (notification.userType === 'AUCTIONEER') {
      router.push('/dashboard/my-auctions');
    } else if (notification.userType === 'BIDDER') {
      router.push('/dashboard/my-bids');
    }
  };

  const formatNotificationMessage = (notification: Notification): string => {
    const { type, nftName, nftTokenId } = notification;

    switch (type) {
      case NotificationType.AUCTION_TIME_END:
        return `The auction for ${nftName || 'an NFT'} has ended. Resolve the auction now!`;

      case NotificationType.AUCTION_WON:
        return `Congratulations! You won the auction for ${nftName || 'an NFT'} (Token ID: ${nftTokenId}).`;

      case NotificationType.AUCTION_LOST:
        return `You lost the auction for ${nftName || 'an NFT'} (Token ID: ${nftTokenId}). Better luck next time!`;

      case NotificationType.CLAIM_HIGHEST_BID:
        return `Your bid for ${nftName || 'an NFT'} (Token ID: ${nftTokenId}) is the highest! Claim it now.`;

      default:
        return 'You have a new notification.';
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        markAllAsRead(); // Mark all as read when bell is clicked
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!account) return null;

  return (
    <div className='relative mx-3 rounded-md bg-gray-50'>
      {/* Bell Icon */}
      <button
        ref={bellRef}
        className='relative p-2 text-gray-700 hover:text-gray-900'
        onClick={() => {
          setIsOpen((prev) => !prev);
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
          className='absolute right-0 z-50 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'
        >
          <div className='p-2'>
            {notifications.length === 0 ? (
              <p className='text-sm text-gray-500'>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-md p-2 text-sm hover:bg-gray-100 ${
                    n.read ? 'text-gray-500' : 'font-medium text-gray-900'
                  }`}
                >
                  <p
                    onClick={() => handleNotificationClick(n)} // Handle notification click
                    className='cursor-pointer'
                  >
                    {formatNotificationMessage(n)}
                  </p>
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
