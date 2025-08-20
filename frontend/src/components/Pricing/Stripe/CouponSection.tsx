import clsx from 'clsx';
import { useState } from 'react';
import { Trans } from 'react-i18next';

import { GradientButton } from '@/components/Common/GradientButton';

import { PaymentApi } from '@/services/api/Payments';

const CouponSection = ({
  onChange,
  coupon,
  amount,
}: {
  onChange: (value: string) => void;
  coupon: string;
  amount: string;
}) => {
  const [loading, setLoading] = useState(false);

  const [haveCoupon, setHaveCoupon] = useState(false);
  const [couponValid, setCouponValid] = useState(null);
  const [amountOff, setAmountOff] = useState(0);

  const checkPromoCode = () => {
    setLoading(true);
    return PaymentApi.checkCodePromo(coupon)
      .then((data) => {
        setCouponValid(data.valid);
        if (data.valid) {
          setAmountOff(
            Math.round(parseInt(amount) * data.percent_off + Number.EPSILON) /
              100
          );
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className='my-4 flex space-x-4'>
        <button onClick={() => setHaveCoupon(!haveCoupon)} type='button'>
          <Trans i18nKey='payment.have_coupon' />
        </button>
        <input
          className={clsx([
            'max-w-[150px] rounded-md p-2 text-black',
            !haveCoupon && 'opacity-0',
          ])}
          value={coupon}
          onChange={({ target: { value } }) => onChange(value)}
        />
        {haveCoupon && (
          <GradientButton
            onClick={checkPromoCode}
            type='button'
            loading={loading}
          >
            <p>ok</p>
          </GradientButton>
        )}{' '}
        {haveCoupon && typeof couponValid === 'boolean' && !couponValid && (
          <div className='flex items-center'>
            <p className='rounded-lg font-bold text-red-700'>invalid coupon</p>
          </div>
        )}
        {couponValid && amountOff > 0 && (
          <div className='flex items-center'>
            <p className='font-spartan text-lg font-bold text-green-500'>
              -{amountOff}$
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export { CouponSection };
