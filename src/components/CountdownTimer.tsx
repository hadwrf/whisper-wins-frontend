import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface CountdownProps {
  startTime: Date;
  auctionEndTime: Date;
}

export const CountdownTimer: React.FC<CountdownProps> = ({ startTime, auctionEndTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auctionEndTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(auctionEndTime));
    }, 60000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [auctionEndTime]);

  function calculateTimeLeft(endTime: Date) {
    const now = new Date().getTime();
    const difference = endTime.getTime() - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    };
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant='secondary'
              className='flex gap-1'
            >
              <CalendarClock size={13} />
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 ? (
                <span>Ended</span>
              ) : (
                <>
                  <span>{timeLeft.days}d </span>
                  <span>{timeLeft.hours}h </span>
                  <span>{timeLeft.minutes}m</span>
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className='rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 font-semibold text-white'>
              Auction Timeline
            </div>
            <div className='bg-white p-3 dark:bg-gray-800'>
              <p className='mb-2 flex items-center text-sm'>
                <CalendarClock
                  size={16}
                  className='mr-2 text-green-500'
                />
                <span className='font-medium'>Started:</span>
                <span className='ml-2 text-gray-600 dark:text-gray-300'>
                  {format(startTime, "MMM d, yyyy 'at' h:mm a")}
                </span>
              </p>
              <p className='flex items-center text-sm'>
                <CalendarClock
                  size={16}
                  className='mr-2 text-red-500'
                />
                <span className='font-medium'>Ends:</span>
                <span className='ml-2 text-gray-600 dark:text-gray-300'>
                  {format(auctionEndTime, "MMM d, yyyy 'at' h:mm a")}
                </span>
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
