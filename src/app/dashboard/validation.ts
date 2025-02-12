import { z } from 'zod';

export const placeBidSchema = (minimumBidAmount: number) =>
  z.object({
    amount: z
      .string()
      .min(1, 'Starting bid is required')
      .regex(/^\d+(\.\d{1,18})?$/, 'Starting bid must be a valid number in ETH')
      .refine((val) => parseFloat(val) >= minimumBidAmount, {
        message: `Bid amount must be at least ${minimumBidAmount} ETH`,
      }),
  });
