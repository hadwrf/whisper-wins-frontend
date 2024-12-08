'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateAuctionForm } from '@/components/forms/CreateAuctionForm';

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
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
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
