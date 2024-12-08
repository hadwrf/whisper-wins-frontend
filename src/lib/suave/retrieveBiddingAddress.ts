import sealedAuction from '@/lib/abi/SealedAuctionv2.json';
import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider, ethers, LogDescription } from 'ethers';
import { getPublicClient, KETTLE_ADDRESS } from './client';

async function retrieveBiddingAddress(contractAddress: string) {
  const { abi } = sealedAuction;
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  // send a confidential compute request
  const ccr: TransactionRequestSuave = {
    to: contractAddress as Hex,
    gasPrice: BigInt(10000000000),
    gas: BigInt(10000000),
    type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'getBiddingAddress',
    }),
    confidentialInputs: '0x',
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccr tx hash:', ccrHash);
  const receipts = await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });
  console.log('receipts', receipts);

  const eventAbi = ['event EncBiddingAddress(address owner, string encodedL1Address)'];

  const contractInterface = new ethers.Interface(eventAbi);

  const decodedLogs = receipts.logs
    .map((log) => {
      try {
        return contractInterface.parseLog(log);
      } catch (e) {
        console.error('Failed to parsse log:', e);
        return null;
      }
    })
    .filter(Boolean);

  decodedLogs.forEach((decoded: LogDescription | null) => {
    if (decoded !== null) {
      const { owner, encodedL1Address } = decoded.args;
      console.log('Owner:', owner);
      console.log('Encoded L1 Address:', encodedL1Address);
    }
  });

  return decodedLogs[0]?.args.encodedL1Address;
}

export default retrieveBiddingAddress;
