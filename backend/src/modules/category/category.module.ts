import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CatgegoryRepository } from './category.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CatgegoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
