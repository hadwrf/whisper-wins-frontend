import { BrowserProvider } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { type Hex, Address, custom } from '@flashbots/suave-viem';
import { AuctionFormData } from '@/components/forms/CreateAuctionForm';
import { getPublicClient } from './client';
import { sealedAuction } from '@/lib/abi';

async function createAuction(auctionFormData: AuctionFormData) {
  const { abi, bytecode } = sealedAuction;
  const { nftAddress, tokenId, startingBid, endTime } = auctionFormData;

  console.log('Auction form data', auctionFormData);

  const bidInWei = BigInt(startingBid * 10 ** 18);

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  await wallet.switchChain({ id: suaveChain.id });

  // Convert JS Date object to Unix timestamp (seconds)
  const auctionEndTimeUnixTimestamp = Math.floor(endTime.getTime() / 1000);

  const hash = await wallet.deployContract({
    abi,
    account: signer.address as Address,
    bytecode: bytecode.object as Hex,
    // 2 february
    args: [nftAddress, BigInt(tokenId), BigInt(auctionEndTimeUnixTimestamp), bidInWei],
  });
  console.log('deployContract tx hash:', hash);

  const receipt = await getPublicClient().waitForTransactionReceipt({ hash: hash });
  console.log('transaction receipt:', receipt);
  const contractAddress = receipt.contractAddress;
  console.log('Contract deployed at:', contractAddress);
  return contractAddress;
}

export default createAuction;
