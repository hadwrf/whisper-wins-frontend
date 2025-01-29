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

const MyBids = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bidsWithNftFetched, setbidsWithNftFetched] = useState(false);

  const [bids, setBids] = useState<BidWithAuction[]>([]);
  const [bidsWithNft, setBidsWithNft] = useState<(BidWithAuction & { nft?: Nft })[]>([]);

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
        });
    }
    fetchBids();
  }, [account]);

  useEffect(() => {
    const fetchNftMetadata = async () => {
      const updatedBids = await Promise.all(
        bids.map(async (bid) => {
          const nftRequest: NftRequest = {
            contractAddress: bid.auction.nftAddress,
            tokenId: bid.auction.tokenId,
          };
          const nft = await getNft(nftRequest); // External API call
          return { ...bid, nft };
        }),
      );
      setBidsWithNft(updatedBids);
    };

    if (bids.length > 0) {
      fetchNftMetadata();
    }

    setbidsWithNftFetched(true);
  }, [bids]);

  useEffect(() => {
    if (bidsWithNftFetched) {
      setLoading(false);
    }
  }, [bidsWithNftFetched]);

  const filterBids = () => {
    return bidsWithNft.filter((bid) => {
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

  const sortBids = (filteredBids: BidWithAuction[]) => {
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

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <BidsFilter onApplyFilters={handleFilters} />
        {loading && <SkeletonSellCards />}
        {!loading && bidsWithNftFetched && bids.length == 0 && <NoDataFoundBids />}
        <div className='mt-10'>
          <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
            {filteredAndSortedBids.map((bid) => (
              <div key={bid.id}>
                <MyBidCard bid={bid} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
