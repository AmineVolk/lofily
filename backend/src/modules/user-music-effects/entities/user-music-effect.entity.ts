import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index('idx_unique_effect_per_user', ['user_id', 'music_effect_id'], {
  unique: true,
})
export class UserMusicEffect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'user_id required' })
  user_id: number;

  @Column()
  @IsNotEmpty({ message: 'music_effect_id required' })
  music_effect_id: number;

  @Column()
  @IsNotEmpty({ message: 'volume required' })
  volume: number;
}
