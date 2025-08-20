import { Trans } from 'react-i18next';

import { AuthApi } from '@/services/api/Auth';

import { ChangePassword } from './ChangePassword';
import { HideInactivity } from './hideInactivity';
import { Infos } from './Infos';
import { Membership } from './Membership';

const UserSettings = () => {
  const onClickLogout = () =>
    AuthApi.logout().then(() => {
      localStorage.clear();
      window.location.reload();
    });
  return (
    <div className='flex flex-col space-y-6'>
      <Infos />
      <ChangePassword />
      <Membership />
      <HideInactivity />
      <div className='flex justify-center pb-6 pt-2'>
        <button
          onClick={onClickLogout}
          className='w-full rounded-md border border-primary-light py-2 text-secondary-base upMd:w-[300px]'
        >
          <Trans i18nKey='logout' />
        </button>
      </div>
    </div>
  );
};
export { UserSettings };
