export interface GetMusicDto {
  id: string;
  url: string;
  artist?: string;
  title?: string;
  image?: string;
  length_text?: string;
  length: number;
  artist_link?: string;
}

export interface GetMusicPagination {
  data: GetMusicDto[];
  total: number;
  page: number;
  limit: number;
}
