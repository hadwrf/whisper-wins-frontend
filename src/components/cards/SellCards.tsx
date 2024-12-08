import { Nft } from '@/lib/services/getUserNfts';
import { SellCard } from './SellCard';
import { SearchBar } from '@/components/SearchBar';

interface Props {
  nfts: Nft[];
}

export const SellCards = ({ nfts }: Props) => {
  return (
    <div>
      <h1>Your NFTs</h1>
      <SearchBar />
      <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
        {nfts.map((nft, i) => (
          <div key={i}>
            <SellCard nft={nft} />
          </div>
        ))}
      </div>
    </div>
  );
};
