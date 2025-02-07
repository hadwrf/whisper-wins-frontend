import getAuctionEndTime from '@/lib/suave/getAuctionEndTime';
import getMinimalBid from '@/lib/suave/getMinimalBid';
import { Auction } from '@prisma/client';
import getWinnerSuave from '@/lib/suave/getWinnerSuave';
import { getNft, Nft } from './getUserNfts';

export interface AuctionCardData extends Auction {
  endsAt: Date;
  minimalBid: string;
  nft: Nft;
}

export const getAuctionCardData = async (account: string | null): Promise<AuctionCardData[]> => {
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

    console.log('biddable auctions', auctions);

    // Fetch minimum bid and NFT data for each auction
    const auctionCardData: AuctionCardData[] = (
      await Promise.all(
        auctions.map(async (auction) => {
          try {
            const [minimalBid, endTime, nft] = await Promise.all([
              getMinimalBid(auction.contractAddress),
              getAuctionEndTime(auction.contractAddress),
              getNft({ contractAddress: auction.nftAddress, tokenId: auction.tokenId }),
            ]);

            return {
              ...auction,
              endsAt: endTime,
              minimalBid,
              nft,
            };
          } catch (error) {
            console.error(`Error processing auction ${auction.contractAddress}:`, error);
            return null; // Return null for failed processing
          }
        }),
      )
    ).filter((data): data is AuctionCardData => data !== null);

    console.log('auction card data', auctionCardData);
    // Filter out any failed entries (nulls)
    return auctionCardData.filter((data) => data !== null) as AuctionCardData[];
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return [];
  }
};

export const getMyAuctionCardData = async (account: string): Promise<AuctionCardData[]> => {
  try {
    // Fetch auctions
    const response = await fetch(`/api/auctions/${account}`, {
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
            const [minimalBid, endTime, nft, winnerAddress] = await Promise.all([
              getMinimalBid(auction.contractAddress),
              getAuctionEndTime(auction.contractAddress),
              getNft({ contractAddress: auction.nftAddress, tokenId: auction.tokenId }),
              getWinnerSuave(auction.contractAddress),
            ]);

            console.log('winnerAddressSuave', winnerAddress);
            return {
              ...auction,
              endsAt: endTime,
              minimalBid,
              nft,
            };
          } catch (error) {
            console.error(`Error processing auction ${auction.contractAddress}:`, error);
            return null; // Return null for failed processing
          }
        }),
      )
    ).filter((data): data is AuctionCardData => data !== null);

    console.log('auctionCardData', auctionCardData);
    // Filter out any failed entries (nulls)
    return auctionCardData.filter((data) => data !== null) as AuctionCardData[];
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return [];
  }
};
