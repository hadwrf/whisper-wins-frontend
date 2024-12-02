'use client';

import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import { LoginToContinue } from '@/components/LoginToContinue';
import { getUserNfts, Nft } from '@/lib/services/getUserNfts';
import React, { useEffect, useState } from 'react';

import { auctions } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';

const MyAuctions = () => {
  // const { account } = useAuthContext();
  const account = '0x973501C85DB87E550952b04F72f75C2E2f1599B9';

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [auctions, setAuctions] = useState<auctions[]>([]);

  const [list, setList] = useState<{ nft: Nft; auction: auctions }[]>([]);

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
        const nft = nfts.find((nft) => nft.tokenId === auction.tokenId);
        if (nft) {
          nftsToList.push({ nft: nft, auction: auction });
        }
      });
      setList(nftsToList);
      console.log('NFTS', nfts);
      console.log('AUCTIONS', auctions);
    }
  }, [nfts, auctions]);

  if (!account) return <LoginToContinue />;

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
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
