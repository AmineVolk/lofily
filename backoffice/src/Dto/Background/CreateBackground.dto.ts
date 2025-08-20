export class CreateBackgroundDto {
  category_id: number;
  is_default: boolean;

  constructor(category_id?: number, is_default?: boolean) {
    this.category_id = category_id || 0;
    this.is_default = is_default || false;
  }
}
