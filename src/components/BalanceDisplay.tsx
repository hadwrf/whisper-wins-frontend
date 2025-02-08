'use client';

import fetchBalance from '@/lib/ethereum/fetchBalance';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { Button } from './ui/button';

interface BalanceDisplayProps {
  biddingAddress: Hex;
  onClose: () => void; // Function to close the modal
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ biddingAddress, onClose }) => {
  const [balance, setBalance] = useState<number | undefined>();
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchedBalance = await fetchBalance({ walletAddress: biddingAddress });
      if (fetchedBalance !== balance) {
        setBalance(fetchedBalance);
      }
    }, 2500);

    (async () => {
      const fetchedBalance = await fetchBalance({ walletAddress: biddingAddress });
      setBalance(fetchedBalance);
    })();

    return () => clearInterval(intervalId);
  }, [biddingAddress]);

  const handleBalanceClick = () => {
    const explorerUrl = `https://sepolia.etherscan.io/address/${biddingAddress}`;
    window.open(explorerUrl, '_blank');
  };

  const handleViewMyBids = () => {
    onClose(); // Close the modal
    setTimeout(() => {
      router.push('/dashboard/my-bids'); // Navigate after modal closes
    }, 100); // Small delay to allow state update
  };

  return (
    <div className='flex flex-col items-center'>
      <Button
        className='mb-1 cursor-pointer text-blue-600 hover:underline'
        onClick={handleBalanceClick}
        variant='ghost'
      >
        {balance ? `Current bid amount: ${balance} ETH` : 'Fetching balance...'}
        <ExternalLink />
      </Button>
      {balance && balance != 0 ? (
        <Button
          variant='secondary'
          onClick={handleViewMyBids}
          size='sm'
        >
          View My Bids
        </Button>
      ) : null}
    </div>
  );
};

export default BalanceDisplay;
