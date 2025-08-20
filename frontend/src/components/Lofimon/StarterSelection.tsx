import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { UserApi } from '@/services/api/UserApi';

import { LofimonButton } from './Button';
import { LofimonCard } from './LofimonCard';
import { ConfirmDialog } from '../Common/ConfirmDialog';

const StarterSelection = () => {
  const [selectedStarter, setselectedStarter] = useState(1);
  const { t } = useTranslation('common');
  const [{ user }, { update }] = useReduxState('user');
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);

  const handleClickConfirm = () => setDisplayConfirmDialog(true);

  const handleConfirmStarter = () => {
    if (user) {
      UserApi.update(user.id, {
        starter_index: selectedStarter,
        starter_begin_date: new Date(),
      }).then((result) => update(['user'], result.data));
    }
  };

  return (
    <div className=' flex-col space-y-10 overflow-y-hidden upLg:max-w-[750px]'>
      <h1 className='text-center'>{t('lofimon.title')}</h1>
      <div className='flex py-4 downSm:flex-col downSm:items-center downSm:space-y-8 upMd:justify-center upMd:space-x-8'>
        {[...new Array(3)].map((_, i) => (
          <LofimonCard
            onClick={() => setselectedStarter(i)}
            key={i}
            img={`/images/lofimon/${i}/0.png`}
            text={t(`lofimon.${i}.title`).toString()}
            starterSelected={selectedStarter === i}
          />
        ))}
      </div>{' '}
      {displayConfirmDialog && (
        <ConfirmDialog
          onValidate={handleConfirmStarter}
          handleClose={() => setDisplayConfirmDialog(false)}
          title={t('lofimon.confirm_lofimon')}
        />
      )}
      <div className='flex min-h-[148px] flex-1 flex-col px-8 text-center text-lg'>
        <p className='mb-2'> {t('lofimon.description')}</p>
        <p>{t('lofimon.description2')}</p>
      </div>
      <div className='flex flex-1 justify-center'>
        <LofimonButton text={t('confirm')} onClick={handleClickConfirm} />
      </div>
    </div>
  );
};

export { StarterSelection };
