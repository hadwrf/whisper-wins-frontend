import { getNft } from '@/lib/services/getUserNfts';
import retrieveWinnerL1 from '@/lib/suave/retrieveWinnerL1';
import retrieveWinnerSuave from '@/lib/suave/retrieveWinnerSuave';
import { prismaEdge } from '@/prisma/edge';
import { NotificationType, ParticipantType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Find auctions where the end time has passed and winner address is null
    const endedAuctions = await prismaEdge.auction.findMany({
      where: {
        status: 'TIME_ENDED',
        winnerAddres: null, // Winner address is not set
      },
    });

    for (const auction of endedAuctions) {
      // Fetch winner address from the contract
      const winnerAddress = await retrieveWinnerL1(auction.contractAddress);
      const winnerAddressSuave = await retrieveWinnerSuave(auction.contractAddress);

      console.log('winnerL1', winnerAddress);
      console.log('winnerAddressSuave', winnerAddressSuave);

      if (winnerAddress) {
        // Fetch NFT metadata
        const nftMetadata = await getNft({
          contractAddress: auction.nftAddress,
          tokenId: auction.tokenId,
        });

        const nftName = nftMetadata?.name || 'Unknown NFT'; // Default to "Unknown NFT" if no name is available

        // Get all bids for the auction
        const bids = await prismaEdge.bid.findMany({
          where: { auctionAddress: auction.contractAddress },
        });

        // Create notifications for bidders
        const bidderNotifications = bids.map((bid) => ({
          type: bid.bidderAddress === winnerAddress ? NotificationType.AUCTION_WON : NotificationType.AUCTION_LOST,
          auctionAddress: auction.contractAddress,
          userAddress: bid.bidderAddress,
          userType: ParticipantType.BIDDER,
          nftAddress: auction.nftAddress,
          nftTokenId: auction.tokenId,
          nftName: nftName,
          read: false,
          clicked: false,
        }));

        // Create a notification for the auction owner
        const ownerNotification = {
          type: NotificationType.CLAIM_HIGHEST_BID,
          auctionAddress: auction.contractAddress,
          userAddress: auction.ownerAddress,
          userType: ParticipantType.AUCTIONEER,
          nftAddress: auction.nftAddress,
          nftTokenId: auction.tokenId,
          nftName: nftName,
          read: false,
          clicked: false,
        };

        // Combine bidder and owner notifications
        const allNotifications = [...bidderNotifications, ownerNotification];

        // Insert notifications into the Notification table
        if (allNotifications.length > 0) {
          await prismaEdge.notification.createMany({ data: allNotifications });
        }

        // Update the auction status to TIME_ENDED and set the winner address
        await prismaEdge.auction.update({
          where: { contractAddress: auction.contractAddress },
          data: { status: 'RESOLVED' },
        });
      }
    }

    return NextResponse.json({
      message: `${endedAuctions.length} auctions processed and notifications sent.`,
    });
  } catch (error) {
    console.error('Error processing auctions:', error);
    return NextResponse.json({ error: 'Failed to process auctions' }, { status: 500 });
  }
}
