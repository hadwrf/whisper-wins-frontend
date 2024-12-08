'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auctionFormSchema } from './validation';
import { useAuthContext } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import createAuction from '@/lib/suave/createAuction';
import { Hex } from '@flashbots/suave-viem';

interface CreateAuctionFormProps {
  nftAddress: string;
  tokenId: string;
}

interface AuctionFormData {
  seller: string;
  nftAddress: string;
  tokenId: string;
  startingBid: number;
}

export const CreateAuctionForm = ({ nftAddress, tokenId }: CreateAuctionFormProps) => {
  const { account } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [auctionAddress, setAuctionAddress] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      seller: account || '',
      nftAddress: nftAddress || '',
      tokenId: tokenId || '',
      startingBid: 0,
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        seller: account,
        nftAddress,
        tokenId,
        startingBid: 0,
      });
    }
  }, [account, nftAddress, tokenId, form]);

  const onSubmit = async (data: AuctionFormData) => {
    setLoading(true);
    const { seller, nftAddress, tokenId } = data;
    const auctionAddress = await createAuction(nftAddress, tokenId);
    await createAuctionRecordInDb(auctionAddress as Hex, seller, nftAddress, tokenId);
    setLoading(false);
    setAuctionAddress(auctionAddress);
  };

  const createAuctionRecordInDb = async (
    auctionAddress: string,
    ownerAddress: string,
    nftAddress: string,
    tokenId: string,
  ) => {
    const response = await fetch('/api/createAuction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionAddress: auctionAddress,
        ownerAddress: ownerAddress,
        nftAddress: nftAddress,
        tokenId: tokenId,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='seller'
          render={() => (
            <FormItem>
              <FormLabel>Seller Address</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  value={account || ''}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nftAddress'
          render={() => (
            <FormItem>
              <FormLabel>NFT Contract Address</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  value={nftAddress || ''}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tokenId'
          render={() => (
            <FormItem>
              <FormLabel>NFT Token ID</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={tokenId || ''}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='startingBid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Bid (ETH)</FormLabel>
              <FormControl>
                <Input
                  placeholder='Starting bid'
                  type='number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={loading || auctionAddress != null}
        >
          Create Auction
        </Button>
        {auctionAddress && !loading && <div>Auction Address: {auctionAddress}</div>}
      </form>
    </Form>
  );
};
