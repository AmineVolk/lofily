import { PomodoroType } from '@/enum';

export const POMODORO_PAGE = 0;
export const REPORT_PAGE = 1;
export const SETTING_PAGE = 2;
export const PROFILE_PAGE = 3;

export const PREMIUM_FETAURES_INDEX = [2, 3, 6];

export const POMODORO_DEFAULT_VALUE_MINUTES = {
  [PomodoroType.pomodoro]: 25,
  [PomodoroType.short_break]: 5,
  [PomodoroType.long_break]: 15,
};

export const MAX_WIDTH_MOBILE = 430;

export const MUSIC_PAGINATION_LIMIT = 1;
export const NBR_HOUR_PER_LOFIMON_LEVEL = {
  2: 60,
  3: 100,
};
