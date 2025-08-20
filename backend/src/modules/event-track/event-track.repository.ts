import { Repository, EntityRepository } from 'typeorm';
import { EventTrack } from './entities/event-track.entity';

@EntityRepository(EventTrack)
export class EventTrackRespository extends Repository<EventTrack> {}
