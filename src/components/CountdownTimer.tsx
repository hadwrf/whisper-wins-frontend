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
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [auctionEndTime]);

  function calculateTimeLeft(endTime: Date) {
    const now = new Date().getTime();
    const difference = endTime.getTime() - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
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
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
                <span>Ended</span>
              ) : (
                <>
                  {timeLeft.days > 0 ? (
                    <>
                      <span>{timeLeft.days}d </span>
                      <span>{timeLeft.hours}h </span>
                      <span>{timeLeft.minutes}m</span>
                    </>
                  ) : timeLeft.hours > 0 ? (
                    <>
                      <span>{timeLeft.hours}h </span>
                      <span>{timeLeft.minutes}m </span>
                    </>
                  ) : (
                    <>
                      <span>{timeLeft.minutes}m </span>
                      <span>{timeLeft.seconds}s</span>
                    </>
                  )}
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className={'w-80 p-0'}>
            <div className='overflow-hidden rounded-lg'>
              <div className='bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-2'>
                <h3 className='text-lg font-semibold text-white'>Auction Timeline</h3>
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
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
