import Image from 'next/image';

export const NoDataFoundExplore = () => {
  return (
    <div className='mx-auto max-w-5xl p-12'>
      <div className='m-auto grid grid-cols-1 place-items-center justify-center space-y-10'>
        <Image
          src='/searching.svg'
          alt='No data found'
          width={400}
          height={400}
        />
        <p className='mt-3 text-lg text-muted-foreground'>
          We couldn&#39;t find anything, you can search with different filters!
        </p>
      </div>
    </div>
  );
};
