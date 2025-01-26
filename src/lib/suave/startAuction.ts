import { BrowserProvider, ethers } from 'ethers';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { http, type Hex, Address, createPublicClient, encodeFunctionData, custom } from '@flashbots/suave-viem';
import { sealedAuction } from '@/lib/abi';
import { KETTLE_ADDRESS, SUAVE } from './client';

async function startAuction(contractAddress: string) {
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
      functionName: 'startAuctionTest',
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  console.log('auction contract address: ', contractAddress);
  console.log('before send start auction transaction');
  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccrhash', ccrHash);
  const receipts = await publicClient.waitForTransactionReceipt({ hash: ccrHash });
  console.log(receipts);

  const eventAbi = [
    'event AuctionOpened(address contractAddr, address nftContractAddress, uint256 nftTokenId, uint256 endTimestamp, uint256 minimalBiddingAmount)',
  ];

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
      const { contractAddr, nftContractAddress, nftTokenId, endTimestamp, minimalBiddingAmount } = decoded.args;
      console.log('contractAddr:', contractAddr);
      console.log('nftContractAddress:', nftContractAddress);
      console.log('nftTokenId:', nftTokenId);
      console.log('endTimestamp:', endTimestamp);
      console.log('minimalBiddingAmount:', minimalBiddingAmount);
    } else {
      console.error('decoded logs are null');
    }
  });

  return decodedLogs[0]?.args.minimalBiddingAmount;
}

export default startAuction;
