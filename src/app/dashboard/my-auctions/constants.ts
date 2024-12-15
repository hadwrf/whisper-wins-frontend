import { AuctionStatus } from '@prisma/client';

export const AuctionStatusMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'NFT Transfer Pending')
  .set(AuctionStatus.IN_PROGRESS, 'In Progress')
  .set(AuctionStatus.START_PENDING, 'Start Pending')
  .set(AuctionStatus.WINNER_CLAIM_PENDING, 'Winner Claim Pending')
  .set(AuctionStatus.ENDED, 'Ended');
