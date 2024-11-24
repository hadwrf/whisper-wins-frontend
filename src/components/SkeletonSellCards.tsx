import { SkeletonSellCard } from './SkeletonSellCard';

export const SkeletonSellCards = () => {
  return (
    <div className='animate-pulse'>
      <div className='my-8 w-full rounded bg-gray-200 p-4 shadow-md'></div>
      <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>
            <SkeletonSellCard />
          </div>
        ))}
      </div>
    </div>
  );
};
