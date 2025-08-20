import Image from 'next/image';
import { useRef, useState } from 'react';
import { CircleMenu as CircleMenu2, CircleMenuItem } from 'react-circular-menu';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxState } from '@/hooks/useReduxState';

import { MAX_WIDTH_MOBILE } from '@/constant';
import { logger } from '@/services/logger';
import { isUserPremium } from '@/services/premium_helper';
import { MenuItemsIndex } from '@/services/redux-state/Store';
const itemStyles = {
  background: '#231526',
  border: 0,
};
const CircleMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [
    { user, currentMenuIndex, displayPricingDialog, isActive, displayTimer },
    { update },
  ] = useReduxState(
    'user,currentMenuIndex,displayPricingDialog,isActive,displayTimer'
  );

  const onClick = (menuIndex: MenuItemsIndex) => {
    if (menuOpen) {
      if (menuIndex === MenuItemsIndex.TIMER) {
        update(['displayTimer'], true);
      }
      if (menuIndex === MenuItemsIndex.YOUTUBE) {
        update(['displayYoutube'], true);
      }
      update(['currentMenuIndex'], menuIndex);

      // close the menu after cick on the menu
      buttonRef?.current?.click();
    }
  };
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  const isDialogDisplayed =
    isMobile &&
    (currentMenuIndex !== 0 || displayPricingDialog || displayTimer);

  logger('CircularButton ', {
    displayPricingDialog,
    displayTimer,
    currentMenuIndex,
  });

  if (isDialogDisplayed || !isActive) return <div />;
  return (
    <div className='absolute bottom-24 right-24 downSm:bottom-52'>
      <CircleMenu2
        startAngle={-90}
        rotationAngle={360}
        itemSize={2}
        radius={5}
        rotationAngleInclusive={false}
        onMenuToggle={(menuActive) => setMenuOpen(menuActive)}
        menuToggleElement={
          <button ref={buttonRef}>
            <Image
              src={
                menuOpen
                  ? '/images/floating_menu/close.svg'
                  : '/images/floating_menu/button.svg'
              }
              width={50}
              height={50}
              alt='menu'
              className='mt-2'
            />
          </button>
        }
      >
        <CircleMenuItem
          onClick={() => onClick(MenuItemsIndex.MIXTS)}
          tooltip='Effects'
          style={itemStyles}
        >
          <Image
            src='/images/floating_menu/mixts.svg'
            width={25}
            height={25}
            alt='effects'
          />
        </CircleMenuItem>
        <CircleMenuItem
          // @ts-expect-error we can use element instead of string
          tooltip={
            <div className='flex items-center space-x-2'>
              {!isUserPremium(user) && (
                <Image
                  src='/images/premium.svg'
                  alt='sdf'
                  width={20}
                  height={20}
                />
              )}
              <div>Notes</div>
            </div>
          }
          style={itemStyles}
          onClick={() => {
            onClick(MenuItemsIndex.NOTES);
          }}
        >
          <Image
            src='/images/floating_menu/notes.svg'
            width={25}
            height={25}
            alt='notes'
          />
        </CircleMenuItem>
        <CircleMenuItem
          // @ts-expect-error we can use element instead of string
          tooltip={
            <div className='flex items-center space-x-2'>
              {!isUserPremium(user) && (
                <Image
                  src='/images/premium.svg'
                  alt='sdf'
                  width={20}
                  height={20}
                />
              )}
              <div>Youtube</div>
            </div>
          }
          style={itemStyles}
          onClick={() => onClick(MenuItemsIndex.YOUTUBE)}
        >
          <Image
            src='/images/floating_menu/youtube.svg'
            width={25}
            height={25}
            alt='youtube'
          />
        </CircleMenuItem>
        <CircleMenuItem
          // @ts-expect-error we can use element instead of string
          tooltip={
            <div className='flex items-center space-x-2'>
              {!isUserPremium(user) && (
                <Image
                  src='/images/premium.svg'
                  alt='sdf'
                  width={20}
                  height={20}
                />
              )}
              <div>Stats</div>
            </div>
          }
          style={itemStyles}
          onClick={() => onClick(MenuItemsIndex.STATS)}
        >
          <Image
            src='/images/floating_menu/stats.svg'
            width={25}
            height={25}
            alt='stats'
          />
        </CircleMenuItem>
        {user ? (
          <CircleMenuItem
            tooltip='Settings'
            style={itemStyles}
            onClick={() => onClick(MenuItemsIndex.SETTINGS)}
          >
            <Image
              src='/images/floating_menu/settings.svg'
              width={25}
              height={25}
              alt='settings'
            />
          </CircleMenuItem>
        ) : (
          <CircleMenuItem
            tooltip='Login'
            style={itemStyles}
            onClick={() => onClick(MenuItemsIndex.PROFILE)}
          >
            <Image
              src='/images/floating_menu/profile.svg'
              width={25}
              height={25}
              alt='Login'
            />
          </CircleMenuItem>
        )}
        <CircleMenuItem
          // @ts-expect-error we can use element instead of string
          tooltip={
            <div className='flex items-center space-x-2'>
              {!isUserPremium(user) && (
                <Image
                  src='/images/premium.svg'
                  alt='sdf'
                  width={20}
                  height={20}
                />
              )}
              <div>Timer</div>
            </div>
          }
          style={itemStyles}
          onClick={() => onClick(MenuItemsIndex.TIMER)}
        >
          <Image
            src='/images/floating_menu/timer.svg'
            width={25}
            height={25}
            alt='timer'
          />
        </CircleMenuItem>
        <CircleMenuItem
          tooltip='Backgrounds'
          style={itemStyles}
          onClick={() => onClick(MenuItemsIndex.SCENES)}
        >
          <Image
            src='/images/floating_menu/scenes.svg'
            width={25}
            height={25}
            alt='Backgrounds'
          />
        </CircleMenuItem>
        <CircleMenuItem
          // @ts-expect-error we can use element instead of string
          tooltip={
            <div className='flex items-center space-x-2'>
              {!isUserPremium(user) && (
                <Image
                  src='/images/premium.svg'
                  alt='sdf'
                  width={20}
                  height={20}
                />
              )}
              <div>Lofimon</div>
            </div>
          }
          style={itemStyles}
          onClick={() => onClick(MenuItemsIndex.LOFIMON)}
        >
          <Image
            src='/images/floating_menu/lofimon.svg'
            width={25}
            height={25}
            alt='lofimon'
          />
        </CircleMenuItem>
      </CircleMenu2>
    </div>
  );
};

export { CircleMenu };
