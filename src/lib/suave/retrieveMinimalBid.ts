import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import sealedAuction from '@/lib/abi/SealedAuctionv2.json';
import { ethers } from 'ethers';

async function retrieveMinimalBid(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const wei = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'minimalBid',
  })) as bigint;

  return ethers.formatUnits(wei, 'ether');
}

export default retrieveMinimalBid;
