import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  userid?: number;
}
