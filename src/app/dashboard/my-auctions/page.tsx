'use client';

import { MyAuctionCard } from '@/components/cards/MyAuctionCard';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import MyAuctionsFilter from '@/components/filter/MyAuctionsFilter';
import { LoginToContinue } from '@/components/LoginToContinue';
import { NoDataFoundAuction } from '@/components/no-data/NoDataFoundAuction';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuctionCardData, getMyAuctionCardData } from '@/lib/services/getAuctionCardData';
import React, { useEffect, useState } from 'react';
import { AuctionStatusFromValue } from './constants';

const MyAuctions = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [auctionsFetched, setAuctionsFetched] = useState(false);
  const [auctions, setAuctions] = useState<AuctionCardData[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    createdFrom: '',
    createdTo: '',
    endsFrom: '',
    endsTo: '',
    minPriceFrom: '',
    minPriceTo: '',
    sort: '',
    status: '',
  });

  const filterAuctions = () => {
    return auctions.filter((auction) => {
      const { name, createdFrom, createdTo, endsFrom, endsTo, minPriceFrom, minPriceTo, status } = filters;

      // Filter by name
      if (name && !auction.nft.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      // Filter by creation date
      if (
        (createdFrom && new Date(auction.createdAt) < new Date(createdFrom)) ||
        (createdTo && new Date(auction.createdAt) > new Date(createdTo))
      ) {
        return false;
      }

      // Filter by end date (placeholder for `endsAt` in auction)
      if (
        (endsFrom && new Date(auction.endTime) < new Date(endsFrom)) ||
        (endsTo && new Date(auction.endTime) > new Date(endsTo))
      ) {
        return false;
      }

      // Filter by price
      const minPrice = parseFloat(auction.minimumBid.toString() || '0');
      if ((minPriceFrom && minPrice < parseFloat(minPriceFrom)) || (minPriceTo && minPrice > parseFloat(minPriceTo))) {
        return false;
      }

      // Filter the status
      if (status != '' && auction.status != AuctionStatusFromValue.get(status)) {
        return false;
      }

      return true;
    });
  };

  const sortAuctions = (filteredAuctions: AuctionCardData[]) => {
    switch (filters.sort) {
      case 'price_asc':
        return filteredAuctions.sort((a, b) => parseFloat(a.minimalBid) - parseFloat(b.minimalBid));
      case 'price_desc':
        return filteredAuctions.sort((a, b) => parseFloat(b.minimalBid) - parseFloat(a.minimalBid));
      case 'created_at_asc':
        return filteredAuctions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'created_at_desc':
        return filteredAuctions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'ends_at_asc':
        return filteredAuctions.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
      case 'ends_at_desc':
        return filteredAuctions.sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime());
      default:
        return filteredAuctions;
    }
  };

  const filteredAuctions = filterAuctions();
  const filteredAndSortedAuctions = sortAuctions(filteredAuctions);

  useEffect(() => {
    async function fetchAuctions() {
      if (!account) {
        return;
      }
      try {
        const auctionData = await getMyAuctionCardData(account); // Fetch auction card data
        setAuctions(auctionData); // Update auctions state
      } catch (error) {
        toast({
          title: 'Error fetching auctions!',
          variant: 'error',
        });
        console.error('Error fetching auctions:', error);
      }
      setAuctionsFetched(true);
    }
    fetchAuctions();
  }, [account]);

  useEffect(() => {
    if (auctionsFetched) {
      setLoading(false);
    }
  }, [auctionsFetched]);

  const updateAuctionCardData = (auctionCardData: AuctionCardData) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.contractAddress === auctionCardData.contractAddress ? auctionCardData : auction,
      ),
    );
  };

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <MyAuctionsFilter onApplyFilters={(appliedFilters) => setFilters(appliedFilters)} />
        <div className='mt-10'>
          {!loading && !auctions.length && <NoDataFoundAuction />}
          {loading && <SkeletonSellCards />}
          <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
            {filteredAndSortedAuctions.map((auction, index) => (
              <div key={`${auction.nft.contract.address}-${index}`}>
                <MyAuctionCard
                  auctionCardData={auction}
                  onUpdateStatus={updateAuctionCardData}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAuctions;
