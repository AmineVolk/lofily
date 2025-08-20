import clsx from 'clsx';
import { Trans } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { UserApi } from '@/services/api/UserApi';

const HideInactivity = () => {
  const [{ user }, { update }] = useReduxState('user');
  const inactivity = user?.hide_inactivity || 0;

  const handleChange = (value: number) => {
    if (user) {
      return UserApi.update(user.id, {
        hide_inactivity: value,
      }).then(() => update(['user', 'hide_inactivity'], value));
    }
  };
  return (
    <div>
      <h1>
        <Trans i18nKey='setting.inactivity.title' />
      </h1>
      <p className='mt-2 text-gray-500'>
        <Trans i18nKey='setting.inactivity.sub_title' />
      </p>
      <div className='mt-3 flex rounded-md border border-primary-light p-2'>
        <button
          className={clsx([
            'flex-1 rounded-md  p-2 capitalize',
            inactivity === 0 && 'bg-primary-light',
          ])}
          onClick={() => handleChange(0)}
        >
          <Trans i18nKey='setting.inactivity.disabled' />
        </button>

        <button
          className={clsx([
            'flex-1 rounded-md  p-2 ',
            inactivity === 10 && 'bg-primary-light',
          ])}
          onClick={() => handleChange(10)}
        >
          <Trans i18nKey='setting.inactivity.10s' />
        </button>
        <button
          className={clsx([
            'flex-1 rounded-md  p-2 ',
            inactivity === 20 && 'bg-primary-light',
          ])}
          onClick={() => handleChange(20)}
        >
          <Trans i18nKey='setting.inactivity.20s' />
        </button>
        <button
          className={clsx([
            'flex-1 rounded-md  p-2 ',
            inactivity === 30 && 'bg-primary-light',
          ])}
          onClick={() => handleChange(30)}
        >
          <Trans i18nKey='setting.inactivity.30s' />
        </button>
      </div>
    </div>
  );
};
export { HideInactivity };
