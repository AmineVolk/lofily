import { Trans } from 'react-i18next';

import { useIsMounted } from '@/hooks/useIsMounted';

import { FreemiumCard } from './FreemiumCard';
import { PremiumCard } from './PremiumCard';

const Pricing = () => {
  const [mounted] = useIsMounted();

  return (
    <div className='  w-full py-10'>
      {mounted && (
        <p
          className='mb-20 mt-32 text-center font-magilio text-[60px] leading-tight downMd:text-[30px]'
          id='pricing'
        >
          <Trans i18nKey='pricing.title' />
        </p>
      )}
      <div className='flex justify-center downMd:flex-col downMd:items-center downMd:space-y-8 upLg:space-x-8'>
        <FreemiumCard />
        <PremiumCard />
      </div>
    </div>
  );
};
export { Pricing };
