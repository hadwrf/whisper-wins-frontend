'use client';

import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import { LoginToContinue } from '@/components/LoginToContinue';
import { getNft, Nft, NftRequest } from '@/lib/services/getUserNfts';
import React, { useEffect, useState } from 'react';

import { Auction, AuctionStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useAuthContext } from '@/context/AuthContext';
import startAuction from '@/lib/suave/startAuction';
import { NoDataFound } from '@/components/NoDataFound';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';
import transferNftToAddress from '@/lib/ethereum/transferNftToAddress';
import { useToast } from '@/hooks/use-toast';
import { AuctionStatusBackgroundColor } from '@/app/ui/colors';
import { AuctionStatusActionMapping, AuctionStatusMapping } from './constants';

const MyAuctions = () => {
  const { account } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [auctionsFetched, setAuctionsFetched] = useState(false);
  const [nftsFetched, setNftsFetched] = useState(false);

  const [auctions, setAuctions] = useState<Auction[]>([]);

  const [list, setList] = useState<{ nft: Nft; auction: Auction }[]>([]);

  const handleButtonClick = async (nft: Nft, auction: Auction) => {
    if (auction.status === AuctionStatus.NFT_TRANSFER_PENDING) {
      await transferNftToAddress(nft.contract.address, nft.tokenId);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.START_PENDING);
      updateNftList(AuctionStatus.START_PENDING, auction.contractAddress);
    } else {
      await startAuction(auction.contractAddress);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.IN_PROGRESS);
      updateNftList(AuctionStatus.IN_PROGRESS, auction.contractAddress);
    }
  };

  const updateAuctionRecordInDb = async (auctionAddress: string, status: string) => {
    const response = await fetch('/api/transferNftToContract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionAddress: auctionAddress,
        status: status,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  const updateNftList = (status: AuctionStatus, auctionAddress: string) => {
    const nftsToList: { nft: Nft; auction: Auction }[] = [];

    list.map((item) => {
      if (item.auction.contractAddress === auctionAddress) {
        nftsToList.push({
          ...item,
          auction: {
            ...item.auction,
            status: status,
          },
        });
      } else {
        nftsToList.push(item);
      }
    });
    setList(nftsToList);
  };

  useEffect(() => {
    async function fetchAuctions() {
      if (!account) {
        return;
      }
      fetch(`/api/auctions/${account}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const res = await response.json();
            console.log('AUCTIONS', res);
            setAuctions(res);
            setAuctionsFetched(true);
          } else {
            const { error } = await response.json();
            console.error('Failed to load NFTs:', error);
          }
        })
        .catch(() => {
          toast({
            title: 'Failed to load NFTs!',
          });
        });
    }
    fetchAuctions();
  }, [account]);

  useEffect(() => {
    async function fetchNfts() {
      if (auctions.length > 0) {
        const nftsToList: { nft: Nft; auction: Auction }[] = [];
        await Promise.all(
          auctions.map(async (auction) => {
            const nftRequest: NftRequest = {
              contractAddress: auction.nftAddress,
              tokenId: auction.tokenId,
            };

            try {
              const nft = await getNft(nftRequest);
              nftsToList.push({ nft, auction });
            } catch (error) {
              console.error(`Failed to fetch NFT for auction ${auction.contractAddress}:`, error);
            }
          }),
        );
        setList(nftsToList);
        setNftsFetched(true);
        console.log('NFTs to list', nftsToList);
        console.log('AUCTIONS', auctions);
      }
    }
    fetchNfts();
  }, [auctions]);

  useEffect(() => {
    if (auctionsFetched && nftsFetched) {
      setLoading(false);
    }
  }, [auctionsFetched, nftsFetched]);

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        {loading && <SkeletonSellCards />}
        {!loading && !list.length && <NoDataFound />}
        <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
          {list.map((item) => (
            <div key={`${item.nft.contract.address}-${item.nft.tokenId}`}>
              <Card className='w-60'>
                <CardMedia>
                  {item.nft.image.originalUrl ? (
                    <Image
                      className='m-auto size-full rounded-lg'
                      src={item.nft.image.originalUrl || ''}
                      alt={item.nft.name || 'NFT'}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <CameraOff className='m-auto size-8 h-full text-slate-300' />
                  )}
                </CardMedia>
                <CardContent className='h-fit overflow-hidden p-3'>
                  <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{item.nft.name}</p>
                </CardContent>
                <CardFooter className='flex-none'>
                  {/* TODO: add tooltip on hover, get AuctionStatusInfoMapping */}
                  <div>
                    <Button
                      size='xs'
                      variant='outline'
                      className={`${AuctionStatusBackgroundColor.get(item.auction.status)} font-bold text-white`}
                    >
                      <Info /> {AuctionStatusMapping.get(item.auction.status)}
                    </Button>
                    <Button
                      className='mt-2'
                      size='xs'
                      onClick={() => handleButtonClick(item.nft, item.auction)}
                    >
                      {AuctionStatusActionMapping.get(item.auction.status)}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAuctions;
