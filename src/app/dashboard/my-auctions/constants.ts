import { AuctionStatus } from '@prisma/client';

export const AuctionStatusMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 'Transfer Address Pending')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'NFT Transfer Pending')
  .set(AuctionStatus.IN_PROGRESS, 'In Progress')
  .set(AuctionStatus.START_PENDING, 'Start Pending')
  .set(AuctionStatus.TIME_ENDED, 'Time Ended')
  .set(AuctionStatus.RESOLVED, 'Resolved');

export const AuctionStatusActionMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 'Get Address')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'Transfer NFT')
  .set(AuctionStatus.IN_PROGRESS, 'In Progress')
  .set(AuctionStatus.START_PENDING, 'Start Auction')
  .set(AuctionStatus.TIME_ENDED, 'Resolve')
  .set(AuctionStatus.RESOLVED, 'Claim Earning');

export const AuctionStatusStepMapping = new Map<AuctionStatus, number>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 2)
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 3)
  .set(AuctionStatus.START_PENDING, 4)
  .set(AuctionStatus.IN_PROGRESS, 5)
  .set(AuctionStatus.TIME_ENDED, 5);

export const AuctionStatusFromValue = new Map<string, AuctionStatus>()
  .set('nft_address_pending', AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING)
  .set('nft_transfer_pending', AuctionStatus.NFT_TRANSFER_PENDING)
  .set('start_pending', AuctionStatus.START_PENDING)
  .set('in_progress', AuctionStatus.IN_PROGRESS)
  .set('time_ended', AuctionStatus.TIME_ENDED)
  .set('resolved', AuctionStatus.RESOLVED);
