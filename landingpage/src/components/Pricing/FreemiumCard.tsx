import { Trans, useTranslation } from 'react-i18next';

import { GradientBorderLink } from '../Common/GradientBorderLink';
import Image from 'next/image';
import { useIsMounted } from '@/hooks/useIsMounted';

const FreemiumCard = () => {
  const [mounted] = useIsMounted();
  const { t } = useTranslation('common');

  if (!mounted) return <div />;
  return (
    <div className='flex w-full max-w-[370px] flex-col rounded-2xl bg-primary-light p-8 duration-500 hover:shadow-3xl upLg:min-w-[370px] upLg:pt-[100px]'>
      <Image
        src='/images/pricing/basique.svg'
        width={100}
        height={100}
        alt='basique'
        className='mb-8'
      />
      <p className='mb-6 font-agraham text-xl capitalize'>
        <Trans i18nKey='pricing.basic.title' />
      </p>
      <p className='mb-4 font-description text-3xl font-bold capitalize'>
        <Trans i18nKey='pricing.basic.price' />
      </p>
      <div className='flex space-x-2'>
        <Image
          src='/images/pricing/check.svg'
          width={16}
          height={16}
          alt='basique-item'
        />
        <p className='font-description text-lg capitalize text-gray-400'>
          <Trans i18nKey='pricing.basic.1' />
        </p>
      </div>
      <div className=' flex space-x-2'>
        <Image
          src='/images/pricing/check.svg'
          width={16}
          height={16}
          alt='basique-item'
        />
        <p className='font-description text-lg capitalize text-gray-400'>
          <Trans i18nKey='pricing.basic.2' />
        </p>
      </div>
      <div className=' flex space-x-2'>
        <Image
          src='/images/pricing/check.svg'
          width={16}
          height={16}
          alt='basique-item'
        />
        <p className='font-description text-lg text-gray-400'>
          <Trans i18nKey='pricing.basic.3' />
        </p>
      </div>
      <div className='mt-10 flex flex-1 items-end'>
        <GradientBorderLink
          href='https://app.lofily.com'
          text={t('pricing.basic.button')}
          className='w-full py-2'
        />
      </div>
    </div>
  );
};
export { FreemiumCard };
