'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { placeBidSchema } from '@/app/dashboard/validation';
import { useState } from 'react';
import retrieveBiddingAddress from '@/lib/suave/retrieveBiddingAddress';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/hooks/use-toast';

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
  const [scanMode, setScanMode] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(placeBidSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: PlaceBidFormData) => {
    setLoading(true);
    retrieveBiddingAddress(auctionAddress)
      .then((biddingAddress) => {
        onBiddingAddressChange(biddingAddress);
        onBiddingAmountChange(data.amount);
        setScanMode(true);
        toast({
          title: 'Bidding address retrieved!',
          description: auctionAddress,
        });
      })
      .catch(() => {
        toast({
          description: 'Transaction signature denied!',
        });
      })
      .finally(() => {
        setLoading(false);
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
        {!scanMode && (
          <div className='flex items-center gap-2'>
            <Button
              type='submit'
              disabled={loading}
            >
              {loading ? 'Retrieving the bidding address' : 'Place Bid'}
            </Button>
            <Spinner show={loading} />
          </div>
        )}
      </form>
    </Form>
  );
};
