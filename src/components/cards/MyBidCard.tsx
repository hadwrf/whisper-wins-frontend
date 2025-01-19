import { BidStatusBackgroundColor } from '@/app/ui/colors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getNft, Nft, NftRequest } from '@/lib/services/getUserNfts';
import { Bid, BidStatus } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarClock, CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface MyBidCardProps {
  bid: Bid;
}

export const MyBidCard = ({ bid }: MyBidCardProps) => {
  const [nft, setNft] = useState<Nft | null>(null);

  // Some prisma issues with included properties: https://stackoverflow.com/a/71445155
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const auction = bid.auction;

  useEffect(() => {
    const nftRequest: NftRequest = {
      contractAddress: auction.nftAddress,
      tokenId: auction.tokenId,
    };

    getNft(nftRequest).then((nft) => {
      setNft(nft);
    });
  }, [auction.nftAddress, auction.tokenId]);

  return (
    <Card className='w-60'>
      <CardMedia>
        {nft?.image?.originalUrl ? (
          <Image
            className='m-auto size-full rounded-lg'
            src={nft.image.originalUrl}
            alt={nft.name || 'NFT'}
            width={100}
            height={100}
          />
        ) : (
          <CameraOff className='m-auto size-8 h-full text-slate-300' />
        )}
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{nft?.name || 'No Name'}</p>
        <div className='mb-1 flex justify-between'>
          <p className='flex items-center text-sm font-semibold text-emerald-400'>ETH {bid.amount}</p>
          <Badge
            variant='secondary'
            className='flex gap-1'
          >
            <CalendarClock size={13} />
            {format(bid.createdAt, 'P')}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='xs'
                variant='outline'
                className={`${BidStatusBackgroundColor.get(bid.status)} font-bold text-white`}
              >
                <Info /> {BidStatusMapping.get(bid.status)}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{BidStatusInfoMapping.get(bid.status)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export const BidStatusMapping = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'Active')
  .set(BidStatus.WINNER, 'Winner')
  .set(BidStatus.LOSER, 'Loser');

export const BidStatusInfoMapping = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'Active info')
  .set(BidStatus.WINNER, 'Winner info')
  .set(BidStatus.LOSER, 'Loser info');
