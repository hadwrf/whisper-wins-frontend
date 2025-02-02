'use client';

import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import { LoginToContinue } from '@/components/LoginToContinue';
import React, { useEffect, useState } from 'react';

import { AuctionStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useAuthContext } from '@/context/AuthContext';
import startAuction from '@/lib/suave/startAuction';
import { NoDataFoundAuction } from '@/components/no-data/NoDataFoundAuction';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import { transferNftToAddress, waitForNftTransferReceipt } from '@/lib/ethereum/transferNftToAddress';
import { useToast } from '@/hooks/use-toast';
import { AuctionStatusBackgroundColor } from '@/app/ui/colors';
import { TransferDialog } from '@/components/TransferDialog';
import setupAuction from '@/lib/suave/setupAuction';
import readNftHoldingAddress from '@/lib/suave/readNftHoldingAddress';
import {
  AuctionStatusActionMapping,
  AuctionStatusFromValue,
  AuctionStatusMapping,
  AuctionStatusStepMapping,
} from './constants';
import MoreInfoButton from '@/components/MoreInfoButton';
import { Hex } from '@flashbots/suave-viem';
import { useRouter } from 'next/navigation';
import MyAuctionsFilter, { Filters } from '@/components/filter/MyAuctionsFilter';
import { AuctionCardData, getMyAuctionCardData } from '@/lib/services/getAuctionCardData';
import endAuction from '@/lib/suave/endAuction';

const MyAuctions = () => {
  const { account } = useAuthContext();
  const { push } = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [auctionsFetched, setAuctionsFetched] = useState(false);
  const [transferTokenDialogOpen, setTransferTokenDialogOpen] = useState(false);

  const [auctions, setAuctions] = useState<AuctionCardData[]>([]);

  const handleButtonClick = async (auction: AuctionCardData) => {
    if (auction.status === AuctionStatus.NFT_TRANSFER_PENDING) {
      const nftHoldingAddress = await readNftHoldingAddress(auction.contractAddress);
      transferNftToAddress(auction.nft.contract.address, auction.nft.tokenId, nftHoldingAddress)
        .then((transactionHash) => {
          console.log('setTransferTokenDialogOpen', true);
          setTransferTokenDialogOpen(true);
          waitForNftTransferReceipt(transactionHash).then(() => {
            updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.START_PENDING).then(() => {
              updateAuctionList(AuctionStatus.START_PENDING, auction.contractAddress);
              toast({
                title: 'NFT transferred successfully!',
              });
              console.log('setTransferTokenDialogOpen', false);
              setTransferTokenDialogOpen(false);
            });
          });
        })
        .catch(() => {
          toast({
            title: 'Failed to transfer NFT!',
          });
        });
      return;
    }
    if (auction.status === AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING) {
      setupAuction(auction.contractAddress)
        .then(async () => {
          const nftHoldingAddress = await readNftHoldingAddress(auction.contractAddress);
          console.log('nftHoldingAddress:', nftHoldingAddress);
          if (!nftHoldingAddress) {
            toast({
              title: 'NFT transfer address not found!',
            });
            return;
          }
          await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.NFT_TRANSFER_PENDING, nftHoldingAddress);
          toast({
            title: 'Auction setup successful!',
          });
          updateAuctionList(AuctionStatus.NFT_TRANSFER_PENDING, auction.contractAddress);
        })
        .catch(() => {
          toast({
            title: 'Auction setup failed!',
          });
        });

      return;
    }
    if (auction.status === AuctionStatus.START_PENDING) {
      await startAuction(auction.contractAddress);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.IN_PROGRESS);
      toast({
        title: 'Your auction is live!',
      });
      updateAuctionList(AuctionStatus.IN_PROGRESS, auction.contractAddress);
      return;
    }
    if (auction.status === AuctionStatus.TIME_ENDED) {
      console.log('endAuction in card clicked', auction.contractAddress);
      await endAuction(auction.contractAddress);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.RESOLVED);
      toast({
        title: 'Auction is resolved!',
      });
      updateAuctionList(AuctionStatus.RESOLVED, auction.contractAddress);
      return;
    }
  };

  const handleStatusClick = (auctionStatus: AuctionStatus) => {
    const step = AuctionStatusStepMapping.get(auctionStatus);

    push(`/dashboard/auction-steps?currentStep=${step}`);
  };

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

  // Handle filter changes
  const handleFilters = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
  };

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

  const updateAuctionRecordInDb = async (auctionAddress: string, status: string, nftTransferAddress?: string) => {
    const requestBody = JSON.stringify({
      contractAddress: auctionAddress,
      status: status,
      nftTransferAddress: nftTransferAddress,
    });
    console.log('updateAuctionRecordInDb requestBody:', requestBody);
    const response = await fetch('/api/updateAuctionContract', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });
    const result = await response.json();
    console.log(result);
  };

  const updateAuctionList = (newStatus: AuctionStatus, auctionAddress: string) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.contractAddress === auctionAddress ? { ...auction, status: newStatus } : auction,
      ),
    );
  };

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

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <MyAuctionsFilter onApplyFilters={handleFilters} />
        <div className='mt-10'>
          {!loading && !auctions.length && <NoDataFoundAuction />}
          {loading && <SkeletonSellCards />}
          <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
            {filteredAndSortedAuctions.map((auction) => (
              <div key={`${auction.nft.contract.address}-${auction.nft.tokenId}`}>
                <Card className='w-60'>
                  <CardMedia>
                    {auction.nft.image.originalUrl ? (
                      <Image
                        className='m-auto size-full rounded-lg'
                        src={auction.nft.image.originalUrl || ''}
                        alt={auction.nft.name || 'NFT'}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <CameraOff className='m-auto size-8 h-full text-slate-300' />
                    )}
                  </CardMedia>
                  <CardContent className='h-fit overflow-hidden p-3'>
                    <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{auction.nft.name}</p>
                  </CardContent>
                  <CardFooter className='flex-none'>
                    <div className='w-full'>
                      <Button
                        onClick={() => handleStatusClick(auction.status)}
                        size='xs'
                        variant='outline'
                        className={`${AuctionStatusBackgroundColor.get(auction.status)} font-bold text-white`}
                      >
                        <Info /> {AuctionStatusMapping.get(auction.status)}
                      </Button>
                      <div className='mt-2 flex items-center justify-between'>
                        <Button
                          size='xs'
                          disabled={auction.status == AuctionStatus.IN_PROGRESS}
                          onClick={() => handleButtonClick(auction)}
                        >
                          {AuctionStatusActionMapping.get(auction.status)}
                        </Button>
                        <MoreInfoButton
                          nftContractAddress={auction.nft?.contract.address as Hex}
                          nftTokenId={auction.nft?.tokenId || ''}
                        />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <TransferDialog
          open={transferTokenDialogOpen}
          onOpenChange={setTransferTokenDialogOpen}
        />
      </div>
    </div>
  );
};

export default MyAuctions;
