const Header = ({
  title,
  handleClose,
}: {
  title?: string;
  handleClose: () => void;
}) => (
  <div className='flex flex-1   pl-6 pr-5 pt-5 font-semibold'>
    {title && (
      <div className='flex'>
        <p className='text-white'>{title}</p>
      </div>
    )}
    <div className='z-40 flex flex-1 justify-end'>
      <button
        className='ml-4 items-center border-0 bg-transparent text-black'
        onClick={() => handleClose()}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='white'
          className='h-6 w-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  </div>
);
export { Header };
