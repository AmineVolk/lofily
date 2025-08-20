export interface UserModel {
  id: string;
  fullname: string;
  created?: Date;
  updated?: Date;
  company?: string;
  designation?: string;
  email: string;
  picture?: string;
  setting: Setting;
  current_pomodoro_id: number;
  nbr_ended_pomodoro: number;
}
export type Setting = {
  pomodoro_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
  autostart_break: boolean;
  autostart_session: boolean;
  pomodoro_color: string;
  short_break_color: string;
  long_break_color: string;
  lang: string;
  pomodoro_end_sound: string;
};
