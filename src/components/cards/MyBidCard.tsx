import { BidCardData } from '@/app/dashboard/my-bids/page';
import { BidPriceBadge } from '@/components/BidPriceBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NftMedia } from '@/components/NftMedia';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import claim from '@/lib/suave/claim';
import endAuction from '@/lib/suave/endAuction';
import { printInfo } from '@/lib/suave/printInfo';
import { AuctionStatus, BidStatus } from '@prisma/client';
import { MousePointerClick } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface MyBidCardProps {
  bidCardData: BidCardData;
  onUpdateStatus: (bid: BidCardData) => void;
}

export const MyBidCard = ({ bidCardData, onUpdateStatus }: MyBidCardProps) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      endAuction(bidCardData.auction.contractAddress)
        .then(async () => {
          await updateAuctionRecordInDb(bidCardData.auction.contractAddress, AuctionStatus.RESOLVED);
          updateBidList(AuctionStatus.RESOLVED, false);
          toast({
            title: 'Auction resolved successfully!',
            variant: 'success',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Card className='w-60'>
      <CardMedia
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          printInfo(bidCardData.auction.contractAddress);
        }}
      >
        <NftMedia nft={bidCardData.nft} />
      </CardMedia>
      <CardContent className='h-fit overflow-hidden p-3 pb-2'>
        <p className='mb-1 line-clamp-1 text-sm font-semibold tracking-tight'>{bidCardData.nft?.name ?? 'No Name'}</p>
        <div className='mb-2 flex justify-between'>
          <BidPriceBadge
            value={`ETH ${bidCardData.amount}`}
            status={bidCardData.status}
          />
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
          disabled={shouldDisableButton(bidCardData, loading)}
          onClick={() => handleActionButtonClick()}
          className='w-full'
        >
          {getActionWording(bidCardData)}
          <Spinner show={loading} />
        </Button>
      </CardFooter>
    </Card>
  );
};

const BidStatusStepMapping = new Map<BidStatus, number>()
  .set(BidStatus.ACTIVE, 2)
  .set(BidStatus.WINNER, 3)
  .set(BidStatus.LOSER, 3);

function shouldDisableButton(bidCardData: BidCardData, loading: boolean) {
  // Disable the button if the auction is resolved and the result is already claimed
  if (bidCardData.auction.status === AuctionStatus.RESOLVED && bidCardData.resultClaimed) {
    return true;
  }

  // Disable the button if the auction is not in a state where actions are valid
  if (bidCardData.auction.status === AuctionStatus.IN_PROGRESS) {
    return true;
  }

  // Disable the button during the loading process to prevent duplicate actions
  if (loading) {
    return true;
  }

  // Default: the button is enabled
  return false;
}

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
    return 'Time ended';
  } else {
    return 'In progress';
  }
}

function getStatusBackgroundColor(bid: BidCardData) {
  if (bid.auction.status == AuctionStatus.IN_PROGRESS) {
    return 'bg-orange-300 hover:bg-orange-400';
  }
  return 'bg-green-400/90 hover:bg-green-500';
}

function getActionWording(bid: BidCardData) {
  if (bid.auction.status == AuctionStatus.RESOLVED) {
    if (!bid.resultClaimed) {
      if (bid.isWinner) {
        return 'Claim NFT';
      } else {
        return 'Claim bid';
      }
    }
    return 'No action available';
  }
  if (bid.auction.status == AuctionStatus.TIME_ENDED) {
    return 'Resolve';
  } else {
    return 'No action available';
  }
}
