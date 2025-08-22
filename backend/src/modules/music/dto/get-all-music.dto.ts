import { GetOneMusicDto } from './get-one-music.dto';

export class GetAllMusicDto {
  data: GetOneMusicDto[];
  total: number;
  page: number;
  limit: number;
}
