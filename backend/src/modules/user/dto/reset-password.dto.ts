import { IsString, IsNotEmpty } from 'class-validator';

export default class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
