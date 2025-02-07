import { sealedAuction } from '@/lib/abi';
import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';

async function getWinnerSuave(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  return (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'auctionWinnerSuave',
  })) as string;
}

export default getWinnerSuave;
