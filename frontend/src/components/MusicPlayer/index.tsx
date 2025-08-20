/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { isIOS } from 'react-device-detect';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { useDebouncedCallback } from 'use-debounce';

import { useMusic } from '@/hooks/useMusic';
import { useReduxState } from '@/hooks/useReduxState';

import { UserApi } from '@/services/api/UserApi';
import { logger } from '@/services/logger';
import { MusicStatus } from '@/services/redux-state/Store';

import { MusicInfos } from './MusicInfos';
import { MusicVolume } from './MusicVolume';
const VOLUME_MAX = 100;

const MusicPlayer = () => {
  const { currentMusic, next, previous } = useMusic();
  const { load, setVolume, volume, togglePlayPause } = useGlobalAudioPlayer();

  const [{ isActive, user, musicStatus, previousVolume }, { update }] =
    useReduxState('isActive,user,musicStatus,previousVolume');

  const isPlaying = musicStatus === MusicStatus.PLAYING;

  const handleStartPauseMusic = () => {
    togglePlayPause();
    if (
      musicStatus === MusicStatus.PAUSED ||
      musicStatus === MusicStatus.NOT_SET
    ) {
      update(['musicStatus'], MusicStatus.PLAYING);
    }
    if (musicStatus === MusicStatus.PLAYING) {
      update(['musicStatus'], MusicStatus.PAUSED);
    }
  };

  const saveVolume = async (newVolume: number) => {
    if (user) {
      UserApi.update(user.id, { volume: newVolume });
    }
  };
  const saveVolumeDebounced = useDebouncedCallback(saveVolume, 300);

  const handleVolume = (newVolume: number) => {
    update(['previousVolume'], volume * 100);

    setVolume(newVolume / VOLUME_MAX);

    if (user) {
      update(['user', 'volume'], newVolume);

      saveVolumeDebounced(newVolume);
    }
  };

  useEffect(() => {
    if (currentMusic) {
      const usedVolume = user?.volume
        ? (user?.volume || 0) / VOLUME_MAX
        : volume;

      logger('----------- music player load ', {
        isPlaying,
        previousVolume,
        url: currentMusic.url,
        uservolume: user?.volume,
        volume,
        usedVolume,
      });

      load(currentMusic.url, {
        onend: next,
        initialVolume: usedVolume,
        autoplay: isPlaying,
      });
    }
  }, [currentMusic?.url]);
  return (
    <div>
      <div className={clsx([!isActive && 'hidden'])}>
        <MusicInfos
          artiste={currentMusic?.artist}
          title={currentMusic?.title}
          image={currentMusic?.image}
          artist_link={currentMusic?.artist_link}
        />
      </div>

      <div
        className={clsx([
          'absolute  left-1/2 bottom-4 z-50  flex -translate-x-1/2 transform justify-center downSm:w-[205px]',
          !isActive && 'hidden',
        ])}
      >
        <div className='z-50 flex min-h-[48px] items-center space-x-8 rounded-md bg-primary-dark p-3 text-white'>
          <button onClick={previous}>
            <Image
              src='/images/bottom_bar/back.svg'
              alt='back'
              width={25}
              height={25}
              priority
            />
          </button>
          <button onClick={handleStartPauseMusic}>
            <Image
              src={
                isPlaying
                  ? '/images/bottom_bar/pause.svg'
                  : '/images/bottom_bar/play.svg'
              }
              alt={isPlaying ? 'pause' : 'play'}
              priority
              width={25}
              height={25}
            />
          </button>
          <button onClick={next}>
            <Image
              src='/images/bottom_bar/next.svg'
              alt='next'
              priority
              width={25}
              height={25}
            />
          </button>
          {!isIOS && (
            <MusicVolume
              handleVolume={handleVolume}
              volume={(volume || 0) * 100}
            />
          )}
        </div>
      </div>
    </div>
  );
};
const MusicPlayerMemoized = React.memo(MusicPlayer);
export { MusicPlayerMemoized as MusicPlayer };
