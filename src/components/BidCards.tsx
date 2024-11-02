import { BidCard } from './BidCard';

export const BidCards = () => {
  return (
    <div className='mx-auto grid max-w-5xl grid-cols-3 gap-4 lg:grid-cols-4'>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          <BidCard />
        </div>
      ))}
    </div>
  );
};
