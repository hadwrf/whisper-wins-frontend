import { AuctionStatus, BidStatus } from '@prisma/client';

export const AuctionStatusBackgroundColor = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 'bg-orange-300 hover:bg-orange-400')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'bg-orange-300 hover:bg-orange-400')
  .set(AuctionStatus.IN_PROGRESS, 'bg-orange-300 hover:bg-orange-400')
  .set(AuctionStatus.START_PENDING, 'bg-orange-300 hover:bg-orange-400')
  .set(AuctionStatus.TIME_ENDED, 'bg-orange-300 hover:bg-orange-400')
  .set(AuctionStatus.RESOLVED, 'bg-green-400/90 hover:bg-green-500');

export const BidStatusBackgroundColor = new Map<BidStatus, string>()
  .set(BidStatus.ACTIVE, 'bg-blue-500')
  .set(BidStatus.WINNER, 'bg-green-500')
  .set(BidStatus.LOSER, 'bg-rose-500');
