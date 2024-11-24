import Image from 'next/image';

export const LoginToContinue = () => {
  return (
    <div className='mx-auto max-w-5xl p-20'>
      <div className='m-auto grid grid-cols-1 place-items-center justify-center space-y-20'>
        <Image
          src='/login.svg'
          alt='Login to continue'
          width={700}
          height={700}
        />
        <p className='mt-3 text-xl text-muted-foreground'>Please connect your wallet to continue</p>
      </div>
    </div>
  );
};
