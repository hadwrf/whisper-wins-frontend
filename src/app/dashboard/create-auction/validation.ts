import { z } from 'zod';

export const auctionFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  price: z
    .string({
      message: 'Price must be given.',
    })
    .min(1, {
      message: 'Price must be given.',
    }),
  startingBid: z
    .string({
      message: 'Starting bid must be given.',
    })
    .min(1, {
      message: 'Starting bid must be given.',
    }),
  endDate: z.string(),
});
