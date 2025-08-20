import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/modules/category/entities/category.entity';

@Entity()
// @Index(['category_id', 'is_default'], { unique: true })
// @Unique("unique_is_default_category_id", ["is_default", "category_id"])

// @Index(
//   ['is_default', 'category_id'],
//   { unique: true },
//   'WHERE is_default=true;',
// )

@Index('idx_one_is_default_true_by_category', ['is_default', 'category_id'], {
  unique: true,
  where: 'is_default = true',
})
export class Background {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Url cannot be empty' })
  url: string;

  @Column({ nullable: true })
  // @IsNotEmpty({ message: 'thumbnail cannot be empty' })
  thumbnail: string;

  @Column({ nullable: true })
  // @IsNotEmpty({ message: 'thumbnail cannot be empty' })
  thumbnail_mobile: string;

  @Column({ nullable: true })
  url_mobile: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ name: 'category_id', nullable: false })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.backgrounds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ default: false })
  is_default: boolean;

  constructor(partial: Partial<Background> = {}) {
    Object.assign(this, partial);
  }
}
