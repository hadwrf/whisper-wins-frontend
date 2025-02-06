'use client';

import { NftMedia } from '@/components/NftMedia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Nft } from '@/lib/services/getUserNfts';
import { useRouter } from 'next/navigation';
import React from 'react';

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
        <NftMedia nft={nft} />
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
      </CardFooter>
    </Card>
  );
};
