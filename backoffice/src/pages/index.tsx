import Image from 'next/image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as React from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { Background } from '@/components/Background';
import { Category } from '@/components/Category';
import Layout from '@/components/common/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Effects } from '@/components/Effects';
import { Music } from '@/components/Music';
import { Users } from '@/components/Users';

import { AuthApi } from '@/services/api/Auth';
import { CategoryApi } from '@/services/api/Category';
import { IDictionary } from '@/type';

export default function HomePage() {
  const router = useRouter();
  const [{ currentMenuItem }, { update }] = useReduxState('currentMenuItem');
  React.useEffect(() => {
    CategoryApi.getAll().then(({ data }) => update(['categories'], data));
  }, []);
  const componentByItem = (): IDictionary => ({
    0: () => <Dashboard />,
    1: () => <Users />,
    2: () => <Category />,
    3: () => <Background />,
    4: () => <Effects />,
    5: () => <Music />,
  });

  const item = currentMenuItem as number;
  const dynamicComponent = componentByItem()[item]();

  return (
    <Layout>
      <button className='absolute top-6 right-8'>
        <Image
          src='/images/logout.svg'
          alt='logout'
          width={25}
          height={20}
          onClick={() => AuthApi.logout().then(() => router.reload())}
        />
      </button>
      {dynamicComponent}
    </Layout>
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
