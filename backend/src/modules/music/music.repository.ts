import { EntityRepository, Repository } from 'typeorm';

import { Music } from './entities/music.entity';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {}
