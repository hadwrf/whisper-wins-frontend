'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Nft } from '@/lib/services/getUserNfts';
import { CameraOff } from 'lucide-react';
import Image from 'next/image';
import MoreInfoButton from '@/components/MoreInfoButton';
import { Hex } from '@flashbots/suave-viem';

type SellCardProps = {
  nft: Nft;
};

export const SellCard: React.FC<SellCardProps> = (props: SellCardProps) => {
  const { nft } = props;
  const { push } = useRouter();

  const handleSellClick = () => {
    const url = `/dashboard/create-auction?nftAddress=${nft.contract.address}&tokenId=${nft.tokenId}`;
    push(url);
  };

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
        >
          Sell NFT
        </Button>
        <MoreInfoButton
          nftContractAddress={nft?.contract.address as Hex}
          nftTokenId={nft?.tokenId || ''}
        />
      </CardFooter>
    </Card>
  );
};
