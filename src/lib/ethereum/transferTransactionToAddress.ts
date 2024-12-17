import { Hex, createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { BrowserProvider } from 'ethers';

async function transferTransactionToAddress(recipientAddress: Hex, amount: number): Promise<Hex> {
  // Convert ETH to Wei (1 ETH = 10^18 Wei)
  const ethToWei = (eth: number) => {
    return BigInt(eth * 10 ** 18);
  };

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const wallet = createWalletClient({
    transport: custom(window.ethereum),
    account: signer.address as Hex,
    chain: sepolia,
  });

  // Ensure the wallet switches to the Sepolia chain
  await wallet.switchChain({ id: sepolia.id });

  // Convert the amount to Wei
  const valueInWei = ethToWei(amount);

  // Send the transaction
  return await wallet.sendTransaction({
    to: recipientAddress, // The recipient address
    value: valueInWei, // Amount in Wei
  });
}

async function waitForTransactionTransferReceipt(transactionHash: Hex) {
  const client = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  // Wait for the transaction receipt
  const receipt = await client.waitForTransactionReceipt({ hash: transactionHash });

  // Log the transaction details after it's mined
  console.log('Transaction receipt:', receipt);
}

export { transferTransactionToAddress, waitForTransactionTransferReceipt };
