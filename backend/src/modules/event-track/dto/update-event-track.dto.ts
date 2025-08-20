import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTrackDto } from './create-event-track.dto';

export class UpdateEventTrackDto extends PartialType(CreateEventTrackDto) {}
