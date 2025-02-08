import { HandCoins } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface BidPriceBadgeProps {
  value: string;
}

export const BidPriceBadge = ({ value }: BidPriceBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='secondary'
            className={'bg-emerald-300 hover:bg-emerald-400'}
          >
            <HandCoins className='mr-2 size-4' />
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className={'w-80 p-0'}>
          <div className='overflow-hidden rounded-lg'>
            <div className='bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-2'>
              <h3 className='text-lg font-semibold text-white'>Your Bid</h3>
            </div>
            <div className='bg-white p-4 dark:bg-gray-800'>
              <p className='mb-3 text-sm text-gray-600 dark:text-gray-300'>
                The winning bid represents the price you have offered in this auction. It&#39;s the amount you are
                willing to pay for the NFT.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
