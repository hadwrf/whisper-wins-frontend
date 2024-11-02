import { BidCards } from '@/components/BidCards';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';

const Page = () => {
  return (
    <div className='p-4'>
      <Hero />
      <div className='mx-auto max-w-5xl'>
        <SearchBar />
        <BidCards />
      </div>
    </div>
  );
};

export default Page;
