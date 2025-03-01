import {
  AuctionStatusActionMapping,
  AuctionStatusMapping,
  AuctionStatusStepMapping,
} from '@/app/dashboard/my-auctions/constants';
import { AuctionStatusBackgroundColor } from '@/app/ui/colors';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NftMedia } from '@/components/NftMedia';
import { TransferDialog } from '@/components/TransferDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardMedia } from '@/components/ui/card';
import { WinningBidBadge } from '@/components/WinningBidBadge';
import { useToast } from '@/hooks/use-toast';
import { transferNftToAddress, waitForNftTransferReceipt } from '@/lib/ethereum/transferNftToAddress';
import { AuctionCardData } from '@/lib/services/getAuctionCardData';
import claim from '@/lib/suave/claim';
import endAuction from '@/lib/suave/endAuction';
import getWinningBid from '@/lib/suave/getWinningBid';
import { printInfo } from '@/lib/suave/printInfo';
import readNftHoldingAddress from '@/lib/suave/readNftHoldingAddress';
import setupAuction from '@/lib/suave/setupAuction';
import startAuction from '@/lib/suave/startAuction';
import { Auction, AuctionStatus } from '@prisma/client';
import { MousePointerClick } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/Spinner';

interface MyAuctionCardProps {
  auctionCardData: AuctionCardData;
  onUpdateStatus: (auction: AuctionCardData) => void;
}

export const MyAuctionCard = (props: MyAuctionCardProps) => {
  const { auctionCardData, onUpdateStatus } = props;
  const { push } = useRouter();
  const { toast } = useToast();
  const [transferTokenDialogOpen, setTransferTokenDialogOpen] = useState(false);
  const [winningBid, setWinningBid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateAuctionRecordInDb = async (
    auctionAddress: string,
    status?: string,
    nftTransferAddress?: string,
    resultClaimed?: boolean,
  ) => {
    const requestBody = JSON.stringify({
      contractAddress: auctionAddress,
      status: status,
      nftTransferAddress: nftTransferAddress,
      resultClaimed: resultClaimed,
    });
    console.log('updateAuctionRecordInDb requestBody:', requestBody);
    const response = await fetch('/api/updateAuctionContract', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });
    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    if (auctionCardData.status == AuctionStatus.RESOLVED) {
      getWinningBid(auctionCardData.contractAddress)
        .then((bid) => {
          setWinningBid(bid);
        })
        .catch(() => {
          toast({ title: 'Failed to get winning bid!', variant: 'error' });
        });
    }
  }, [auctionCardData.status]);

  const updateAuctionList = (newStatus: AuctionStatus, resultClaimed: boolean = false) => {
    onUpdateStatus({ ...auctionCardData, status: newStatus, resultClaimed });
  };

  const handleStatusClick = (auction: Auction) => {
    const step = auction.resultClaimed ? 7 : AuctionStatusStepMapping.get(auction.status);
    push(`/dashboard/auction-steps?currentStep=${step}`);
  };

  const handleButtonClick = async (auction: AuctionCardData) => {
    setLoading(true);
    try {
      switch (auction.status) {
        case AuctionStatus.NFT_TRANSFER_PENDING:
          await handleNftTransferPending(auction);
          break;

        case AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING:
          await handleNftTransferAddressPending(auction);
          break;

        case AuctionStatus.START_PENDING:
          await handleStartPending(auction);
          break;

        case AuctionStatus.TIME_ENDED:
          await handleTimeEnded(auction);
          break;

        case AuctionStatus.RESOLVED:
          await handleResolved(auction);
          break;

        default:
          toast({ title: 'Invalid auction status!', variant: 'error' });
      }
    } catch (error) {
      console.error('Error handling button click:', error);
      toast({ title: 'An unexpected error occurred!', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNftTransferPending = async (auction: AuctionCardData) => {
    const nftHoldingAddress = await readNftHoldingAddress(auction.contractAddress);
    try {
      const transactionHash = await transferNftToAddress(
        auction.nft.contract.address,
        auction.nft.tokenId,
        nftHoldingAddress,
      );

      setTransferTokenDialogOpen(true);
      await waitForNftTransferReceipt(transactionHash);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.START_PENDING);
      updateAuctionList(AuctionStatus.START_PENDING);
      toast({ title: 'NFT transferred successfully!', variant: 'success' });
    } catch {
      toast({ title: 'Failed to transfer NFT!', variant: 'error' });
    } finally {
      setTransferTokenDialogOpen(false);
    }
  };

  const handleNftTransferAddressPending = async (auction: AuctionCardData) => {
    try {
      await setupAuction(auction.contractAddress);

      const nftHoldingAddress = await readNftHoldingAddress(auction.contractAddress);
      if (!nftHoldingAddress) {
        toast({ title: 'NFT transfer address not found!', variant: 'error' });
        return;
      }

      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.NFT_TRANSFER_PENDING, nftHoldingAddress);

      toast({ title: 'NFT transfer address retrieved!', variant: 'success' });
      updateAuctionList(AuctionStatus.NFT_TRANSFER_PENDING);
    } catch {
      toast({ title: 'NFT transfer address retrieve failed!', variant: 'error' });
    }
  };

  const handleStartPending = async (auction: AuctionCardData) => {
    await startAuction(auction.contractAddress);
    await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.IN_PROGRESS);
    toast({ title: 'Your auction is live!', variant: 'success' });
    updateAuctionList(AuctionStatus.IN_PROGRESS);
  };

  const handleTimeEnded = async (auction: AuctionCardData) => {
    console.log('End auction button clicked', auction.contractAddress);
    try {
      await endAuction(auction.contractAddress);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.RESOLVED);
      toast({ title: 'Auction is resolved!', variant: 'success' });
      updateAuctionList(AuctionStatus.RESOLVED);
    } catch {
      toast({ title: 'Failed to resolve auction!', variant: 'error' });
    }
  };

  const handleResolved = async (auction: AuctionCardData) => {
    if (!auction.resultClaimed) {
      try {
        await claim(auction.contractAddress);
        await updateAuctionRecordInDb(auction.contractAddress, undefined, undefined, true);
        updateAuctionList(AuctionStatus.RESOLVED, true);
        toast({ title: 'Claimed earnings successfully!', variant: 'success' });
      } catch {
        toast({ title: 'Failed to claim earnings!', variant: 'error' });
      }
    } else {
      toast({ title: 'Already claimed earnings!', variant: 'error' });
    }
  };

  //const handleNftBack = (contractAddress: string) => {
  //  console.log('handleNftBack', contractAddress, account);
  //moveNFTDebug(contractAddress, account as string);
  //  getNftHoldingAddressPrivateKey(contractAddress);
  //};

  return (
    <>
      <Card className='w-60'>
        <CardMedia
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            printInfo(auctionCardData.contractAddress);
          }}
        >
          {/*<Button onClick={() => handleNftBack(auction.contractAddress)}>Move nft</Button>*/}
          <NftMedia nft={auctionCardData.nft} />
        </CardMedia>
        <CardContent className='h-fit overflow-hidden p-3 pb-2'>
          <p className='mb-1 line-clamp-1 text-sm font-semibold tracking-tight'>{auctionCardData.nft.name}</p>
          <div className='mb-2 flex justify-between'>
            {auctionCardData.endsAt && (
              <CountdownTimer
                startTime={auctionCardData.createdAt}
                auctionEndTime={auctionCardData.endsAt}
              />
            )}
            {winningBid && <WinningBidBadge value={`ETH ${winningBid}`} />}
          </div>
          <Badge
            variant='secondary'
            onClick={() => handleStatusClick(auctionCardData)}
            className={`${AuctionStatusBackgroundColor.get(auctionCardData.status)} flex w-full cursor-pointer items-center justify-center text-sky-800`}
          >
            <MousePointerClick className='mr-1 size-5' />
            {auctionCardData.status == AuctionStatus.RESOLVED && auctionCardData.resultClaimed
              ? 'Completed'
              : AuctionStatusMapping.get(auctionCardData.status)}
          </Badge>
        </CardContent>
        <CardFooter>
          <Button
            size='xs'
            className='w-full'
            disabled={shouldDisableButton(auctionCardData, loading)}
            onClick={() => handleButtonClick(auctionCardData)}
          >
            {(auctionCardData.status == AuctionStatus.RESOLVED && auctionCardData.resultClaimed) ||
            auctionCardData.status == AuctionStatus.IN_PROGRESS
              ? 'No action needed'
              : AuctionStatusActionMapping.get(auctionCardData.status)}
            <Spinner show={loading} />
          </Button>
        </CardFooter>
      </Card>
      <TransferDialog
        open={transferTokenDialogOpen}
        onOpenChange={setTransferTokenDialogOpen}
      />
    </>
  );
};

function shouldDisableButton(auction: AuctionCardData, loading: boolean) {
  // Disable the button if the auction is resolved and the result is already claimed
  // auction is in progress
  if (
    (auction.status === AuctionStatus.RESOLVED && auction.resultClaimed) ||
    auction.status == AuctionStatus.IN_PROGRESS ||
    loading
  ) {
    return true;
  }

  // Default: the button is enabled
  return false;
}
