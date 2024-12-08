import { z } from 'zod';

export const placeBidSchema = z.object({
  amount: z
    .string()
    .min(1, 'Starting bid is required')
    .regex(/^\d+(\.\d{1,18})?$/, 'Starting bid must be a valid number in ETH'),
});
