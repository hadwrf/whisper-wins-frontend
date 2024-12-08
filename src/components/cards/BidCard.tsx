'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { CameraOff, DollarSign, Info, CalendarClock, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

// type BidCardProps = {
//   auctionAddress: string;
// };

export const BidCard = () => {
  const { push } = useRouter();

  const handleSellClick = () => {
    const auctionAddress = '0x0e99aefc77a809fd69fb7c5266a72a47749157d6';
    const url = `/dashboard/place-bid?auctionAddress=${auctionAddress}`;
    push(url);
  };

  return (
    <Card className='w-60'>
      <CardMedia>
        <CameraOff className='m-auto size-8 h-full text-slate-300' />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>Silent Serenade</p>
        <div className='mb-1 flex justify-between'>
          <p className='flex items-center text-sm font-semibold text-emerald-400'>
            <DollarSign
              size={14}
              strokeWidth={3}
            />
            1,00
          </p>
          <Badge
            variant='secondary'
            className='flex gap-1'
          >
            <CalendarClock size={13} />
            02.10.2024
          </Badge>
        </div>
        <div className='flex max-w-full gap-1 overflow-x-auto'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Badge
              key={i}
              variant='outline'
              className='flex gap-1'
            >
              <Tag size={12} />
              <p>nft</p>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSellClick}
          size='xs'
        >
          Place Bid
        </Button>
        <Button
          size='xs'
          variant='outline'
        >
          <Info /> More Info
        </Button>
      </CardFooter>
    </Card>
  );
};
