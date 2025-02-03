'use client';
import { AuctionCards } from '@/components/cards/AuctionCards';
import AuctionsFilter, { Filters } from '@/components/filter/ExploreFilter';
import { Button } from '@/components/ui/button';
import deployOracle from '@/lib/suave/deployOracle';
// import registerApiKeyOffchain from '@/lib/suave/registerApiKeyOffchain';
import { useState } from 'react';
import registerApiKeyOffchainEtherscan from '@/lib/suave/registerApiKeyOffchainEtherscan';

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
  const handleDeployOracle = () => {
    deployOracle()
      .then(async (oracleAddress) => {
        console.log('Oracle deployed at:', oracleAddress);
        console.log('Change the static oracle address at: src/lib/suave/createAuction.ts');
      })
      .catch((e) => {
        console.log('createAuction error:', e);
      });
  };

  // Handle deploy oracle
  const register = () => {
    registerApiKeyOffchainEtherscan()
      .then(async () => {
        console.log('registered');
      })
      .catch((e) => {
        console.log('fail', e);
      });
  };

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <AuctionsFilter onApplyFilters={handleFilters} />
        <div className='mt-10'>
          <Button
            size='lg'
            className='bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-800'
            onClick={() => handleDeployOracle()}
          >
            Deploy Oracle
          </Button>
          <Button
            size='lg'
            className='bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-800'
            onClick={() => register()}
          >
            register Oracle
          </Button>
          <AuctionCards filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Explore;
