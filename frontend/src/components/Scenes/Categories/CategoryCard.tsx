import Image from 'next/image';

import useMediaQuery from '@/hooks/useMediaQuery';

import NextImage from '@/components/Common/NextImage';

import { MAX_WIDTH_MOBILE } from '@/constant';

const CategoryCard = ({
  thumbnail,
  thumbnail_mobile,
  name,
  nbr_backgrounds,
  is_for_premium,
  onCategorySelected,
  is_new,
}: {
  thumbnail: string;
  name: string;
  nbr_backgrounds: number;
  is_for_premium: boolean;
  thumbnail_mobile?: string;
  is_new: boolean;

  onCategorySelected: () => void;
}) => {
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  return (
    <button
      className='relative mb-6 flex   rounded-lg border border-primary-dark transition  delay-200    ease-in hover:border-secondary-base upMd:mr-6 '
      onClick={onCategorySelected}
    >
      {is_new && (
        <Image
          src='/images/new.svg'
          alt='new'
          width={40}
          height={40}
          className='absolute top-[-5px] left-[-5px]'
        />
      )}
      {isMobile && thumbnail_mobile ? (
        <NextImage
          useSkeleton
          src={process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail_mobile}
          alt='backgrounds-category'
          width={260}
          height={380}
          imgClassName='mb-0 rounded-lg'
          blurClassName='bg-primary-light rounded-lg'
        />
      ) : (
        <NextImage
          useSkeleton
          src={process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail}
          alt='backgrounds-category'
          width={300}
          height={170}
          imgClassName='mb-0 rounded-lg'
          blurClassName='bg-primary-light rounded-lg'
        />
      )}

      <div className='absolute bottom-3 left-6'>
        <p className='text-sm font-semibold capitalize'>{name}</p>
      </div>
      <div className='absolute bottom-3 right-6 flex flex-1 space-x-2'>
        <Image
          src='/images/backgrounds.svg'
          alt='backgrounds'
          width={24}
          height={24}
          className='mb-0'
        />
        <p>{nbr_backgrounds}</p>
        {is_for_premium && (
          <Image
            src='/images/premium.svg'
            width={20}
            height={20}
            alt='premium'
          />
        )}
      </div>
    </button>
  );
};
export { CategoryCard };
