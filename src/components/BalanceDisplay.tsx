'use client';

import fetchBalance from '@/lib/ethereum/fetchBalance';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { Button } from './ui/button';

interface BalanceDisplayProps {
  biddingAddress: Hex;
  onClose: () => void; // Function to close the modal
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ biddingAddress, onClose }) => {
  const [balance, setBalance] = useState<string | undefined>();
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
    <div className='mt-5 flex flex-col items-center space-y-2'>
      <p
        className='mt-5 cursor-pointer text-blue-600 hover:underline'
        onClick={handleBalanceClick}
      >
        {balance ? `Current bid amount: ${balance} ETH` : 'Fetching balance...'}
      </p>
      {balance && (
        <Button
          variant='outline'
          className='mt-2'
          onClick={handleViewMyBids}
        >
          View My Bids
        </Button>
      )}
    </div>
  );
};

export default BalanceDisplay;
