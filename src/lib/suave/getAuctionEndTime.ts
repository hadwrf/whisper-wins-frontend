import { sealedAuction } from '@/lib/abi';
import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';

async function getAuctionEndTime(contractAddress: string): Promise<Date> {
  const { abi } = sealedAuction;

  const unixTime = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'auctionEndTime',
  })) as bigint;

  // Convert BigInt to Number for compatibility with Date
  const timestamp = Number(unixTime);

  // Create a JavaScript Date object
  return new Date(timestamp * 1000);
}

export default getAuctionEndTime;
