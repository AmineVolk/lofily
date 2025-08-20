import { SetStateAction, useCallback, useEffect, useState } from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { POMODORO_DEFAULT_VALUE_MINUTES } from '@/constant';
import { PomodoroSettings } from '@/Dto/Pomodoro/PomodoroSettings';
import { PomodoroType } from '@/enum';
import { PomodoroApi } from '@/services/api/PomodoroApi';
import { getFromLocalStorage } from '@/services/helper';
import { logger } from '@/services/logger';

import { TimerComponent } from './Timer.component';

const TimerContainer = () => {
  const [{ user }, { update }] = useReduxState('user');

  const [isPlaying, setIsPlaying] = useState(false);
  const [pomodoroCreated, setPomodoroCreated] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const [remainingTime, setRemainingTime] = useState<number>(
    user?.pomodoro_settings.pomodoro_duration || 1500
  );
  const [initialRemainingTime, setInitialRemainingTime] = useState<
    number | undefined
  >();

  const [currentPomodoroType, setCurrentPomodorotype] = useState<PomodoroType>(
    PomodoroType.pomodoro
  );

  // Save some data before closing the tab
  useEffect(() => {
    window.addEventListener('unload', handleTabClosing);

    return () => {
      window.removeEventListener('unload', handleTabClosing);
    };
  });

  const handleTabClosing = async () => {
    localStorage.setItem('remainingTimeWhenClosed', remainingTime.toString());
  };

  const resetRemainingTimeFromLocalStorage = () => {
    logger('resetRemainingTimeFromLocalStorage');

    const remainingTimeWhenClosed = getFromLocalStorage(
      'remainingTimeWhenClosed'
    );

    if (remainingTimeWhenClosed) {
      setInitialRemainingTime(parseInt(remainingTimeWhenClosed));
      setPomodoroCreated(true);
      setTimerKey(timerKey + 1);
    }
  };

  useEffect(() => {
    resetRemainingTimeFromLocalStorage();
  }, []);

  useEffect(() => {
    PomodoroApi.getPomodorType().then(({ data }) =>
      setCurrentPomodorotype(data)
    );
  }, [pomodoroCreated]);

  const onClickStart = useCallback(() => {
    logger('timer onClickStart ', isPlaying);

    if (!isPlaying) {
      if (pomodoroCreated || initialRemainingTime) {
        setIsPlaying(true);
      } else {
        PomodoroApi.start().then(({ data }) => {
          update(['user'], {
            ...user,
            current_pomodoro_id: data.id,
          });
          setIsPlaying(true);
          setPomodoroCreated(true);
        });
      }
    }
  }, [isPlaying, pomodoroCreated, timerKey, isPlaying]);

  const onClickPause = useCallback(() => {
    logger('timer onClickPause ', isPlaying);

    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const onComplete = useCallback(async () => {
    logger('timeronComplete ');

    const { nextPomodoroType, user: returnedUser } =
      await PomodoroApi.finished();

    const { current_pomodoro_id, nbr_ended_pomodoro } = returnedUser;
    reInitiatState(nextPomodoroType);

    localStorage.clear();

    update(['user'], {
      ...user,
      current_pomodoro_id,
      nbr_ended_pomodoro,
    });
  }, [currentPomodoroType, user?.current_pomodoro_id]);

  const onClickReload = (newSettings?: PomodoroSettings) => {
    return PomodoroApi.reset().then(() => {
      logger('timer onClickReload newSettings ', newSettings);
      localStorage.removeItem('remainingTimeWhenClosed');
      reInitiatState(PomodoroType.pomodoro);
      const newUser = {
        ...user,
        current_pomodoro_id: null,
        nbr_ended_pomodoro: 0,
      };
      if (newSettings) {
        newUser.pomodoro_settings = newSettings;
      }
      update(['user'], newUser);
    });
  };
  const onClickReloadCallback = useCallback(onClickReload, [timerKey]);

  const reInitiatState = (type: SetStateAction<PomodoroType>) => {
    setCurrentPomodorotype(type);
    setIsPlaying(false);
    setPomodoroCreated(false);
    setInitialRemainingTime(undefined);
    setTimerKey(timerKey + 1);
  };

  const getPomodroDuration = {
    [PomodoroType.pomodoro]:
      user?.pomodoro_settings.pomodoro_duration ||
      POMODORO_DEFAULT_VALUE_MINUTES[PomodoroType.pomodoro],
    [PomodoroType.short_break]:
      user?.pomodoro_settings.short_break_duration ||
      POMODORO_DEFAULT_VALUE_MINUTES[PomodoroType.short_break],
    [PomodoroType.long_break]:
      user?.pomodoro_settings.long_break_duration ||
      POMODORO_DEFAULT_VALUE_MINUTES[PomodoroType.long_break],
  };

  const setRemainingTimeCallback = useCallback(
    (rtime: number) => setRemainingTime(rtime),
    []
  );

  return (
    <>
      <div className='absolute'>
        <svg>
          <defs>
            <linearGradient id='timer-color' x1='1' y1='0' x2='0' y2='0'>
              <stop offset='5%' stopColor='#FB923C' />
              <stop offset='95%' stopColor='#F87171' />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <TimerComponent
        initialRemainingTime={initialRemainingTime}
        currentPomodoroType={currentPomodoroType}
        onClickPause={onClickPause}
        onClickStart={onClickStart}
        onComplete={onComplete}
        isPlaying={isPlaying}
        setRemainingTime={setRemainingTimeCallback}
        duration={getPomodroDuration[currentPomodoroType] * 60}
        timerKey={timerKey}
        onClickReload={onClickReloadCallback}
      />
    </>
  );
};
export { TimerContainer };
