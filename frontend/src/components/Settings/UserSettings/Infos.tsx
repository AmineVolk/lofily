import { useState } from 'react';
import { Trans } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { ButtonLoader } from '@/components/Common/Loader';

import { UserApi } from '@/services/api/UserApi';

const Infos = () => {
  const [{ user }, { update }] = useReduxState('user');
  const [username, setUsername] = useState(user?.username);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (user && username && username !== user.username) {
      setLoading(true);

      return UserApi.update(user.id, {
        username: username,
      }).then(() => {
        update(['user'], {
          ...user,
          username,
        });
        setLoading(false);
      });
    }
  };
  return (
    <div className='border-b-2 border-primary-light pb-6'>
      <h1 className='mb-4'>
        <Trans i18nKey='setting.infos.title' />
      </h1>
      <div className='flex flex-1 items-center downSm:flex-col downSm:items-start downSm:space-y-4'>
        <p className='mr-4 flex cursor-not-allowed space-x-4 rounded-md bg-primary-light p-4 text-gray-400 xs:w-full'>
          {user?.email}
        </p>
        <input
          className='mr-4 rounded-md bg-primary-light p-4 xs:w-full'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          disabled={loading}
          onClick={handleSave}
          className='mb-0 flex h-[45px] max-w-[80px] items-center justify-center rounded-md border border-primary-light px-4 py-2 text-secondary-base  '
        >
          <Trans i18nKey='save' /> {loading && <ButtonLoader />}
        </button>
      </div>
    </div>
  );
};
export { Infos };
