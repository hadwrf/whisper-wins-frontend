'use client';

import { CountdownTimer } from '@/components/CountdownTimer';
import { NftMedia } from '@/components/NftMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { AuctionCardData } from '@/lib/services/getAuctionCardData';
import { Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface AuctionCardProps {
  auction: AuctionCardData;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const { push } = useRouter();

  const handleSellClick = () => {
    push(`/dashboard/place-bid?auctionAddress=${auction.contractAddress}`);
  };

  return (
    <Card className='w-60'>
      <CardMedia>
        <NftMedia nft={auction.nft} />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3 pb-2'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{auction.nft?.name || 'No Name'}</p>
        <div className='mb-1 flex justify-between'>
          <p className='flex items-center text-sm font-semibold text-emerald-400'>ETH {auction.minimumBid}</p>
          <CountdownTimer
            startTime={auction.createdAt}
            auctionEndTime={auction.endsAt}
          />
        </div>
        <div className='flex max-w-full gap-1 overflow-x-auto'>
          <Badge
            variant='outline'
            className='flex gap-1'
          >
            <Tag size={12} />
            <p>nft</p>
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSellClick}
          size='xs'
          className='w-full'
        >
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
};
