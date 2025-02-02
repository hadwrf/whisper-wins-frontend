import { oracle } from '@/lib/abi';
import { Address, custom, encodeFunctionData } from '@flashbots/suave-viem';
import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { getSuaveWallet, SuaveTxRequestTypes, type TransactionRequestSuave } from '@flashbots/suave-viem/chains/utils';
import { BrowserProvider } from 'ethers';
import { Hex } from 'viem';
import { KETTLE_ADDRESS } from './client';

const ORACLE_ADDRESS: Address = '0x3475084e107e9c2954a2451a1350b861ffc0de04';

async function registerApiKeyOffchainEtherscan() {
  const { abi } = oracle;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = getSuaveWallet({
    transport: custom(window.ethereum),
    jsonRpcAccount: signer.address as Address,
    chain: suaveChain,
  });

  const encodedData = `0x${Buffer.from('ZW4YHTVP7VR6KPS5GW4A17YCT76US41PDH', 'utf-8').toString('hex')}`;

  // send a confidential compute request
  const ccr: TransactionRequestSuave = {
    to: ORACLE_ADDRESS,
    gasPrice: BigInt(10000000000),
    gas: BigInt(10000000),
    type: SuaveTxRequestTypes.ConfidentialRequest,
    data: encodeFunctionData({
      abi: abi,
      functionName: 'registerApiKeyOffchain',
      args: ['etherscan'],
    }),
    confidentialInputs: encodedData as Hex,
    kettleAddress: KETTLE_ADDRESS,
  };

  await wallet.sendTransaction(ccr);
}

export default registerApiKeyOffchainEtherscan;
