import { BrowserProvider } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { type Hex, Address, custom } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import { sealedAuction } from '@/lib/abi';

const ORACLE_ADDRESS: Address = '0x9a8c1daa0e28e13ae6f754359082e370fdb7de18';

async function createAuction(nftContractAddress: string, tokenId: string, biddingPrice: number) {
  const { abi, bytecode } = sealedAuction;

  const bidInWei = BigInt(biddingPrice * 10 ** 18);

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  await wallet.switchChain({ id: suaveChain.id });

  // TODO CHECK THE DIFFERENCES BETWEEN V2 AND V4
  const hash = await wallet.deployContract({
    abi,
    account: signer.address as Address,
    bytecode: bytecode.object as Hex,
    // 2 february
    args: [nftContractAddress, BigInt(tokenId), BigInt('1738514897'), bidInWei, ORACLE_ADDRESS],
  });
  console.log('deployContract tx hash:', hash);

  const receipt = await getPublicClient().waitForTransactionReceipt({ hash: hash });
  console.log('transaction receipt:', receipt);
  const contractAddress = receipt.contractAddress;
  console.log('Contract deployed at:', contractAddress);
  return contractAddress;
}

export default createAuction;
