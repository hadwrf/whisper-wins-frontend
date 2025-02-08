import { AuctionStatus, BidStatus } from '@prisma/client';

export const AuctionStatusBackgroundColor = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 'bg-rose-500/90')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'bg-rose-500/90')
  .set(AuctionStatus.IN_PROGRESS, 'bg-yellow-500/90')
  .set(AuctionStatus.START_PENDING, 'bg-orange-500/90')
  .set(AuctionStatus.TIME_ENDED, 'bg-orange-500/90')
  .set(AuctionStatus.RESOLVED, 'bg-green-500/90');

export const BidStatusBackgroundColor = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'bg-blue-500')
  .set(BidStatus.WINNER, 'bg-green-500')
  .set(BidStatus.LOSER, 'bg-rose-500');
