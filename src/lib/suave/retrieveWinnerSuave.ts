import { Address } from '@flashbots/suave-viem';
import { sealedAuction } from '@/lib/abi';
import { getPublicClient } from './client';

async function retrieveWinnerSuave(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const winnerAddress = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'auctionWinnerSuave',
  })) as string;

  return winnerAddress;
}

export default retrieveWinnerSuave;
