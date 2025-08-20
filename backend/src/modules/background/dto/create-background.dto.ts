import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBackgroundDto {
  @IsNotEmpty()
  url: string;

  url_mobile?: string;

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  thumbnail_mobile?: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsBoolean()
  is_default: boolean;
}
