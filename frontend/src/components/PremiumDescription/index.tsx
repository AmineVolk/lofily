import clsx from 'clsx';
import Image from 'next/image';
import { Trans } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { MenuItemsIndex } from '@/services/redux-state/Store';
import { DynamicStringType } from '@/type';

import { Dialog } from '../Common/Dialog';
import { GradientButton } from '../Common/GradientButton';

const PremiumDescriptionDialog = ({
  featureIndex,
}: {
  featureIndex: MenuItemsIndex;
}) => {
  const [{ user }, { update }] = useReduxState('user');
  const handleClose = () => {
    update(['currentMenuIndex'], MenuItemsIndex.NONE);
    update(['displayPricingDialog'], false);
    update(['displayTimer'], false);
  };

  const handleClickUpgrade = () => {
    handleClose();

    if (user) {
      update(['displayPricingDialog'], true);
    } else {
      update(['currentMenuIndex'], MenuItemsIndex.PROFILE);
    }
  };
  const styleByIndex: DynamicStringType = {
    2: 'max-w-[534px] min-h-[402px] downSm:min-h-[300px]',
    3: 'max-w-[534px] min-h-[402px] downSm:min-h-[250px]',
    6: 'max-w-[334px] min-h-[400px] downSm:min-h-[300px]',
    8: 'max-w-[534px] min-h-[352px] downSm:min-h-[250px]',
  };
  return (
    <Dialog handleClose={handleClose} withHeader={false}>
      <div className='max-w-[500px] justify-center'>
        <div className='mb-6 flex items-center'>
          <h2>
            <Trans i18nKey={`premium_description.${featureIndex}.title`} />
          </h2>
          <div className='flex flex-1 justify-end'>
            <button onClick={handleClose}>
              <Image
                src='/images/notes/close.svg'
                width={20}
                height={20}
                alt='close button'
              />
            </button>
          </div>
        </div>

        <div className='flex flex-1 justify-center'>
          <div
            className={clsx([
              'relative flex flex-1 flex-col items-center  rounded-lg ',
              styleByIndex[featureIndex],
              featureIndex !== MenuItemsIndex.LOFIMON &&
                'shadow-2xl shadow-primary-light',
            ])}
          >
            {featureIndex === MenuItemsIndex.LOFIMON ? (
              <div className='flex flex-1 items-center downSm:flex-col '>
                <Image
                  src='/images/lofimon/0/0.png'
                  width={150}
                  height={200}
                  alt='user lofimon progression'
                  className='m-2 '
                />
                <Image
                  src='/images/lofimon/1/0.png'
                  width={150}
                  height={200}
                  alt='user lofimon progression'
                  className='m-2'
                />
                <Image
                  src='/images/lofimon/2/0.png'
                  width={150}
                  height={200}
                  alt='user lofimon progression'
                  className='m-2  '
                />
              </div>
            ) : (
              <Image
                src={`/images/premium_description/${featureIndex}.png`}
                fill
                alt='lofily features'
              />
            )}
          </div>
        </div>

        <p className='mt-8  text-center font-semibold '>
          <Trans i18nKey={`premium_description.${featureIndex}.description`} />
        </p>
        <div className='mt-8 flex w-full justify-center'>
          <GradientButton
            className='w-full justify-center py-3'
            onClick={handleClickUpgrade}
          >
            <>
              <Image
                src='/images/premium-white.svg'
                alt='premium'
                className='mr-2'
                width={20}
                height={20}
              />
              <p className='font-semibold'>
                <Trans i18nKey={user ? 'pricing.button' : 'pricing.signup'} />
              </p>
            </>
          </GradientButton>
        </div>
      </div>
    </Dialog>
  );
};
export { PremiumDescriptionDialog };
