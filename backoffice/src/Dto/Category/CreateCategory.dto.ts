// interface CreateCategoryDtoType {
//   name: string;
//   is_for_premium: boolean;
// }

export class CreateCategoryDto {
  name: string;
  is_for_premium: boolean;
  is_new: boolean;
  order: number;

  constructor(
    name?: string,
    is_for_premium?: boolean,
    is_new?: boolean,
    order?: number
  ) {
    this.name = name || '';
    this.is_for_premium = is_for_premium || false;
    this.is_new = is_new || false;
    this.order = order || 0;
  }
}
