import { USER_TYPE } from '@/enum';

import { PomodoroSettings } from '../Pomodoro/PomodoroSettings';
export type SubscriptionInfos = {
  card_exp: string;
  card_last_4: string;
  currency: string;
  subscription_start: string;
  subscription_end: string;
  amount: number;
  amout_after_coupon: number;
  interval: string;
  subscription_id: string;
  customer_id: string;
  invoice_pdf?: string;
  coupon_percent_of?: number;
  cancel_requested?: boolean;
};
export interface UpdateUserDto {
  username?: string;
  company?: string;
  designation?: string;
  email?: string;
  current_pomodoro_id?: number;
  nbr_ended_pomodoro?: number;
  background_id?: number;
  pomodoro_settings?: PomodoroSettings;
  type?: USER_TYPE;
  subscription_infos?: SubscriptionInfos;
  hide_inactivity?: number;
  volume?: number;
  starter_index?: number | null;
  starter_begin_date?: Date | null;
}
