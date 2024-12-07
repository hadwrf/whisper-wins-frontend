'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateAuctionForm } from '@/app/dashboard/create-auction/CreateAuctionForm';

const CreateAuctionModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nftAddress = searchParams?.get('nftAddress') || '';
  const tokenId = searchParams?.get('tokenId') || '';

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <DialogContent>
        <CreateAuctionForm
          nftAddress={nftAddress}
          tokenId={tokenId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionModal;
