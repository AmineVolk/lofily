import Image from 'next/image';

const EmptyState = ({ description }: { description: string }) => {
  return (
    <div
      className='relative flex h-full w-full flex-col items-center justify-center'
      id='empty-wrapper'
    >
      <h3 className='mb-12 text-gray-400'>{description}</h3>
      <Image
        width={300}
        height={300}
        src='/images/empty.svg'
        alt='empty backgrounds'
      />
    </div>
  );
};
export { EmptyState };
