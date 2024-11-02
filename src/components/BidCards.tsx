import { BidCard } from './BidCard';

export const BidCards = () => {
  return (
    <div className='grid grid-cols-3 gap-4 lg:grid-cols-4'>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i}>
          <BidCard />
        </div>
      ))}
    </div>
  );
};
