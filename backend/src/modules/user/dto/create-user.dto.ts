import { classToPlain, Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../enum/user-type';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserType)
  type: string;

  @Exclude()
  password?: string;

  toJSON() {
    return classToPlain(this);
  }
}
