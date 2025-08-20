import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';

import { GetPriceDto } from '@/Dto/Payments/GetPrice.dto';
import { logger } from '@/services/logger';

import { StripeForm } from './Stripe';
import { Subscription } from './Subscription';
import { Dialog } from '../Common/Dialog';

const PricingPopup = ({ handleClose }: { handleClose: () => void }) => {
  const [selectedPricingId, setSelectedPricingId] = useState('');
  const [displayStripeForm, setDisplayStripeForm] = useState(false);
  const { data: prices } = useFetch<GetPriceDto[]>('payments/prices');

  const monthlyPrice = prices?.find(
    (price) => price.recurring.interval === 'month'
  );

  const yearlyPrice = prices?.find(
    (price) => price.recurring.interval === 'year'
  );

  logger('selectedPricing ', selectedPricingId);
  const onValidate = () => {
    // comming
  };

  useEffect(() => {
    if (monthlyPrice && selectedPricingId === '')
      setSelectedPricingId(monthlyPrice.id);
  }, [prices?.length]);

  const isUserSelectYearly = selectedPricingId === yearlyPrice?.id;
  const formatedMonthlyPrice = (
    (monthlyPrice?.unit_amount || 399) / 100
  ).toFixed(2);

  const formatedYearlyPrice = (
    (yearlyPrice?.unit_amount || 3990) / 100
  ).toFixed(2);
  return (
    <Dialog
      handleClose={handleClose}
      onValidate={onValidate}
      withHeader={false}
    >
      <div className='relative min-w-[300px]'>
        <div className='flex items-center'>
          <Image
            src='/images/top_bar/premuim.svg'
            alt='premium'
            className='mr-2'
            width={20}
            height={20}
          />
          <p className='font-semibold capitalize'>
            <Trans i18nKey='pricing.title' />
          </p>
          {displayStripeForm && (
            <div className='absolute left-1/2 -translate-x-1/2 transform'>
              <p className='text-lg font-semibold capitalize'>
                {isUserSelectYearly
                  ? formatedYearlyPrice
                  : formatedMonthlyPrice}{' '}
                $
              </p>
            </div>
          )}
          <div className='flex flex-1 justify-end'>
            <button onClick={handleClose} className='   justify-end'>
              <Image
                src='/images/notes/close.svg'
                alt='close'
                width={24}
                height={30}
              />
            </button>
          </div>
        </div>
        <div className='my-6 flex space-x-2 rounded-lg border border-primary-light p-2'>
          <button
            onClick={() => setSelectedPricingId(monthlyPrice?.id || '')}
            className={clsx([
              'flex flex-1 justify-center rounded-lg p-2 capitalize duration-300',
              !isUserSelectYearly && 'bg-bgSelected',
            ])}
          >
            <Trans i18nKey='pricing.monthly' />
          </button>

          <button
            onClick={() => setSelectedPricingId(yearlyPrice?.id || '')}
            className={clsx([
              'flex flex-1 justify-center rounded-lg p-2 capitalize duration-300',
              isUserSelectYearly && 'bg-bgSelected',
            ])}
          >
            <Trans i18nKey='pricing.yearly' />
          </button>
        </div>

        {displayStripeForm ? (
          <StripeForm
            amount={
              isUserSelectYearly ? formatedYearlyPrice : formatedMonthlyPrice
            }
            selectedPricingId={selectedPricingId}
            monthly={monthlyPrice?.id === selectedPricingId}
          />
        ) : (
          <Subscription
            displayStripeForm={() => setDisplayStripeForm(true)}
            isUserSelectYearly={isUserSelectYearly}
            monthlyAmount={formatedMonthlyPrice}
            yearlyAmount={formatedYearlyPrice}
          />
        )}
      </div>
    </Dialog>
  );
};
export { PricingPopup };
