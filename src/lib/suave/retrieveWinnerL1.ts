import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import { sealedAuction } from '@/lib/abi';

async function retrieveWinnerL1(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const winnerAddress = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'auctionWinnerL1',
  })) as string;

  return winnerAddress;
}

export default retrieveWinnerL1;
