import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PomodorSettings, SubscriptionInfos } from '../entities/user.entity';

import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsDate()
  updated: Date;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  current_pomodoro_id?: number;

  @IsOptional()
  @IsNumber()
  nbr_ended_pomodoro?: number;

  @IsOptional()
  @IsNumber()
  background_id?: number;

  @IsOptional()
  @IsObject()
  pomodoro_settings?: PomodorSettings;

  @IsOptional()
  @IsObject()
  subscription_infos?: SubscriptionInfos;

  @IsOptional()
  @IsNumber()
  volume?: number;
}
