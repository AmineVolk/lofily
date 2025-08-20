import Image from 'next/image';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { PomodoroSettings } from '@/Dto/Pomodoro/PomodoroSettings';
import { PomodoroApi } from '@/services/api/PomodoroApi';
import { UserApi } from '@/services/api/UserApi';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { FormWrapper } from '../Common/FormWrapper';
import { Input } from '../Common/Input';

const TimerSettings = ({
  onClickBack,
  onClickReload,
}: {
  onClickBack: () => void;
  onClickReload: (newSettings?: PomodoroSettings) => void;
}) => {
  const { t } = useTranslation('common');
  const [{ user }, { update }] = useReduxState('user');
  const [settings, setSettings] = useState<PomodoroSettings | undefined>(
    user?.pomodoro_settings
  );

  const onClose = () => {
    update(['displayTimer'], false);
    update(['currentMenuIndex'], MenuItemsIndex.NONE);
  };
  const onSubmit = () => {
    if (user) {
      return UserApi.update(user.id, { pomodoro_settings: settings })
        .then(() => PomodoroApi.reset())
        .then(() => {
          onClickReload(settings);
          onClickBack();
        });
    }
  };

  const Header = () => (
    <div className='flex items-center'>
      <div className='relative right-3 flex items-center'>
        <button type='button' onClick={onClickBack}>
          <Image
            src='/images/notes/back.svg'
            width={36}
            height={36}
            alt='back'
          />
        </button>
        <p className='text-md font-semibold capitalize'>
          <Trans i18nKey='timer.settings.title' />
        </p>
      </div>
      <div className='flex flex-1 justify-end'>
        <button onClick={onClose}>
          <Image
            src='/images/notes/close.svg'
            width={24}
            height={24}
            alt='close-timer'
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col'>
      <Header />
      {settings && (
        <FormWrapper onSubmit={onSubmit} values={settings}>
          <div className='my-4 w-full'>
            <p className='text-md mb-3 font-bold'>
              <Trans i18nKey='timer.settings.pomodoro_time' />
            </p>
            <Input
              id='pomodoro_duration'
              type='number'
              value={settings?.pomodoro_duration}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  pomodoro_duration: parseInt(value.toString()),
                })
              }
              validation={{
                required: t('timer.settings.pomodoro_time_required'),
              }}
            />
            <p className='text-md mb-3 font-bold'>
              <Trans i18nKey='timer.settings.short_break' />
            </p>
            <Input
              id='short_break_duration'
              type='number'
              value={settings.short_break_duration}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  short_break_duration: parseInt(value.toString()),
                })
              }
              validation={{
                required: t('timer.settings.short_break_required'),
              }}
            />
            <p className='text-md mb-3 font-bold'>
              <Trans i18nKey='timer.settings.long_break' />
            </p>
            <Input
              id='long_break_duration'
              type='number'
              value={settings.long_break_duration}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  long_break_duration: parseInt(value.toString()),
                })
              }
              validation={{
                required: t('timer.settings.long_break_required'),
              }}
            />
            <p className='text-md mb-3 font-bold'>
              <Trans i18nKey='timer.settings.long_break_interval' />
            </p>
            <Input
              id='long_break_interval'
              type='number'
              value={settings.long_break_interval}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  long_break_interval: parseInt(value.toString()),
                })
              }
              validation={{
                required: t('timer.settings.long_break_interval_required'),
              }}
            />
            <button className='w-full rounded-md border  border-primary-light px-6 py-2 font-bold text-secondary-base'>
              <Trans i18nKey='save' />
            </button>
          </div>
        </FormWrapper>
      )}
    </div>
  );
};
export { TimerSettings };
