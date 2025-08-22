import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from 'src/modules/category/entities/category.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @Column()
  @IsNotEmpty({ message: 'Artist cannot be empty' })
  artist: string;

  @Column()
  @IsNotEmpty({ message: 'Url cannot be empty' })
  url: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ nullable: true })
  duration_text: string;

  @Column({ nullable: true })
  artist_link: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ default: true })
  is_active: boolean;

  constructor(partial: Partial<Music> = {}) {
    Object.assign(this, partial);
  }
}
