'use client';

import { AuctionCard } from './AuctionCard';
import { useEffect, useState } from 'react';
import { Auction } from '@prisma/client';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SkeletonSellCards } from './SkeletonSellCards';

export const AuctionCards = () => {
  const { account } = useAuthContext();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          toast({
            title: 'Failed to load auctions!',
          });
          console.error('Failed to load auctions:', error);
        }
      } catch (error) {
        toast({
          title: 'Error fetching auctions!',
        });
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [account]);

  if (loading) return <SkeletonSellCards showSearchBar={false} />;
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
