import Link from 'next/link';
import { Button } from './ui/button';

export const SellYourNfts = () => {
  return (
    <section className='bg-gradient-to-r from-gray-100 to-gray-300 py-12 shadow-inner'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='mb-4 text-3xl font-bold text-gray-800'>Sell your NFTs here!</h2>
        <p className='mb-8 text-xl text-gray-600'>
          Join our marketplace and turn your digital creations into valuable assets.
        </p>
        <Link
          href='/dashboard/my-nfts'
          passHref
        >
          <Button
            size='lg'
            className='bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-800'
          >
            Start Selling
          </Button>
        </Link>
      </div>
    </section>
  );
};
