import { Contact } from './Contact';
import { Dialog } from '../Common/Dialog';
import { DynamicComponentType } from '@/type';
import { Features } from './Features';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Link from 'next/link';
import { MenuItemsIndex } from '@/services/redux-state/Store';
import { Share } from './Share';
import { UserSettings } from './UserSettings';
import clsx from 'clsx';
import { useReduxActions } from '@/hooks/useReduxState';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const menuItemByIndex: DynamicComponentType = {
  0: () => <UserSettings />,
  1: () => <Features />,
  2: () => (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTACHA?.toString() || ''}
    >
      <Contact />
    </GoogleReCaptchaProvider>
  ),
  3: () => <Share />,
};

const SettingsDialog = () => {
  const { t } = useTranslation('common');
  const [currentItem, setCurrentItem] = useState<number>(0);
  const { update } = useReduxActions();

  const HeaderItem = ({
    text,
    onClick,
    selected,
  }: {
    text: string;
    onClick: () => void;
    selected?: boolean;
  }) => (
    <button
      className={clsx([
        'mb-4  mr-4 border-b pb-2 duration-300 hover:border-secondary-base hover:text-secondary-base',
        selected
          ? 'border-secondary-base text-secondary-base'
          : 'border-b-primary-dark ',
      ])}
      onClick={onClick}
    >
      {text}
    </button>
  );

  const Header = () => (
    <div
      className='relative mb-6 flex flex-wrap pr-10 text-sm font-semibold text-gray-500'
      id='setting-header'
    >
      <HeaderItem
        text={t('setting.header.settings')}
        onClick={() => setCurrentItem(0)}
        selected={currentItem === 0}
      />
      <HeaderItem
        text={t('setting.header.features')}
        onClick={() => setCurrentItem(1)}
        selected={currentItem === 1}
      />
      <HeaderItem
        text={t('setting.header.contact')}
        onClick={() => setCurrentItem(2)}
        selected={currentItem === 2}
      />
      <HeaderItem
        text={t('setting.header.share')}
        onClick={() => setCurrentItem(3)}
        selected={currentItem === 3}
      />
      <Link
        href='https://lofily.com/#faq'
        target='_blank'
        rel='noreferrer'
        className='mb-4  mr-4 border-b border-primary-dark pb-2 duration-300 hover:border-secondary-base hover:text-secondary-base'
      >
        {t('setting.header.faq')}
      </Link>{' '}
      <div className='absolute right-0 flex flex-1 justify-end'>
        <button
          className='ml-4 items-center border-0 bg-transparent text-black'
          onClick={() => update(['currentMenuIndex'], MenuItemsIndex.NONE)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='white'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  );

  const DynamicComponent = menuItemByIndex[currentItem]();
  return (
    <Dialog
      withHeader={false}
      handleClose={() => {
        update(['currentMenuIndex'], MenuItemsIndex.NONE);
      }}
    >
      <div className='flex flex-col xs:max-w-[500px] downSm:max-h-[80vh] upLg:h-[600px] upLg:w-[700px]'>
        <Header />
        {DynamicComponent}
      </div>
    </Dialog>
  );
};
export { SettingsDialog };
