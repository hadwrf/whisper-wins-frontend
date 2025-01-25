import { AuctionStatus } from '@prisma/client';

export const AuctionStatusMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 'NFT Transfer Address Pending')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'NFT Transfer Pending')
  .set(AuctionStatus.IN_PROGRESS, 'In Progress')
  .set(AuctionStatus.START_PENDING, 'Start Pending')
  .set(AuctionStatus.EARNING_CLAIM_PENDING, 'Earning Claim Pending')
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
  .set(AuctionStatus.EARNING_CLAIM_PENDING, 'Winner Claim Pending')
  .set(AuctionStatus.ENDED, 'Ended');

export const AuctionStatusActionMapping = new Map<AuctionStatus, string>()
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'Get Address')
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 'Transfer NFT')
  .set(AuctionStatus.IN_PROGRESS, 'End Auction')
  .set(AuctionStatus.START_PENDING, 'Start Auction')
  .set(AuctionStatus.EARNING_CLAIM_PENDING, 'Claim your NFT')
  .set(AuctionStatus.ENDED, 'Auction Ended');

export const AuctionStatusStepMapping = new Map<AuctionStatus, number>()
  .set(AuctionStatus.NFT_TRANSFER_ADDRESS_PENDING, 2)
  .set(AuctionStatus.NFT_TRANSFER_PENDING, 3)
  .set(AuctionStatus.START_PENDING, 4)
  .set(AuctionStatus.IN_PROGRESS, 5)
  .set(AuctionStatus.EARNING_CLAIM_PENDING, 6)
  .set(AuctionStatus.ENDED, 7);
