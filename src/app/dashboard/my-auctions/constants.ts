import { AuctionStatus } from '@prisma/client';

export const AuctionStatusMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'NFT Transfer Pending')
  .set(AuctionStatus.IN_PROGRESS, 'In Progress')
  .set(AuctionStatus.START_PENDING, 'Start Pending')
  .set(AuctionStatus.WINNER_CLAIM_PENDING, 'Winner Claim Pending')
  .set(AuctionStatus.ENDED, 'Ended');

export const AuctionStatusInfoMapping = new Map<AuctionStatus, string>()
  .set(
    AuctionStatus.NFT_TRANSFER_PENDING,
    'You need to transfer your NFT to our stake account to be able to start the auction. This ensures fair auction process.',
  )
  .set(AuctionStatus.IN_PROGRESS, 'People are bidding for your NFT.')
  .set(
    AuctionStatus.START_PENDING,
    'The auction has not been started yet. When you start the auction, other people are able to bid for you NFT.',
  )
  .set(AuctionStatus.WINNER_CLAIM_PENDING, 'Winner Claim Pending')
  .set(AuctionStatus.ENDED, 'Ended');

export const AuctionStatusActionMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'Transfer NFT')
  .set(AuctionStatus.IN_PROGRESS, 'End Auction')
  .set(AuctionStatus.START_PENDING, 'Start Auction')
  .set(AuctionStatus.WINNER_CLAIM_PENDING, 'Claim your NFT')
  .set(AuctionStatus.ENDED, 'Auction Ended');
