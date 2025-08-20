import { IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  content: string;

  @IsString()
  title: string;

  @IsNumber()
  note_group_id: number;
}
