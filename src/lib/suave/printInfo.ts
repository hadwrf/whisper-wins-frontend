import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { sealedAuction } from '@/lib/abi';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider, ethers, LogDescription } from 'ethers';
import { getPublicClient, KETTLE_ADDRESS } from './client';

export async function printInfo(contractAddress: string) {
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
      functionName: 'printInfo',
    }),
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  const receipts = await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });

  const eventAbi = [
    '    event AuctionInfo(\n' +
      '        address auctioneerSUAVE,\n' +
      '        address nftHoldingAddress,\n' +
      '        address nftContract,\n' +
      '        uint256 tokenId,\n' +
      '        uint256 auctionEndTime,\n' +
      '        uint256 minimalBid,\n' +
      '        bool auctionHasStarted,\n' +
      '        address auctionWinnerL1,\n' +
      '        address auctionWinnerSuave,\n' +
      '        uint256 winningBid,\n' +
      '        address[] revealedL1Addresses\n' +
      '    )',
  ];

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

  decodedLogs.forEach((decoded: LogDescription | null) => {
    if (decoded !== null) {
      const {
        auctioneerSUAVE,
        nftHoldingAddress,
        nftContract,
        tokenId,
        auctionEndTime,
        minimalBid,
        auctionHasStarted,
        auctionWinnerL1,
        auctionWinnerSuave,
        winningBid,
        revealedL1Addresses,
      } = decoded.args;
      console.log('auctioneerSUAVE', auctioneerSUAVE);
      console.log('nftHoldingAddress', nftHoldingAddress);
      console.log('nftContract', nftContract);
      console.log('tokenId', tokenId);
      console.log('auctionEndTime', auctionEndTime);
      console.log('minimalBid', minimalBid);
      console.log('auctionHasStarted', auctionHasStarted);
      console.log('auctionWinnerL1', auctionWinnerL1);
      console.log('auctionWinnerSuave', auctionWinnerSuave);
      console.log('winningBid', winningBid);
      console.log('revealedL1Addresses', revealedL1Addresses);
    }
  });
}
