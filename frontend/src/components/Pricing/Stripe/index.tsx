import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { CheckoutForm } from './CheckoutForm';

const StripeForm = ({
  selectedPricingId,
  monthly,
  amount,
}: {
  selectedPricingId: string;
  monthly: boolean;
  amount: string;
}) => {
  const getStrip = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

  return (
    <div>
      <div className=' upLg:min-w-[500px]'>
        <Elements stripe={getStrip()}>
          <CheckoutForm
            amount={amount}
            selectedPricingId={selectedPricingId}
            monthly={monthly}
          />
        </Elements>
      </div>
    </div>
  );
};
export { StripeForm };
