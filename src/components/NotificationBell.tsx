'use client';
import { useAuthContext } from '@/context/AuthContext';
import { Notification } from '@prisma/client';
import { BellIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const { account } = useAuthContext();

  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications/stream?userAddress=${account}`);

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, [account]);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)));
      } else {
        console.error('Error marking notification as read:', data.error);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (!account) return;

  return (
    <div className='relative bg-gray-50 rounded-md mx-3'>
      {/* Bell Icon */}
      <button
        className='relative p-2 text-gray-700 hover:text-gray-900'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BellIcon className='h-6 w-6' />
        {unreadCount > 0 && (
          <span className='absolute -top-[1px] -right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50'>
          <div className='p-2'>
            {notifications.length === 0 ? (
              <p className='text-sm text-gray-500'>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 rounded-md text-sm hover:bg-gray-100 ${
                    n.read ? 'text-gray-500' : 'text-gray-900 font-medium'
                  }`}
                >
                  <p
                    onClick={() => markAsRead(n.id)}
                    className='cursor-pointer'
                  >
                    {n.message}
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
