import { BidStatus } from '@prisma/client';
import { HandCoins } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface BidPriceBadgeProps {
  value: string;
  status: BidStatus;
}

export const BidPriceBadge = ({ value, status }: BidPriceBadgeProps) => {
  const getStatusBgColor = () => {
    switch (status) {
      case BidStatus.WINNER:
        return 'bg-green-300 hover:bg-green-400';
      case BidStatus.LOSER:
        return 'bg-red-400 hover:bg-rose-600';
      default:
        return 'bg-orange-300 hover:bg-orange-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case BidStatus.WINNER:
        return 'Congratulations! Your bid has won the auction. Get ready to claim your NFT!';
      case BidStatus.LOSER:
        return 'Unfortunately, your bid did not win this auction. Better luck next time!';
      default:
        return (
          "The bid represents the price you have offered in this auction. It's the amount you are\n" +
          'willing to pay for the NFT.'
        );
    }
  };

  const getHeader = () => {
    switch (status) {
      case BidStatus.WINNER:
        return 'You won!';
      case BidStatus.LOSER:
        return 'You lost!';
      default:
        return 'Your bid';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='secondary'
            className={getStatusBgColor()}
          >
            <HandCoins className='mr-2 size-4' />
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className={'w-80 p-0'}>
          <div className='overflow-hidden rounded-lg'>
            <div className='bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-2'>
              <h3 className='text-lg font-semibold text-white'>{getHeader()}</h3>
            </div>
            <div className='bg-white p-4 dark:bg-gray-800'>
              <p className='mb-3 text-sm text-gray-600 dark:text-gray-300'>{getStatusText()}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
