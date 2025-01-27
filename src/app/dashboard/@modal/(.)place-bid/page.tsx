'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingQRCode from '@/components/LoadingQRCode';
import { PlaceBidForm } from '@/components/forms/PlaceBidForm';
import { useState } from 'react';
import BiddingQRCode from '@/components/BiddingQRCode';
import { Hex } from '@flashbots/suave-viem';
import BalanceDisplay from '@/components/BalanceDisplay';
import { Button } from '@/components/ui/button';
import { transferTransactionToAddress } from '@/lib/ethereum/transferTransactionToAddress';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/context/AuthContext';

const PlaceBidModal = () => {
  const router = useRouter();
  const { account } = useAuthContext();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const auctionAddress = searchParams?.get('auctionAddress') || '';

  const [biddingAddress, setBiddingAddress] = useState<string | null>(null);
  const [biddingAmount, setBiddingAmount] = useState<number | null>(null);

  const handleClickTransaction = (biddingAddress: string | null, biddingAmount: number | null) => {
    setLoading(true);
    transferTransactionToAddress(biddingAddress as Hex, biddingAmount as number)
      .then(() => {
        createBidRecordInDb(auctionAddress, biddingAddress as string, biddingAmount as number);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const createBidRecordInDb = async (auctionAddress: string, bidderAddress: string, amount: number) => {
    fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionAddress: auctionAddress,
        bidderAddress: bidderAddress,
        l1Address: account,
        amount: amount,
      }),
    })
      .then(() => {
        toast({
          title: 'Bid persisted in DB!',
        });
      })
      .catch(() => {
        toast({
          title: 'Bid persisting error!',
        });
      });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>
      <DialogContent>
        <div className='flex flex-col items-center justify-items-center'>
          {!biddingAddress && !biddingAmount && (
            <>
              <LoadingQRCode />
              <p className='mt-5'>Enter your bid amount</p>
            </>
          )}
          {biddingAddress && biddingAmount && (
            <>
              <BiddingQRCode
                recipient={biddingAddress as Hex}
                amount={biddingAmount}
              />
              <p className='mt-5'>Scan QR code to send your bid..</p>
              <div className='flex items-center gap-2'>
                <Button
                  variant={'ghost'}
                  onClick={() => handleClickTransaction(biddingAddress, biddingAmount)}
                >
                  or click here!
                </Button>
                <Spinner show={loading} />
              </div>
            </>
          )}
          {biddingAddress && <BalanceDisplay biddingAddress={biddingAddress as Hex} />}
        </div>
        <PlaceBidForm
          auctionAddress={auctionAddress}
          onBiddingAddressChange={setBiddingAddress}
          onBiddingAmountChange={setBiddingAmount}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PlaceBidModal;
