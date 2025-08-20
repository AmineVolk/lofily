export enum EventType {
  TIME_SPENT_ON_APP = 'time_spent_on_app',
}
export interface CreateEventTrackDto {
  minute_spent: number;
  type: EventType;
}
