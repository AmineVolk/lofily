import { Repository, EntityRepository } from 'typeorm';
import { Pomodoro } from './entities/pomodoro.entity';

@EntityRepository(Pomodoro)
export class PomodoroRepository extends Repository<Pomodoro> {}
