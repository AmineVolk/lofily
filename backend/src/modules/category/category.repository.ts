import { Repository, EntityRepository } from 'typeorm';
import { Category } from './entities/category.entity';

@EntityRepository(Category)
export class CatgegoryRepository extends Repository<Category> {}
