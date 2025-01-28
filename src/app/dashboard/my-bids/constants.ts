import { BidStatus } from '@prisma/client';

export const BidStatusFromValue = new Map<string, BidStatus>()
  .set('won', BidStatus.WINNER)
  .set('lost', BidStatus.LOSER);
