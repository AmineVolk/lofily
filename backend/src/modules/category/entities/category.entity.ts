import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Background } from 'src/modules/background/entities/background.entity';
import { IsNotEmpty } from 'class-validator';
import { Music } from 'src/modules/music/entities/music.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Column()
  is_for_premium: boolean;

  @Column({ default: false })
  is_new: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Background, (background) => background.category)
  backgrounds: Background[];

  // @OneToMany(() => Music, (music) => music.category)
  // musics: Music[];

  constructor(partial: Partial<Category> = {}) {
    Object.assign(this, partial);
  }
}
