'use client';
import AuctionsFilter, { Filters } from '@/components/filter/ExploreFilter';
import { AuctionCards } from '@/components/cards/AuctionCards';
import { useState } from 'react';

const Explore = () => {
  const [filters, setFilters] = useState({
    name: '',
    createdFrom: '',
    createdTo: '',
    endsFrom: '',
    endsTo: '',
    minPriceFrom: '',
    minPriceTo: '',
    sort: '',
  });

  // Handle filter changes
  const handleFilters = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
  };

  // Handle deploy oracle
  // const handleDeployOracle = () => {
  //   deployOracle()
  //     .then(async (oracleAddress) => {
  //       console.log('Oracle deployed at:', oracleAddress);
  //     })
  //     .catch((e) => {
  //       console.log('createAuction error:', e);
  //     });
  // };

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <AuctionsFilter onApplyFilters={handleFilters} />
        <div className='mt-10'>
          {/*<Button*/}
          {/*  size='lg'*/}
          {/*  className='bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-800'*/}
          {/*  onClick={() => handleDeployOracle()}*/}
          {/*>*/}
          {/*  Deploy Oracle*/}
          {/*</Button>*/}
          <AuctionCards filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Explore;
