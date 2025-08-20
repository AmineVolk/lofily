import clsx from 'clsx';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxState } from '@/hooks/useReduxState';

import { MAX_WIDTH_MOBILE } from '@/constant';
import { UserApi } from '@/services/api/UserApi';

import Header from './Header';
import { InfoPopin } from './InfoPopin';
import { MusicPlayer } from './MusicPlayer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [displayInfosPopin, setDisplayInfosPopin] = useState(false);
  const [{ isActive }, { update }] = useReduxState('isActive,user');
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  const getUser = () => {
    return UserApi.me().then((user) => {
      update(['user'], user);
      return user;
    });
  };

  useEffect(() => {
    if (isMobile) {
      setDisplayInfosPopin(true);
    }
    if (!mounted) {
      setMounted(true);
    }
    getUser();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className='flex h-full flex-1 flex-col bg-primary-dark px-6'
      id='layout'
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
    `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_GA_MEASUREMENT_ID}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Head>
        <title> Lofily.com - Your ultimate Lofi music haven</title>
      </Head>
      <div className={clsx([!isActive && 'hidden'])}>
        {displayInfosPopin && (
          <InfoPopin onClose={() => setDisplayInfosPopin(false)} />
        )}
        <Image
          src='/images/logo-white.png'
          width={36}
          height={26}
          alt='logo'
          className='absolute left-10 top-8 z-50 downSm:left-3 downMd:top-11'
        />
      </div>
      <Header />
      {children}
      <MusicPlayer />
    </div>
  );
}
