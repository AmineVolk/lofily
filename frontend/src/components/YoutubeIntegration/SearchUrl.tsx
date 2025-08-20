import Image from 'next/image';
import { KeyboardEvent } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';

import useMediaQuery from '@/hooks/useMediaQuery';

import { MAX_WIDTH_MOBILE } from '@/constant';

const SearchUrl = ({
  handleKeyDown,
  setUrl,
  url,
  handleClose,
}: {
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setUrl: (value: string) => void;
  url: string;
  handleClose: () => void;
}) => {
  const { t } = useTranslation('common');
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  return (
    <Draggable disabled={isMobile}>
      <div className='flex cursor-move space-x-2  rounded-md  bg-primary-dark p-3 shadow-2xl'>
        <input
          className='mr-21 w-full rounded-sm bg-primary-light p-1'
          placeholder={t('youtube.input_placeholder').toString()}
          onKeyDown={handleKeyDown}
          onChange={(event) => setUrl(event.target.value)}
          value={url}
        />
        <button onClick={handleClose}>
          <Image
            src='/images/youtube/close.svg'
            width={18}
            height={18}
            alt='close'
          />
        </button>
      </div>
    </Draggable>
  );
};
export { SearchUrl };
