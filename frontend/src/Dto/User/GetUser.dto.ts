import { USER_TYPE } from '@/enum';

import { SubscriptionInfos } from './UpdateUser.dto';
import { PomodoroSettings } from '../Pomodoro/PomodoroSettings';

export interface GetUserDto {
  id: number;
  background_id: number | null;
  background_url: string | null;
  background_url_mobile: string | null;
  created: string;
  current_pomodoro_id: number | null;
  email: string;
  nbr_ended_pomodoro: 0;
  setting: object;
  type: USER_TYPE;
  updated: string;
  username: string;
  pomodoro_settings: PomodoroSettings;
  subscription_infos: SubscriptionInfos;
  hide_inactivity: number;
  volume: number;
  starter_index: number | null;
  starter_usage_minutes: number;
  starter_begin_date: Date | null;
}
