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

  const handleCloseModal = () => {
    router.back(); // This closes the modal by navigating back
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
          title: 'Bid successfully sent!',
          variant: 'success',
        });
      })
      .catch(() => {
        toast({
          title: 'Bid could not be sent!',
          variant: 'error',
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
        <div className='justify-items-center'>
          {!biddingAddress && !biddingAmount && (
            <>
              <LoadingQRCode />
              <p className='mt-5'>Enter your bid amount</p>
            </>
          )}
          {biddingAddress && biddingAmount && (
            <div>
              <BiddingQRCode
                recipient={biddingAddress as Hex}
                amount={biddingAmount}
              />
              <div className='mb-1 flex flex-col items-center justify-center gap-2'>
                <p className=''>Scan QR code to send your bid..</p>
                <div className='flex items-center'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => handleClickTransaction(biddingAddress, biddingAmount)}
                    disabled={loading}
                  >
                    or click here!
                  </Button>
                  <Spinner show={loading} />
                </div>
              </div>
            </div>
          )}
          {biddingAddress && (
            <BalanceDisplay
              biddingAddress={biddingAddress as Hex}
              onClose={handleCloseModal}
            />
          )}
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
