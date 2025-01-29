import { Nft } from '@/lib/services/getUserNfts';
import { SellCard } from './SellCard';

interface Props {
  nfts: Nft[];
}

export const SellCards = ({ nfts }: Props) => {
  return (
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {nfts.map((nft, i) => (
        <div key={i}>
          <SellCard nft={nft} />
        </div>
      ))}
    </div>
  );
};
