import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteGroupDto } from './create-note-group.dto';

export class UpdateNoteGroupDto extends PartialType(CreateNoteGroupDto) {}
