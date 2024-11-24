'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { CreateAuctionForm } from '@/app/dashboard/create-auction/CreateAuctionForm';

const CreateAuctionModal = () => {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <DialogContent>
        <CreateAuctionForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionModal;
