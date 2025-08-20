export interface GetBackgroundDto {
  id: number;
  url: string;
  url_mobile: string;
  thumbnail: string;
  thumbnail_mobile?: string;
  category_id: number;
  is_default: boolean;
  created: string;
  updated: string;
}
