import { Repository, EntityRepository } from 'typeorm';
import { UserMusicEffect } from './entities/user-music-effect.entity';

@EntityRepository(UserMusicEffect)
export class UserMusicEffectRepository extends Repository<UserMusicEffect> {}
