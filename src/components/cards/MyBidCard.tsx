import { BidStatusBackgroundColor } from '@/app/ui/colors';
import { CountdownTimer } from '@/components/CountdownTimer';
import MoreInfoButton from '@/components/MoreInfoButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { Hex } from '@flashbots/suave-viem';
import { AuctionStatus, BidStatus } from '@prisma/client';
import { CameraOff, Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import claim from '@/lib/suave/claim';
import endAuction from '@/lib/suave/endAuction';
import { BidCardData } from '@/app/dashboard/my-bids/page';

interface MyBidCardProps {
  bid: BidCardData;
}

export const MyBidCard = ({ bid }: MyBidCardProps) => {
  const { push } = useRouter();
  const { toast } = useToast();

  const handleStatusClick = (bidStatus: BidStatus) => {
    const step = BidStatusStepMapping.get(bidStatus);
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
    return 'In Progress';
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
    return 'In Progress';
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
        {bid.nft?.image?.originalUrl ? (
          <Image
            className='m-auto size-full rounded-lg'
            src={bid.nft.image.originalUrl}
            alt={bid.nft.name || 'NFT'}
            width={100}
            height={100}
          />
        ) : (
          <CameraOff className='m-auto size-8 h-full text-slate-300' />
        )}
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
        <div className='w-full'>
          <Button
            onClick={() => handleStatusClick(bid.status)}
            size='xs'
            variant='outline'
            className={`${BidStatusBackgroundColor.get(bid.status)} font-bold text-white`}
          >
            <Info /> {getBidStatus()}
          </Button>
          <div className='mt-2 flex w-full items-center justify-between'>
            <Button
              size='xs'
              disabled={bid.auction.status == AuctionStatus.IN_PROGRESS}
              onClick={() => handleActionButtonClick()}
            >
              {getActionWording()}
            </Button>
            <MoreInfoButton
              nftContractAddress={bid.nft?.contract.address as Hex}
              nftTokenId={bid.nft?.tokenId ?? ''}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export const BidStatusMapping = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'Active')
  .set(BidStatus.WINNER, 'Winner')
  .set(BidStatus.LOSER, 'Loser');

export const BidStatusInfoMapping = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'Auction in progress')
  .set(BidStatus.WINNER, 'You won the auction')
  .set(BidStatus.LOSER, 'You lost the auction');

export const BidStatusActionMapping = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'Resolve')
  .set(BidStatus.WINNER, 'Claim NFT')
  .set(BidStatus.LOSER, 'Claim Bid');

export const BidStatusStepMapping = new Map<BidStatus, number>()
  .set(BidStatus.ACTIVE, 1)
  .set(BidStatus.WINNER, 2)
  .set(BidStatus.LOSER, 2);
