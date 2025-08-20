import { CatgegoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetOneCategoryDto } from './dto/get-one-category.dto';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';

@Injectable()
export class CategoryService {
  constructor(private catgegoryRepository: CatgegoryRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.catgegoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<GetOneCategoryDto[]> {
    const query = `
      with cover_backgrounds as (
        select b.url,b.category_id,b.thumbnail,b.thumbnail_mobile
        from background as b
        where b.is_default = true
      )
      SELECT  distinct(c.*),
      sum(case when c.id = b.category_id then 1 else 0 end )::int as nbr_backgrounds,
      (count(*) OVER())::int AS total,
      cb.thumbnail as thumbnail,
      cb.thumbnail_mobile as thumbnail_mobile
      FROM category as c
      left join background as b on b.category_id = c.id
      left join cover_backgrounds as cb on cb.category_id = c.id
      group by (c.id,cb.url,cb.thumbnail,cb.thumbnail_mobile)
      order by "order"
    `;

    const cateogries = await this.catgegoryRepository.query(query);

    return cateogries;
  }

  finOneByName(name: string) {
    return this.catgegoryRepository.findOne({ where: { name } });
  }

  findOne(id: number) {
    return this.catgegoryRepository.findOne({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.catgegoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.catgegoryRepository.delete(id);
  }

  findBackgrounds(id: number) {
    return this.catgegoryRepository.find({
      where: { id },
      relations: ['backgrounds'],
    });
  }

  updateCategoriesOrder(categories: UpdateCategoryOrderDto) {
    const query = categories.categories
      .map(
        ({ id, order }) =>
          `update public.category set "order"=${order} where id=${id} ;`,
      )
      .join('');
    return this.catgegoryRepository.query(query);
  }
}
