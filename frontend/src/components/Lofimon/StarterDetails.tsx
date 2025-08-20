import Image from 'next/image';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { UserApi } from '@/services/api/UserApi';
import { getLofimonData } from '@/services/helper';

import { LofimonButton } from './Button';
import { LofimonProgressBar } from './ProgressBar';
import { ConfirmDialog } from '../Common/ConfirmDialog';

const StarterDetails = () => {
  const [{ user }, { update }] = useReduxState('user');
  const { t } = useTranslation('common');
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);

  const handleChangeStarter = () => {
    if (user) {
      UserApi.update(user.id, {
        starter_index: null,
        starter_begin_date: null,
      }).then((data) => {
        update(['user'], data.data);
      });
    }
  };
  const lofimonData = user ? getLofimonData(user?.starter_usage_minutes) : null;

  return (
    <div className='flex max-w-[800px] space-x-8 p-4 downSm:flex-col'>
      <div className='flex items-center rounded-3xl border-2 border-secondary-base bg-primary-dark p-8 shadow-md shadow-secondary-base downSm:mb-8'>
        <Image
          src={`/images/lofimon/${user?.starter_index}/${lofimonData?.level}.png`}
          width={550}
          height={300}
          alt='user lofimon progression'
          className='m-2 animate-circularMove'
        />
      </div>{' '}
      {displayConfirmDialog && (
        <ConfirmDialog
          onValidate={handleChangeStarter}
          handleClose={() => setDisplayConfirmDialog(false)}
          title={t('lofimon.confirm_reset')}
          description={t('lofimon.confirm_reset_description').toString()}
        />
      )}
      <div className='flex flex-col'>
        <h1 className='mb-4'>
          <Trans
            i18nKey={`lofimon.${user?.starter_index}.${lofimonData?.level}.title`}
          />
        </h1>
        <p className='mb-10 text-xl'>
          <Trans
            i18nKey={`lofimon.${user?.starter_index}.${lofimonData?.level}.description`}
          />
        </p>
        <p className='text-xl'>
          <Trans
            i18nKey={`lofimon.${user?.starter_index}.${lofimonData?.level}.description2`}
          />
        </p>

        <p className='mt-4 text-center text-lg font-bold'>
          <Trans i18nKey='lofimon.next_evolve' />
        </p>
        <LofimonProgressBar className='mt-4' />

        <div className='mt-8 flex flex-1 justify-center'>
          <LofimonButton
            text={t('lofimon.change_starter')}
            onClick={() => setDisplayConfirmDialog(true)}
            className='h-[100px] w-[250px]'
          />
        </div>
      </div>
    </div>
  );
};
export { StarterDetails };
