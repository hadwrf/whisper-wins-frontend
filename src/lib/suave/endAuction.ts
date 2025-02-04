import { sealedAuction } from '@/lib/abi';
import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider } from 'ethers';
import { getPublicClient, KETTLE_ADDRESS } from './client';

async function endAuction(contractAddress: string) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x201188a` }],
  });

  const { abi } = sealedAuction;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  const gasPrice = await getPublicClient().getGasPrice();

  console.log('gas price', gasPrice);

  const ccr: TransactionRequestSuave = {
    to: contractAddress as Hex,
    gasPrice: gasPrice,
    gas: BigInt(10000000),
    type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'endAuction',
    }),
    kettleAddress: KETTLE_ADDRESS,
  };
  console.log(
    'Transaction Request:',
    JSON.stringify(ccr, (key, value) => (typeof value === 'bigint' ? value.toString() : value), 2),
  );
  const ccrHash = await wallet.sendTransaction(ccr);

  // getPublicClient().simulateContract({
  //   account: signer.getAddress(),
  //   address: contractAddress as Hex,
  //   abi: abi,
  //   functionName: 'endAuction',
  // });
  console.log('ccrHash', ccrHash);
  const receipts = await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });
  console.log(receipts);

  wallet
    .sendTransaction(ccr)
    .then(async (ccrHash) => {
      const receipts = await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });
      console.log('receipt', receipts);
      console.log('endAuction executed!');
    })
    .catch((e) => {
      console.log('endAuction call error: ', e);
    });
}

export default endAuction;
