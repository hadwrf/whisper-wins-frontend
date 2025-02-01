'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auctionFormSchema } from '@/app/dashboard/create-auction/validation';
import { useAuthContext } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import createAuction from '@/lib/suave/createAuction';
import { Hex } from '@flashbots/suave-viem';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/Spinner';
import { DateTimePicker } from '@/components/DateTimePicker';

interface CreateAuctionFormProps {
  nftAddress: string;
  tokenId: string;
}

export interface AuctionFormData {
  seller: string;
  nftAddress: string;
  tokenId: string;
  startingBid: number;
  endTime: Date;
}

export const CreateAuctionForm = ({ nftAddress, tokenId }: CreateAuctionFormProps) => {
  const { account } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      seller: account ?? '',
      nftAddress: nftAddress ?? '',
      tokenId: tokenId ?? '',
      startingBid: 0,
      endTime: new Date(),
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        seller: account,
        nftAddress,
        tokenId,
        startingBid: 0,
        endTime: new Date(),
      });
    }
  }, [account, nftAddress, tokenId, form]);

  const onSubmit = async (auctionFormData: AuctionFormData) => {
    setLoading(true);
    console.log('Aucsiono', auctionFormData);
    // create auction call pops up the metamask window.
    return createAuction(auctionFormData)
      .then(async (auctionAddress) => {
        await createAuctionRecordInDb(auctionAddress as Hex, auctionFormData);
        const nextStepsUrl = `/dashboard/auction-create-next-step?auctionAddress=${auctionAddress}`;
        router.replace(nextStepsUrl);
      })
      .catch((e) => {
        console.log('createAuction error:', e);
        toast({
          title: 'Transaction failed!',
          description: e.shortMessage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createAuctionRecordInDb = async (auctionAddress: string, auctionFormData: AuctionFormData) => {
    const { seller, nftAddress, tokenId, startingBid } = auctionFormData;
    const response = await fetch('/api/createAuction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionAddress: auctionAddress,
        ownerAddress: seller,
        nftAddress: nftAddress,
        tokenId: tokenId,
        minimumBid: startingBid,
      }),
    });
    const result = await response.json();
    console.log('createAuctionRecordInDb result:', result);
  };

  console.log(form.watch());

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
        <FormField
          control={form.control}
          name='endTime'
          render={({ field }) => (
            <FormItem className='flex flex-col space-y-2'>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-2'>
          <Button
            type='submit'
            disabled={loading}
          >
            Create Auction
          </Button>
          <Spinner show={loading} />
        </div>
      </form>
    </Form>
  );
};
