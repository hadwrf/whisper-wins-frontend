import { sealedAuction } from '@/lib/abi';
import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider } from 'ethers';
import { KETTLE_ADDRESS } from './client';

async function moveNFTDebug(contractAddress: string, to: string) {
  const { abi } = sealedAuction;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  const ccr: TransactionRequestSuave = {
    to: contractAddress as Hex,
    gasPrice: BigInt(10000000000),
    gas: BigInt(10000000),
    // type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'moveNFTDebug',
      args: [to],
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccrHash', ccrHash);
}

export default moveNFTDebug;
