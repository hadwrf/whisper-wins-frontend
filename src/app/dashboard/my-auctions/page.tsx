'use client';

import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import { LoginToContinue } from '@/components/LoginToContinue';
import { getUserNfts, Nft } from '@/lib/services/getUserNfts';
import React, { useEffect, useState } from 'react';

import { auctions } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useAuthContext } from '@/context/AuthContext';
import startAuction from '@/lib/suave/startAuction';
import { NoDataFound } from '@/components/NoDataFound';
import { SkeletonSellCards } from '@/components/cards/SkeletonSellCards';

const MyAuctions = () => {
  const { account } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [auctionsFetched, setAuctionsFetched] = useState(false);
  const [nftsFetched, setNftsFetched] = useState(false);

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [auctions, setAuctions] = useState<auctions[]>([]);

  const [list, setList] = useState<{ nft: Nft; auction: auctions }[]>([]);

  const startAuctionCall = async (auctionAddress: string) => {
    await startAuction(auctionAddress);
    await updateAuctionRecordInDb(auctionAddress);

    const nftsToList: { nft: Nft; auction: auctions }[] = [];

    list.map((item) => {
      if (item.auction.contractAddress === auctionAddress) {
        nftsToList.push({
          ...item,
          auction: {
            ...item.auction,
            status: 'IN_PROGRESS',
          },
        });
      } else {
        nftsToList.push(item);
      }
    });
    setList(nftsToList);
  };

  const updateAuctionRecordInDb = async (auctionAddress: string) => {
    const response = await fetch('/api/transferNftToContract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionAddress: auctionAddress,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    async function fetchNfts() {
      if (!account) {
        return;
      }
      try {
        const data = await getUserNfts(account);
        setNfts(data.ownedNfts);
        setNftsFetched(true);
      } catch (error) {
        console.error('Failed to load NFTs:', error);
      }
    }
    fetchNfts();
  }, [account]);

  useEffect(() => {
    async function fetchAuctions() {
      if (!account) {
        return;
      }
      fetch(`/api/auctions/${account}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (response.ok) {
          const res = await response.json();
          console.log('AUCTIONS', res);
          setAuctions(res);
          setAuctionsFetched(true);
        } else {
          const { error } = await response.json();
          console.error('Failed to load NFTs:', error);
        }
      });
    }
    fetchAuctions();
  }, [account]);

  useEffect(() => {
    if (nfts.length > 0 && auctions.length > 0) {
      const nftsToList: { nft: Nft; auction: auctions }[] = [];
      auctions.forEach((auction) => {
        const nft = nfts.find((nft) => nft.tokenId === auction.tokenId && nft.contract.address === auction.nftAddress);
        if (nft) {
          nftsToList.push({ nft: nft, auction: auction });
        }
      });
      setList(nftsToList);
      console.log('NFTs to tils', nftsToList);
      console.log('NFTS', nfts);
      console.log('AUCTIONS', auctions);
    }
  }, [nfts, auctions]);

  useEffect(() => {
    if (nftsFetched && auctionsFetched) {
      setLoading(false);
    }
  }, [nftsFetched, auctionsFetched]);

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        {loading && <SkeletonSellCards />}
        {!loading && !list.length && <NoDataFound />}
        <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
          {list.map((item) => (
            <div key='a'>
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
                <CardFooter>
                  <Button
                    size='xs'
                    variant='outline'
                    onClick={() => startAuctionCall(item.auction.contractAddress)}
                  >
                    <Info /> {item.auction.status}
                  </Button>
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
