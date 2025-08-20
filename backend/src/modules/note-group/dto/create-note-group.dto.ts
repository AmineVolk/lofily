import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNoteGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  user_id;
}
