export interface GetCategoryDto {
  id: number;
  name: string;
  is_for_premium: boolean;
  created: string;
  updated: string;
  nbr_backgrounds: number;
  total: number;
  thumbnail: string;
  thumbnail_mobile?: string;
  order: number;
  is_new: boolean;
}
