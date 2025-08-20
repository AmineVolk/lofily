import { Repository, EntityRepository } from 'typeorm';
import { Tasks } from './entities/task.entity';

@EntityRepository(Tasks)
export class TasksRepository extends Repository<Tasks> {}
