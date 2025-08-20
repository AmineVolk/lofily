export class GetMusicDto {
  id: string;
  url: string;
  artist?: string;
  title?: string;
  image?: string;
  length_text?: string;
  length: number;
  artist_link?: string;
}
