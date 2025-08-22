export interface GetMusicDto {
  id: number;
  title: string;
  artist: string;
  url: string;
  image_url?: string;
  duration: number;
  duration_text?: string;
  artist_link?: string;

  is_active: boolean;
  created: string;
  updated: string;
}
