'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { placeBidSchema } from './validation';
import { useState } from 'react';
import retrieveBiddingAddress from '@/lib/suave/retrieveBiddingAddress';

interface PlaceBidFormProps {
  auctionAddress: string;
  onBiddingAddressChange: (address: string) => void;
  onBiddingAmountChange: (amount: number) => void;
}

interface PlaceBidFormData {
  amount: number;
}

export const PlaceBidForm = ({ auctionAddress, onBiddingAddressChange, onBiddingAmountChange }: PlaceBidFormProps) => {
  const [loading, setLoading] = useState(false);
  const [biddingAddress, setBiddingAddress] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(placeBidSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: PlaceBidFormData) => {
    setLoading(true);
    const biddingAddress = await retrieveBiddingAddress(auctionAddress);
    setBiddingAddress(biddingAddress);
    onBiddingAddressChange(biddingAddress);
    onBiddingAmountChange(data.amount);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bid Amount (ETH)</FormLabel>
              <FormControl>
                <Input
                  placeholder='Bid Amount'
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
          disabled={loading || biddingAddress != null}
        >
          Place Bid
        </Button>
      </form>
    </Form>
  );
};
