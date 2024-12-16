import { Hex, createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { erc721Abi } from '@/lib/abi';
import { BrowserProvider } from 'ethers';

async function transferNftToAddress(nftContractAddress: string, tokenId: string | number): Promise<Hex> {
  const RECIPIENT_ADDRESS = '0xA1050B14e8d8E821f4b0f792084f6098b82EBdBB';

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
    args: [signer.address as Hex, RECIPIENT_ADDRESS, tokenId],
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
