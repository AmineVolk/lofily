import { useState } from 'react';

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex w-full flex-1 flex-col'>
      <h2>
        <button
          type='button'
          className='flex w-full items-center justify-between rounded-t-lg border-b border-gray-800  bg-primary-light p-5 text-left text-lg font-bold   text-gray-300   
          hover:bg-bgSelected focus:ring-1 focus:ring-gray-400 
            '
          onClick={() => setOpen(!open)}
        >
          <span>{question}</span>
          <div>
            {open ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' d='M4.5 15.75l7.5-7.5 7.5 7.5' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
              </svg>
            )}
          </div>
        </button>
      </h2>
      <div className={open ? '' : 'hidden'}>
        <div className='rounded-b-lg  bg-primary-light p-5 ring-1 ring-gray-400 dark:border-gray-700'>
          <p className='mb-2 font-description    '>
            <div
              dangerouslySetInnerHTML={{
                __html: answer,
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export { FAQItem };
