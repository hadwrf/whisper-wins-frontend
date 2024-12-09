import { Hex, createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import { erc721Abi } from '@/lib/abi';
import { BrowserProvider } from 'ethers';

const RECIPIENT_ADDRESS = '0xA1050B14e8d8E821f4b0f792084f6098b82EBdBB';

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: `0xaa36a7` }],
});

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const wallet = createWalletClient({
  transport: custom(window.ethereum),
  account: signer.address as Hex,
  chain: sepolia,
});

async function transferNftToAddress(nftContractAddress: string, tokenId: string | number) {
  try {
    const tx = await wallet.writeContract({
      address: nftContractAddress as Hex,
      abi: erc721Abi.abi,
      functionName: 'safeTransferFrom',
      args: [signer.address as Hex, RECIPIENT_ADDRESS, tokenId],
    });

    await client.waitForTransactionReceipt({ hash: tx });
    console.log(`Transaction sent: ${tx}`);
  } catch (error) {
    console.error('Error transferring NFT:', error);
  }
}

export default transferNftToAddress;
