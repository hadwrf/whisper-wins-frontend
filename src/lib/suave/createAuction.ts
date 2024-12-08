import { BrowserProvider } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { http, type Hex, Address, createPublicClient, custom } from '@flashbots/suave-viem';
import sealedAuction from '@/lib/abi/SealedAuctionv2.json';

async function createAuction(nftContractAddress: string, tokenId: string) {
  const SUAVE = 'https://rpc.toliman.suave.flashbots.net';

  const { abi, bytecode } = sealedAuction;
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

  const publicClient = createPublicClient({
    chain: {
      ...suaveChain,
      networkName: suaveChain.name,
      chainId: suaveChain.id,
      currencySymbol: suaveChain.nativeCurrency.symbol,
    },
    transport: http(SUAVE),
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: hash });
  console.log(receipt);
  const contractAddress = receipt.contractAddress;
  console.log('Contract deployed at:', contractAddress);
  return contractAddress;
}

export default createAuction;
