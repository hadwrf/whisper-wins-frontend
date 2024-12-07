import { BrowserProvider, ethers } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { http, type Hex, Address, createPublicClient, encodeFunctionData, custom } from '@flashbots/suave-viem';
import sealedAuction from '@/lib/abi/SealedAuction.json';

async function retrieveBiddingAddress(contractAddress: string) {
  const SUAVE = 'https://rpc.toliman.suave.flashbots.net';
  const KETTLE_ADDRESS = '0xf579de142d98f8379c54105ac944fe133b7a17fe';

  const { abi } = sealedAuction;
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
      functionName: 'getBiddingAddress',
    }),
    confidentialInputs: '0x',
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccrhash', ccrHash);
  const receipts = await publicClient.waitForTransactionReceipt({ hash: ccrHash });
  console.log(receipts);

  const eventAbi = ['event BiddingAddress(address owner, string encodedL1Address)'];

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
    const { owner, encodedL1Address } = decoded.args;
    console.log('Owner:', owner);
    console.log('Encoded L1 Address:', encodedL1Address);
  });

  return decodedLogs[0].args.encodedL1Address;
}

export default retrieveBiddingAddress;
