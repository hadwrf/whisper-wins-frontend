import { BrowserProvider } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { type Hex, Address, custom } from '@flashbots/suave-viem';
import { getPublicClient } from './client';
import { oracle } from '@/lib/abi';

async function deployOracle() {
  const { abi, bytecode } = oracle;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  await wallet.switchChain({ id: suaveChain.id });

  // @param chainID: The ID of the L1 chain (e.g. Sepolia: 11155111; Our local test chain: 1234321)
  const hash = await wallet.deployContract({
    abi,
    account: signer.address as Address,
    bytecode: bytecode.object as Hex,
    args: [11155111],
  });
  console.log('deployOracle tx hash:', hash);

  const receipt = await getPublicClient().waitForTransactionReceipt({ hash: hash });
  console.log('transaction receipt:', receipt);
  const contractAddress = receipt.contractAddress;
  console.log('Oracle contract deployed at:', contractAddress);
  return contractAddress;
}

export default deployOracle;
