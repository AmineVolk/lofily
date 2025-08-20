import clsx from 'clsx';

import useMediaQuery from '@/hooks/useMediaQuery';

import NextImage from '@/components/Common/NextImage';

import { MAX_WIDTH_MOBILE } from '@/constant';

const BackgroundCard = ({
  thumbnail,
  hanldeSelectBackground,
  selected,
  thumbnail_mobile,
}: {
  thumbnail: string;
  hanldeSelectBackground: () => void;
  selected: boolean;
  thumbnail_mobile?: string;
}) => {
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  return (
    <button
      onClick={hanldeSelectBackground}
      className={clsx([
        selected && 'border-secondary-base',
        'mb-6  rounded-lg    border border-primary-dark transition delay-200 ease-in hover:border-secondary-base  upMd:mr-6',
      ])}
    >
      {' '}
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
          alt='backgrounds'
          width={300}
          height={170}
          imgClassName='mb-0 rounded-lg'
          blurClassName='bg-primary-light rounded-lg'
        />
      )}
    </button>
  );
};
export { BackgroundCard };
