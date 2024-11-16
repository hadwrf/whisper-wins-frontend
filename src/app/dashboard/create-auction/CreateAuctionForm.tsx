'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { myFirstSuappAbi } from '@/lib/abi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useWatchContractEvent, useWriteContract } from 'wagmi';
import { Auction } from './types';
import { auctionFormSchema } from './validation';

/**
 * suave-geth spell deploy Contract.sol:Contract
 */
const CONTRACT_ADDRESS = '0xd594760B2A36467ec7F0267382564772D7b0b73c';

export const CreateAuctionForm = () => {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  const form = useForm<Auction>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      name: '',
      price: '',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (auction: Auction) => {
    try {
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: myFirstSuappAbi,
        functionName: 'offchain',
      })
        .then((tx) => {
          console.log('Transaction:', tx);
        })
        .catch((err) => {
          console.error('Failed to send transaction:', err);
        });
    } catch (err) {
      console.error('Failed to send transaction:', err);
    }
  };

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: myFirstSuappAbi,
    eventName: 'OffchainEvent',
    onLogs(logs) {
      console.log('New logs!', logs);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Auction name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder='Price'
                  type='number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
        {hash ?? <div>Transaction Hash: {hash}</div>}
        {isPending ?? 'Pending...'}
      </form>
    </Form>
  );
};
