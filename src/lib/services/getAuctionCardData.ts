import { Auction } from '@prisma/client';
import { Nft, getNft } from './getUserNfts';
import retrieveMinimalBid from '@/lib/suave/retrieveMinimalBid';

export interface AuctionCardData extends Auction {
  endsAt: Date;
  minimumBid: string;
  nft: Nft;
}

const getAuctionCardData = async (account: string): Promise<AuctionCardData[]> => {
  try {
    // Fetch auctions
    const response = await fetch(`/api/getBiddableAuctions?accountAddress=${account}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error('Failed to load auctions:', error);
      return [];
    }

    const auctions: Auction[] = await response.json();

    // Fetch minimum bid and NFT data for each auction
    const auctionCardData: AuctionCardData[] = (
      await Promise.all(
        auctions.map(async (auction) => {
          try {
            const [minimumBid, nft] = await Promise.all([
              retrieveMinimalBid(auction.contractAddress),
              getNft({ contractAddress: auction.nftAddress, tokenId: auction.tokenId }),
            ]);

            return {
              ...auction,
              endsAt: new Date(),
              minimumBid,
              nft,
            };
          } catch (error) {
            console.error(`Error processing auction ${auction.contractAddress}:`, error);
            return null; // Return null for failed processing
          }
        }),
      )
    ).filter((data): data is AuctionCardData => data !== null);

    // Filter out any failed entries (nulls)
    return auctionCardData.filter((data) => data !== null) as AuctionCardData[];
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return [];
  }
};

export default getAuctionCardData;
