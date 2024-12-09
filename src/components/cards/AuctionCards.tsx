'use client';

import { AuctionCard } from './AuctionCard';
import { useEffect, useState } from 'react';
import { Auction } from '@prisma/client';
import { useAuthContext } from '@/context/AuthContext';

export const AuctionCards = () => {
  const { account } = useAuthContext();
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(`/api/getBiddableAuctions?accountAddress=${account}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const res = await response.json();
          setAuctions(res);
        } else {
          const { error } = await response.json();
          console.error('Failed to load auctions:', error);
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, [account]);

  return (
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {auctions.map((auction) => (
        <div key={auction.nftAddress}>
          <AuctionCard auction={auction} />
        </div>
      ))}
    </div>
  );
};
