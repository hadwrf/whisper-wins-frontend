import { Hex, createPublicClient, formatUnits, http } from 'viem';
import { sepolia } from 'viem/chains';

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

async function fetchBalance({ walletAddress }: { walletAddress: Hex }): Promise<number> {
  try {
    const balance = await client.getBalance({
      address: walletAddress,
    });
    const balanceInEther = Number(formatUnits(balance, 18));
    console.log(`Balance: ${balanceInEther} ETH`);
    return balanceInEther;
  } catch (error) {
    console.log('Error fetchBalance', error);
    throw new Error('Error fetching balance!');
  }
}

export default fetchBalance;
