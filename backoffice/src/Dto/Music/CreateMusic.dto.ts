export interface CreateMusicDto {
  title: string;
  artist: string;
  url: string;
  image_url?: string;
  duration: number;
  duration_text?: string;
  artist_link?: string;
}
