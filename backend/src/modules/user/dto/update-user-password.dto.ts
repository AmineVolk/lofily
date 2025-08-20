import { IsString, IsNotEmpty } from 'class-validator';

export default class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;
}
