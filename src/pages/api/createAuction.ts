import type { NextApiRequest, NextApiResponse } from 'next';
import createAuction from '@/lib/db/createAuction';

interface CreateAuctionParams {
  auctionAddress: string;
  ownerAddress: string;
  nftAddress: string;
  tokenId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const { auctionAddress, ownerAddress, nftAddress, tokenId }: CreateAuctionParams = req.body;
    await createAuction({ auctionAddress, ownerAddress, nftAddress, tokenId });
    res.status(200).json({ message: 'Auction created successfully' });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
}
