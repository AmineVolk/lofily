import { PartialType } from '@nestjs/mapped-types';
import { CreateBackgroundDto } from './create-background.dto';

export class GetOneBackgroundDto extends PartialType(CreateBackgroundDto) {
  id: number;
}
