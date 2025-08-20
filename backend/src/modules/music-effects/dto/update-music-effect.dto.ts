import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicEffectDto } from './create-music-effect.dto';

export class UpdateMusicEffectDto extends PartialType(CreateMusicEffectDto) {}
