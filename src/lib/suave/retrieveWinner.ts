import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import sealedAuction from '@/lib/abi/SealedAuctionv2.json';

async function retrieveWinner(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const winnerAddress = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'winner',
  })) as string;

  return winnerAddress;
}

export default retrieveWinner;
