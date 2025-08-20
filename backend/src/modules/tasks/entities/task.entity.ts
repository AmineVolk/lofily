import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  done: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userid' })
  userid: number;

  constructor(partial: Partial<Tasks> = {}) {
    Object.assign(this, partial);
  }
}
