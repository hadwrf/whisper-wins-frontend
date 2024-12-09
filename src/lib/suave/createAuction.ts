import { BrowserProvider } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { type Hex, Address, custom } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import sealedAuction from '@/lib/abi/SealedAuctionv2.json';

async function createAuction(nftContractAddress: string, tokenId: string) {
  const { abi, bytecode } = sealedAuction;

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x201188a` }],
  });

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  const hash = await wallet.deployContract({
    abi,
    account: signer.address as Address,
    bytecode: bytecode.object as Hex,
    args: [signer.address as Hex, nftContractAddress, BigInt(1), BigInt(tokenId), BigInt(1000000000)],
  });
  console.log(hash);

  const receipt = await getPublicClient().waitForTransactionReceipt({ hash: hash });
  console.log(receipt);
  const contractAddress = receipt.contractAddress;
  console.log('Contract deployed at:', contractAddress);
  return contractAddress;
}

export default createAuction;
