import clsx from 'clsx';
import Image from 'next/image';
import { Trans } from 'react-i18next';

import NextImage from '@/components/Common/NextImage';

import { DynamicStringType } from '@/type';

const FeatureDetails = ({
  onClickBack,
  index,
  className,
}: {
  onClickBack: () => void;
  index: number;
  className?: string;
}) => {
  const styleByIndex: DynamicStringType = {
    0: 'max-w-[300px] min-h-[350px]',
    1: 'max-w-[343px] min-h-[446px]',
    2: 'max-w-[534px] min-h-[402px]',
    3: 'max-w-[461px] min-h-[321px]',
    4: 'max-w-[319px] min-h-[334px]',
    5: 'max-w-[534px] min-h-[402px] xs:min-h-[250px]',
    6: 'max-w-[534px] min-h-[352px] xs:min-h-[250px]',
    7: 'max-w-[527px] min-h-[432px] xs:min-h-[280px]',
  };

  return (
    <div className='flex flex-1 flex-col  '>
      <div className='mb-4 flex items-center'>
        <button onClick={onClickBack}>
          <Image
            src='/images/notes/back.svg'
            alt='back'
            width={30}
            height={30}
          />
        </button>
        <p className='text-[16px] font-bold'>
          <Trans i18nKey={`setting.features.${index}.title`} />
        </p>
      </div>
      <div className='flex flex-1 justify-center'>
        <div
          className={clsx([
            'relative mb-8 flex  flex-1 justify-center rounded-lg shadow-2xl shadow-primary-light',
            styleByIndex[index],
          ])}
        >
          <NextImage
            useSkeleton
            src={`/images/features/screenshots/${index}.png`}
            alt='lofily features'
            fill
            imgClassName='mb-0 rounded-lg'
            blurClassName='bg-primary-light'
            priority
          />
        </div>
      </div>
      <div className='pb-4'>
        <p className='text-gray-500'>
          <Trans i18nKey={`setting.features.${index}.description`} />
        </p>
      </div>
    </div>
  );
};
export { FeatureDetails };
