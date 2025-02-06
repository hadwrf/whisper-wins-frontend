'use client';

import { Info } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Hex } from '@flashbots/suave-viem';
import { useRouter } from 'next/navigation';

interface MoreInfoProps {
  nftContractAddress: Hex;
  nftTokenId: string;
}

const MoreInfoButton: React.FC<MoreInfoProps> = ({ nftContractAddress, nftTokenId }) => {
  const { push } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    push(`/dashboard/nft-details?nftContractAddress=${nftContractAddress}&nftTokenId=${nftTokenId}`);
  };

  return (
    <Button
      onClick={handleClick}
      size='icon'
      variant='ghost'
      className={'rounded-full bg-white/50'}
    >
      <Info />
    </Button>
  );
};

export default MoreInfoButton;
