'use client';

import { AuctionCard } from './AuctionCard';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SkeletonSellCards } from './SkeletonSellCards';
import getAuctionCardData, { AuctionCardData } from '@/lib/services/getAuctionCardData';
import { NoDataFoundExplore } from '@/components/NoDataFoundExplore';

interface AuctionCardsProps {
  filters?: {
    name?: string;
    createdFrom?: string;
    createdTo?: string;
    endsFrom?: string;
    endsTo?: string;
    minPriceFrom?: string;
    minPriceTo?: string;
    sort?: string;
  };
}

export const AuctionCards = ({ filters = {} }: AuctionCardsProps) => {
  const { account } = useAuthContext();
  const [auctions, setAuctions] = useState<AuctionCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [auctionsFetched, setAuctionsFetched] = useState(false);
  const { toast } = useToast();

  const filterAuctions = () => {
    return auctions.filter((auction) => {
      const { name, createdFrom, createdTo, endsFrom, endsTo, minPriceFrom, minPriceTo } = filters;

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
        (endsFrom && new Date(auction.endsAt) < new Date(endsFrom)) ||
        (endsTo && new Date(auction.endsAt) > new Date(endsTo))
      ) {
        return false;
      }

      // Filter by price
      const minPrice = parseFloat(auction.minimumBid || '0');
      if ((minPriceFrom && minPrice < parseFloat(minPriceFrom)) || (minPriceTo && minPrice > parseFloat(minPriceTo))) {
        return false;
      }

      return true;
    });
  };

  const sortAuctions = (filteredAuctions: AuctionCardData[]) => {
    switch (filters.sort) {
      case 'price_asc':
        return filteredAuctions.sort((a, b) => parseFloat(a.minimumBid) - parseFloat(b.minimumBid));
      case 'price_desc':
        return filteredAuctions.sort((a, b) => parseFloat(b.minimumBid) - parseFloat(a.minimumBid));
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
    const fetchAuctions = async () => {
      if (!account) return;
      try {
        const auctionData = await getAuctionCardData(account); // Fetch auction card data
        setAuctions(auctionData); // Update auctions state
      } catch (error) {
        toast({
          title: 'Error fetching auctions!',
        });
        console.error('Error fetching auctions:', error);
      }
      setAuctionsFetched(true);
    };

    fetchAuctions();
  }, [account]);

  useEffect(() => {
    if (auctionsFetched) {
      setLoading(false);
    }
  }, [auctionsFetched]);

  if (loading) return <SkeletonSellCards showSearchBar={false} />;
  if (!loading && auctionsFetched && filteredAndSortedAuctions.length == 0) return <NoDataFoundExplore />;

  return (
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {filteredAndSortedAuctions.map((auction) => (
        <div key={auction.nftAddress}>
          <AuctionCard auction={auction} />
        </div>
      ))}
    </div>
  );
};
