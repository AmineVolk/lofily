import { IsEnum } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum EventType {
  TIME_SPENT_ON_APP = 'time_spent_on_app',
}

// type MinutSpentByHour = {
//   date_hour: number;
//   minute_spent_at_hour: number;
// };

@Index('indx_user_day', ['user_id', 'day'], {
  unique: true,
})
@Entity()
export class EventTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEnum(EventType)
  type: string;

  @Column()
  user_id: number;

  @Column()
  day: string;

  @Column()
  minute_spent: number;

  // the array element will be : "date/nbr_hour"
  @Column({ type: 'jsonb', default: [] })
  minute_spent_day_history: string[];
}
