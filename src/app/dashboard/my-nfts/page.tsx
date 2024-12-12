'use client';

import { LoginToContinue } from '@/components/LoginToContinue';
import { useEffect, useState } from 'react';
import { Nft, getUserNfts } from '@/lib/services/getUserNfts';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import { SellCards } from '@/components/cards/SellCards';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MyNfts = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNfts() {
      if (!account) {
        return;
      }
      try {
        const data = await getUserNfts(account);
        setNfts(data.ownedNfts);
      } catch (error) {
        toast({
          title: 'Failed to load NFTs!',
        });
        console.error('Failed to load NFTs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNfts();
  }, [account]);

  if (!account) return <LoginToContinue />;
  if (!loading && !nfts.length) return <div>No NFTs found for this owner.</div>;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        {loading && <SkeletonSellCards />}
        {!loading && <SellCards nfts={nfts} />}
      </div>
    </div>
  );
};

export default MyNfts;
