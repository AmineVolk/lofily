import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class GetOneCategoryDto extends PartialType(CreateCategoryDto) {
  id: number;
  cover_image: string;
  is_for_premium: boolean;
  nbr_backgrounds: number;
}
