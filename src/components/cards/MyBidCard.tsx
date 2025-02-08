import { BidCardData } from '@/app/dashboard/my-bids/page';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NftMedia } from '@/components/NftMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import claim from '@/lib/suave/claim';
import endAuction from '@/lib/suave/endAuction';
import { AuctionStatus, BidStatus } from '@prisma/client';
import { MousePointerClick } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BidPriceBadge } from '@/components/BidPriceBadge';

interface MyBidCardProps {
  bidCardData: BidCardData;
  onUpdateStatus: (bid: BidCardData) => void;
}

export const MyBidCard = ({ bidCardData, onUpdateStatus }: MyBidCardProps) => {
  const { push } = useRouter();
  const { toast } = useToast();

  const updateBidList = (newStatus: AuctionStatus, resultClaimed: boolean) => {
    onUpdateStatus({ ...bidCardData, auction: { ...bidCardData.auction, status: newStatus }, resultClaimed });
  };

  const handleStatusClick = (bid: BidCardData) => {
    let step = BidStatusStepMapping.get(bid.status);
    if (bid.auction.status == AuctionStatus.RESOLVED) {
      step = 3;
    }
    if (bid.resultClaimed) {
      step = 4;
    }
    push(`/dashboard/bid-steps?currentStep=${step}`);
  };

  const updateAuctionRecordInDb = async (auctionAddress: string, status?: string) => {
    const requestBody = JSON.stringify({
      contractAddress: auctionAddress,
      status: status,
    });
    console.log('updateAuctionRecordInDb requestBody:', requestBody);
    const response = await fetch('/api/updateAuctionContract', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });
    const result = await response.json();
    console.log('updateAuctionRecordInDb result', result);
  };

  const updateBidRecordInDb = async (resultClaimed?: boolean) => {
    const requestBody = JSON.stringify({
      bidId: bidCardData.id,
      resultClaimed: resultClaimed,
    });
    console.log('updateBidRecordInDb requestBody:', requestBody);
    const response = await fetch('/api/bids', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });
    const result = await response.json();
    console.log('updateBidRecordInDb result', result);
  };

  const handleActionButtonClick = () => {
    if (bidCardData.auction.status == AuctionStatus.RESOLVED) {
      claim(bidCardData.auction.contractAddress)
        .then(async () => {
          await updateBidRecordInDb(true);
          updateBidList(AuctionStatus.RESOLVED, true);
          toast({
            title: 'Successfully claimed the NFT!',
            variant: 'success',
          });
        })
        .catch(() => {
          toast({
            title: 'Failed to claim the NFT!',
            variant: 'error',
          });
        });
    } else {
      endAuction(bidCardData.auction.contractAddress).then(async () => {
        await updateAuctionRecordInDb(bidCardData.auction.contractAddress, AuctionStatus.RESOLVED);
        updateBidList(AuctionStatus.RESOLVED, false);
        toast({
          title: 'Auction resolved successfully!',
          variant: 'success',
        });
      });
    }
  };

  return (
    <Card className='w-60'>
      <CardMedia>
        <NftMedia nft={bidCardData.nft} />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3 pb-2'>
        <p className='mb-1 line-clamp-1 text-sm font-semibold tracking-tight'>{bidCardData.nft?.name ?? 'No Name'}</p>
        <div className='mb-2 flex justify-between'>
          <BidPriceBadge value={`ETH ${bidCardData.amount}`} />
          {bidCardData.auctionEndTime && (
            <CountdownTimer
              startTime={bidCardData.auction.createdAt}
              auctionEndTime={bidCardData.auctionEndTime}
            />
          )}
        </div>
        <Badge
          variant='secondary'
          onClick={() => handleStatusClick(bidCardData)}
          className={`${getStatusBackgroundColor(bidCardData)} flex w-full cursor-pointer items-center justify-center text-sky-800`}
        >
          <MousePointerClick className='mr-1 size-5 ' />
          {getBidStatus(bidCardData)}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button
          size='xs'
          disabled={bidCardData.auction.status == AuctionStatus.IN_PROGRESS}
          onClick={() => handleActionButtonClick()}
          className='w-full'
        >
          {getActionWording(bidCardData)}
        </Button>
      </CardFooter>
    </Card>
  );
};

const BidStatusStepMapping = new Map<BidStatus, number>()
  .set(BidStatus.ACTIVE, 2)
  .set(BidStatus.WINNER, 3)
  .set(BidStatus.LOSER, 3);

function getBidStatus(bid: BidCardData) {
  if (bid.auction.status == AuctionStatus.RESOLVED) {
    if (!bid.resultClaimed) {
      if (bid.isWinner) {
        return 'You won';
      } else {
        return 'You lost';
      }
    }
    return 'Completed';
  }
  if (bid.auction.status == AuctionStatus.TIME_ENDED) {
    return 'Time Ended';
  } else {
    return 'In Progress';
  }
}

function getStatusBackgroundColor(bid: BidCardData) {
  if (bid.isWinner) {
    return 'bg-green-400/90';
  } else {
    return 'bg-rose-500/90';
  }
}

function getActionWording(bid: BidCardData) {
  if (bid.auction.status == AuctionStatus.RESOLVED) {
    if (!bid.resultClaimed) {
      if (bid.isWinner) {
        return 'Claim NFT';
      } else {
        return 'Claim Bid';
      }
    }
    return 'Completed';
  }
  if (bid.auction.status == AuctionStatus.TIME_ENDED) {
    return 'Resolve';
  } else {
    return 'In Progress';
  }
}
