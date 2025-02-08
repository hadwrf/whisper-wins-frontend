import { getNft } from '@/lib/services/getUserNfts';
import getWinnerSuave from '@/lib/suave/getWinnerSuave';
import { prismaEdge } from '@/prisma/edge';
import { BidStatus, NotificationType, ParticipantType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Find auctions where the end time has passed and winner address is null
    const endedAuctions = await prismaEdge.auction.findMany({
      where: {
        status: 'RESOLVED',
        winnerAddres: null, // Winner address is not set
      },
    });

    for (const auction of endedAuctions) {
      // Fetch winner address from the contract
      const winnerAddressSuave = await getWinnerSuave(auction.contractAddress);

      console.log('winnerAddressSuave', winnerAddressSuave);

      if (winnerAddressSuave) {
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

        // Create win / lost status for bidders
        const bidsStatus = bids.map((bid) => ({
          status: bid.l1Address === winnerAddressSuave ? BidStatus.WINNER : BidStatus.LOSER,
          id: bid.id,
        }));

        // Update bids in the Bids table
        const updatePromises = bidsStatus.map((bid) =>
          prismaEdge.bid.update({
            where: { id: bid.id },
            data: { status: bid.status },
          }),
        );
        await Promise.all(updatePromises);

        // Create notifications for bidders
        const bidderNotifications = bids.map((bid) => ({
          type: bid.l1Address === winnerAddressSuave ? NotificationType.AUCTION_WON : NotificationType.AUCTION_LOST,
          auctionAddress: auction.contractAddress,
          userAddress: bid.l1Address,
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

        await prismaEdge.auction.update({
          where: { contractAddress: auction.contractAddress },
          data: { status: 'RESOLVED', winnerAddres: winnerAddressSuave },
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
