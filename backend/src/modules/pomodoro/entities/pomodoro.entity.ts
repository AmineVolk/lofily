import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Tasks } from 'src/modules/tasks/entities/task.entity';
import { PomodoroType } from 'src/modules/pomodoro/enum/pomodoro-type';

@Entity()
export class Pomodoro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userid' })
  userid: number;

  @Column()
  startat: Date;

  @Column({ nullable: true })
  endat: Date;

  @Column()
  type: PomodoroType;

  constructor(partial: Partial<Pomodoro> = {}) {
    Object.assign(this, partial);
  }
}
