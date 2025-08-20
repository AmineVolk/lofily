import { GetOneCategoryDto } from './get-one-category.dto';

type Item = {
  id: number;
  order: number;
};
export class UpdateCategoryOrderDto {
  categories: Item[];
}
