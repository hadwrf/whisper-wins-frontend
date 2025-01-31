'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';

const AuctionCreateNextStep = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const auctionAddress = searchParams?.get('auctionAddress') || '';

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Auction Created Successfully!</DialogTitle>
          <DialogDescription>You have created the auction. The next step is the NFT transfer.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className={'flex w-full justify-between'}>
            <Button
              variant='secondary'
              onClick={() =>
                window.open(`https://explorer.toliman.suave.flashbots.net/address/${auctionAddress}`, '_blank')
              }
            >
              Show in Block Explorer
            </Button>
            <Button
              onClick={() => {
                router.replace('/dashboard/my-auctions');
              }}
            >
              Go to My Auctions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionCreateNextStep;
