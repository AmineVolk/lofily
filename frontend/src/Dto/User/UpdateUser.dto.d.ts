type UpdateUserDto = {
  fullname?: string;
  updated: Date;
  company?: string;
  designation?: string;
  email?: string;
  current_pomodoro_id?: number;
  nbr_ended_pomodoro?: number;
  background_id?: number;
  pomodoro_settings?: PomodorSettings;
  subscription_infos?: SubscriptionInfos;
  volume?: number;
};

type PomodorSettings = {
  // Définir la structure selon vos besoins
  [key: string]: any;
};

type SubscriptionInfos = {
  // Définir la structure selon vos besoins
  [key: string]: any;
};
