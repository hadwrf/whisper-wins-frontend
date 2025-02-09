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
      'Obtain the secure address where you will transfer your NFT. This step ensures that your NFT\nis ready for the auction process and can be transferred safely to the stake account.',
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
    title: 'Resolve the Auction',
    description:
      'Once the auction ends, the contract will determine the highest bidder. This step ensures\nthat the auction is finalized and a winner is selected.',
  },
  {
    title: 'Claim Earning',
    description:
      'Once the auction ends, you will receive the highest bid amount in ETH. The amount\nyou receive will be taxed in order to fund the transactions.',
  },
];

const AuctionStatusStepper: React.FC<AuctionStatusStepperProps> = ({ currentStep }) => {
  return (
    <ol className='space-y-8 overflow-hidden'>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const stepClass = isCompleted ? 'bg-blue-500' : 'bg-blue-100';
        const borderClass = currentStep >= stepNumber ? 'border-blue-500' : 'border-transparent';
        const textClass = isCompleted ? 'text-blue-500' : 'text-gray-900';

        return (
          <li
            key={stepNumber}
            className={`relative flex-1 ${isCompleted ? 'after:bg-blue-500' : 'after:bg-gray-200'} after:h-full after:w-0.5 ${stepNumber != 6 ? 'after:inline-block' : 'after:hidden'} after:absolute after:-bottom-10 after:left-4 lg:after:left-5`}
          >
            <a className='flex w-full items-start space-y-2'>
              <span
                className={`size-8 ${stepClass} border-2 ${borderClass} mr-3 flex items-center justify-center rounded-full text-sm text-white lg:size-10`}
              >
                {isCompleted ? (
                  <svg
                    className='size-5 stroke-white'
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
