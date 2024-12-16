import Image from 'next/image';

export const NoDataFoundNft = () => {
  return (
    <div className='mx-auto max-w-5xl p-20'>
      <div className='m-auto grid grid-cols-1 place-items-center justify-center space-y-20'>
        <Image
          src='/searching.svg'
          alt='No data found'
          width={500}
          height={500}
        />
        <p className='mt-3 text-xl text-muted-foreground'>{`Your MetaMask wallet doesn't contain any NFTs. 🐾👀️`}</p>
      </div>
    </div>
  );
};
