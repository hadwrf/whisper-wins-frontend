import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import sealedAuction from '@/lib/abi/SealedAuctionv2.json';

async function retrieveContractEndDate(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const response = await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'nftContract',
  });

  return response as string;
}

export default retrieveContractEndDate;
