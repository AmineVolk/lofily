import { Repository, EntityRepository } from 'typeorm';
import { Background } from './entities/background.entity';

@EntityRepository(Background)
export class BackgroundRepository extends Repository<Background> {}
