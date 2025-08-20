import { IsNotEmpty } from 'class-validator';

export class CreateMusicEffectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;
}
