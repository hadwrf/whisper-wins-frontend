import { sealedAuction } from '@/lib/abi';
import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';

async function getWinnerL1(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  return (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'auctionWinnerL1',
  })) as string;
}

export default getWinnerL1;
