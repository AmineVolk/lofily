/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import * as React from 'react';
import { isIOS } from 'react-device-detect';
import { Trans, useTranslation } from 'react-i18next';

import { useDate } from '@/hooks/useDate';
import { useReduxState } from '@/hooks/useReduxState';

import { AuthApi } from '@/services/api/Auth';
import { getLofimonData } from '@/services/helper';
import { isUserPremium } from '@/services/premium_helper';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { IconButton } from './Common/Buttons/IconButton';
import { LofimonProgressBar } from './Lofimon/ProgressBar';
import { PricingPopup } from './Pricing';

function Header() {
  const { t } = useTranslation('common');
  const [{ user, displayPricingDialog, isActive }, { update }] = useReduxState(
    'user,displayPricingDialog,isActive'
  );

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
  const { time } = useDate();

  const loginLogoutButton = () => {
    user
      ? AuthApi.logout().then(() => {
          localStorage.clear();
          window.location.reload();
        })
      : update(['currentMenuIndex'], MenuItemsIndex.PROFILE);
  };

  const lofimonData = user ? getLofimonData(user?.starter_usage_minutes) : null;
  return (
    <header className={clsx(['z-20 ', !isActive && 'hidden'])}>
      <div className='flex flex-wrap justify-end space-x-4 rounded-md p-3 pt-8 pr-0 text-white'>
        {displayPricingDialog && (
          <PricingPopup
            handleClose={() => update(['displayPricingDialog'], false)}
          />
        )}
        {(!user || !isUserPremium(user)) && (
          <button
            className='flex h-10 items-center rounded-md bg-primary-dark px-2 opacity-90 upMd:w-[200px] downMd:mt-2 '
            onClick={() => update(['displayPricingDialog'], true)}
          >
            <img
              src='/images/top_bar/premuim.svg'
              alt='premium'
              className='mr-2 h-5 w-5'
            />
            <p className='text-xs font-semibold'>{t('nav.premium')}</p>
          </button>
        )}
        <button
          className='flex items-center rounded-md bg-primary-dark p-2 px-3 opacity-90 downMd:mt-2'
          onClick={loginLogoutButton}
        >
          <Trans i18nKey={user ? 'logout' : 'nav.login'} />
        </button>
        <div className='flex items-center rounded-md bg-primary-dark p-2 px-3 opacity-90 downMd:mt-2'>
          <p className='font-semibold'>{time}</p>
        </div>
        {!isIOS && (
          <div className='rounded-md bg-primary-dark p-2 opacity-90 downMd:mt-2'>
            <IconButton
              onClick={handleFullScreen}
              className='hvr-grow'
              icon={
                <img src='/images/top_bar/fullscreen.svg' alt='fullscreen' />
              }
            />
          </div>
        )}
      </div>
      {user && isUserPremium(user) && user?.starter_index !== null && (
        <div className='flex flex-1 items-center justify-end'>
          <button
            className='mr-4  rounded-[50%] border-[1px] border-secondary-base bg-primary-dark p-4'
            onClick={() => update(['currentMenuIndex'], MenuItemsIndex.LOFIMON)}
          >
            <img
              src={`/images/lofimon/${user?.starter_index}/${lofimonData?.level}.png`}
              about='lofimon-home-page'
              alt='user lofimon progression'
              className='h-[30px] w-[30px]'
            />
          </button>
          {user && lofimonData && (
            <LofimonProgressBar className='w-[70px] rounded-sm bg-primary-dark text-white' />
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
