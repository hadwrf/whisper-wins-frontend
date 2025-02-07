'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MyBidCard } from '@/components/cards/MyBidCard';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import { NoDataFoundBids } from '@/components/no-data/NoDataFoundBids';
import BidsFilter, { Filters } from '@/components/filter/BidsFilter';
import { BidWithAuction } from '@/lib/db/getBids';
import { BidStatusFromValue } from './constants';
import { Nft, NftRequest, getNft } from '@/lib/services/getUserNfts';
import getAuctionEndTime from '@/lib/suave/getAuctionEndTime';
import getWinnerSuave from '@/lib/suave/getWinnerSuave';
import { LoginToContinue } from '@/components/LoginToContinue';

export interface BidCardData extends BidWithAuction {
  nft: Nft;
  auctionEndTime: Date;
  isWinner: boolean;
}

const MyBids = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bidsFetched, setBidsFetched] = useState(false);
  const [bidCardsDataFetched, setBidCardsDataFetched] = useState(false);

  const [bids, setBids] = useState<BidWithAuction[]>([]);
  const [bidCardsData, setBidCardsData] = useState<BidCardData[]>([]);

  const [filters, setFilters] = useState({
    name: '',
    bidPlacedFrom: '',
    bidPlacedTo: '',
    endsFrom: '',
    endsTo: '',
    minPriceFrom: '',
    minPriceTo: '',
    status: '',
    sort: '',
  });

  // Handle filter changes
  const handleFilters = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
  };

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
        })
        .finally(() => {
          setBidsFetched(true);
        });
    }
    fetchBids();
  }, [account]);

  useEffect(() => {
    const fetchNftMetadata = async () => {
      if (!bidsFetched) return;

      try {
        const updatedBids = await Promise.all(
          bids.map(async (bid) => {
            const nftRequest: NftRequest = {
              contractAddress: bid.auction.nftAddress,
              tokenId: bid.auction.tokenId,
            };

            // Wait for all promises properly
            const [nft, endTime, winnerAddress] = await Promise.all([
              getNft(nftRequest),
              getAuctionEndTime(bid.auction.contractAddress),
              getWinnerSuave(bid.auction.contractAddress),
            ]);

            return { ...bid, nft, auctionEndTime: endTime, isWinner: winnerAddress === account };
          }),
        );

        setBidCardsData(updatedBids);
        setBidCardsDataFetched(true);
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
      }
    };

    fetchNftMetadata();
  }, [bidsFetched]);

  useEffect(() => {
    if (bidCardsDataFetched) {
      setLoading(false);
    }
  }, [bidCardsDataFetched]);

  const filterBids = () => {
    return bidCardsData.filter((bid) => {
      const { name, bidPlacedFrom, bidPlacedTo, endsFrom, endsTo, minPriceFrom, minPriceTo, status } = filters;

      // Filter by name
      if (name && !bid.nft?.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      // Filter by creation date
      if (
        (bidPlacedFrom && new Date(bid.createdAt) < new Date(bidPlacedFrom)) ||
        (bidPlacedTo && new Date(bid.createdAt) > new Date(bidPlacedTo))
      ) {
        return false;
      }

      // Filter by end date (placeholder for `endsAt` in auction)
      if (
        (endsFrom && new Date(bid.auction.endTime) < new Date(endsFrom)) ||
        (endsTo && new Date(bid.auction.endTime) > new Date(endsTo))
      ) {
        return false;
      }

      // Filter by price
      const minPrice = parseFloat(bid.auction.minimumBid.toString() || '0');
      if ((minPriceFrom && minPrice < parseFloat(minPriceFrom)) || (minPriceTo && minPrice > parseFloat(minPriceTo))) {
        return false;
      }

      // Filter the status
      if (status != '' && bid.status != BidStatusFromValue.get(status)) {
        return false;
      }

      return true;
    });
  };

  const sortBids = (filteredBids: BidCardData[]) => {
    switch (filters.sort) {
      case 'price_asc':
        return filteredBids.sort((a, b) => parseFloat(a.amount.toString()) - parseFloat(b.amount.toString()));
      case 'price_desc':
        return filteredBids.sort((a, b) => parseFloat(b.amount.toString()) - parseFloat(a.amount.toString()));
      case 'created_at_asc':
        return filteredBids.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'created_at_desc':
        return filteredBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'ends_at_asc':
        return filteredBids.sort(
          (a, b) => new Date(a.auction.endTime).getTime() - new Date(b.auction.endTime).getTime(),
        );
      case 'ends_at_desc':
        return filteredBids.sort(
          (a, b) => new Date(b.auction.endTime).getTime() - new Date(a.auction.endTime).getTime(),
        );
      default:
        return filteredBids;
    }
  };

  const filteredBids = filterBids();
  const filteredAndSortedBids = sortBids(filteredBids);

  const updateBidCardData = (bidCardData: BidCardData) => {
    setBidCardsData((prevBids) => prevBids.map((bid) => (bid.id === bidCardData.id ? bidCardData : bid)));
  };

  if (!account) return <LoginToContinue />;
  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <BidsFilter onApplyFilters={handleFilters} />
        <div className='mt-10'>
          {loading && <SkeletonSellCards />}
          {!loading && bidCardsDataFetched && filteredAndSortedBids.length == 0 && <NoDataFoundBids />}
          <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
            {filteredAndSortedBids.map((bid) => (
              <div key={bid.id}>
                <MyBidCard
                  bidCardData={bid}
                  onUpdateStatus={updateBidCardData}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
