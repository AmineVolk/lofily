import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { logger } from '@/services/logger';

const MusicVolume = ({
  handleVolume,
  volume,
}: {
  handleVolume: (newValue: number) => void;
  volume: number;
}) => {
  const [isHover, setIsHover] = useState<boolean | null>(null);
  const [{ previousVolume }, { update }] = useReduxState('previousVolume');
  logger('MusicVolume previousVolume ', previousVolume);
  const animation = isHover
    ? 'animate-[slidInBottom_0.4s_forwards]'
    : 'animate-[slidOutBottom_0.3s_forwards]';

  const onClickOnMute = () => {
    const newValue = volume > 0 ? 0 : previousVolume;
    return handleVolume(newValue);
  };

  return (
    <div
      className='flex'
      id='AnimateComponentFromBottom'
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <button className='p-1' onClick={onClickOnMute}>
        <Image
          src={`/images/bottom_bar/${volume ? 'volume' : 'mute'}.svg`}
          alt='volume'
          priority
          width={25}
          height={25}
        />
      </button>
      {typeof isHover === 'boolean' && (
        <div
          className={clsx(
            `absolute bottom-0 left-0 w-full`,
            animation,
            !isHover && 'pointer-events-none'
          )}
          id='animated-volume'
        >
          <div className='flex min-h-[48px] rounded-t-md bg-primary-dark  p-3  text-white'>
            <input
              onChange={({ target: { value } }) =>
                handleVolume(parseInt(value))
              }
              type='range'
              min={0}
              max={100}
              value={volume}
              className='w-full text-secondary-base  accent-secondary-base'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { MusicVolume };
