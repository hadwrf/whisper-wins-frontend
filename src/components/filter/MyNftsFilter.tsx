'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface Filters {
  name: string;
}

interface MyNftsFilterProps {
  onApplyFilters: (filters: Filters) => void;
}

export default function MyNftsFilter({ onApplyFilters }: MyNftsFilterProps) {
  const [filters, setFilters] = useState({
    name: '',
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  const validateFilters = () => {
    const newErrors = {
      name: '',
    };

    // Name validation
    if (filters.name.length > 0 && filters.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    if (validateFilters()) {
      onApplyFilters(filters);
      console.log('Filters applied:', filters);
    } else {
      console.error('Validation errors:', errors);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      name: '',
    };

    setFilters(resetFilters);
    setErrors({
      name: '',
    });

    // Pass reset filters directly to the parent function
    onApplyFilters(resetFilters);
  };

  return (
    <div className='mx-auto rounded-lg text-sm mt-6'>
      {/* First Row: Name & Price Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* Name Filter */}
        <div className='flex flex-col lg:col-span-2'>
          <label className='text-sm font-medium text-gray-700'>NFT Name</label>
          <input
            type='text'
            name='name'
            value={filters.name}
            onChange={handleChange}
            placeholder='Search by name'
            className='mt-2 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
          />
          {errors.name && <span className='text-xs text-red-600 mt-1'>{errors.name}</span>}
        </div>

        {/* Buttons */}
        <div className='flex flex-col self-end'>
          <div className='flex items-center gap-4 mt-6'>
            <div className='flex flex-col w-full sm:w-1/2'>
              <Button
                className='w-full gap-2 px-6 py-5'
                onClick={handleResetFilters}
                size='sm'
                variant='outline'
              >
                Reset Filters
              </Button>
            </div>
            <div className='flex flex-col w-full sm:w-1/2'>
              <Button
                className='w-full gap-2 px-6 py-5'
                onClick={handleApplyFilters}
                size='sm'
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
