import { Contact } from '@/components/Contact';
import CookieConsent from 'react-cookie-consent';
import { FAQ } from '@/components/FAQ';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Home } from '@/components/Home';
import { LogoCarousel } from '@/components/LogoCarousel';
import { NavBar } from '@/components/NavBar';
import { Pricing } from '@/components/Pricing';
import { SEO } from '@/components/SEO';
import Script from 'next/script';
import { Testimonals } from '@/components/Testimonals';
import sal from 'sal.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation('common');
  useEffect(() => {
    sal();
  }, []);
  return (
    <div className='bg-primary-dark '>
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
          gtag('set', 'linker', {
            'domains': ['app.lofily.com']
            });
        `}
      </Script>
      <CookieConsent
        location='bottom'
        buttonText={t('cookies.button')}
        cookieName='lofily-cookies-consent'
        style={{ background: '#392C3B' }}
        buttonStyle={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: '13px',
          background: '#F98754',
          padding: '10px 20px',
          borderRadius: 8,
        }}
        expires={150}
      >
        {t('cookies.text')}
      </CookieConsent>
      <SEO />
      {/* <CouponBanner /> */}
      <div
        className='flex flex-1 flex-col items-center justify-center bg-primary-dark px-10 up2Xl:px-32'
        id='main'
      >
        <NavBar />
        <Home /> <p className='mt-20 mb-6 font-magilio text-5xl'>As seen on</p>
        <LogoCarousel />
        <Features />
        <Pricing />
        <Testimonals />
        <Contact />
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
export type LocalProps = {
  locale: string;
};
export async function getStaticProps({ locale }: LocalProps) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
