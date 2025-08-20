import { IsString, IsNotEmpty } from 'class-validator';

export default class SocialMediaRefreshDTO {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  id: number;
}
