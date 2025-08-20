import { IsString, IsNotEmpty } from 'class-validator';

export default class EmailDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
