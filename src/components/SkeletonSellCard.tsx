export const SkeletonSellCard = () => {
  return (
    <div className='w-60 animate-pulse rounded bg-white pb-2 shadow-md'>
      <div className='h-44 rounded-t-lg bg-gray-200'></div>
      <div className='m-3 h-6 rounded bg-gray-200'></div>
      <div className='m-3 flex justify-between'>
        <div className='h-8 w-20 rounded bg-gray-200'></div>
        <div className='h-8 w-24 rounded bg-gray-200'></div>
      </div>
    </div>
  );
};
