import { AuctionCards } from '@/components/cards/AuctionCards';
import { Hero } from '@/components/Hero';
import { SellYourNfts } from '@/components/SellYourNfts';

const Page = () => {
  return (
    <div className='p-4'>
      <Hero />
      <div className={'mb-8'}>
        <SellYourNfts />
      </div>
      <div className='mx-auto max-w-5xl'>
        {/*<SearchBar />*/}
        <AuctionCards />
      </div>
    </div>
  );
};

export default Page;
