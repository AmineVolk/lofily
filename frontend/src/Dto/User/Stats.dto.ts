export type AppUsingTimeStateItem = {
  id: number;
  day: string;
  minute_spent: number;
};
export interface UserStatsDto {
  app_using: {
    last_7_days: AppUsingTimeStateItem[];
    last_30_days: AppUsingTimeStateItem[];
  };
}
