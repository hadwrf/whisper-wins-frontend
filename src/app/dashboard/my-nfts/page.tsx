'use client';
import SellCards from '@/components/SellCards';
import { LoginToContinue } from '@/components/LoginToContinue';
import { useEffect, useState } from 'react';
import { Nft, getUserNfts } from '@/lib/services/getUserNfts';
import { SkeletonSellCards } from '@/components/SkeletonSellCards';
import { useAuthContext } from '@/context/AuthContext';

const MyNfts = () => {
  const { account } = useAuthContext();

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
