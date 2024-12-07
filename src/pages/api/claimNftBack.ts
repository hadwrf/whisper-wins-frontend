import claimNftBack from '@/lib/db/clainNftBack';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ClaimNftBackParams {
  auctionAddress: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const { auctionAddress }: ClaimNftBackParams = req.body;
    await claimNftBack({ auctionAddress });
    res.status(200).json({ message: 'Auction created successfully' });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
}
