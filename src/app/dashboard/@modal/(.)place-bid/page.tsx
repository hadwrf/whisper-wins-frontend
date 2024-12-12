'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingQRCode from '@/components/LoadingQRCode';
import { PlaceBidForm } from '@/components/forms/PlaceBidForm';
import { useState } from 'react';
import BiddingQRCode from '@/components/BiddingQRCode';
import { Hex } from '@flashbots/suave-viem';

const PlaceBidModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const auctionAddress = searchParams?.get('auctionAddress') || '';

  const [biddingAddress, setBiddingAddress] = useState<string | null>(null);
  const [biddingAmount, setBiddingAmount] = useState<number | null>(null);

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <DialogContent>
        {!biddingAddress && !biddingAmount && (
          <div className='flex flex-col items-center justify-items-center'>
            <LoadingQRCode />
            <p className='mt-5'>Enter your bid amount</p>
          </div>
        )}
        {biddingAddress && biddingAmount && (
          <div className='flex flex-col items-center justify-items-center'>
            <BiddingQRCode
              recipient={biddingAddress as Hex}
              amount={biddingAmount}
            />
            <p className='mt-5'>Scan QR code to send your bid..</p>
          </div>
        )}
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
