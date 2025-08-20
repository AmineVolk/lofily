import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import '@/styles/hover-min.css';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTACHA?.toString() || ''}
    >
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  );
}

export default appWithTranslation(MyApp);
