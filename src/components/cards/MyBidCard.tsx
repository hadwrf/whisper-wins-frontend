import { BidCardData } from '@/app/dashboard/my-bids/page';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NftMedia } from '@/components/NftMedia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import claim from '@/lib/suave/claim';
import endAuction from '@/lib/suave/endAuction';
import { AuctionStatus, BidStatus } from '@prisma/client';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MyBidCardProps {
  bidCardData: BidCardData;
}

export const MyBidCard = ({ bidCardData }: MyBidCardProps) => {
  const { push } = useRouter();
  const { toast } = useToast();

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

  const updateAuctionRecordInDb = async (auctionAddress: string, status?: string, resultClaimed?: boolean) => {
    const requestBody = JSON.stringify({
      contractAddress: auctionAddress,
      status: status,
      resultClaimed: resultClaimed,
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

  const handleActionButtonClick = () => {
    if (bidCardData.auction.status == AuctionStatus.RESOLVED) {
      claim(bidCardData.auction.contractAddress)
        .then(async () => {
          await updateAuctionRecordInDb(bidCardData.auction.contractAddress, AuctionStatus.RESOLVED, true);
          toast({
            title: 'Claimed!',
          });
        })
        .catch(() => {
          toast({
            title: 'Failed to claim!',
          });
        });
    } else {
      endAuction(bidCardData.auction.contractAddress).then(async () => {
        await updateAuctionRecordInDb(bidCardData.auction.contractAddress, AuctionStatus.RESOLVED, false);
        toast({
          title: 'Auction resolved!',
        });
      });
    }
  };

  return (
    <Card className='w-60'>
      <CardMedia>
        <NftMedia nft={bidCardData.nft} />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{bidCardData.nft?.name ?? 'No Name'}</p>
        <div className='mb-1 flex justify-between'>
          <p className='flex items-center text-sm font-semibold text-emerald-400'>ETH {bidCardData.amount}</p>
          {bidCardData.auctionEndTime && (
            <CountdownTimer
              startTime={bidCardData.auction.createdAt}
              auctionEndTime={bidCardData.auctionEndTime}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className='w-full flex-none'>
        <div className='flex w-full justify-between'>
          <Button
            onClick={() => handleStatusClick(bidCardData)}
            size='xs'
            variant='outline'
            className={`${getStatusBackgroundColor(bidCardData)} font-bold text-white`}
          >
            <Info /> {getBidStatus(bidCardData)}
          </Button>
          <Button
            size='xs'
            disabled={bidCardData.auction.status == AuctionStatus.IN_PROGRESS}
            onClick={() => handleActionButtonClick()}
          >
            {getActionWording(bidCardData)}
          </Button>
        </div>
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
    return 'bg-green-500';
  } else {
    return 'bg-rose-500';
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
