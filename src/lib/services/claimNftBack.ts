import { BrowserProvider, ethers } from 'ethers';

// Define the ABI (replace with your actual auction contract's ABI)
import basicAuctionContractArtifact from '@/lib/abi/BasicAuctionContract.json';

/**
 * Ends an auction in the auction contract.
 *
 * @param auctionAddress - The address of the auction contract.
 * @returns The transaction hash of the end auction transaction.
 */
async function claimNftBack(auctionAddress: string): Promise<string> {
  // Validate input
  if (!ethers.isAddress(auctionAddress)) {
    throw new Error('Invalid auction contract address');
  }

  // Create a provider and signer
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Create an instance of the auction contract
  const { abi } = basicAuctionContractArtifact;
  const auctionContract = new ethers.Contract(auctionAddress, abi, signer);

  // Call the endAuction function on the auction contract
  const transaction = await auctionContract.endAuction();
  const receipt = await transaction.wait();

  console.log('Auction ended successfully. Transaction hash:', receipt.transactionHash);

  return receipt.transactionHash;
}

export default claimNftBack;
