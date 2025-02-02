import { sealedAuction } from '@/lib/abi';
import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';

async function readNftHoldingAddress(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const address = await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'nftHoldingAddress',
  });

  return address as string;
}

export default readNftHoldingAddress;
