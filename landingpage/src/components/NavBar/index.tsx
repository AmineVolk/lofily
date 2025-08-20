import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';

const NavBarMobile = dynamic(() => import('./Mobile'), {
  ssr: false,
});
const Desktop = dynamic(() => import('./Desktop'), {
  ssr: false,
});

const NavBar = () => {
  const isDesktop = useMediaQuery('(min-width: 1000px)');
  console.log('---------- isDesktop ', isDesktop);
  return (
    <div
      className={clsx([
        'animate__animated animate__slideInDown animate__delay-1s bg-background  z-50 w-full',
      ])}
    >
      {isDesktop ? <Desktop /> : <NavBarMobile />}
    </div>
  );
};

export { NavBar };
