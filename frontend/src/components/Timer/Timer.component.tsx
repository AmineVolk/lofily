import Image from 'next/image';
import React, { useState } from 'react';
import {
  ColorFormat,
  CountdownCircleTimer,
} from 'react-countdown-circle-timer';
import Draggable from 'react-draggable';
import { Trans } from 'react-i18next';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxState } from '@/hooks/useReduxState';

import { MAX_WIDTH_MOBILE } from '@/constant';
import { PomodoroSettings } from '@/Dto/Pomodoro/PomodoroSettings';
import { PomodoroType } from '@/enum';
import { logger } from '@/services/logger';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { TimerSettings } from './Settings';
import { TimerTask } from './Tasks';

type TimerComponentType = {
  isPlaying: boolean;
  initialRemainingTime?: number;
  currentPomodoroType: PomodoroType;
  duration: number;
  onClickStart: () => void;
  onClickPause: () => void;
  onComplete: () => void;
  onClickReload: (newSettings?: PomodoroSettings) => void;
  setRemainingTime: (remainingTime: number) => void;
  timerKey: number;
};

const colorByPomodoroType = {
  [PomodoroType.pomodoro]: 'url(#timer-color)',
  [PomodoroType.short_break]: '#2E8A99',
  [PomodoroType.long_break]: '#1B9C85',
};

const TimerComponent = ({
  isPlaying,
  currentPomodoroType,
  initialRemainingTime,
  onClickStart,
  onClickPause,
  onComplete,
  setRemainingTime,
  duration,
  timerKey = 0,
  onClickReload,
}: TimerComponentType) => {
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);

  const [{ user }, { update }] = useReduxState('user');
  const onClose = () => {
    update(['displayTimer'], false);
    update(['currentMenuIndex'], MenuItemsIndex.NONE);
  };

  logger('-- timer ', { duration, initialRemainingTime, timerKey });
  const onClickSettings = () => {
    setDisplaySettings(true);
  };

  const onClickBack = () => {
    setDisplaySettings(false);
  };

  const Header = () => (
    <div className='flex items-center'>
      <p className='font-semibold capitalize'>
        <Trans i18nKey='setting.features.1.title' />
      </p>
      <div className='flex flex-1 justify-end space-x-3'>
        <button onClick={onClickSettings}>
          <Image
            src='/images/timer/setting.svg'
            width={36}
            height={36}
            alt='settings-timer'
          />
        </button>
        <button onClick={onClose}>
          <Image
            src='/images/notes/close.svg'
            width={24}
            height={24}
            alt='close-timer'
          />
        </button>
      </div>
    </div>
  );

  const getRemainingTime = (remainingTimeSecond: number) => {
    const minutes = Math.floor((remainingTimeSecond % 3600) / 60);
    const seconds = remainingTimeSecond % 60;
    return (
      <p className='text-5xl font-bold'>
        {minutes}:{seconds}
      </p>
    );
  };

  const Buttons = () => (
    <div className='my-6 flex justify-center space-x-3'>
      <button onClick={isPlaying ? onClickPause : onClickStart}>
        <Image
          src={isPlaying ? '/images/timer/pause.svg' : '/images/timer/play.svg'}
          width={36}
          height={36}
          alt='restart-timer'
        />
      </button>
      <button onClick={() => onClickReload()}>
        <Image
          src='/images/timer/reload.svg'
          width={36}
          height={36}
          alt='restart-timer'
        />
      </button>
    </div>
  );

  const renderRemainingTimeSection = ({
    remainingTime,
  }: {
    remainingTime: number;
  }) => {
    const isHavingLongBreak =
      user?.pomodoro_settings?.long_break_interval &&
      user?.pomodoro_settings?.long_break_interval > 0;

    const maxSession = isHavingLongBreak
      ? '/' + user?.pomodoro_settings.long_break_interval
      : '';

    const nbrSession = `${
      isHavingLongBreak ? user?.nbr_ended_pomodoro : ''
    } ${maxSession}`;

    return (
      <div>
        <p className='text-center'>{getRemainingTime(remainingTime)}</p>
        <p className='mt-2 text-center text-xs font-bold text-gray-500'>
          <Trans i18nKey={`timer.type.${currentPomodoroType}`} />{' '}
          {currentPomodoroType === PomodoroType.pomodoro && (
            <span className='text-gray-400'>{nbrSession}</span>
          )}
        </p>
      </div>
    );
  };
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  return (
    <Draggable disabled={isMobile}>
      <div className='max-h-[70vh] max-w-[340px] cursor-move overflow-auto rounded-2xl bg-primary-dark px-4 py-2  shadow-2xl '>
        {displaySettings ? (
          <TimerSettings
            onClickBack={onClickBack}
            onClickReload={onClickReload}
          />
        ) : (
          <div className='mb-4'>
            <Header />
            <div className='my-8 flex justify-center'>
              <CountdownCircleTimer
                key={timerKey + currentPomodoroType}
                strokeWidth={10}
                size={200}
                isPlaying={isPlaying}
                duration={duration}
                initialRemainingTime={initialRemainingTime || duration}
                colors={colorByPomodoroType[currentPomodoroType] as ColorFormat}
                trailColor='#392C3B'
                onComplete={onComplete}
                onUpdate={setRemainingTime}
              >
                {renderRemainingTimeSection}
              </CountdownCircleTimer>
            </div>
            <Buttons />
            <TimerTask />
          </div>
        )}
      </div>
    </Draggable>
  );
};

const TimerComponentMemoized = React.memo(TimerComponent);
export { TimerComponentMemoized as TimerComponent };
