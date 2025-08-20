import { IsString, IsNotEmpty } from 'class-validator';

export default class ForgotPassword {
  @IsString()
  @IsNotEmpty()
  email: string;
}
