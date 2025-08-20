import { CreateCategoryDto } from './CreateCategory.dto';

export interface GetCategoryDto extends CreateCategoryDto {
  id: number;
  nbr_backgrounds: number;
  cover_image: string | null;
  created: string;
  updated: string;
  thumbnail: string | null;
  is_new: boolean;
  order: number;
}
