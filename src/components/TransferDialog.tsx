'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { X } from 'lucide-react';

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <DialogContent className='sm:max-w-md'>
        <button
          onClick={() => onOpenChange(false)}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
        >
          <X className='size-4' />
          <span className='sr-only'>Close</span>
        </button>
        <div className='flex flex-col items-center gap-6 py-10'>
          <Loader2 className='size-12 animate-spin' />
          <div className='flex flex-col items-center gap-2 text-center'>
            <h2 className='text-4xl font-bold tracking-tight'>Your transfer is processing...</h2>
            <p className='text-lg text-muted-foreground'>
              Your NFT transfer is processing. It should be confirmed on the blockchain shortly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
