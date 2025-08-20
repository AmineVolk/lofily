import { IsNotEmpty } from 'class-validator';

export class CreateUserMusicEffectDto {
  user_id?: number;

  @IsNotEmpty()
  music_effect_id: number;

  @IsNotEmpty()
  volume: number;
}
