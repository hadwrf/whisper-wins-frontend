'use client';
import AuctionsFilter, { Filters } from '@/components/AuctionsFilter';
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

  return (
    <div className='p-4'>
      <div className='mx-auto max-w-5xl'>
        <AuctionsFilter onApplyFilters={handleFilters} />
        <div className='mt-10'>
          <AuctionCards filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Explore;
