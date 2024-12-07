'use client';

import { useSearchParams } from 'next/navigation';
import { CreateAuctionForm } from './CreateAuctionForm';

const CreateAuction = () => {
  const searchParams = useSearchParams();

  const nftAddress = searchParams?.get('nftAddress') || '';
  const tokenId = searchParams?.get('tokenId') || '';

  return (
    <div className='mx-auto mt-8 max-w-2xl'>
      <CreateAuctionForm
        nftAddress={nftAddress}
        tokenId={tokenId}
      />
    </div>
  );
};

export default CreateAuction;
