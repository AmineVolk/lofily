export type DayStats = {
  count: number;
  day: string;
};

export type StatsItem = {
  total: number;
  percent_progression: string;
  last_7_days: DayStats[];
};

export type NbrUserOfBackground = {
  id: number;
  url: string;
  thumbnail: string;
  count: number;
};
export type NbrUserOfEffect = {
  id: number;
  music_effect_id: number;
  name: string;
  count: number;
  url: string;
};
export interface UserStatsDto {
  users_stats: StatsItem;
  users_premimum_stats: StatsItem;
  nbr_user_of_background: NbrUserOfBackground[];
  nbr_user_of_effect: NbrUserOfEffect[];
}
