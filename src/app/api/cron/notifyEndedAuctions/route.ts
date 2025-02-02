import { getNft } from '@/lib/services/getUserNfts';
import { prismaEdge } from '@/prisma/edge';
import { NotificationType, ParticipantType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    // Find auctions where the end time has passed and status is IN_PROGRESS
    const endedAuctions = await prismaEdge.auction.findMany({
      where: {
        endTime: { lt: now },
        status: 'IN_PROGRESS',
      },
    });

    for (const auction of endedAuctions) {
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
        type: NotificationType.AUCTION_TIME_END,
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
        type: NotificationType.AUCTION_TIME_END,
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

      // Update the auction status to TIME_ENDED
      await prismaEdge.auction.update({
        where: { contractAddress: auction.contractAddress },
        data: { status: 'TIME_ENDED' },
      });
    }

    return NextResponse.json({
      message: `${endedAuctions.length} auctions processed and notifications sent.`,
    });
  } catch (error) {
    console.error('Error processing auctions:', error);
    return NextResponse.json({ error: 'Failed to process auctions' }, { status: 500 });
  }
}
