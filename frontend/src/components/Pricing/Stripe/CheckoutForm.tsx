import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { GradientButton } from '@/components/Common/GradientButton';
import { ButtonLoader } from '@/components/Common/Loader';

import { CreatePaymentSubscription } from '@/Dto/Payments/CreatePaymentSubscription.dto';
import { PaymentApi } from '@/services/api/Payments';
import { logger } from '@/services/logger';

import { CouponSection } from './CouponSection';
import { PowredByStripe } from './PowredByStripe';

type Props = {
  selectedPricingId: string;
  monthly: boolean;
  amount: string;
};

const CheckoutForm = ({ selectedPricingId, monthly, amount }: Props) => {
  const { t } = useTranslation('common');
  const [error, setError] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [invalidCoupon, setInvalidCoupon] = useState<boolean>(false);

  const [{ user }] = useReduxState('user');

  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return <div />;
  }

  logger('stripe form ', { error, success });

  const createSubscription = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const cardElement = elements.getElement(CardElement);
      // create a payment method
      if (cardElement && user) {
        setLoading(true);
        setError(false);
        const paymentMethod = await stripe?.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: user?.username,
            email: user?.email,
          },
        });
        const subscriptionPayload: CreatePaymentSubscription = {
          price_id: selectedPricingId,
          payment_method_id: paymentMethod?.paymentMethod?.id || '',
        };
        if (!monthly) {
          subscriptionPayload.promocode = coupon;
        }
        const response = await PaymentApi.createSubscription(
          subscriptionPayload
        ).then(({ data }) => data);

        const confirmPayment = await stripe?.confirmCardPayment(
          response.client_secret
        );

        if (confirmPayment?.error) {
          setError(true);
          alert(confirmPayment.error.message);
        } else {
          setSuccess(true);

          await PaymentApi.subscriptionDone({
            customer_id: response.customer_id,
            subscription_id: response.subscription_id,
          });
          setTimeout(() => document.location.reload(), 1000);
        }
      }
    } catch (error) {
      setError(true);

      if (error === 404) setInvalidCoupon(true);
    }
  };

  return (
    <form onSubmit={createSubscription} className=' '>
      <p className='mb-2'>
        <Trans i18nKey='pricing.input_title' />
      </p>
      {!success && (
        <div className='rounded-md bg-white p-4'>
          <CardElement />
        </div>
      )}
      {success && (
        <div className='mt-6 rounded-md bg-green-500 p-4'>
          <Trans i18nKey='payment.success' />
        </div>
      )}
      <PowredByStripe />
      {!monthly && (
        <CouponSection
          onChange={(value: string) => setCoupon(value)}
          coupon={coupon}
          amount={amount}
        />
      )}
      {!success && (
        <div className='mt-8 flex w-full justify-center'>
          <GradientButton
            className='w-full justify-center py-3'
            disabled={loading && !error}
          >
            <>
              <p className='font-semibold capitalize'>
                <Trans i18nKey='payment.subscribe' />
              </p>{' '}
              {loading && !error && <ButtonLoader />}
            </>
          </GradientButton>
        </div>
      )}
      {error && (
        <div className='mt-6 rounded-md bg-red-500 p-4'>
          {coupon && invalidCoupon ? (
            <Trans i18nKey='payment.invalid_coupon' />
          ) : (
            <Trans i18nKey='payment.error' />
          )}
        </div>
      )}
    </form>
  );
};
export { CheckoutForm };
