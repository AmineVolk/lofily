import { useEffect } from 'react';
import { useAudioPlayer } from 'react-use-audio-player';

import { logger } from '@/services/logger';

const ListenEffectItem = ({ src, volume }: { src: string; volume: number }) => {
  logger('---- effect item', { src, volume });
  const { load, togglePlayPause, setVolume } = useAudioPlayer();

  useEffect(() => {
    load(src, { initialVolume: volume, loop: true });
    togglePlayPause();
  }, [src]);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  return <div />;
};
export { ListenEffectItem };
