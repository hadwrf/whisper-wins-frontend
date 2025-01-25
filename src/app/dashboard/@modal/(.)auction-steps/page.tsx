'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import AuctionStatusStepper from '@/components/AuctionStatusStepper';

const NftDetaisModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = searchParams?.get('currentStep') || 3;

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <DialogContent className='min-w-[800px]'>
        <div className='m-6'>
          <AuctionStatusStepper currentStep={currentStep as number} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetaisModal;
