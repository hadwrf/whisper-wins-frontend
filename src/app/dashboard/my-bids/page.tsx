'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bid } from '@prisma/client';
import { MyBidCard } from '@/components/cards/MyBidCard';

const MyBids = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    async function fetchBids() {
      if (!account) {
        return;
      }
      fetch(`/api/bids/${account}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const res = await response.json();
            console.log('BIDS', res);
            setBids(res);
          } else {
            const { error } = await response.json();
            console.error('Failed to load Bids:', error);
          }
        })
        .catch(() => {
          toast({
            title: 'Failed to load Bids!',
          });
        });
    }
    fetchBids();
  }, [account]);

  return (
    <div className='mx-auto max-w-5xl p-4'>
      <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
        {bids.map((bid) => (
          <div key={bid.id}>
            <MyBidCard bid={bid} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBids;
