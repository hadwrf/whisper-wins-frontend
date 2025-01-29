import { SkeletonSellCard } from './SkeletonSellCard';

export const SkeletonSellCards = () => (
  <div className='animate-pulse'>
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i}>
          <SkeletonSellCard />
        </div>
      ))}
    </div>
  </div>
);
