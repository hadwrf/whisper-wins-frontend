'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface Filters {
  name: string;
  createdFrom: string;
  createdTo: string;
  endsFrom: string;
  endsTo: string;
  minPriceFrom: string;
  minPriceTo: string;
  sort: string;
  status: string;
}

interface MyAuctionsFilterProps {
  onApplyFilters: (filters: Filters) => void;
}

export default function MyAuctionsFilter({ onApplyFilters }: MyAuctionsFilterProps) {
  const [filters, setFilters] = useState({
    name: '',
    createdFrom: '',
    createdTo: '',
    endsFrom: '',
    endsTo: '',
    minPriceFrom: '',
    minPriceTo: '',
    sort: '',
    status: '',
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
      status: '',
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
    <div className='mx-auto mt-6 rounded-lg text-sm'>
      {/* First Row: Name & Price Filters */}
      <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Name Filter */}
        <div className='flex flex-col'>
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

        {/* Minimum Price Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Minimum Price (ETH)</label>
          <div className='mt-2 flex items-center gap-4'>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='number'
                name='minPriceFrom'
                value={filters.minPriceFrom}
                onChange={handleChange}
                placeholder='From'
                className='w-full rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='number'
                name='minPriceTo'
                value={filters.minPriceTo}
                onChange={handleChange}
                placeholder='To'
                className='w-full rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
          </div>
          {errors.price && <span className='mt-1 text-xs text-red-600'>{errors.price}</span>}
        </div>

        {/* Sorting Options */}
        <div className='flex flex-col'>
          <div className='flex items-center gap-4'>
            <div className='flex w-1/2 flex-col'>
              <label className='text-sm font-medium text-gray-700'>Status</label>
              <div className='flex w-full flex-col'>
                <select
                  name='status'
                  value={filters.status}
                  onChange={handleChange}
                  className='mt-2 w-full rounded-lg border border-gray-300 p-2 pr-8 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
                >
                  <option value=''>All</option>
                  <option value='nft_address_pending'>Nft Address Pending</option>
                  <option value='nft_transfer_pending'>Nft Transfer Pending</option>
                  <option value='start_pending'>Start Pending</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='time_ended'>Time Ended</option>
                  <option value='resolved'>Resolved</option>
                </select>
              </div>
            </div>
            <div className='flex w-1/2 flex-col'>
              <label className='text-sm font-medium text-gray-700'>Sort By</label>
              <div className='flex w-full flex-col'>
                <select
                  name='sort'
                  value={filters.sort}
                  onChange={handleChange}
                  className='mt-2 w-full rounded-lg border border-gray-300 p-2 pr-8 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
                >
                  <option value=''>Default</option>
                  <option value='price_asc'>Price (Ascending)</option>
                  <option value='price_desc'>Price (Descending)</option>
                  <option value='created_at_asc'>Created At (Ascending)</option>
                  <option value='created_at_desc'>Created At (Descending)</option>
                  <option value='ends_at_asc'>Ends At (Ascending)</option>
                  <option value='ends_at_desc'>Ends At (Descending)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Ends At Filter and Sorting */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Created At Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Auction Created At</label>
          <div className='mt-2 flex items-center gap-4'>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='date'
                name='createdFrom'
                value={filters.createdFrom}
                onChange={handleChange}
                className='rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='date'
                name='createdTo'
                value={filters.createdTo}
                onChange={handleChange}
                className='rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
          </div>
          {errors.createDates && <span className='mt-1 text-xs text-red-600'>{errors.createDates}</span>}
        </div>

        {/* Ends At Filter */}
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Auction Ends At</label>
          <div className='mt-2 flex items-center gap-4'>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='date'
                name='endsFrom'
                value={filters.endsFrom}
                onChange={handleChange}
                className='rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
            <span className='text-sm text-gray-500'>to</span>
            <div className='flex w-full flex-col sm:w-1/2'>
              <input
                type='date'
                name='endsTo'
                value={filters.endsTo}
                onChange={handleChange}
                className='rounded-lg border border-gray-300 p-2 shadow-sm transition-all focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-800'
              />
            </div>
          </div>
          {errors.endDates && <span className='mt-1 text-xs text-red-600'>{errors.endDates}</span>}
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
