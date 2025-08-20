import { Trans, useTranslation } from 'react-i18next';

import { GradientLink } from '../Common/GradientLink';
import Image from 'next/image';
import clsx from 'clsx';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useState } from 'react';

const PremiumCard = () => {
  const [mounted] = useIsMounted();
  const [selectedPricing, setSelectedPricing] = useState(0);
  const { t } = useTranslation('common');
  if (!mounted) return <div />;
  return (
    <div className='flex w-full max-w-[370px] flex-col rounded-2xl bg-primary-light p-8 duration-500 hover:shadow-3xl upLg:min-w-[370px]'>
      <div className='mb-6 flex space-x-2 rounded-lg border border-gray-500 p-2 font-description'>
        <button
          onClick={() => setSelectedPricing(0)}
          className={clsx([
            'flex flex-1 justify-center rounded-lg p-2 capitalize duration-300',
            selectedPricing === 0 && 'bg-bgSelected',
          ])}
        >
          <Trans i18nKey='pricing.premium.monthly' />
        </button>
        <button
          onClick={() => setSelectedPricing(1)}
          className={clsx([
            'flex flex-1 justify-center rounded-lg p-2 capitalize duration-300',
            selectedPricing === 1 && 'bg-bgSelected',
          ])}
        >
          <Trans i18nKey='pricing.premium.yearly' />
        </button>
      </div>
      <Image
        src='/images/pricing/premium.svg'
        width={100}
        height={100}
        alt='basique'
        className='mb-8'
      />
      <p className='mb-6 font-agraham text-xl capitalize'>
        <Trans i18nKey='pricing.premium.title' />
      </p>
      {selectedPricing === 1 ? (
        <p className=' mb-4 font-description text-3xl font-bold capitalize'>
          {t('pricing.premium.price_yearly')}
          <span className='text-lg'>/ year</span>
        </p>
      ) : (
        <p className=' mb-4 font-description text-3xl font-bold capitalize'>
          {t('pricing.premium.price_monthly')}
          <span className='text-lg'>/ month</span>
        </p>
      )}
      {[...new Array(9)].map((_, index) => (
        <div className='mt-2 flex space-x-2' key={index}>
          <Image
            src='/images/pricing/check.svg'
            width={16}
            height={16}
            alt='basique-item'
          />
          <p className='font-description text-lg capitalize text-gray-400'>
            <Trans i18nKey={`pricing.premium.${index + 1}`} />
          </p>
        </div>
      ))}
      <div className='mt-10 flex items-end'>
        <GradientLink
          href='https://app.lofily.com'
          text={t('pricing.premium.button')}
          className='w-full py-3'
        />
      </div>
    </div>
  );
};
export { PremiumCard };
