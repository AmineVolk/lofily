import Image from 'next/image';
import { isIOS } from 'react-device-detect';

import { GetUserMuiscEffect } from '@/Dto/UserMusicEffect/GetUserMusicEffect.dto';
import { logger } from '@/services/logger';

const EffectItem = ({
  userMuiscEffect,
  onChangeVolume,
}: {
  userMuiscEffect: GetUserMuiscEffect;
  onChangeVolume: (volume: number) => void;
}) => {
  const isEffectStart =
    typeof userMuiscEffect?.volume === 'number' && userMuiscEffect?.volume > 0;

  const newVolume =
    typeof userMuiscEffect?.volume === 'number' ? userMuiscEffect?.volume : 0;

  if (userMuiscEffect.id === 13) {
    logger('-------- volume ', { newVolume });
  }
  const startPauseEffect = () => {
    return onChangeVolume(isEffectStart ? 0 : 100);
  };

  return (
    <div className='flex flex-1 justify-start rounded-md bg-primary-light p-4'>
      <div className='flex flex-1 justify-start'>
        <p className='capitalize'>{userMuiscEffect.name}</p>
      </div>
      {isIOS ? (
        <button onClick={startPauseEffect}>
          <Image
            src={
              isEffectStart
                ? '/images/bottom_bar/pause.svg'
                : '/images/bottom_bar/play.svg'
            }
            alt={isEffectStart ? 'pause' : 'play'}
            priority
            width={25}
            height={25}
          />
        </button>
      ) : (
        <div className='flex flex-1 justify-end'>
          <input
            id={userMuiscEffect.name}
            type='range'
            min={0}
            max={100}
            value={newVolume}
            className='text-secondary-base accent-secondary-base'
            onChange={({ target: { value } }) =>
              onChangeVolume(parseInt(value))
            }
          />
        </div>
      )}
    </div>
  );
};
export { EffectItem };
