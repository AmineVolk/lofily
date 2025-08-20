import { GetOneCategoryDto } from './get-one-category.dto';

export class GetAllCategoryDto {
  data: GetOneCategoryDto[];
  total: number;
  page: number;
  limit: number;
}
