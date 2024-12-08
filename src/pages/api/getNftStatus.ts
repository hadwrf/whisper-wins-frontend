import type { NextApiRequest, NextApiResponse } from 'next';
import getNftStatus from '@/lib/db/getNftStatus';

interface GetNftStatusParams {
  nftAddress?: string;
  tokenId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    // Destructure and cast query parameters
    const { nftAddress, tokenId }: GetNftStatusParams = req.query;

    if (!nftAddress || !tokenId) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    // Call your database function
    const nftStatus = await getNftStatus({ nftAddress, tokenId });

    res.status(200).json({ nftStatus });
  } catch (error) {
    console.error('Error retrieving NFT status:', error);
    res.status(500).json({ error: 'Failed to retrieve NFT status' });
  }
}
