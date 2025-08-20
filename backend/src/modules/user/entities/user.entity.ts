import { IsEmail, IsNotEmpty } from 'class-validator';
import { NoteGroup } from 'src/modules/note-group/entities/note-group.entity';
import { Tasks } from 'src/modules/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/user-type';

export type PomodorSettings = {
  pomodoro_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
};

export const defaultSetting: PomodorSettings = {
  pomodoro_duration: 25,
  short_break_duration: 5,
  long_break_duration: 15,
  long_break_interval: 4,
};

export type SubscriptionInfos = {
  card_exp?: string;
  card_last_4?: string;
  currency?: string;
  subscription_start?: string;
  subscription_end?: string;
  amount?: number;
  amout_after_coupon?: number;
  interval?: string;
  subscription_id?: string;
  customer_id?: string;
  invoice_pdf?: string;
  coupon_percent_of?: number;
  cancel_requested?: boolean;
  is_forced_by_admin?: boolean;
};

@Entity()
@Index('idx_unique_email', ['email'], {
  unique: true,
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'The username is required' })
  username: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  @IsEmail({}, { message: 'Incorrect email' })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ default: UserType.FREEMIUM, enum: UserType })
  type: string;

  @Column({ nullable: true })
  current_pomodoro_id: number;

  @Column({ default: 0 })
  nbr_ended_pomodoro: number;

  @Column({ type: 'jsonb', default: defaultSetting })
  pomodoro_settings: PomodorSettings;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @OneToMany(() => NoteGroup, (noteGroup) => noteGroup.user)
  noteGroups: NoteGroup[];

  @OneToMany(() => Tasks, (tasks) => tasks.userid)
  tasks: Tasks[];

  @Column({ nullable: true })
  background_id: number;

  @Column({ type: 'jsonb', default: {} })
  subscription_infos: SubscriptionInfos;

  @Column({ default: 0 })
  hide_inactivity: number;

  @Column({ default: 0 })
  volume: number;

  @Column({ nullable: true })
  starter_index: number;

  @Column({ nullable: true })
  starter_begin_date: Date;

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}
