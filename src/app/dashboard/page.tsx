import { AuctionCards } from '@/components/cards/AuctionCards';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';

const Page = () => {
  return (
    <div className='p-4'>
      <Hero />
      <div className='mx-auto max-w-5xl'>
        <SearchBar />
        <AuctionCards />
      </div>
    </div>
  );
};

export default Page;
