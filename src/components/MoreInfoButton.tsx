'use client';

import { Info } from 'lucide-react';
import { Button } from './ui/button';
import { Hex } from '@flashbots/suave-viem';
import { useRouter } from 'next/navigation';

interface MoreInfoProps {
  nftContractAddress: Hex;
  nftTokenId: string;
}

const MoreInfoButton: React.FC<MoreInfoProps> = ({ nftContractAddress, nftTokenId }) => {
  const { push } = useRouter();

  const handleClick = () => {
    push(`/dashboard/nft-details?nftContractAddress=${nftContractAddress}&nftTokenId=${nftTokenId}`);
  };

  return (
    <Button
      onClick={handleClick}
      size='xs'
      variant='outline'
    >
      <Info /> NFT Info
    </Button>
  );
};

export default MoreInfoButton;
