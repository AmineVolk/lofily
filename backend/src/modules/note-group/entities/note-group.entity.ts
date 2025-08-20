import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { Note } from 'src/modules/note/entities/note.entity';

@Entity()
export class NoteGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @ManyToOne(() => User, (user) => user.noteGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Note, (note) => note.noteGroup)
  notes: Note[];

  constructor(partial: Partial<NoteGroup> = {}) {
    Object.assign(this, partial);
  }
}
