'use client';

import fetchBalance from '@/lib/ethereum/fetchBalance';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';

interface BalanceDisplayProps {
  biddingAddress: Hex;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ biddingAddress }) => {
  const [balance, setBalance] = useState<string | undefined>();
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchedBalance = await fetchBalance({ walletAddress: biddingAddress });
      setBalance(fetchedBalance);
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

  return (
    <p
      className='cursor-pointer mt-5 text-blue-600 hover:underline'
      onClick={handleBalanceClick}
    >
      {balance ? `Sent amount: ${balance} ETH` : 'Fetching balance...'}
    </p>
  );
};

export default BalanceDisplay;
