import { BrowserProvider, ContractFactory, ethers } from 'ethers';

// Define the ABI and bytecode types (replace with your actual contract's ABI and bytecode)
import basicAuctionContractArtifact from '@/lib/abi/BasicAuctionContract.json';

/**
 * Deploys an auction contract.
 *
 * @param seller - The address of the seller.
 * @param nftAddress - The address of the NFT contract.
 * @param tokenId - The ID of the NFT being auctioned.
 * @param startingBid - The starting bid for the auction (in ether).
 * @returns The address of the deployed auction contract.
 */
async function deployAuction(
  seller: string,
  nftAddress: string,
  tokenId: number,
  startingBid: string,
): Promise<string> {
  if (!ethers.isAddress(seller)) {
    throw new Error('Invalid seller address');
  }
  if (!ethers.isAddress(nftAddress)) {
    throw new Error('Invalid NFT address');
  }
  if (!tokenId || isNaN(tokenId)) {
    throw new Error('Invalid tokenId');
  }
  if (isNaN(parseFloat(startingBid)) || parseFloat(startingBid) <= 0) {
    throw new Error('Invalid starting bid');
  }

  // Create a provider and signer
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Extract ABI and bytecode from the artifact
  const { abi, bytecode } = basicAuctionContractArtifact;

  // Create a contract factory
  const AuctionFactory = new ContractFactory(abi, bytecode, signer);

  // Deploy the contract
  const auction = await AuctionFactory.deploy(seller, nftAddress, tokenId, ethers.parseEther(startingBid));
  await auction.waitForDeployment();

  console.log('Auction deployed to:', auction.target);

  return auction.target as string;
}

export default deployAuction;
