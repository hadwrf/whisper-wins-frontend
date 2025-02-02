import { Hex, createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { erc721Abi } from '@/lib/abi';
import { BrowserProvider } from 'ethers';

async function transferNftToAddress(
  nftContractAddress: string,
  tokenId: string | number,
  recipient: string,
): Promise<Hex> {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = createWalletClient({
    transport: custom(window.ethereum),
    account: signer.address as Hex,
    chain: sepolia,
  });

  await wallet.switchChain({ id: sepolia.id });

  return await wallet.writeContract({
    address: nftContractAddress as Hex,
    abi: erc721Abi.abi,
    functionName: 'safeTransferFrom',
    args: [signer.address as Hex, recipient, tokenId],
  });
}

async function waitForNftTransferReceipt(transactionHash: Hex) {
  const client = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  await client.waitForTransactionReceipt({ hash: transactionHash });
  console.log(`Transaction sent: ${transactionHash}`);
}

export { transferNftToAddress, waitForNftTransferReceipt };
