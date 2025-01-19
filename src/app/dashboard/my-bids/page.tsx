'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bid } from '@prisma/client';

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
    <>
      {bids.map((bid) => (
        <div key={bid.id}>{bid.status}</div>
      ))}
    </>
  );
};

export default MyBids;
