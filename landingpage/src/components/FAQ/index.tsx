import { Trans, useTranslation } from 'react-i18next';

import { useIsMounted } from '@/hooks/useIsMounted';

import { FAQItem } from './item';

const FAQ = () => {
  const [mounted] = useIsMounted();

  const { t } = useTranslation('common');
  return (
    <div id='faq' className='my-20 flex w-full flex-1 flex-col'>
      {mounted && (
        <>
          <p className='mb-10 text-center font-magilio text-5xl capitalize downSm:text-3xl'>
            <Trans i18nKey='faq.title' />
          </p>
          <div className='flex flex-col space-y-10'>
            {[...Array(6)].map((_, index) => (
              <FAQItem
                key={index}
                answer={t(`faq.${index}.answer`).toString()}
                question={t(`faq.${index}.question`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export { FAQ };
