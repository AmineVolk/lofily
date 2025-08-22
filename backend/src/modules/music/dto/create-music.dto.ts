import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMusicDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  duration_text?: string;

  @IsOptional()
  @IsString()
  artist_link?: string;
}
