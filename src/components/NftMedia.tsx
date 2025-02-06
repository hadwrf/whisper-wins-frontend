import { Hex } from '@flashbots/suave-viem';
import { CameraOff } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Nft } from '@/lib/services/getUserNfts';
import MoreInfoButton from './MoreInfoButton';

interface NftMediaProps {
  nft: Nft;
}

export const NftMedia = ({ nft }: NftMediaProps) => {
  return (
    <div className={'relative m-auto size-full'}>
      {nft.image.originalUrl ? (
        <Image
          className='m-auto size-full rounded-lg'
          src={nft.image.originalUrl || ''}
          alt={nft.name || 'NFT'}
          width={500}
          height={500}
        />
      ) : (
        <CameraOff className='m-auto size-8 h-full text-slate-300' />
      )}
      <div className='absolute bottom-1 right-1'>
        <MoreInfoButton
          nftContractAddress={nft?.contract.address as Hex}
          nftTokenId={nft?.tokenId || ''}
        />
      </div>
    </div>
  );
};
