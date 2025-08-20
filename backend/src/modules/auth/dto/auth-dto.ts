import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsString({ message: 'Mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
