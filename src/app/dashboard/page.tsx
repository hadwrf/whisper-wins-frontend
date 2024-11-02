import { BidCards } from '@/components/BidCards';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';

const Page = () => {
  return (
    <>
      <Hero />
      <div className='mx-auto max-w-5xl'>
        <SearchBar />
        <BidCards />
      </div>
    </>
  );
};

export default Page;
