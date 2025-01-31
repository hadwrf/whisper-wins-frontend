import { sealedAuction } from '@/lib/abi';
import { aesDecrypt } from '@/lib/crypto/aesDecrypt';
import { Address, custom, encodeFunctionData, type Hex } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { randomBytes } from 'crypto';
import { BrowserProvider, ethers, LogDescription } from 'ethers';
import { getPublicClient, KETTLE_ADDRESS } from './client';

async function retrieveBiddingAddress(contractAddress: string) {
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

  const secretKey = ('0x' + randomBytes(32).toString('hex')) as `0x${string}`; // Generate a 32-byte key

  console.log('secretKey: ', secretKey);
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
    confidentialInputs: secretKey, // Provide the 32-byte AES key
    kettleAddress: KETTLE_ADDRESS,
  };

  const ccrHash = await wallet.sendTransaction(ccr);
  console.log('ccr tx hash:', ccrHash);
  const receipts = await getPublicClient().waitForTransactionReceipt({ hash: ccrHash });
  console.log('receipts', receipts);

  const eventAbi = ['event EncBiddingAddress(address owner, bytes encodedL1Address)'];

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
      const { owner, encodedL1Address } = decoded.args;
      console.log('Owner:', owner);
      console.log('Encoded L1 Address:', encodedL1Address);

      console.log('decodeSecretKey', secretKey.replace(/^0x/, ''));
      const keyBuffer = Buffer.from(secretKey.replace(/^0x/, ''), 'hex');
      console.log('Key Length:', keyBuffer.length); // Should print 32

      try {
        const decryptedAddress = aesDecrypt(keyBuffer, encodedL1Address);
        console.log('Decrypted L1 Address:', decryptedAddress);
      } catch (e) {
        console.log('ex', e);
      }
    }
  });

  const biddingAddress = decodedLogs[0]?.args.encodedL1Address;
  if (!biddingAddress) {
    throw new Error("bidding address couldn't retrieved.");
  }
  return biddingAddress;
}

export default retrieveBiddingAddress;
