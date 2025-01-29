import Image from 'next/image';

export const NoDataFoundBids = () => {
  return (
    <div className='mx-auto max-w-5xl pt-20'>
      <div className='m-auto grid grid-cols-1 place-items-center justify-center space-y-20'>
        <Image
          src='/searching.svg'
          alt='No data found'
          width={450}
          height={450}
        />
        <p className='mt-3 text-xl text-muted-foreground'>
          We couldn&#39;t find anything, visit Explore page and bid to some auctions! 🛎️
        </p>
      </div>
    </div>
  );
};
