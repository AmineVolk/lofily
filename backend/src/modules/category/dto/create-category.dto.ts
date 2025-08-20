import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  is_for_premium: boolean;
}
