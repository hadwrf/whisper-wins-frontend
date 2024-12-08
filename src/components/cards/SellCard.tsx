'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Nft } from '@/lib/services/getUserNfts';
import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';

type SellCardProps = {
  nft: Nft;
};

export const SellCard: React.FC<SellCardProps> = (props: SellCardProps) => {
  const { nft } = props;
  const { push } = useRouter();
  const [isSellable, setIsSellable] = useState(false);

  const handleSellClick = () => {
    const url = `/dashboard/create-auction?nftAddress=${nft.contract.address}&tokenId=${nft.tokenId}`;
    push(url);
  };

  const checkNftStatus = async () => {
    const response = await fetch(`/api/getNftStatus?nftAddress=${nft.contract.address}&tokenId=${nft.tokenId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!result.nftStatus) {
      setIsSellable(true);
    }
  };

  useEffect(() => {
    checkNftStatus();
  }, []);

  return (
    <Card className='w-60'>
      <CardMedia>
        {nft.image.originalUrl ? (
          <Image
            className='m-auto size-full rounded-lg'
            src={nft.image.originalUrl || ''}
            alt={nft.name || 'NFT'}
            width={100}
            height={100}
          />
        ) : (
          <CameraOff className='m-auto size-8 h-full text-slate-300' />
        )}
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{nft.name}</p>
      </CardContent>
      <CardFooter>
        <Button
          size='xs'
          onClick={handleSellClick}
          disabled={!isSellable}
        >
          Sell NFT
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
