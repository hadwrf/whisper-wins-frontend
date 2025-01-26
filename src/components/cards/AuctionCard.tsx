'use client';

import { CountdownTimer } from '@/components/CountdownTimer';
import MoreInfoButton from '@/components/MoreInfoButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { AuctionCardData } from '@/lib/services/getAuctionCardData';
import { Hex } from '@flashbots/suave-viem';
import { CameraOff, Tag } from 'lucide-react';
import Image from 'next/image';
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
        {auction.nft?.image?.originalUrl ? (
          <Image
            className='m-auto size-full rounded-lg'
            src={auction.nft.image.originalUrl}
            alt={auction.nft.name || 'NFT'}
            width={100}
            height={100}
          />
        ) : (
          <CameraOff className='m-auto size-8 h-full text-slate-300' />
        )}
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
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
        >
          Place Bid
        </Button>
        <MoreInfoButton
          nftContractAddress={auction.nft?.contract.address as Hex}
          nftTokenId={auction.nft?.tokenId || ''}
        />
      </CardFooter>
    </Card>
  );
};
