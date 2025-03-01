import { sealedAuction } from '@/lib/abi';
import { Address, createPublicClient, custom, encodeFunctionData, type Hex, http } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider, ethers } from 'ethers';
import { KETTLE_ADDRESS, SUAVE } from './client';

async function getNftHoldingAddressPrivateKey(contractAddress: string) {
  const { abi } = sealedAuction;

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

  const publicClient = createPublicClient({
    chain: {
      ...suaveChain,
      networkName: suaveChain.name,
      chainId: suaveChain.id,
      currencySymbol: suaveChain.nativeCurrency.symbol,
    },
    transport: http(SUAVE),
  });

  const ccr: TransactionRequestSuave = {
    to: contractAddress as Hex,
    gasPrice: BigInt(10000000000),
    gas: BigInt(10000000),
    type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'getNftHoldingAddressPrivateKey',
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  console.log('auction contract address: ', contractAddress);
  console.log('before send start auction transaction');
  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccrhash', ccrHash);
  const receipts = await publicClient.waitForTransactionReceipt({ hash: ccrHash });
  console.log(receipts);

  const eventAbi = ['event NFTHoldingAddressPrivateKeyEvent(string privateKey)'];

  const contractInterface = new ethers.Interface(eventAbi);

  const decodedLogs = receipts.logs
    .map((log) => {
      try {
        return contractInterface.parseLog(log);
      } catch (e) {
        console.error('Failed to parse log:', e);
        return null;
      }
    })
    .filter(Boolean);

  decodedLogs.forEach((decoded) => {
    if (decoded?.args) {
      const { privateKey } = decoded.args;
      console.log('privateKey:', privateKey);
    } else {
      console.error('decoded logs are null');
    }
  });

  return decodedLogs[0]?.args.privateKey;
}

export default getNftHoldingAddressPrivateKey;
