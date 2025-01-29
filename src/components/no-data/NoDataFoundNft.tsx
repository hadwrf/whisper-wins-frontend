import Image from 'next/image';

export const NoDataFoundNft = () => {
  return (
    <div className='mx-auto max-w-5xl p-10'>
      <div className='m-auto grid grid-cols-1 place-items-center justify-center space-y-20'>
        <Image
          src='/searching.svg'
          alt='No data found'
          width={500}
          height={500}
        />
        <p className='mt-3 text-xl text-muted-foreground'>{`We couldn't find any mathcing NFT. 🐾👀️`}</p>
      </div>
    </div>
  );
};
