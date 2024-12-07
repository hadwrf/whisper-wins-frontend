import type { NextApiRequest, NextApiResponse } from 'next';
import transferNftToContract from '@/lib/db/transferNftToContract';

interface TransferNftToContractParams {
  auctionAddress: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const { auctionAddress }: TransferNftToContractParams = req.body;
    await transferNftToContract({ auctionAddress });
    res.status(200).json({ message: 'Auction status changed to IN_PROGRESS successfully' });
  } catch (error) {
    console.error('Error changing auction status to IN_PROGRESS:', error);
    res.status(500).json({ error: 'Failed to change auction status to IN_PROGRESS' });
  }
}
