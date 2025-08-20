import NextImage from '@/components/Common/NextImage';
import Image from 'next/image';

const FeatureCard = ({
  img,
  title,
  onClick,
}: {
  img: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <button
      className='mb-4 flex flex-col items-center  rounded-md bg-primary-light p-8 xs:w-full  upSm:mr-4 downSm:mx-4 downSm:min-w-[120px] downSm:p-4 upLg:min-w-[202px]'
      onClick={onClick}
    >
      <div className='mb-2 flex justify-center'>
        <Image src={img} alt={title} width={30} height={40} />
      </div>
      <p className='text-center text-sm font-semibold downSm:text-xs'>
        {title}
      </p>
    </button>
  );
};
export { FeatureCard };
