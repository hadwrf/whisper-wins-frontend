'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { getNft, Nft, NftRequest } from '@/lib/services/getUserNfts';
import retrieveMinimalBid from '@/lib/suave/retrieveMinimalBid';
import { Auction } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarClock, CameraOff, Tag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MoreInfoButton from '@/components/MoreInfoButton';
import { Hex } from '@flashbots/suave-viem';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const { push } = useRouter();
  const [nft, setNft] = useState<Nft | null>(null);
  const [minimalBid, setMinimalBid] = useState<string>('$,$$');

  useEffect(() => {
    const nftRequest: NftRequest = {
      contractAddress: auction.nftAddress,
      tokenId: auction.tokenId,
    };

    getNft(nftRequest).then((nft) => {
      setNft(nft);
    });
  }, [auction.nftAddress, auction.tokenId]);

  const handleSellClick = () => {
    push(`/dashboard/place-bid?auctionAddress=${auction.contractAddress}`);
  };

  useEffect(() => {
    // todo normally the auction contract should return the end date but for now we print the createdAt date
    retrieveMinimalBid(auction.contractAddress).then((res) => {
      setMinimalBid(res);
    });
  }, [auction.contractAddress]);

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
          <p className='flex items-center text-sm font-semibold text-emerald-400'>ETH {minimalBid}</p>
          <Badge
            variant='secondary'
            className='flex gap-1'
          >
            <CalendarClock size={13} />
            {format(auction.createdAt, 'P')}
          </Badge>
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
          nftContractAddress={nft?.contract.address as Hex}
          nftTokenId={nft?.tokenId || ''}
        />
      </CardFooter>
    </Card>
  );
};
