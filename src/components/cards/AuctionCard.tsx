'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Auction } from '@prisma/client';
import { CameraOff, DollarSign, Info, CalendarClock, Tag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getNft, Nft, NftRequest } from '@/lib/services/getUserNfts';
import { useEffect, useState } from 'react';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const { push } = useRouter();
  const [nft, setNft] = useState<Nft | null>(null);

  console.log(auction);

  useEffect(() => {
    const nftRequest: NftRequest = {
      contractAddress: auction.nftAddress,
      tokenId: auction.tokenId,
    };

    getNft(nftRequest).then((nft) => {
      setNft(nft);
    });
  }, []);

  const handleSellClick = () => {
    push(`/dashboard/place-bid?auctionAddress=${auction.contractAddress}`);
  };

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
          <p className='flex items-center text-sm font-semibold text-emerald-400'>
            <DollarSign
              size={14}
              strokeWidth={3}
            />
            1,00
          </p>
          <Badge
            variant='secondary'
            className='flex gap-1'
          >
            <CalendarClock size={13} />
            02.10.2024
          </Badge>
        </div>
        <div className='flex max-w-full gap-1 overflow-x-auto'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Badge
              key={i}
              variant='outline'
              className='flex gap-1'
            >
              <Tag size={12} />
              <p>nft</p>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSellClick}
          size='xs'
        >
          Place Bid
        </Button>
        <Button
          size='xs'
          variant='outline'
        >
          <Info /> More Info
        </Button>
      </CardFooter>
    </Card>
  );
};
