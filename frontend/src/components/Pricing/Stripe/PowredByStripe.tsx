import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const PowredByStripe = () => {
  const { t } = useTranslation('common');

  return (
    <div className='mt-4 flex items-center'>
      <Image
        src='/images/lock.svg'
        alt='powred-by-stripe'
        width={20}
        height={20}
      />
      <p className='mx-2 text-gray-400'>
        <div dangerouslySetInnerHTML={{ __html: t('pricing.secure_text') }} />
      </p>
      <a href='https://stripe.com' target='_blank'>
        <Image
          src='/images/stripe.svg'
          alt='powred-by-stripe'
          width={120}
          height={20}
        />
      </a>
    </div>
  );
};
export { PowredByStripe };
