/* eslint-disable no-undef */

import React, { useEffect, useState } from 'react';
import { useClickOutside } from 'react-click-outside-hook';

import { logger } from '@/services/logger';

type Props = {
  triggerOnHover?: boolean;
  text?: string;
  Icon: () => JSX.Element;
  children: JSX.Element;
  disbled?: boolean;
  displayRight?: boolean;
};
const DrowDownMenu = ({
  triggerOnHover,
  text,
  Icon,
  children,
  disbled,
}: Props) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [ref, hasClickedOutside] = useClickOutside();

  useEffect(() => {
    logger('--- dropDown useffect ---', hasClickedOutside);

    if (hasClickedOutside) {
      setButtonClicked(false);
      setButtonHover(false);
    }
  }, [hasClickedOutside]);

  const shouldDisplayDropdown = () => {
    return triggerOnHover ? buttonHover : buttonClicked;
  };
  return (
    <div className='relative inline-block text-left' ref={ref}>
      <div className='flex items-center'>
        <button
          disabled={disbled}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          type='button'
          className='flex items-center rounded-md p-2'
          onClick={() => setButtonClicked(!buttonClicked)}
        >
          {text && <span className='mr-2 text-sm text-black'>{text}</span>}
          <Icon />
        </button>
      </div>
      {shouldDisplayDropdown() && (
        <div
          className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='menu-button'
        >
          {children}
        </div>
      )}
    </div>
  );
};

export { DrowDownMenu };
