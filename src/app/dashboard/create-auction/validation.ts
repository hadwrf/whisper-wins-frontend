import { z } from 'zod';

export const auctionFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  price: z.string({
    message: 'Price must be given.',
  }),
});
