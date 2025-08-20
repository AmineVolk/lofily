import { useEffect, useState } from 'react';

import { BrowserApp } from './BrowserApp';
import { GradientLink } from '../Common/GradientLink';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('common');
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div className='flex flex-1 flex-col  downSm:pt-[60px]' id='home'>
      <div className='flex items-center pt-20 downSm:items-start downSm:pt-8 '>
        <div className='flex flex-1 flex-col space-y-8 '>
          <TypeAnimation
            sequence={[t('home.typed').toString(), 2000]}
            speed={20}
            className='block whitespace-pre-line font-magilio text-[70px] font-bold leading-tight downSm:min-h-[70px] downSm:text-2xl upLg:min-h-[130px]'
            repeat={Infinity}
          />
          {hydrated && (
            <p className='font-description text-lg text-gray-300'>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('home.description'),
                }}
              />
            </p>
          )}
          <div className='flex w-full flex-1 '>
            <GradientLink
              href='https://app.lofily.com'
              text='Get Started'
              className='py-4 text-lg xs:w-full'
            />
          </div>
        </div>
        <div className='flex flex-1 justify-end downLg:hidden'>
          <Image
            src='/images/timer-home.svg'
            width={487}
            height={590}
            alt='timer'
          />
        </div>
      </div>
      <BrowserApp />
    </div>
  );
};
export { Home };
