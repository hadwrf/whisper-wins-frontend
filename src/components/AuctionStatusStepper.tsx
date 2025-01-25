import React from 'react';

interface AuctionStatusStepperProps {
  currentStep: number;
}

const steps = [
  {
    title: 'Create Auction',
    description:
      'Set up your auction by providing details about your NFT, such as its end time and starting bid.\nThis is the first step to list your NFT for bidding.',
  },
  {
    title: 'Retrieve NFT Transfer Address',
    description:
      'Obtain the secure address where you will transfer your NFT. This step ensures that your NFT\nis ready forthe auction process and can be transferred safely to the stake account.',
  },
  {
    title: 'Transfer NFT',
    description:
      'Transfer your NFT to the provided address. This action guarantees that the NFT is securely\nheld in escrow for the duration of the auction, preventing any disputes.',
  },
  {
    title: 'Start Auction',
    description:
      'Launch the auction, making your NFT available for bidding. Once the auction starts, other\nparticipants can place bids, and the highest bid will determine the winner.',
  },
  {
    title: 'Claim Earning',
    description:
      'Once the auction ends, you will receive the highest bid amount in ETH.\nThis step finalizes the transaction and ensures you get your earnings from the auction.',
  },
];

const AuctionStatusStepper: React.FC<AuctionStatusStepperProps> = ({ currentStep }) => {
  return (
    <ol className='overflow-hidden space-y-8'>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const stepClass = isCompleted ? 'bg-blue-500' : 'bg-blue-100';
        const borderClass = currentStep >= stepNumber ? 'border-blue-500' : 'border-transparent';
        const textClass = isCompleted ? 'text-blue-500' : 'text-gray-900';

        return (
          <li
            key={stepNumber}
            className={`relative flex-1 ${isCompleted ? 'after:bg-blue-500' : 'after:bg-gray-200'} after:w-0.5 after:h-full after:inline-block after:absolute after:-bottom-10 after:left-4 lg:after:left-5`}
          >
            <a className='flex items-start w-full space-y-2'>
              <span
                className={`w-8 h-8 ${stepClass} border-2 ${borderClass} rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10`}
              >
                {isCompleted ? (
                  <svg
                    className='w-5 h-5 stroke-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7'
                      stroke='stroke-current'
                      strokeWidth='1.6'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    ></path>
                  </svg>
                ) : (
                  stepNumber
                )}
              </span>
              <div className='block'>
                <h4 className={`text-md ${textClass} mb-1`}>{step.title}</h4>
                <span className='text-sm'>
                  {step.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < step.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            </a>
          </li>
        );
      })}
    </ol>
  );
};

export default AuctionStatusStepper;
