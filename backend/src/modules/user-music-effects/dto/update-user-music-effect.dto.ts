import { IsNotEmpty } from 'class-validator';

export class UpdateUserMusicEffectDto {
  @IsNotEmpty()
  volume: number;
}
