import { Repository, EntityRepository } from 'typeorm';
import { NoteGroup } from './entities/note-group.entity';

@EntityRepository(NoteGroup)
export class NoteGroupRepository extends Repository<NoteGroup> {}
