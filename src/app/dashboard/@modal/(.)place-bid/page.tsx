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
        {!biddingAddress && !biddingAmount && <LoadingQRCode />}
        {biddingAddress && biddingAmount && (
          <BiddingQRCode
            recipient={biddingAddress as Hex}
            amount={biddingAmount}
          />
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
