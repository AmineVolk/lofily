import Image from 'next/image';
import { isIOS } from 'react-device-detect';
import { Trans, useTranslation } from 'react-i18next';

import useMediaQuery from '@/hooks/useMediaQuery';

import { MAX_WIDTH_MOBILE } from '@/constant';

import { Dialog } from './Common/Dialog';
import { GradientButton } from './Common/GradientButton';

const InfoPopin = ({ onClose }: { onClose: () => void }) => {
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);
  const { t } = useTranslation('common');
  return (
    <Dialog
      onValidate={onClose}
      handleClose={onClose}
      className='rounded-none bg-[#231526]'
    >
      <div className='flex flex-col items-center space-y-4 '>
        <div className='flex flex-col items-center'>
          <Image
            src='/images/logo-white.png'
            alt='lofily logo'
            width={48}
            height={48}
          />
          <h2>
            <Trans i18nKey='login.title' />
          </h2>
        </div>
        <div className='text-md flex flex-col items-center space-y-6'>
          {isMobile && (
            <p>
              <Trans i18nKey='info_popin.android' />
            </p>
          )}
          {isMobile && isIOS && (
            <div
              dangerouslySetInnerHTML={{
                __html: t('info_popin.ios'),
              }}
            />
          )}

          <GradientButton
            onClick={onClose}
            className='flex min-w-[120px] justify-center px-12'
          >
            <p>OK</p>
          </GradientButton>
        </div>
      </div>
    </Dialog>
  );
};
export { InfoPopin };
