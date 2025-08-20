import { Repository, EntityRepository } from 'typeorm';
import { MusicEffect } from './entities/music-effect.entity';

@EntityRepository(MusicEffect)
export class MusicEffectRepository extends Repository<MusicEffect> {}
