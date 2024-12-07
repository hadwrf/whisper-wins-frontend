import { BrowserProvider, Contract, ethers } from 'ethers';
import minimalERC721Abi from '@/lib/abi/MinimalERC721Abi.json';

// Define the ABI (replace with your actual auction contract's ABI)
import basicAuctionContractArtifact from '@/lib/abi/BasicAuctionContract.json';

/**
 * Deposits an NFT into the auction contract.
 *
 * @param auctionAddress - The address of the auction contract.
 * @param nftAddress - The address of the NFT contract.
 * @param tokenId - The ID of the NFT being deposited.
 * @returns The transaction hash of the deposit transaction.
 */
async function transferNftToContract(auctionAddress: string, nftAddress: string, tokenId: string): Promise<string> {
  // Validate inputs
  try {
    if (!ethers.isAddress(auctionAddress)) {
      throw new Error('Invalid auction contract address');
    }

    // Create a provider and signer
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new Contract(nftAddress, minimalERC721Abi.abi, signer);

    // await nftContract.approve(auctionAddress, tokenId);
    const owner = await nftContract.ownerOf(tokenId);
    console.log('owner', owner); // Check if it matches the seller's address
    //const approvedAddress = await nftContract.getApproved(tokenId);
    //console.log("approved address", approvedAddress); // Should be the auction contract address
    // Create an instance of the auction contract
    const { abi } = basicAuctionContractArtifact;
    const auctionContract = new Contract(auctionAddress, abi, signer);
    console.log('Contract available functions:', auctionContract.functions);
    if (auctionContract.callStatic) {
      console.log('callStatic is available on the contract instance.');
    } else {
      console.error('callStatic is undefined.');
    }
    const approvedAddress = await nftContract.getApproved(tokenId);
    console.log('Approved address:', approvedAddress);
    if (approvedAddress !== auctionAddress) {
      console.error('Auction contract is not approved to transfer this NFT.');
      const tx = await nftContract.approve(auctionContract, tokenId);
      await tx.wait();
      console.log('Approval granted to auction contract.');
    }
    const approvedAddress2 = await nftContract.getApproved(tokenId);
    console.log('Approved address:', approvedAddress2);
    const seller = await auctionContract.seller();
    console.log('seller', seller);
    const nftAddresss = await auctionContract.nftAddress();
    console.log('nftAddresss', nftAddresss);
    const tokenIdd = await auctionContract.tokenId();
    console.log('tokenIdd', tokenIdd);
    try {
      const result = await auctionContract.depositNFT.staticCall();
      console.log('Simulation successful:', result);
    } catch (error) {
      console.error('Simulation failed:', error);
    }
    // Call the depositNFT function on the auction contract
    const transaction = await auctionContract.depositNFT();
    const receipt = await transaction.wait();

    console.log('NFT deposited successfully. Transaction hash:', receipt.transactionHash);
    return '';
    // return receipt.transactionHash;
  } catch (error) {
    console.error(error);
  }
  return '';
}

export default transferNftToContract;
