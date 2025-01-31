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
    <div className='mx-auto mt-6 rounded-lg text-sm'>
      {/* First Row: Name & Price Filters */}
      <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Name Filter */}
        <div className='flex flex-col lg:col-span-2'>
          <label className='text-sm font-medium text-gray-700'>NFT Name</label>
          <input
            type='text'
            name='name'
            value={filters.name}
            onChange={handleChange}
            placeholder='Search by name'
            className='mt-2 rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
          />
          {errors.name && <span className='mt-1 text-xs text-red-600'>{errors.name}</span>}
        </div>

        {/* Buttons */}
        <div className='flex flex-col self-end'>
          <div className='mt-6 flex items-center gap-4'>
            <div className='flex w-full flex-col sm:w-1/2'>
              <Button
                className='w-full gap-2 px-6 py-5'
                onClick={handleResetFilters}
                size='sm'
                variant='outline'
              >
                Reset Filters
              </Button>
            </div>
            <div className='flex w-full flex-col sm:w-1/2'>
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
