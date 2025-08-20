import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class MusicEffect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Url cannot be empty' })
  url: string;
}
