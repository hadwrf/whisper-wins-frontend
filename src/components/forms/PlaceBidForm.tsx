'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { placeBidSchema } from '@/app/dashboard/validation';
import { useEffect, useState } from 'react';
import getBiddingAddress from '@/lib/suave/getBiddingAddress';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/hooks/use-toast';

interface PlaceBidFormProps {
  auctionAddress: string;
  minimumBidAmount: number;
  onBiddingAddressChange: (address: string) => void;
  onBiddingAmountChange: (amount: number) => void;
}

interface PlaceBidFormData {
  amount: number;
}

export const PlaceBidForm = ({
  auctionAddress,
  minimumBidAmount,
  onBiddingAddressChange,
  onBiddingAmountChange,
}: PlaceBidFormProps) => {
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(placeBidSchema(minimumBidAmount)),
    defaultValues: {
      amount: minimumBidAmount,
    },
  });

  useEffect(() => {
    form.reset({ amount: minimumBidAmount });
  }, [minimumBidAmount, form.reset]);

  const onSubmit = async (data: PlaceBidFormData) => {
    setLoading(true);
    getBiddingAddress(auctionAddress)
      .then((biddingAddress) => {
        onBiddingAddressChange(biddingAddress);
        onBiddingAmountChange(data.amount);
        setScanMode(true);
        toast({
          title: 'Bidding address retrieved!',
          variant: 'success',
          description: auctionAddress,
        });
      })
      .catch(() => {
        toast({
          description: 'Transaction signature denied!',
          variant: 'error',
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
                  type='decimal'
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
