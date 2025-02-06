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
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
          toast({ title: 'Failed to get winning bid!' });
        });
    }
  }, [auctionCardData.status]);

  const updateAuctionList = (newStatus: AuctionStatus) => {
    onUpdateStatus({ ...auctionCardData, status: newStatus });
  };

  const handleStatusClick = (auction: Auction) => {
    const step = auction.resultClaimed ? 7 : AuctionStatusStepMapping.get(auction.status);
    push(`/dashboard/auction-steps?currentStep=${step}`);
  };

  const handleButtonClick = async (auction: AuctionCardData) => {
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
          toast({ title: 'Invalid auction status!' });
      }
    } catch (error) {
      console.error('Error handling button click:', error);
      toast({ title: 'An unexpected error occurred!' });
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
      toast({ title: 'NFT transferred successfully!' });
    } catch {
      toast({ title: 'Failed to transfer NFT!' });
    } finally {
      setTransferTokenDialogOpen(false);
    }
  };

  const handleNftTransferAddressPending = async (auction: AuctionCardData) => {
    try {
      await setupAuction(auction.contractAddress);

      const nftHoldingAddress = await readNftHoldingAddress(auction.contractAddress);
      if (!nftHoldingAddress) {
        toast({ title: 'NFT transfer address not found!' });
        return;
      }

      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.NFT_TRANSFER_PENDING, nftHoldingAddress);

      toast({ title: 'Auction setup successful!' });
      updateAuctionList(AuctionStatus.NFT_TRANSFER_PENDING);
    } catch {
      toast({ title: 'Auction setup failed!' });
    }
  };

  const handleStartPending = async (auction: AuctionCardData) => {
    await startAuction(auction.contractAddress);
    await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.IN_PROGRESS);
    toast({ title: 'Your auction is live!' });
    updateAuctionList(AuctionStatus.IN_PROGRESS);
  };

  const handleTimeEnded = async (auction: AuctionCardData) => {
    console.log('End auction button clicked', auction.contractAddress);
    try {
      await endAuction(auction.contractAddress);
      await updateAuctionRecordInDb(auction.contractAddress, AuctionStatus.RESOLVED);
      toast({ title: 'Auction is resolved!' });
      updateAuctionList(AuctionStatus.RESOLVED);
    } catch {
      toast({ title: 'Failed to resolve auction!' });
    }
  };

  const handleResolved = async (auction: AuctionCardData) => {
    if (!auction.resultClaimed) {
      try {
        await claim(auction.contractAddress);
        await updateAuctionRecordInDb(auction.contractAddress, undefined, undefined, true);
        toast({ title: 'Claimed successfully!' });
      } catch {
        toast({ title: 'Failed to claim!' });
      }
    } else {
      toast({ title: 'Already claimed!' });
    }
  };

  //const handleNftBack = (contractAddress: string) => {
  //  console.log('handleNftBack', contractAddress, account);
  //moveNFTDebug(contractAddress, account as string);
  //  getPrivateKey(contractAddress);
  //};

  return (
    <>
      <Card className='w-72'>
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
        <CardContent className='h-fit overflow-hidden p-3 pb-1'>
          <p className='mb-1 line-clamp-1 text-sm font-semibold tracking-tight'>{auctionCardData.nft.name}</p>
          <div className='mb-1 flex justify-between'>
            {auctionCardData.endsAt && (
              <CountdownTimer
                startTime={auctionCardData.createdAt}
                auctionEndTime={auctionCardData.endsAt}
              />
            )}
            {winningBid && <WinningBidBadge value={`ETH ${winningBid}`} />}
          </div>
        </CardContent>
        <CardFooter className='flex-none'>
          <div className='flex w-full justify-between'>
            <Button
              onClick={() => handleStatusClick(auctionCardData)}
              size='xs'
              variant='outline'
              className={`${AuctionStatusBackgroundColor.get(auctionCardData.status)} font-bold text-white`}
            >
              <Info />
              {auctionCardData.status == AuctionStatus.RESOLVED && auctionCardData.resultClaimed
                ? 'Completed'
                : AuctionStatusMapping.get(auctionCardData.status)}
            </Button>
            <Button
              size='xs'
              disabled={auctionCardData.status == AuctionStatus.IN_PROGRESS || auctionCardData.resultClaimed}
              onClick={() => handleButtonClick(auctionCardData)}
            >
              {AuctionStatusActionMapping.get(auctionCardData.status)}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <TransferDialog
        open={transferTokenDialogOpen}
        onOpenChange={setTransferTokenDialogOpen}
      />
    </>
  );
};
