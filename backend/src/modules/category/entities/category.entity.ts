import { IsNotEmpty } from 'class-validator';
import { Background } from 'src/modules/background/entities/background.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';

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

  constructor(partial: Partial<Category> = {}) {
    Object.assign(this, partial);
  }
}
