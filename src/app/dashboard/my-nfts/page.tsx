'use client';

import { SellCards } from '@/components/cards/SellCards';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import { LoginToContinue } from '@/components/LoginToContinue';
import MyNftsFilter, { Filters } from '@/components/filter/MyNftsFilter';
import { NoDataFoundNft } from '@/components/no-data/NoDataFoundNft';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUserNfts, Nft } from '@/lib/services/getUserNfts';
import { useEffect, useState } from 'react';

const MyNfts = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState({
    name: '',
  });

  // Handle filter changes
  const handleFilters = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
  };

  const filterNfts = () => {
    return nfts.filter((nft) => {
      const { name } = filters;

      // Filter by name
      if (name && !nft.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const filteredNfts = filterNfts();

  useEffect(() => {
    async function fetchNfts() {
      if (!account) {
        return;
      }

      try {
        const data = await getUserNfts(account); // Assuming this function fetches NFTs
        const nftList = data.ownedNfts;

        // Check auction status for each NFT and filter out those that aren't sellable
        const filteredNfts = await Promise.all(
          nftList.map(async (nft) => {
            const isSellable = await checkAuctionStatus(nft);
            return isSellable ? nft : null;
          }),
        );

        // Remove null values from the array (NFTs that are not sellable)
        setNfts(filteredNfts.filter((nft) => nft !== null) as Nft[]);
      } catch (error) {
        toast({
          title: 'Failed to load NFTs!',
          variant: 'error',
        });
        console.error('Failed to load NFTs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNfts();
  }, [account]);

  const checkAuctionStatus = async (nft: Nft) => {
    try {
      const response = await fetch(`/api/getAuctionStatus?nftAddress=${nft.contract.address}&tokenId=${nft.tokenId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // No auction found, mark as sellable
        return true;
      }

      const auctionData = await response.json();
      // If auction exists, return false (not sellable)
      return auctionData?.active ? false : true;
    } catch (error) {
      console.error('Failed to check auction status:', error);
      return true; // Default to sellable in case of error
    }
  };

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <MyNftsFilter onApplyFilters={handleFilters} />
        {loading && <SkeletonSellCards />}
        {!loading && !filteredNfts.length && <NoDataFoundNft />}
        {!loading && <SellCards nfts={filteredNfts} />}
      </div>
    </div>
  );
};

export default MyNfts;
