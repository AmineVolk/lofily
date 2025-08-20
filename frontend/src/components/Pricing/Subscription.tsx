import Image from 'next/image';
import { Trans, useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';

import { useReduxState } from '@/hooks/useReduxState';

import { MenuItemsIndex } from '@/services/redux-state/Store';

import { GradientButton } from '../Common/GradientButton';

type Props = {
  monthlyAmount: string;
  yearlyAmount: string;
  isUserSelectYearly: boolean;
  displayStripeForm: () => void;
};

const Subscription = ({
  monthlyAmount,
  yearlyAmount,
  isUserSelectYearly,
  displayStripeForm,
}: Props) => {
  const [{ user }, { update }] = useReduxState('user');
  const { t } = useTranslation('common');
  const upgradeClick = () => {
    if (user) {
      displayStripeForm();
    } else {
      update(['currentMenuIndex'], MenuItemsIndex.PROFILE);
      update(['displayPricingDialog'], false);
    }
  };

  return (
    <div className='flex flex-col'>
      <div>
        <p className='font-agraham mb-2 text-center   '>
          <span className='text-2xl font-bold capitalize'>
            <Trans
              i18nKey='pricing.amount'
              values={{
                amount: isUserSelectYearly ? yearlyAmount : monthlyAmount,
              }}
            />
          </span>
          <span className='text-[16px]'>
            {' / '}
            <Trans
              i18nKey={
                isUserSelectYearly ? 'pricing.yearly' : 'pricing.monthly'
              }
            />
          </span>
        </p>
        <Tooltip
          id='pricing-description'
          opacity='unset'
          style={{
            background: '#FF9155',
            fontWeight: 500,
            maxWidth: '100%',
          }}
        />

        <p
          className='mb-6 text-center text-gray-500'
          data-tooltip-id='pricing-description'
          data-tooltip-content={t('pricing.tooltip')}
        >
          <Trans i18nKey='pricing.description' />
        </p>
        <div className='ml-10'>
          {[...new Array(9)].map((_, index) => (
            <div className='mt-2 flex   space-x-2' key={index}>
              <Image
                src='/images/check.svg'
                width={20}
                height={20}
                alt='basique-item'
              />
              <p className='text-[16px] capitalize text-gray-200'>
                <Trans i18nKey={`pricing.${index + 1}`} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <GradientButton
        className='mt-6 w-full justify-center py-3'
        onClick={upgradeClick}
      >
        <>
          <Image
            src='/images/premium-white.svg'
            alt='premium'
            className='mr-2'
            width={20}
            height={20}
          />
          <p className='font-semibold'>
            <Trans i18nKey={user ? 'pricing.button' : 'pricing.signup'} />
          </p>
        </>
      </GradientButton>
    </div>
  );
};
export { Subscription };
