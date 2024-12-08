interface SpinnerProps {
  show: boolean;
}

export const Spinner = ({ show }: SpinnerProps) => {
  return (
    <>
      {show && (
        <div
          className='inline-block size-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500'
          role='status'
          aria-label='loading'
        >
          <span className='sr-only'>Loading...</span>
        </div>
      )}
    </>
  );
};
