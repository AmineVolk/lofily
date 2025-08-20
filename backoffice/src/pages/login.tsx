import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as React from 'react';

import { LoginDialog } from '@/components/LoginDialog';

export default function LoginPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className='h-full bg-loginbg bg-contain bg-center bg-no-repeat'>
      <div className='flex h-full flex-1 items-center justify-center'>
        <LoginDialog />
      </div>
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
