import { sealedAuction } from '@/lib/abi';
import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider } from 'ethers';
import { getPublicClient, KETTLE_ADDRESS } from './client';

async function claim(contractAddress: string) {
  const { abi } = sealedAuction;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  const gasPrice = await getPublicClient().getGasPrice();

  const returnAddressL1 = await signer.getAddress();

  const ccr: TransactionRequestSuave = {
    to: contractAddress as Hex,
    gasPrice: gasPrice,
    gas: BigInt(10000000),
    type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'claim',
      args: [returnAddressL1 as Hex],
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);

  console.log('claim ready!');

  await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });

  console.log('claim executed!');
}

export default claim;
