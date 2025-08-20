import Image from 'next/image';

const TestimonialCard = ({
  img,
  name,
  stars,
  description,
}: {
  img: string;
  name: string;
  stars: number;
  description: string;
}) => {
  return (
    <div className='mb-12 flex  min-h-[450px]  max-w-[370px] flex-1 flex-col items-center space-y-4 rounded-lg bg-primary-light p-4 py-10'>
      {/* <Image
        src={img}
        width={90}
        height={90}
        alt={name + 'feedback'}
        className='max-w-[90px]'
      /> */}

      <p className='font-description text-lg font-semibold text-gray-300'>
        {name}
      </p>
      <div className='flex'>
        {[...Array(stars)].map((star, index) => (
          <Image
            src='/images/testimonials/stars.svg'
            key={index}
            width={17}
            height={17}
            alt='star'
            className='h-[17px w-[17px]'
          />
        ))}
      </div>
      <p className='font-description text-lg text-gray-300'>{description}</p>
    </div>
  );
};
export { TestimonialCard };
