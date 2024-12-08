import { z } from 'zod';

export const auctionFormSchema = z.object({
  seller: z
    .string()
    .min(1, 'Seller address is required')
    .length(42, 'Seller address must be 42 characters long')
    .startsWith('0x', 'Seller address must start with "0x"'),

  nftAddress: z
    .string()
    .min(1, 'NFT contract address is required')
    .length(42, 'NFT contract address must be 42 characters long')
    .startsWith('0x', 'NFT address must start with "0x"'),

  tokenId: z.string().min(1, 'NFT Token ID is required').regex(/^\d+$/, 'Token ID must be a number'),

  startingBid: z
    .string()
    .min(1, 'Starting bid is required')
    .regex(/^\d+(\.\d{1,18})?$/, 'Starting bid must be a valid number in ETH'),
});
