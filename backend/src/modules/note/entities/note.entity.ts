import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { NoteGroup } from 'src/modules/note-group/entities/note-group.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @Column()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ name: 'note_group_id', nullable: false })
  note_group_id: number;

  @ManyToOne(() => NoteGroup, (noteGroup) => noteGroup.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'note_group_id' })
  noteGroup: NoteGroup;

  constructor(partial: Partial<Note> = {}) {
    Object.assign(this, partial);
  }
}
