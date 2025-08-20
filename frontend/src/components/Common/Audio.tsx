import { useEffect, useState } from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { logger } from '@/services/logger';
import { MusicStatus } from '@/services/redux-state/Store';

const AudioListener = ({ url, volume }: { url: string; volume: number }) => {
  const [{ musicStatus }] = useReduxState('musicStatus');
  const [audio, setAudio] = useState(new Audio(url));
  // audio.loop = true;

  logger('AudioListner   ', { musicStatus, volume, url });

  useEffect(() => {
    if (musicStatus === MusicStatus.PLAYING) {
      audio.play();
    }
    if (musicStatus === MusicStatus.PAUSED) {
      audio.pause();
    }
  }, [musicStatus]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  // useEffect(() => {
  //   setAudio(new Audio(url));
  // }, [url]);

  return <></>;
};
export { AudioListener };
