import { CreateMusicDto } from './create-music.dto';
import { PartialType } from '@nestjs/mapped-types';

export class GetOneMusicDto extends PartialType(CreateMusicDto) {
  id: number;
}
