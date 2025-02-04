import { sealedAuction } from '@/lib/abi';
import { Address, createPublicClient, custom, encodeFunctionData, type Hex, http } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider, ethers } from 'ethers';
import { KETTLE_ADDRESS, SUAVE } from './client';

async function setupAuction(contractAddress: string): Promise<boolean> {
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
      functionName: 'setUpAuction',
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  const receipts = await publicClient.waitForTransactionReceipt({ hash: ccrHash });
  console.log(receipts);

  const eventAbi = ['event NFTHoldingAddressEvent(address nftHoldingAddress)'];

  const contractInterface = new ethers.Interface(eventAbi);

  const decodedLogs = receipts.logs
    .map((log) => {
      try {
        const decoded = contractInterface.parseLog(log);
        return decoded;
      } catch (e) {
        console.error('Failed to parse log:', e);
        return null;
      }
    })
    .filter(Boolean);

  decodedLogs.forEach((decoded) => {
    if (decoded?.args) {
      const { nftHoldingAddress } = decoded.args;
      console.log('nftHoldingAddress:', nftHoldingAddress);
    } else {
      console.error('decoded logs are null');
    }
  });
  return true;
}

export default setupAuction;
