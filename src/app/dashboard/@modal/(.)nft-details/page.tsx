'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Nft, NftRequest, getNft } from '@/lib/services/getUserNfts';
import Image from 'next/image';

const NftDetaisModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nftContractAddress = searchParams?.get('nftContractAddress') || '';
  const nftTokenId = searchParams?.get('nftTokenId') || '';

  const [nft, setNft] = useState<Nft | null>(null);

  useEffect(() => {
    const nftRequest: NftRequest = {
      contractAddress: nftContractAddress,
      tokenId: nftTokenId,
    };

    getNft(nftRequest).then((nft: Nft) => {
      setNft(nft);
      console.log(nft);
    });
  }, []);

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <DialogContent>
        <div className='my-6 flex flex-col items-center justify-items-center'>
          {nft && (
            <div>
              <div className='flex flex-col items-center'>
                <Image
                  className='size-48 rounded-lg object-cover shadow-md'
                  src={nft.image.originalUrl}
                  alt={nft.name || 'NFT'}
                  width={500}
                  height={500}
                />
                <h2 className='mt-4 text-2xl font-semibold'>{nft.name || 'Unnamed NFT'}</h2>
                <p className='mt-2 text-sm text-gray-600'>{nft.description || 'No description provided.'}</p>
              </div>

              <div className='mt-6 min-w-[380px] '>
                <h3 className='font-medium text-gray-800'>Attributes</h3>
                <ul className='space-y-2'>
                  {nft.raw.metadata.attributes?.map((attribute, index) => (
                    <li
                      key={index}
                      className='flex justify-between border-b py-1 text-sm text-gray-600'
                    >
                      <span>{attribute.trait_type}</span>
                      <span>{attribute.value}</span>
                    </li>
                  )) || <p className='text-sm text-gray-500'>No attributes available.</p>}
                </ul>
              </div>

              <div className='mt-6'>
                <h3 className='font-medium text-gray-800'>Contract Details</h3>
                <ul className='space-y-2'>
                  <li className='flex justify-between border-b py-1 text-sm text-gray-600'>
                    <span>Address</span>
                    <a
                      href={`https://sepolia.etherscan.io/address/${nft.contract.address}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline'
                    >
                      {shortenAddress(nft.contract.address)}
                    </a>
                  </li>
                  <li className='flex justify-between border-b py-1 text-sm text-gray-600'>
                    <span>Token ID</span>
                    <a
                      href={nft.tokenUri}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline'
                    >
                      {nft.tokenId}
                    </a>
                  </li>
                  <li className='flex justify-between border-b py-1 text-sm text-gray-600'>
                    <span>Token Type</span>
                    <span>{nft.contract.tokenType}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetaisModal;
