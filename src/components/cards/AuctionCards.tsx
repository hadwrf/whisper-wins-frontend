import { getAllAuctions } from '@/lib/db/getAuctions';
import { AuctionCard } from './AuctionCard';

export const AuctionCards = async () => {
  const auctions = await getAllAuctions();

  return (
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {auctions.map((auction) => (
        <div key={auction.tokenId}>
          <AuctionCard />
        </div>
      ))}
    </div>
  );
};
