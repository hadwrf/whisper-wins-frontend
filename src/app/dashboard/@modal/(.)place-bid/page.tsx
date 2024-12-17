'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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

const PlaceBidModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const auctionAddress = searchParams?.get('auctionAddress') || '';

  const [biddingAddress, setBiddingAddress] = useState<string | null>(null);
  const [biddingAmount, setBiddingAmount] = useState<number | null>(null);

  const handleClickTransaction = (biddingAddress: string | null, biddingAmount: number | null) => {
    transferTransactionToAddress(biddingAddress as Hex, biddingAmount as number);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
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
              <Button
                variant={'ghost'}
                onClick={() => handleClickTransaction(biddingAddress, biddingAmount)}
              >
                or click here!
              </Button>
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
