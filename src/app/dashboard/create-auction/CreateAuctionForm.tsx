'use client';

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { myFirstSuapp } from '@/lib/abi';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useWriteContract } from 'wagmi';
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
      startingBid: '',
      endDate: '',
    },
  });

  const onSubmit = () => {
    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: myFirstSuapp.abi,
      functionName: 'offchain',
    })
      .then((tx) => {
        console.log('Transaction:', tx);
      })
      .catch((err) => {
        console.error('Failed to send transaction:', err);
      });
  };

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
        <FormField
          control={form.control}
          name='startingBid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Bid</FormLabel>
              <FormControl>
                <Input
                  placeholder='Starting Bid'
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
          name='endDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => date && field.onChange(format(date, 'dd.MM.yyyy'))}
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
