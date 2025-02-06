import { BidCardData } from '@/app/dashboard/my-bids/page';
import { BidStatusBackgroundColor } from '@/app/ui/colors';
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
  bid: BidCardData;
}

export const MyBidCard = ({ bid }: MyBidCardProps) => {
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

  function getBidStatus() {
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

  function getActionWording() {
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
    if (bid.auction.status == AuctionStatus.RESOLVED) {
      claim(bid.auction.contractAddress)
        .then(async () => {
          await updateAuctionRecordInDb(bid.auction.contractAddress, AuctionStatus.RESOLVED, true);
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
      endAuction(bid.auction.contractAddress).then(async () => {
        await updateAuctionRecordInDb(bid.auction.contractAddress, AuctionStatus.RESOLVED, false);
        toast({
          title: 'Auction resolved!',
        });
      });
    }
  };

  return (
    <Card className='w-60'>
      <CardMedia>
        <NftMedia nft={bid.nft} />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3'>
        <p className='line-clamp-1 text-sm font-semibold tracking-tight'>{bid.nft?.name ?? 'No Name'}</p>
        <div className='mb-1 flex justify-between'>
          <p className='flex items-center text-sm font-semibold text-emerald-400'>ETH {bid.amount}</p>
          {bid.auctionEndTime && (
            <CountdownTimer
              startTime={bid.auction.createdAt}
              auctionEndTime={bid.auctionEndTime}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className='w-full flex-none'>
        <div className='flex w-full justify-between'>
          <Button
            onClick={() => handleStatusClick(bid)}
            size='xs'
            variant='outline'
            className={`${BidStatusBackgroundColor.get(bid.status)} font-bold text-white`}
          >
            <Info /> {getBidStatus()}
          </Button>
          <Button
            size='xs'
            disabled={bid.auction.status == AuctionStatus.IN_PROGRESS}
            onClick={() => handleActionButtonClick()}
          >
            {getActionWording()}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const BidStatusStepMapping = new Map<BidStatus, number>()
  .set(BidStatus.ACTIVE, 2)
  .set(BidStatus.WINNER, 3)
  .set(BidStatus.LOSER, 3);
