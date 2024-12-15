import { Hex, createPublicClient, formatUnits, http } from 'viem';
import { sepolia } from 'viem/chains';

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

async function fetchBalance({ walletAddress }: { walletAddress: Hex }) {
  try {
    const balance = await client.getBalance({
      address: walletAddress,
    });
    const balanceInEther = formatUnits(balance, 18);
    console.log(`Balance: ${balanceInEther} ETH`);
    return balanceInEther;
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

export default fetchBalance;
