'use client';

import { useState } from 'react';
import { Button } from './ui/button';

export interface Filters {
  name: string;
  createdFrom: string;
  createdTo: string;
  endsFrom: string;
  endsTo: string;
  minPriceFrom: string;
  minPriceTo: string;
  sort: string;
}

interface AuctionsFilterProps {
  onApplyFilters: (filters: Filters) => void;
}

export default function AuctionsFilter({ onApplyFilters }: AuctionsFilterProps) {
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

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    createDates: '',
    endDates: '',
  });

  const validateFilters = () => {
    const newErrors = {
      name: '',
      price: '',
      createDates: '',
      endDates: '',
    };

    console.log('in validate');
    console.log(filters.name.length);

    // Name validation
    if (filters.name.length > 0 && filters.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
    }

    // Price validation
    const minPriceFrom = parseFloat(filters.minPriceFrom);
    const minPriceTo = parseFloat(filters.minPriceTo);

    if (filters.minPriceFrom || filters.minPriceTo) {
      if ((!isNaN(minPriceFrom) && minPriceFrom < 0) || (!isNaN(minPriceTo) && minPriceTo < 0)) {
        newErrors.price = 'Price values must be positive numbers.';
      } else if (minPriceFrom > minPriceTo) {
        newErrors.price = "'From' price must be less than or equal to 'To' price.";
      }
    }

    // Date validation
    const createdFromDate = new Date(filters.createdFrom);
    const createdToDate = new Date(filters.createdTo);
    const endsFromDate = new Date(filters.endsFrom);
    const endsToDate = new Date(filters.endsTo);

    if (filters.createdFrom && filters.createdTo && createdFromDate > createdToDate) {
      newErrors.createDates = "'Created From' must be earlier than 'Created To'.";
    }
    if (filters.endsFrom && filters.endsTo && endsFromDate > endsToDate) {
      newErrors.endDates = "'Ends From' must be earlier than 'Ends To'.";
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
      createdFrom: '',
      createdTo: '',
      endsFrom: '',
      endsTo: '',
      minPriceFrom: '',
      minPriceTo: '',
      sort: '',
    };

    setFilters(resetFilters);
    setErrors({
      name: '',
      price: '',
      createDates: '',
      endDates: '',
    });

    // Pass reset filters directly to the parent function
    onApplyFilters(resetFilters);
  };

  return (
    <div className='mx-auto rounded-lg text-sm mt-6'>
      {/* First Row: Name & Price Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* Name Filter */}
        <div className='flex flex-col'>
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

        {/* Minimum Price Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Minimum Price (ETH)</label>
          <div className='flex items-center gap-4 mt-2'>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='number'
                name='minPriceFrom'
                value={filters.minPriceFrom}
                onChange={handleChange}
                placeholder='From'
                className='w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='number'
                name='minPriceTo'
                value={filters.minPriceTo}
                onChange={handleChange}
                placeholder='To'
                className='w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
          </div>
          {errors.price && <span className='text-xs text-red-600 mt-1'>{errors.price}</span>}
        </div>

        {/* Sorting Options */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Sort By</label>
          <select
            name='sort'
            value={filters.sort}
            onChange={handleChange}
            className='w-full p-2 pr-8 mt-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
          >
            <option value=''>Default Sorting</option>
            <option value='price_asc'>Price (Ascending)</option>
            <option value='price_desc'>Price (Descending)</option>
            <option value='created_at_asc'>Created At (Ascending)</option>
            <option value='created_at_desc'>Created At (Descending)</option>
            <option value='ends_at_asc'>Ends At (Ascending)</option>
            <option value='ends_at_desc'>Ends At (Descending)</option>
          </select>
        </div>
      </div>

      {/* Second Row: Ends At Filter and Sorting */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Created At Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Auction Created At</label>
          <div className='flex items-center gap-4 mt-2'>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='date'
                name='createdFrom'
                value={filters.createdFrom}
                onChange={handleChange}
                className='p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='date'
                name='createdTo'
                value={filters.createdTo}
                onChange={handleChange}
                className='p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
          </div>
          {errors.createDates && <span className='text-xs text-red-600 mt-1'>{errors.createDates}</span>}
        </div>

        {/* Ends At Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Auction Ends At</label>
          <div className='flex items-center gap-4 mt-2'>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='date'
                name='endsFrom'
                value={filters.endsFrom}
                onChange={handleChange}
                className='p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex flex-col w-full sm:w-1/2'>
              <input
                type='date'
                name='endsTo'
                value={filters.endsTo}
                onChange={handleChange}
                className='p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800 focus:border-gray-500 transition-all'
              />
            </div>
          </div>
          {errors.endDates && <span className='text-xs text-red-600 mt-1'>{errors.endDates}</span>}
        </div>

        {/* Buttons */}
        <div className='flex flex-col'>
          <div className='flex items-center gap-4 mt-7'>
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
          {errors.endDates && <span className='text-xs text-red-600 mt-1'>{errors.endDates}</span>}
        </div>
      </div>
    </div>
  );
}
