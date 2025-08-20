import { EventType } from '../entities/event-track.entity';

export class CreateEventTrackDto {
  minute_spent: number;
  type: EventType;
}
