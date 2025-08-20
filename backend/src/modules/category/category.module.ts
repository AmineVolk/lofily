import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CatgegoryRepository } from './category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([Category, CatgegoryRepository]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
