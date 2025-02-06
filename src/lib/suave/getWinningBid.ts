import { Address } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import { sealedAuction } from '@/lib/abi';
import { ethers } from 'ethers';

async function getWinningBid(contractAddress: string): Promise<string> {
  const { abi } = sealedAuction;

  const wei = (await getPublicClient().readContract({
    address: contractAddress as Address,
    abi: abi,
    functionName: 'winningBid',
  })) as bigint;

  const ether = ethers.formatUnits(wei, 'ether');
  console.log('Winning bid for ', contractAddress, ': ', ether);
  return ether;
}

export default getWinningBid;
